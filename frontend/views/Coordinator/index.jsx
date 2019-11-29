import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Questions from './Questions'
import { Tabs, Tab } from '@material-ui/core'
import { AppBar } from '../../components'
import Problems from '../Problems'
import { withRouter } from 'react-router-dom'
import Progress from './Progress'
export default withRouter(
  class Coordinator extends React.Component {
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
        case 2:
          this.props.history.push('/progress')
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
            <Tab label='Questions' />
            <Tab label='Problem Reports' />
            <Tab label='Student Progress' />
          </Tabs>
          <Switch>
            <Route path='/reports' component={Problems} />
            <Route path='/progress' component={Progress} />
            <Route path='/' component={Questions} />
          </Switch>
        </div>
      )
    }
  }
)
