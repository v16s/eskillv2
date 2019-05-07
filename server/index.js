import express from 'express'
import bodyParser from 'body-parser'
import { validate, auth } from './routes'
import cors from 'cors'
import http from 'http'
import passport from './config/passport'
import logger from 'morgan'
import { ApolloServer } from 'apollo-server-express'
import { prisma } from './prisma'
import { typeDefs, resolvers } from './graphql'

const app = express()
const port = process.env.PORT || 5000

async function init (callback) {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user })
  })

  app.use(cors())
  app.use(logger('tiny'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: 'false' }))

  app.use('/api/auth', auth)
  app.use('/api/validate', validate)
  app.use('/graphql', (req, res, next) => {
    passport.authenticate('auth', { session: false }, (err, user) => {
      req.user = user
      next()
    })(req, res, next)
  })
  await apollo.applyMiddleware({
    app
  })
  let server = http.createServer(app)

  server.listen(port)
  server.on('listening', () => {
    let addr = server.address()
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.log('Listening on ' + bind)
  })
}
try {
  init()
} catch (e) {
  console.log(e)
}
