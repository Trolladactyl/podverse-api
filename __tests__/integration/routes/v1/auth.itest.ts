import * as chai from 'chai'
import chaiHttp = require('chai-http')
import { testUsers, v1Path } from '../../utils'
const { expect: chaiExpect } = chai
chai.use(chaiHttp)

describe('Auth endpoints', () => {
  describe('Login', () => {
    const validLogin = {
      email: 'premiumexpired@stage.podverse.fm',
      password: 'Aa!1asdf'
    }

    const invalidLogin = {
      email: 'premiumexpired@stage.podverse.fm',
      password: 'Aa!1asdfs'
    }

    test('Invalid login', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/login`)
        .send(invalidLogin)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)

          chaiExpect(res.body.message).to.equal('Invalid username or password')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })

    test('Valid login', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/login`)
        .send(validLogin)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body.addByRSSPodcastFeedUrls).to.eql([])
          chaiExpect(res.body.email).to.equal('premiumexpired@stage.podverse.fm')
          chaiExpect(res.body.emailVerified).to.equal(true)
          chaiExpect(res.body).to.have.property('freeTrialExpiration')
          // chaiExpect(res.body).to.have.property('historyItems')
          chaiExpect(res.body.id).to.equal('oAbPPRF9')
          chaiExpect(res.body).to.have.property('membershipExpiration')
          chaiExpect(res.body.name).to.equal('Premium Expired - Test User')

          const playlist0 = res.body.playlists[0]
          const playlist1 = res.body.playlists[1]

          chaiExpect(playlist0.id).to.equal('tlWa5_QG')
          chaiExpect(playlist0).to.have.property('description')
          chaiExpect(playlist0.isPublic).to.equal(false)
          chaiExpect(playlist0.itemCount).to.equal(4)
          chaiExpect(playlist0.itemsOrder).to.eql([])
          chaiExpect(playlist0.title).to.equal('Test Playlist 2')
          chaiExpect(playlist0).to.have.property('createdAt')
          chaiExpect(playlist0).to.have.property('updatedAt')

          chaiExpect(playlist1.id).to.equal('lmhNAIuc')
          chaiExpect(playlist1).to.have.property('description')
          chaiExpect(playlist1.isPublic).to.equal(false)
          chaiExpect(playlist1.itemCount).to.equal(8)
          chaiExpect(playlist1.itemsOrder).to.eql([])
          chaiExpect(playlist1.title).to.equal('Test Playlist 1')
          chaiExpect(playlist1).to.have.property('createdAt')
          chaiExpect(playlist1).to.have.property('updatedAt')

          chaiExpect(res.body.subscribedPlaylistIds).to.eql([])
          chaiExpect(res.body.subscribedPodcastIds).to.eql([
            'mN25xFjDG',
            '0RMk6UYGq',
            '0orLYSBnp',
            'qxQ_w69iJ',
            'xSTqnMUb57K'
          ])
          chaiExpect(res.body.subscribedUserIds).to.eql(['bvVjsQCH', 'QMReJmbE', 'EVHDBRZY'])
          chaiExpect(Object.keys(res.body).length).to.equal(11)

          done()
        })
    })
  })

  describe('Logout', () => {
    test('Logout', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/logout`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)
          chaiExpect(Object.keys(res.body).length).to.equal(0)
          done()
        })
    })
  })

  describe('Get Authenticated User Info', () => {
    test('User Logged In', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/get-authenticated-user-info`)
        .set('Cookie', testUsers.premiumExpired.authCookie)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body.isPublic).to.equal(true)

          chaiExpect(res.body.addByRSSPodcastFeedUrls).to.eql([])
          chaiExpect(res.body.email).to.equal('premiumexpired@stage.podverse.fm')
          chaiExpect(res.body.emailVerified).to.equal(true)
          chaiExpect(res.body).to.have.property('freeTrialExpiration')
          chaiExpect(res.body.id).to.equal('oAbPPRF9')
          chaiExpect(res.body).to.have.property('membershipExpiration')
          chaiExpect(res.body.name).to.equal('Premium Expired - Test User')

          const playlist0 = res.body.playlists[0]
          const playlist1 = res.body.playlists[1]

          chaiExpect(playlist0.id).to.equal('tlWa5_QG')
          chaiExpect(playlist0).to.have.property('description')
          chaiExpect(playlist0.isPublic).to.equal(false)
          chaiExpect(playlist0.itemCount).to.equal(4)
          chaiExpect(playlist0.itemsOrder).to.eql([])
          chaiExpect(playlist0.title).to.equal('Test Playlist 2')
          chaiExpect(playlist0).to.have.property('createdAt')
          chaiExpect(playlist0).to.have.property('updatedAt')

          chaiExpect(playlist1.id).to.equal('lmhNAIuc')
          chaiExpect(playlist1).to.have.property('description')
          chaiExpect(playlist1.isPublic).to.equal(false)
          chaiExpect(playlist1.itemCount).to.equal(8)
          chaiExpect(playlist1.itemsOrder).to.eql([])
          chaiExpect(playlist1.title).to.equal('Test Playlist 1')
          chaiExpect(playlist1).to.have.property('createdAt')
          chaiExpect(playlist1).to.have.property('updatedAt')

          chaiExpect(res.body.subscribedPlaylistIds).to.eql([])
          chaiExpect(res.body.subscribedPodcastIds).to.eql([
            'mN25xFjDG',
            '0RMk6UYGq',
            '0orLYSBnp',
            'qxQ_w69iJ',
            'xSTqnMUb57K'
          ])
          chaiExpect(res.body.subscribedUserIds).to.eql(['bvVjsQCH', 'QMReJmbE', 'EVHDBRZY'])
          chaiExpect(Object.keys(res.body).length).to.equal(12)
          done()
        })
    })
    test('No User Logged in', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/get-authenticated-user-info`)
        .end((err, res) => {
          chaiExpect(res).to.have.status(401)
          chaiExpect(Object.keys(res.body).length).to.equal(0)
          done()
        })
    })
  })

  describe('reset password', () => {
    const premiumValidInsecure = {
      password: 'newpassword',
      resetPasswordToken: 'secretKey1'
    }

    const premiumValid = {
      password: 'newPassword1!',
      resetPasswordToken: 'secretKey1'
    }

    const premiumExpired = {
      password: 'newPassword1!',
      resetPasswordToken: 'secretKey2'
    }

    const freeTrialValid = {
      password: 'newPassword1!',
      resetPasswordToken: 'secretKey3'
    }

    const freeTrialExpired = {
      password: 'newPassword1!',
      resetPasswordToken: 'secretKey4'
    }

    test('invalid password', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/reset-password`)
        .send(premiumValidInsecure)
        .end((err, res) => {
          chaiExpect(res).to.have.status(400)

          chaiExpect(res.body.message).to.equal('Invalid password provided.')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })

    test('Premium Valid', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/reset-password`)
        .send(premiumValid)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body.message).to.equal('Password reset successful.')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })

    test('Premium Expired', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/reset-password`)
        .send(premiumExpired)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body.message).to.equal('Password reset successful.')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })

    test('Free Trial Valid', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/reset-password`)
        .send(freeTrialValid)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body.message).to.equal('Password reset successful.')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })

    test('Free Trial Expired', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/reset-password`)
        .send(freeTrialExpired)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body.message).to.equal('Password reset successful.')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })
  })

  describe('send reset password', () => {
    const sendBody = {
      email: 'premium@stage.podverse.fm'
    }

    test('premium account', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/send-reset-password`)
        .send(sendBody)
        .end((err, res) => {
          chaiExpect(res).to.have.status(400)
          chaiExpect(res.body.message).to.equal('Development mode: sendResetPassword endpoint is disabled.')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })
  })

  describe('Login', () => {
    const sendBody = {
      email: 'verifyEmailTest@stage.podverse.fm',
      password: 'Aa!1asdf'
    }

    test('attempt log in to unverified email', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/login`)
        .send(sendBody)
        .end((err, res) => {
          chaiExpect(res).to.have.status(460)

          chaiExpect(res.body.message).to.equal('Please verify your email address to login.')
          chaiExpect(Object.keys(res.body).length).to.equal(1)

          done()
        })
    })

    test('verify email', async (done) => {
      chai
        .request(global.app)
        .get(`${v1Path}/auth/verify-email?token=cff436a6-c456-4aa5-b407-faa122cedb19`)
        .send(sendBody)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)
          chaiExpect(Object.keys(res.body).length).to.equal(0)

          done()
        })
    })

    test('log in to newly verified account', async (done) => {
      chai
        .request(global.app)
        .post(`${v1Path}/auth/login`)
        .send(sendBody)
        .end((err, res) => {
          chaiExpect(res).to.have.status(200)

          chaiExpect(res.body.addByRSSPodcastFeedUrls).to.eql([])
          chaiExpect(res.body.email).to.equal('verifyEmailTest@stage.podverse.fm')
          chaiExpect(res.body.emailVerified).to.equal(true)
          chaiExpect(res.body).to.have.property('freeTrialExpiration')
          chaiExpect(res.body.id).to.equal('BoYBlZiFw')
          chaiExpect(res.body.membershipExpiration).to.equal(null)
          chaiExpect(res.body.name).to.equal('test - verifyEmail')
          chaiExpect(res.body.playlists).to.eql([])
          chaiExpect(res.body.subscribedPlaylistIds).to.eql([])
          chaiExpect(res.body.subscribedPodcastIds).to.eql([])
          chaiExpect(res.body.subscribedUserIds).to.eql([])
          chaiExpect(Object.keys(res.body).length).to.equal(11)

          done()
        })
    })
  })
})
