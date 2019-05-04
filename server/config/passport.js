import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { User, Report } from '../models'
import settings from './settings'
import passport from 'passport'

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
opts.secretOrKey = settings.secret
passport.use(
  'admin',
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ regNumber: jwt_payload.regNumber }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user && user.isAdmin == 0) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  })
)
passport.use(
  'student',
  new JwtStrategy(opts, function (jwt_payload, done) {
    Report.findOne({ username: jwt_payload.username }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  })
)
passport.use(
  'faculty',
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ regNumber: jwt_payload.regNumber }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user && (user.isAdmin == 2 || user.isAdmin == 0)) {
        done(null, user)
      } else {
        done(null, { level: 0 })
      }
    })
  })
)
passport.use(
  'validate',
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ regNumber: jwt_payload.regNumber }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, { level: 0 })
      }
    })
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
