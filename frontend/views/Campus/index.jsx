import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Progress from './Progress'
import { Tabs, Tab } from '@material-ui/core'
import { AppBar } from '../../components'
import { withRouter } from 'react-router-dom'
export default withRouter(
  class Admin extends React.Component {
    constructor (props) {
      super(props)
      let location = 0
      switch (props.history.location.pathname) {
        case '/reports':
          location = 1
          break
      }
      this.state = {
        value: location
      }
    }
    handleChange = (e, value) => {
      switch (value) {
        case 0:
          this.props.history.push('/')
          break
        case 1:
          this.props.history.push('/reports')
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
            <Tab label='Reports' />
          </Tabs>
          <Switch>
            <Route path='/reports' component={Progress} />
            <Route path='/' component={Dashboard} />
          </Switch>
        </div>
      )
    }
  }
)
