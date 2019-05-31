import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  TextField,
  Typography,
  Paper,
  Button,
  NavigationIcon
} from '@material-ui/core'
import { history } from '../util'

const styles = theme => ({
  root: {
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box'
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
  }
})

class Login extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography color='primary' variant='h5' className={classes.heading}>
            eSkill
          </Typography>
          <div className={classes.input}>
            <TextField
              className={classes.input}
              variant='outlined'
              id='username'
              type='text'
              label='Register Number'
            />

            <TextField
              className={classes.input}
              id='password'
              type='password'
              variant='outlined'
              label='Password'
            />
          </div>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            className={`${classes.button} ${classes.login}`}
          >
            Login
          </Button>
          <Button
            variant='outlined'
            size='medium'
            color='primary'
            className={classes.button}
            onClick={e => {
              history.push('/register')
            }}
          >
            Register
          </Button>
        </Paper>
      </div>
    )
  }
}
export default withStyles(styles)(Login)
