import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  TextField,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab
} from '@material-ui/core'
import { history } from '../util'
import { Dropdown } from '../components'

const suggestions = ['ktr', 'asd', 'bbb'].map(suggestion => ({
  value: suggestion,
  label: suggestion
}))

const styles = theme => ({
  root: {
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    flexDirection: 'column'
  },
  paper: {
    width: '80%',
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2)
  },
  input: {
    marginTop: '15px',
    width: '100%'
  },
  heading: {
    textAlign: 'center',
    fontFamily: 'monospace',
    fontWeight: '500'
  },
  button: {
    width: '100%',
    marginTop: '10px'
  },
  login: {
    background: 'linear-gradient( 135deg, #130CB7 10%, #3F51B5 100%)'
  },
  textButton: {
    width: '80%',
    maxWidth: 400
  }
})

class Login extends React.Component {
  state = {
    value: null,
    tab: 0
  }
  onDropdownChange = value => {
    this.setState({ value })
  }
  handleTabChange = (event, tab) => {
    this.setState({ tab })
  }
  render () {
    const { classes } = this.props
    const { value, tab } = this.state

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography color='primary' variant='h5' className={classes.heading}>
            Register
          </Typography>
          <Tabs
            value={tab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.handleTabChange}
          >
            <Tab label='Student' />
            <Tab label='Faculty' />
          </Tabs>
          <div className={classes.input}>
            <TextField
              className={classes.input}
              variant='outlined'
              id='username'
              type='text'
              label={tab == 0 ? 'Register Number' : 'Faculty ID'}
            />

            <Dropdown
              className={classes.input}
              options={suggestions}
              onChange={this.onDropdownChange}
              value={value}
              placeholder={'Select your campus'}
              label='College Campus'
            />
            <Dropdown
              className={classes.input}
              options={suggestions}
              onChange={this.onDropdownChange}
              value={value}
              placeholder={'Select your department'}
              label='College Department'
            />
            <TextField
              className={classes.input}
              variant='outlined'
              id='email'
              type='text'
              label='Email'
            />
            <TextField
              className={classes.input}
              id='password'
              type='password'
              variant='outlined'
              label='Password'
            />
            <TextField
              className={classes.input}
              id='confirm'
              type='password'
              variant='outlined'
              label='Confirm Password'
            />
          </div>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            className={`${classes.button} ${classes.login}`}
          >
            Register
          </Button>
        </Paper>
        <Button
          size='medium'
          color='primary'
          className={`${classes.textButton}`}
          onClick={e => {
            history.push('/')
          }}
        >
          Already have an account? Login
        </Button>
      </div>
    )
  }
}
export default withStyles(styles)(Login)
