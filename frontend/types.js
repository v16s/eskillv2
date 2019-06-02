import gql from 'graphql-tag'
export const typeDefs = gql`
  extend type Query {
    loggedIn: Boolean!
    details: User!
  }
`
export const resolvers = {}
