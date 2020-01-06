import React from 'react'
import { render } from 'react-dom'
// Apollo
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-common'
import { graphql } from '@apollo/react-hoc'
import { createUploadLink } from 'apollo-upload-client'
import gql from 'graphql-tag'
import { typeDefs, resolvers } from './types'
// Material UI
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
// Components
import { endpoints } from './util'
import Router from './router'
// Setting ENV
let production = process.env.NODE_ENV == 'production'
// Initializing Apollo Cache and httpLink based on ENV
const cache = new InMemoryCache()
const httpLink = createUploadLink({
  uri: production ? endpoints.production : endpoints.dev
})
const GET_DARK = gql`
  {
    dark @client
  }
`
// Setting bearer token from localstorage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : ''
    }
  }
}).concat(httpLink)
// Initializing ApolloClient
const client = new ApolloClient({
  link: authLink,
  cache,
  typeDefs,
  resolvers
})
// Queries
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
// Initializing Cache
client.writeData({
  data: { loggedIn: null, dark: localStorage.getItem('dark') == 'true' }
})
client.query({ query: GET_USER }).then(({ data: { validate } }) => {
  client.writeData({
    data: { loggedIn: validate != null, details: validate }
  })
})
// JSS
const styles = theme => ({
  root: {
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
    // width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    background: theme.palette.background.default
  }
})
// Component with ApolloProvider (Apollo Root)
class Root extends React.Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <ThemeWrapper />
      </ApolloProvider>
    )
  }
}
// Declaring Index (Soft Root)
let Index = ({ classes }) => (
  <div className={classes.root}>
    <Router />
  </div>
)
Index = withStyles(styles)(Index)
let ThemeWrapper = ({ data }) => {
  let theme = createMuiTheme({
    palette: {
      type: data.dark ? 'dark' : 'light',
      primary: {
        main: '#3281ff'
      }
    }
  })
  return (
    <ThemeProvider theme={theme}>
      <Index />
    </ThemeProvider>
  )
}
ThemeWrapper = graphql(GET_DARK)(ThemeWrapper)
render(<Root />, document.getElementById('root'))
