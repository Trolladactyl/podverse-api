import * as Router from 'koa-router'
import type { SocialInteraction } from 'podverse-shared'
import { config } from '~/config'
import { emitRouterError } from '~/lib/errors'
import { delimitQueryValues } from '~/lib/utility'
import {
  getEpisode,
  getEpisodes,
  getEpisodesByCategoryIds,
  getEpisodesByPodcastIds,
  retrieveLatestChapters
} from '~/controllers/episode'
import { parseQueryPageOptions } from '~/middleware/parseQueryPageOptions'
import { validateEpisodeSearch } from '~/middleware/queryValidation/search'
import { parseNSFWHeader } from '~/middleware/parseNSFWHeader'
import { getThreadcap } from '~/services/socialInteraction/activityPub'

const router = new Router({ prefix: `${config.apiPrefix}${config.apiVersion}/episode` })

const delimitKeys = ['authors', 'mediaRefs']

// Search
router.get(
  '/',
  (ctx, next) => parseQueryPageOptions(ctx, next, 'episodes'),
  validateEpisodeSearch,
  parseNSFWHeader,
  async (ctx) => {
    try {
      ctx = delimitQueryValues(ctx, delimitKeys)

      let episodes
      if (ctx.state.query.categories) {
        episodes = await getEpisodesByCategoryIds(ctx.state.query)
      } else if (ctx.state.query.podcastId) {
        episodes = await getEpisodesByPodcastIds(ctx.state.query)
      } else {
        episodes = await getEpisodes(ctx.state.query)
      }

      ctx.body = episodes
    } catch (error) {
      emitRouterError(error, ctx)
    }
  }
)

// Get
router.get('/:id', parseNSFWHeader, async (ctx) => {
  try {
    const episode = await getEpisode(ctx.params.id)

    ctx.body = episode
  } catch (error) {
    emitRouterError(error, ctx)
  }
})

router.get('/:id/retrieve-latest-chapters', async (ctx) => {
  try {
    if (!ctx.params.id) throw new Error('An episodeId is required.')
    const latestChapters = await retrieveLatestChapters(ctx.params.id)
    ctx.body = latestChapters
  } catch (error) {
    emitRouterError(error, ctx)
  }
})

router.get('/:id/proxy/activity-pub', async (ctx) => {
  try {
    if (!ctx.params.id) throw new Error('An episodeId is required.')
    const episode = await getEpisode(ctx.params.id)
    if (!episode) {
      throw new Error('No episode found with that id.')
    }
    if (!episode.socialInteraction || episode.socialInteraction.length === 0) {
      throw new Error('No socialInteraction value found for episode.')
    }
    const activityPub = episode.socialInteraction.find(
      (item: SocialInteraction) => item.platform === 'activitypub' || item.platform === 'mastodon'
    )
    if (!activityPub || !activityPub.url) {
      throw new Error('No activityPub/mastodon url found for episode.')
    }

    const body = await getThreadcap(activityPub.url)
    ctx.body = body
  } catch (error) {
    emitRouterError(error, ctx)
  }
})

export const episodeRouter = router
