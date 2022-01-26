import * as chai from 'chai'
import chaiHttp = require('chai-http')
import { testUsers, v1Path } from '../../utils'
const { expect: chaiExpect } = chai
chai.use(chaiHttp)

describe('User endpoints', () => {
  describe('get public user by ID', () => {
    test('when a valid id is provided', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/EVHDBRZY`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)
          chaiExpect(res.body.id).to.equal('EVHDBRZY')
          chaiExpect(res.body.isPublic).to.equal(true)
          chaiExpect(res.body.name).to.equal('Free Trial Valid - Test User')
          const subscribedPodcastIds = res.body.subscribedPodcastIds
          chaiExpect(subscribedPodcastIds[0]).to.equal('0RMk6UYGq')
          chaiExpect(subscribedPodcastIds[1]).to.equal('XdbkHTiH9')
          chaiExpect(subscribedPodcastIds[2]).to.equal('kS9ZnQNWlQc')
          chaiExpect(subscribedPodcastIds[3]).to.equal('mN25xFjDG')
          chaiExpect(subscribedPodcastIds[4]).to.equal('nG6sRiNDv')
          chaiExpect(subscribedPodcastIds[5]).to.equal('zRo1jwx67')
          chaiExpect(subscribedPodcastIds[6]).to.equal('Yqft_RG8j')

          chaiExpect(Object.keys(res.body).length).to.equal(4)

          done()
        })
    })

    test('when an invalid id is provided', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/EVHDBRgfdsaZY`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(404)
          chaiExpect(res.body.message).to.equal('User not found.')

          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })
  })

  describe('update', () => {
    const sendBody = {
      email: 'premium@stage.podverse.fm',
      id: 'QMReJmbE',
      isPublic: 'true',
      name: 'Kyle'
    }

    test('when the user is not logged in', async (done) => {
      chai
        .request(global.app)
        .patch(`${v1Path}/user`)
        .send(sendBody)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })

    test('when the user is logged in', async (done) => {
      chai
        .request(global.app)
        .patch(`${v1Path}/user`)
        .set('Cookie', testUsers.premium.authCookie)
        .send(sendBody)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body).to.eql(sendBody)

          chaiExpect(Object.keys(res.body).length).to.equal(4)

          done()
        })
    })
  })

  describe('toggle subscribe', () => {
    test('when the user is not logged in', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/toggle-subscribe/EVHDBRZY`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })

    test('when the user is logged in: subscribe to user', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/toggle-subscribe/EVHDBRZY`)
        .set('Cookie', testUsers.premium.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body).to.eql(['bvVjsQCH', 'oAbPPRF9'])

          chaiExpect(Object.keys(res.body).length).to.equal(2)

          done()
        })
    })

    test('when the user is logged in: unsubscribe from user', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/toggle-subscribe/EVHDBRZY`)
        .set('Cookie', testUsers.premium.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body).to.eql(['bvVjsQCH', 'oAbPPRF9', 'EVHDBRZY'])

          chaiExpect(Object.keys(res.body).length).to.equal(3)

          done()
        })
    })
  })

  describe('get mediaRefs', () => {
    test('id: bvVjsQCH', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/bvVjsQCH/mediaRefs`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          const queueItem = res.body[0][0]

          chaiExpect(queueItem.id).to.equal('fgmGHz0o')
          chaiExpect(queueItem.endTime).to.equal(7380)
          chaiExpect(queueItem.isPublic).to.equal(true)
          chaiExpect(queueItem.pastHourTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.pastDayTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.pastWeekTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.pastMonthTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.pastYearTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.pastAllTimeTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.startTime).to.equal(7200)
          chaiExpect(queueItem.title).to.equal(
            'Non tellus orci ac auctor augue mauris augue neque. Aliquet risus feugiat in ante metus dictum at tempor. Vehicula ipsum a arcu cursus vitae congue mauris rhoncus.'
          )
          chaiExpect(queueItem).to.have.property('createdAt')
          chaiExpect(queueItem).to.have.property('updatedAt')

          chaiExpect(queueItem.episode.id).to.equal('z3kazYivU')
          chaiExpect(queueItem.episode).to.have.property('description')
          chaiExpect(queueItem.episode.duration).to.equal(0)
          chaiExpect(queueItem.episode.episodeType).to.equal('full')
          chaiExpect(queueItem.episode.guid).to.equal('67fec643-473d-48b4-b888-e5ee619600b3')
          chaiExpect(queueItem.episode.imageUrl).to.equal(
            'http://static.libsyn.com/p/assets/c/6/c/7/c6c723c38fb853b1/JRE1428.jpg'
          )
          chaiExpect(queueItem.episode.isExplicit).to.equal(false)
          chaiExpect(queueItem.episode.isPublic).to.equal(true)
          chaiExpect(queueItem.episode.linkUrl).to.equal(null)
          chaiExpect(queueItem.episode.mediaFilesize).to.equal(0)
          chaiExpect(queueItem.episode.mediaType).to.equal('audio/mpeg')
          chaiExpect(queueItem.episode.mediaUrl).to.equal(
            'https://stage.podverse.fm/sampleAudio/2B-F3-50-63-terkel-a0a0i2-a.mp3'
          )
          chaiExpect(queueItem.episode.pastHourTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.pastDayTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.pastWeekTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.pastMonthTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.pastYearTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.pastAllTimeTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode).to.have.property('pubDate')
          chaiExpect(queueItem.episode.title).to.equal('#1428 - Brian Greene')
          chaiExpect(queueItem.episode.podcastId).to.equal('yKyjZDxsB')
          chaiExpect(queueItem.episode).to.have.property('createdAt')
          chaiExpect(queueItem.episode).to.have.property('updatedAt')

          chaiExpect(queueItem.episode.podcast.id).to.equal('yKyjZDxsB')
          chaiExpect(queueItem.episode.podcast.int_id).to.equal(1)
          chaiExpect(queueItem.episode.podcast.podcastIndexId).to.equal('550168')
          chaiExpect(queueItem.episode.podcast.authorityId).to.equal(null)
          chaiExpect(queueItem.episode.podcast.alwaysFullyParse).to.equal(false)
          chaiExpect(queueItem.episode.podcast.description).to.equal('The podcast of Comedian Joe Rogan..')
          chaiExpect(queueItem.episode.podcast.feedLastParseFailed).to.equal(false)
          chaiExpect(queueItem.episode.podcast).to.have.property('feedLastUpdated')
          chaiExpect(queueItem.episode.podcast.guid).to.equal(null)
          chaiExpect(queueItem.episode.podcast.hideDynamicAdsWarning).to.equal(false)
          chaiExpect(queueItem.episode.podcast.imageUrl).to.equal(
            'https://d1gtnbjwzey0wh.cloudfront.net/podcast-images/o6kgywuwTA/thejoeroganexperience.jpg'
          )
          chaiExpect(queueItem.episode.podcast.isExplicit).to.equal(true)
          chaiExpect(queueItem.episode.podcast.isPublic).to.equal(true)
          chaiExpect(queueItem.episode.podcast.language).to.equal('en-us')
          chaiExpect(queueItem.episode.podcast).to.have.property('lastEpisodePubDate')
          chaiExpect(queueItem.episode.podcast.lastEpisodeTitle).to.equal('#1452 - Greg Fitzsimmons')
          chaiExpect(queueItem.episode.podcast.linkUrl).to.equal('https://www.joerogan.com')
          chaiExpect(queueItem.episode.podcast.pastAllTimeTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.podcast.pastHourTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.podcast.pastDayTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.podcast.pastWeekTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.podcast.pastMonthTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.podcast.pastYearTotalUniquePageviews).to.equal(123456789)
          chaiExpect(queueItem.episode.podcast.shrunkImageUrl).to.equal(
            'https://d1gtnbjwzey0wh.cloudfront.net/podcast-images/o6kgywuwTA/thejoeroganexperience.jpg'
          )
          chaiExpect(queueItem.episode.podcast.sortableTitle).to.equal('joe rogan experience')
          chaiExpect(queueItem.episode.podcast.title).to.equal('The Joe Rogan Experience')
          chaiExpect(queueItem.episode.podcast.type).to.equal('episodic')
          chaiExpect(queueItem.episode.podcast).to.have.property('createdAt')
          chaiExpect(queueItem.episode.podcast).to.have.property('updatedAt')

          chaiExpect(Object.keys(res.body).length).to.equal(2)

          done()
        })
    })
  })

  describe('logged-in user: get user mediaRefs', () => {
    test('Logged in', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/mediaRefs`)
        .set('Cookie', testUsers.premium.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          const queueItem = res.body[0][0]

          chaiExpect(queueItem.id).to.equal('9rA5BhWp')
          chaiExpect(queueItem.endTime).to.equal(1680)
          chaiExpect(queueItem.isPublic).to.equal(true)
          chaiExpect(queueItem.pastHourTotalUniquePageviews).to.equal(7)
          chaiExpect(queueItem.pastDayTotalUniquePageviews).to.equal(8)
          chaiExpect(queueItem.pastWeekTotalUniquePageviews).to.equal(9)
          chaiExpect(queueItem.pastMonthTotalUniquePageviews).to.equal(0)
          chaiExpect(queueItem.pastYearTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.pastAllTimeTotalUniquePageviews).to.equal(2)
          chaiExpect(queueItem.startTime).to.equal(1500)
          chaiExpect(queueItem.title).to.equal('Amet aliquam id diam maecenas ultricies mi eget.')
          chaiExpect(queueItem).to.have.property('createdAt')
          chaiExpect(queueItem).to.have.property('updatedAt')

          chaiExpect(queueItem.episode.id).to.equal('fFmGXkgIM')
          chaiExpect(queueItem.episode).to.have.property('description')
          chaiExpect(queueItem.episode.duration).to.equal(0)
          chaiExpect(queueItem.episode.episodeType).to.equal('full')
          chaiExpect(queueItem.episode.guid).to.equal('465b2bdc-eebd-11e9-85c8-171e42a72b35')
          chaiExpect(queueItem.episode.imageUrl).to.equal(null)
          chaiExpect(queueItem.episode.isExplicit).to.equal(false)
          chaiExpect(queueItem.episode.isPublic).to.equal(true)
          chaiExpect(queueItem.episode.linkUrl).to.equal(null)
          chaiExpect(queueItem.episode.mediaFilesize).to.equal(0)
          chaiExpect(queueItem.episode.mediaType).to.equal('audio/mpeg')
          chaiExpect(queueItem.episode.mediaUrl).to.equal(
            'https://www.podtrac.com/pts/redirect.mp3/pdst.fm/e/chtbl.com/track/524GE/traffic.megaphone.fm/VMP3689667624.mp3'
          )
          chaiExpect(queueItem.episode.pastHourTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.episode.pastDayTotalUniquePageviews).to.equal(2)
          chaiExpect(queueItem.episode.pastWeekTotalUniquePageviews).to.equal(3)
          chaiExpect(queueItem.episode.pastMonthTotalUniquePageviews).to.equal(4)
          chaiExpect(queueItem.episode.pastYearTotalUniquePageviews).to.equal(5)
          chaiExpect(queueItem.episode.pastAllTimeTotalUniquePageviews).to.equal(6)
          chaiExpect(queueItem.episode).to.have.property('pubDate')
          chaiExpect(queueItem.episode.title).to.equal(
            'Jason Calacanis: TikTok should be banned, Tim Cook doesn\'t have enough "chutzpah," and Uber will be fine'
          )
          chaiExpect(queueItem.episode.podcastId).to.equal('zRo1jwx67')
          chaiExpect(queueItem.episode).to.have.property('createdAt')
          chaiExpect(queueItem.episode).to.have.property('updatedAt')

          chaiExpect(queueItem.episode.podcast.id).to.equal('zRo1jwx67')
          chaiExpect(queueItem.episode.podcast.alwaysFullyParse).to.equal(false)
          chaiExpect(queueItem.episode.podcast.podcastIndexId).to.equal(null)
          chaiExpect(queueItem.episode.podcast.authorityId).to.equal(null)
          chaiExpect(queueItem.episode.podcast).to.have.property('description')
          chaiExpect(queueItem.episode.podcast.feedLastParseFailed).to.equal(false)
          chaiExpect(queueItem.episode.podcast).to.have.property('feedLastUpdated')
          chaiExpect(queueItem.episode.podcast.guid).to.equal(null)
          chaiExpect(queueItem.episode.podcast.hideDynamicAdsWarning).to.equal(false)
          chaiExpect(queueItem.episode.podcast.imageUrl).to.equal(
            'https://d1gtnbjwzey0wh.cloudfront.net/podcast-images/-cykCbiMI3/recodedecode.png'
          )
          chaiExpect(queueItem.episode.podcast.isExplicit).to.equal(false)
          chaiExpect(queueItem.episode.podcast.isPublic).to.equal(true)
          chaiExpect(queueItem.episode.podcast.language).to.equal('en-us')
          chaiExpect(queueItem.episode.podcast).to.have.property('lastEpisodePubDate')
          chaiExpect(queueItem.episode.podcast.lastEpisodeTitle).to.equal(
            "Episode 500: Slack CEO Stewart Butterfield on coronavirus, working from home, and Slack's redesign"
          )
          chaiExpect(queueItem.episode.podcast.linkUrl).to.equal(
            'https://www.vox.com/recode-decode-podcast-kara-swisher'
          )
          chaiExpect(queueItem.episode.podcast.pastAllTimeTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.episode.podcast.pastHourTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.episode.podcast.pastDayTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.episode.podcast.pastWeekTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.episode.podcast.pastMonthTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.episode.podcast.pastYearTotalUniquePageviews).to.equal(1)
          chaiExpect(queueItem.episode.podcast.shrunkImageUrl).to.equal(
            'https://d1gtnbjwzey0wh.cloudfront.net/podcast-images/-cykCbiMI3/recodedecode.png'
          )
          chaiExpect(queueItem.episode.podcast.sortableTitle).to.equal('recode decode')
          chaiExpect(queueItem.episode.podcast.title).to.equal('Recode Decode')
          chaiExpect(queueItem.episode.podcast.type).to.equal('episodic')
          chaiExpect(queueItem.episode.podcast).to.have.property('createdAt')
          chaiExpect(queueItem.episode.podcast).to.have.property('updatedAt')

          chaiExpect(Object.keys(res.body).length).to.equal(2)

          done()
        })
    })
    test('Not logged in', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/mediaRefs`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })
  })

  describe('logged-in user: get user playlists', () => {
    test('Logged in', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/playlists`)
        .set('Cookie', testUsers.premium.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          const queueItems = res.body[0]
          const queueItem = queueItems[0]

          chaiExpect(queueItem.id).to.equal('-67KgiG1')
          chaiExpect(queueItem).to.have.property('description')
          chaiExpect(queueItem.isPublic).to.equal(false)
          chaiExpect(queueItem.itemCount).to.equal(6)
          chaiExpect(queueItem.itemsOrder).to.eql([])
          chaiExpect(queueItem.title).to.equal('Premium - Test Playlist 1')
          chaiExpect(queueItem).to.have.property('createdAt')
          chaiExpect(queueItem).to.have.property('updatedAt')

          chaiExpect(queueItem.owner.id).to.equal('QMReJmbE')
          chaiExpect(queueItem.owner).to.not.have.property('isPublic')
          chaiExpect(queueItem.owner).to.not.have.property('name')

          chaiExpect(queueItems[1].id).to.equal('CH_2-LlM')
          chaiExpect(queueItems[1]).to.have.property('description')
          chaiExpect(queueItems[1].isPublic).to.equal(false)
          chaiExpect(queueItems[1].itemCount).to.equal(2)
          chaiExpect(queueItems[1].itemsOrder).to.eql([])
          chaiExpect(queueItems[1].title).to.equal('Premium - Test Playlist 2')
          chaiExpect(queueItems[1]).to.have.property('createdAt')
          chaiExpect(queueItems[1]).to.have.property('updatedAt')

          chaiExpect(queueItems[1].owner.id).to.equal('QMReJmbE')
          chaiExpect(queueItem.owner).to.not.have.property('isPublic')
          chaiExpect(queueItem.owner).to.not.have.property('name')

          chaiExpect(Object.keys(res.body).length).to.equal(2)

          done()
        })
    })

    test('Not logged in', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/playlists`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })
  })

  describe('Download user data', () => {
    test('Logged in', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/download`)
        .set('Cookie', testUsers.premium.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })

    test('Not logged in', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/download`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })
  })

  describe('Find public users by query', () => {
    test('find 3 users', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user?userIds=bvVjsQCH,oAbPPRF9,EVHDBRZY`)
        .set('Cookie', testUsers.premium.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          const queueItems = res.body[0]
          const queueItem = queueItems[0]

          chaiExpect(queueItem.id).to.equal('bvVjsQCH')
          chaiExpect(queueItem.name).to.equal('Free Trial Expired - Test User')

          chaiExpect(queueItems[1].id).to.equal('EVHDBRZY')
          chaiExpect(queueItems[1].name).to.equal('Free Trial Valid - Test User')

          chaiExpect(queueItems[2].id).to.equal('oAbPPRF9')
          chaiExpect(queueItems[2].name).to.equal('Premium Expired - Test User')

          chaiExpect(Object.keys(res.body).length).to.equal(2)

          done()
        })
    })
  })

  describe('find by query subscribed', () => {
    test('Top past week - Invalid user', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/subscribed?sort=top-past-week`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })

    test('Top past week - Premium Valid', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/user/subscribed?sort=top-past-week`)
        .set('Cookie', testUsers.premium.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          const podcast0 = res.body[0][0]

          chaiExpect(podcast0.id).to.equal('bvVjsQCH')
          chaiExpect(podcast0.name).to.equal('Free Trial Expired - Test User')

          const podcast1 = res.body[0][1]

          chaiExpect(podcast1.id).to.equal('EVHDBRZY')
          chaiExpect(podcast1.name).to.equal('Free Trial Valid - Test User')

          const podcast2 = res.body[0][2]

          chaiExpect(podcast2.id).to.equal('oAbPPRF9')
          chaiExpect(podcast2.name).to.equal('Premium Expired - Test User')

          chaiExpect(Object.keys(res.body[0]).length).to.equal(3)
          chaiExpect(Object.keys(res.body[0][0]).length).to.equal(2)

          done()
        })
    })
  })

  describe('user delete', () => {
    test('when the user is not logged in', async (done) => {
      chai
        .request(global.app)
        .delete(`${v1Path}/user`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })
    test('when the user is logged in', async (done) => {
      chai
        .request(global.app)
        .delete(`${v1Path}/user`)
        .set('Cookie', testUsers.premiumExpired.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })
  })
})
