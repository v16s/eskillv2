import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Questions from './Questions'
import Users from './Users'
import { Tabs, Tab } from '@material-ui/core'
import { AppBar } from '../../components'
import { history } from '../../util'
export default class Admin extends React.Component {
  constructor (props) {
    super(props)
    let location = 0
    switch (history.location.pathname) {
      case '/questions':
        location = 1
        break
      case '/user':
        location = 2
        break
    }
    this.state = {
      value: location
    }
  }
  handleChange = (e, value) => {
    switch (value) {
      case 0:
        history.push('/')
        break
      case 1:
        history.push('/questions')
        break
      case 2:
        history.push('/user')
        break
    }
    this.setState({ value })
  }
  render () {
    const { value } = this.state
    return (
      <div
        style={{
          width: '100vw',
          minHeight: '100vh'
        }}
      >
        <AppBar />
        <Tabs
          value={value}
          indicatorColor='primary'
          textColor='primary'
          onChange={this.handleChange}
        >
          <Tab label='Dashboard' />
          <Tab label='Questions' />
          <Tab label='User' />
        </Tabs>
        <Switch>
        <Route path='/user' component={Users} />
          <Route path='/questions' component={Questions} />
          <Route path='/' component={Dashboard} />
        </Switch>
      </div>
    )
  }
}
