import React from 'react'
import { render } from 'react-dom'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider, graphql } from 'react-apollo'
import { endpoints } from './util'
import { createUploadLink } from 'apollo-upload-client'
import Router from './router'
import { typeDefs, resolvers } from './types'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import { lightBlue } from '@material-ui/core/colors'
const cache = new InMemoryCache()

const httpLink = createUploadLink({
  uri: endpoints.dev
})
const GET_DARK = gql`
  {
    dark @client
  }
`
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
client.writeData({ data: { loggedIn: null, dark: false } })
client.query({ query: GET_USER }).then(({ data: { validate } }) => {
  client.writeData({
    data: { loggedIn: validate != null, details: validate }
  })
})
const styles = theme => ({
  root: {
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    background: theme.palette.background.default
  }
})
class Root extends React.Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <ThemeWrapper />
      </ApolloProvider>
    )
  }
}
let Index = ({ classes }) => (
  <div className={classes.root}>
    <Router />
  </div>
)
Index = withStyles(styles)(Index)
let ThemeWrapper = ({ data }) => {
  console.log(data.dark)
  let theme = createMuiTheme({
    palette: {
      type: data.dark ? 'dark' : 'light',
      primary: lightBlue
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
