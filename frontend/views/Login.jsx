import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextField, Typography, Paper, Button } from '@material-ui/core'
import gql from 'graphql-tag'
import { graphql, withApollo, compose } from 'react-apollo'
import { history } from '../util'

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(user: { username: $username, password: $password }) {
      username
      password
      name
      email
      level
      department
      dob
      jwt
      campus
    }
  }
`

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
    background: `linear-gradient( 135deg, ${theme.palette.primary.main} 40%, ${
      theme.palette.primary.dark
    } 100%)`
  }
})

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }
  onInputChange = e => {
    let newstate = this.state
    newstate[e.target.id] = e.target.value
    this.setState(newstate)
  }
  onLogin = e => {
    e.preventDefault()
    let { client } = this.props
    this.props
      .mutate({ variables: this.state })
      .then(({ data: { login } }) => {
        localStorage.setItem('jwtToken', login.jwt)
        client.writeData({ data: { loggedIn: !!login.jwt, details: login } })
      })
      .catch(err => {
        console.log(err)
      })
  }
  render () {
    const { classes } = this.props
    const { username, password } = this.state
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography color='primary' variant='h5' className={classes.heading}>
            eSkill
          </Typography>
          <form onSubmit={this.onLogin}>
            <div className={classes.input}>
              <TextField
                className={classes.input}
                variant='outlined'
                id='username'
                type='text'
                onChange={this.onInputChange}
                label='Register Number'
                value={username}
              />

              <TextField
                className={classes.input}
                id='password'
                type='password'
                variant='outlined'
                onChange={this.onInputChange}
                label='Password'
                value={password}
              />
            </div>
            <Button
              variant='contained'
              color='primary'
              size='medium'
              className={`${classes.button} ${classes.login}`}
              type='submit'
            >
              Login
            </Button>
          </form>
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
Login = withStyles(styles)(Login)
export default compose(
  withApollo,
  graphql(LOGIN)
)(Login)
