import React from 'react'
import { Router as BrowserRouter, Route, Switch } from 'react-router-dom'
import { history } from './util'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Login, Register, Admin, Student } from './views'
import {Loading} from './components'

const GET_USER = gql`
  {
    details @client {
      level
    }
    loggedIn @client
  }
`
const RouterSwitch = ({ level }) => {
  switch (level) {
    case 0:
      return <Admin />
      break
    case 4:
      return <Student />
    default:
      return <div> logged in </div>
      break
  }
}
class Router extends React.Component {
  render () {
    let { data } = this.props
    if (data.loggedIn == null) {
      return <Loading color="#03a9f4"></Loading>
    }
    return (
      <BrowserRouter history={history}>
        {data.loggedIn == false && (
          <Switch>
            <Route path='/register' component={() => <Register />} />
            <Route path='/' component={() => <Login />} />
          </Switch>
        )}
        {data.loggedIn == true && <RouterSwitch level={data.details.level} />}
      </BrowserRouter>
    )
  }
}
export default graphql(GET_USER)(Router)
