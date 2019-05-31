import React from 'react'
import { Router as BrowserRouter, Route, Switch } from 'react-router-dom'
import { history } from './util'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Login, Register } from './views'

const GET_USER = gql`
  {
    loggedIn @client
  }
`

export default class Router extends React.Component {
  render () {
    return (
      <Query query={GET_USER}>
        {({ data }) => {
          console.log(data.loggedIn)
          if (data.loggedIn == null) {
            return 'loading...'
          }
          return (
            <BrowserRouter history={history}>
              {data.loggedIn == false && (
                <Switch>
                  <Route path='/register' component={() => <Register />} />
                  <Route path='/' component={() => <Login />} />
                </Switch>
              )}
              {data.loggedIn == true && (
                <Switch>
                  <Route path='/' component={() => <Login />} />
                </Switch>
              )}
            </BrowserRouter>
          )
        }}
      </Query>
    )
  }
}
