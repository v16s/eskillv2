import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import { AppBar } from '../../components'
export default () => (
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
