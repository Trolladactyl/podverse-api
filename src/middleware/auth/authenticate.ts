import { Context } from 'koa'
import { generateToken } from 'services/auth/generateToken'
import { authExpires } from 'lib/constants'

export function authenticate (ctx: Context, next) {
  return generateToken(ctx.state.user)
    .then(token => {
      if (token) {
        const expires = authExpires()
        ctx.cookies.set('Authorization', `Bearer ${token}`, {
          expires,
          httpOnly: true,
          overwrite: true
        })

        const { user } = ctx.state
        ctx.body = {
          email: user.email,
          freeTrialExpiration: user.freeTrialExpiration,
          historyItems: user.historyItems,
          id: user.id,
          membershipExpiration: user.membershipExpiration,
          name: user.name,
          playlists: user.playlists,
          queueItems: user.queueItems,
          subscribedPlaylistIds: user.subscribedPlaylistIds,
          subscribedPodcastIds: user.subscribedPodcastIds
        }
        ctx.status = 200
      } else {
        ctx.status = 500
      }

      next()
    })
}
