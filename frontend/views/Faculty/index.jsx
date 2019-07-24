import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AppBar } from '../../components'
import { Tabs, Tab, Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import Progress from './Progress'
import Problems from '../Problems'
export default withStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    maxWidth: '800px',
    zIndex: 1
  }
}))(
  withRouter(
    class Student extends React.Component {
      constructor (props) {
        super(props)
        let location = 0
        switch (props.history.location.pathname) {
          case '/progress':
            location = 1
            break
          case '/reports':
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
            this.props.history.push('/')
            break
          case 1:
            this.props.history.push('/progress')
            break
          case 2:
            this.props.history.push('/reports')
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

            <Paper className={classes.paper}>
              <Tabs
                variant='fullWidth'
                value={value}
                indicatorColor='primary'
                textColor='primary'
                onChange={this.handleChange}
              >
                <Tab label='Incoming Requests' />
                <Tab label='Student Progress' />
                <Tab label='Problem Reports' />
              </Tabs>

              <Switch>
                <Route path='/reports' component={Problems} />
                <Route path='/progress' component={Progress} />
                <Route path='/' component={Dashboard} />
              </Switch>
            </Paper>
          </div>
        )
      }
    }
  )
)
