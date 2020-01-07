import gql from 'graphql-tag'
export const typeDefs = gql`
  extend type Query {
    loggedIn: Boolean!
    details: User!
  }
  extend type Mutation {
    resize(width: Float!, height: Float!): Dimensions
  }
`
export const resolvers = {
  Mutation: {
    changeDark: (_, { dark }, { cache }) => {
      localStorage.setItem('dark', dark)
      cache.writeData({ data: { dark } })
      return dark
    }
  }
}
