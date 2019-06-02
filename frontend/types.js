import gql from 'graphql-tag'
export const typeDefs = gql`
  extend type Query {
    loggedIn: Boolean!
    details: User!
  }
  extend type Mutation {
    changeDark(dark: Boolean!): Boolean
  }
`
export const resolvers = {
  Mutation: {
    changeDark: (_, { dark }, { cache }) => {
      cache.writeData({ data: { dark } })
      return dark
    }
  }
}
