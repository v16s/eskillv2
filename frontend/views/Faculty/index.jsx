import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AppBar } from '../../components'
import { Tabs, Tab, Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { history } from '../../util'
import Dashboard from './Dashboard'
export default withStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '90%',
    maxWidth: '800px',
    zIndex: 1
  }
}))(
  class Student extends React.Component {
    constructor (props) {
      super(props)
      let location = 0
      switch (history.location.pathname) {
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
          history.push('/')
          break
        case 1:
          history.push('/reports')
          break
      }
      this.setState({ value })
    }
    render () {
      const { value } = this.state
      const { classes } = this.props
      return (
        <div
          style={{
            width: '100vw',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ zIndex: 2 }}>
            <AppBar />
          </div>
          <div
            style={{
              position: 'absolute',
              height: '100vh',
              width: '100vw',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              top: 0,
              left: 0
            }}
          >
            <Paper className={classes.paper}>
              <Tabs
                variant='fullWidth'
                value={value}
                indicatorColor='primary'
                textColor='primary'
                onChange={this.handleChange}
              >
                <Tab label='Student Progress' />
                <Tab label='Problem Reports' />
              </Tabs>

              <Switch>
                <Route path='/' component={Dashboard} />
              </Switch>
            </Paper>
          </div>
        </div>
      )
    }
  }
)
