import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  TextField,
  Typography,
  Paper,
  Button,
  IconButton
} from '@material-ui/core'
import gql from 'graphql-tag'
import { graphql, withApollo, compose, Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { Tonality } from '@material-ui/icons'

const LOGIN = gql`
  mutation Recovery($input: RecoveryInput!) {
    recover(input: $input) {
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
const GET_DARK = gql`
  {
    dark @client
  }
`
const IS_VALID = gql`
  query TokenExistence($token: String!) {
    tokenExistence(token: $token)
  }
`
const CHANGE_DARK = gql`
  mutation ChangeDark($dark: Boolean!) {
    changeDark(dark: $dark) @client
  }
`
const styles = theme => ({
  paper: {
    width: '80%',
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    color: theme.palette.text.primary
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
  },
  titleBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

class Recovery extends React.Component {
  state = {
    confirm: '',
    password: '',
    token: this.props.match.params.token
  }
  onInputChange = e => {
    let newstate = this.state
    newstate[e.target.id] = e.target.value
    this.setState(newstate)
  }
  onRecovery = e => {
    e.preventDefault()
    let { client } = this.props
    if (this.state.password === this.state.confirm) {
      this.props
        .mutate({ variables: { input: this.state } })
        .then(({ data: { recover } }) => {
          localStorage.setItem('jwtToken', recover.jwt)
          client.writeData({
            data: { loggedIn: !!recover.jwt, details: recover }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  render () {
    const { classes, dark, match } = this.props

    const { confirm, password } = this.state
    const isSame = confirm === password
    return (
      <div className={classes.paper}>
        <div className={classes.titleBar}>
          <Typography color='primary' variant='h5' className={classes.heading}>
            Recover eSkill Account
          </Typography>
          <IconButton
            color='primary'
            onClick={e => {
              this.props.changeDark({ variables: { dark: !dark.dark } })
            }}
          >
            <Tonality />
          </IconButton>
        </div>
        <Query query={IS_VALID} variables={{ token: match.params.token }}>
          {({ data, loading }) => {
            if (!loading) {
              if (data.tokenExistence) {
                return (
                  <form onSubmit={this.onRecovery}>
                    <div className={classes.input}>
                      <TextField
                        className={classes.input}
                        variant='outlined'
                        id='password'
                        type='password'
                        onChange={this.onInputChange}
                        label='New Password'
                        value={password}
                      />

                      <TextField
                        className={classes.input}
                        id='confirm'
                        type='password'
                        variant='outlined'
                        error={!isSame}
                        helperText={!isSame && "Passwords don't match!"}
                        onChange={this.onInputChange}
                        label='Confirm Password'
                        value={confirm}
                      />
                    </div>
                    <Button
                      variant='contained'
                      color='primary'
                      size='medium'
                      className={`${classes.button} ${classes.login}`}
                      type='submit'
                      style={{ color: '#fff' }}
                    >
                      Change Password
                    </Button>
                  </form>
                )
              } else return 'Invalid Token'
            }
            return null
          }}
        </Query>
      </div>
    )
  }
}
Recovery = withStyles(styles)(Recovery)
export default compose(
  withApollo,
  graphql(LOGIN),
  graphql(GET_DARK, { name: 'dark' }),
  graphql(CHANGE_DARK, { name: 'changeDark' }),
  graphql(IS_VALID, { name: 'validity' })
)(Recovery)
