import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AppBar } from '../../components'
import { history } from '../../util'
import Dashboard from './Dashboard'
export default class Admin extends React.Component {
  render () {
    return (
      <div
        style={{
          width: '100vw',
          minHeight: '100vh'
        }}
      >
        <AppBar />
        <Switch>
          <Route path='/' component={Dashboard} />
        </Switch>
      </div>
    )
  }
}
