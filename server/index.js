import express from 'express'
import http from 'http'
import passport from './config/passport'
import logger from 'morgan'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql'
import mongodb from 'mongodb'
import { dburl, dbname } from './config/db'

const app = express()
const port = process.env.PORT || 5000

async function init (callback) {
  mongodb.MongoClient.connect(
    dburl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (error, client) => {
      const db = client.db(dbname)

      const apollo = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({
          user: req.user,
          bucket: new mongodb.GridFSBucket(db)
        }),
        introspection: true
      })

      app.use(logger('tiny'))
      app.use('/graphql', (req, res, next) => {
        passport.authenticate('auth', { session: false }, (err, user) => {
          req.user = user
          next()
        })(req, res, next)
      })
      await apollo.applyMiddleware({
        app,
        path: '/graphql'
      })
      let server = http.createServer(app)

      server.listen(port)
      server.on('listening', () => {
        let addr = server.address()
        let bind =
          typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
        console.log('Listening on ' + bind)
      })
    }
  )
}
try {
  init()
} catch (e) {
  console.log(e)
}
