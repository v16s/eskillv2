import express from 'express'
import bodyParser from 'body-parser'
import {
  admin,
  student,
  validate,
  auth,
  global,
  faculty,
  coordinator
} from './routes'
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
    resolvers
  })

  app.use(cors())
  app.use(logger('tiny'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: 'false' }))

  app.use('/api/auth', auth)
  app.use('/api/global', global)
  app.use(
    '/api/faculty',
    passport.authenticate('faculty', { session: false }),
    faculty
  )
  app.use(
    '/api/admin',
    passport.authenticate('admin', { session: false }),
    admin
  )
  app.use(
    '/api/coordinator',
    passport.authenticate('coordinator', { session: false }),
    coordinator
  )
  app.use(
    '/api/student',
    passport.authenticate('student', { session: false }),
    student
  )
  app.use('/api/validate', validate)
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
