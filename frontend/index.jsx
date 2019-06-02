import React from 'react'
import { render } from 'react-dom'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { endpoints } from './util'
import { createUploadLink } from 'apollo-upload-client'
import Router from './router'
import { typeDefs, resolvers } from './types'

const cache = new InMemoryCache()

const httpLink = createUploadLink({
  uri: endpoints.dev
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwtToken')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : ''
    }
  }
}).concat(httpLink)

const client = new ApolloClient({
  link: authLink,
  cache,
  typeDefs,
  resolvers
})
const GET_USER = gql`
  {
    validate {
      username
      password
      name
      campus
      department
      dob
      email
      level
    }
  }
`
client.writeData({ data: { loggedIn: null } })
client.query({ query: GET_USER }).then(({ data: { validate } }) => {
  client.writeData({
    data: { loggedIn: validate != null, details: validate }
  })
})

class Index extends React.Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <Router />
      </ApolloProvider>
    )
  }
}

render(<Index />, document.getElementById('root'))
