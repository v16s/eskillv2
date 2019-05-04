import types from './types'
const resolvers = {
  Query: {
    global: (parent, args, ctx, info) => {
      return new Promise(resolve => {
        resolve('hello')
      })

      return {}
    }
  }
}
const typeDefs = [types]
export { typeDefs, resolvers }
