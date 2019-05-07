import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { prisma } from 'prisma'
import settings from './settings'
import passport from 'passport'

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
opts.secretOrKey = settings.secret
passport.use(
  'auth',
  new JwtStrategy(opts, async function ({ username }, done) {
    try {
      let user = await prisma.user({ username })

      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    } catch (err) {
      return done(err, false)
    }
  })
)
passport.use(
  'coordinator',
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ regNumber: jwt_payload.regNumber }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user && user.isAdmin == 1) {
        done(null, user)
      } else {
        done(null, { level: 0 })
      }
    })
  })
)

export default passport
