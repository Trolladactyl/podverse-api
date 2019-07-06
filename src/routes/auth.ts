import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import { config } from '~/config'
import { emitRouterError } from '~/lib/errors'
import { /* emailNotExists, */ jwtAuth, localAuth, logOut, optionalJwtAuth, resetPassword, sendResetPassword,
  sendVerification, /* signUpUser, validEmail, */ verifyEmail } from '~/middleware/auth'
import { validateAuthLogin, validateAuthResetPassword, validateAuthSendResetPassword,
  validateAuthSendVerification, /* validateAuthSignUp, */ validateAuthVerifyEmail
  } from '~/middleware/queryValidation/auth'
import { getLoggedInUser } from '~/controllers/user'
const RateLimit = require('koa2-ratelimit').RateLimit
const { rateLimiterMaxOverride } = config

const router = new Router({ prefix: `${config.apiPrefix}${config.apiVersion}/auth` })

router.use(bodyParser())

router.post('/get-authenticated-user-info',
  optionalJwtAuth,
  async ctx => {
    try {
      const { user: jwtUserData } = ctx.state

      if (jwtUserData && jwtUserData.id) {
        const user = await getLoggedInUser(jwtUserData.id)
        if (user) {
          ctx.body = {
            email: user.email,
            freeTrialExpiration: user.freeTrialExpiration,
            historyItems: user.historyItems,
            id: user.id,
            isPublic: user.isPublic,
            membershipExpiration: user.membershipExpiration,
            name: user.name,
            playlists: user.playlists,
            queueItems: user.queueItems,
            subscribedPlaylistIds: user.subscribedPlaylistIds,
            subscribedPodcastIds: user.subscribedPodcastIds,
            subscribedUserIds: user.subscribedUserIds
          }
        }
      }

      ctx.status = 200
    } catch (error) {
      ctx.body = {}
      ctx.status = 401
    }
  })

const loginLimiter = RateLimit.middleware({
  interval: 1 * 60 * 1000,
  max:  rateLimiterMaxOverride || 5,
  message: `You're doing that too much. Please try again in a minute.`,
  prefixKey: 'post/login'
})

router.post('/login',
  loginLimiter,
  validateAuthLogin,
  localAuth)

router.post('/logout', logOut)

const resetPasswordLimiter = RateLimit.middleware({
  interval: 1 * 60 * 1000,
  max:  rateLimiterMaxOverride || 3,
  message: `You're doing that too much. Please try again in a minute.`,
  prefixKey: 'post/reset-password'
})

router.post('/reset-password',
  resetPasswordLimiter,
  validateAuthResetPassword,
  resetPassword)

const sendResetPasswordLimiter = RateLimit.middleware({
  interval: 5 * 60 * 1000,
  max:  rateLimiterMaxOverride || 2,
  message: `You're doing that too much. Please try again in 2 minutes.`,
  prefixKey: 'post/reset-password'
})

router.post('/send-reset-password',
  sendResetPasswordLimiter,
  validateAuthSendResetPassword,
  sendResetPassword)

const sendVerificationLimiter = RateLimit.middleware({
  interval: 5 * 60 * 1000,
  max:  rateLimiterMaxOverride || 2,
  message: `You're doing that too much. Please try again in 2 minutes.`,
  prefixKey: 'post/reset-password'
})

router.post('/send-verification',
  jwtAuth,
  sendVerificationLimiter,
  validateAuthSendVerification,
  async ctx => {
    try {
      await sendVerification(ctx, ctx.state.user.id)
    } catch (error) {
      emitRouterError(error, ctx)
    }
  })

// const signUpLimiter = RateLimit.middleware({
//   interval: 5 * 60 * 1000,
//   max: rateLimiterMaxOverride || 2,
//   message: `You're doing that too much. Please try again in 2 minutes.`,
//   prefixKey: 'post/reset-password'
// })

// router.post('/sign-up',
//   signUpLimiter,
//   validateAuthSignUp,
//   validEmail,
//   emailNotExists,
//   signUpUser)

const verifyEmailLimiter = RateLimit.middleware({
  interval: 5 * 60 * 1000,
  max: rateLimiterMaxOverride || 2,
  message: `You're doing that too much. Please try again in 2 minutes.`,
  prefixKey: 'post/verify-email'
})

router.get('/verify-email',
  verifyEmailLimiter,
  validateAuthVerifyEmail,
  verifyEmail)

export const authRouter = router
