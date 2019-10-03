import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Login,
  Register,
  Admin,
  Student,
  Coordinator,
  Faculty,
  Forgot,
  Campus,
  Recovery
} from './views'
import { Loading } from './components'
import { endpoints } from './util'

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
    case 1:
      return <Campus />
    case 2:
      return <Coordinator />
    case 3:
      return <Faculty />
    case 4:
      return <Student />
    default:
      return <div> logged in </div>
  }
}
class Router extends React.Component {
  render () {
    let { data } = this.props
    if (data.loggedIn == null) {
      return <Loading color='#3281ff' />
    }
    return (
      <BrowserRouter
        basename={process.env.NODE_ENV == 'production' ? endpoints.path : ''}
      >
        {data.loggedIn == false && (
          <Switch>
            <Route path='/forgot/:token' component={Recovery} />
            <Route path='/forgot' component={Forgot} />
            <Route path='/register' component={Register} />
            <Route path='/' component={Login} />
          </Switch>
        )}
        {data.loggedIn == true && <RouterSwitch level={data.details.level} />}
      </BrowserRouter>
    )
  }
}
export default graphql(GET_USER)(Router)
