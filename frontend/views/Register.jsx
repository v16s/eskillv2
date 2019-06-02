import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  TextField,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  IconButton
} from '@material-ui/core'
import { history } from '../util'
import { Dropdown } from '../components'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { find } from 'lodash'
import { Tonality } from '@material-ui/icons'

const GET_CAMPUSES = gql`
  query Campus {
    campuses {
      name
      departments {
        name
        id
      }
    }
  }
`
const GET_DARK = gql`
  {
    dark @client
  }
`
const CHANGE_DARK = gql`
  mutation ChangeDark($dark: Boolean!) {
    changeDark(dark: $dark) @client
  }
`
const REGISTER = gql`
  mutation Register(
    $username: String!
    $password: String!
    $name: String!
    $email: String!
    $campus: String!
    $department: String!
    $type: Boolean!
  ) {
    register(
      user: {
        username: $username
        password: $password
        email: $email
        name: $name
        department: $department
        campus: $campus
        type: $type
      }
    ) {
      name
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
    background: `linear-gradient( 135deg, ${theme.palette.primary.main} 40%, ${
      theme.palette.primary.dark
    } 100%)`
  },
  textButton: {
    width: '80%',
    maxWidth: 400
  },
  titleBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

class Register extends React.Component {
  state = {
    campus: { value: '' },
    tab: 0,
    department: null,
    username: '',
    email: '',
    password: '',
    confirm: '',
    name: ''
  }
  onDropdownChange = (value, { name }) => {
    let newstate = this.state
    newstate[name] = value
    this.setState(newstate)
  }
  handleTabChange = (event, tab) => {
    this.setState({ tab })
  }
  onInputChange = e => {
    let newstate = this.state
    newstate[e.target.id] = e.target.value
    this.setState(newstate)
  }
  onSubmit = e => {
    e.preventDefault()
    console.log('submit')
    let { success, error, details: data } = this.checkDetails()
    if (success) {
      console.log('success')
      let type = this.state.tab == 1
      this.props
        .mutate({ variables: { ...data, type } })
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      console.log(error)
    }
  }
  checkDetails = () => {
    let result = { success: true, error: '' }
    let {
      username,
      email,
      password,
      confirm,
      campus,
      department,
      name
    } = this.state
    campus = campus.value
    department = department.value
    let arr = [username, email, password, confirm, campus, department, name]
    arr.map(k => {
      if (!k || k == '') {
        result.success = false
        result.error = 'Null Field'
      }
    })
    if (result.success) {
      if (password != confirm) {
        result.success = false
        result.error = 'Passwords not equal'
      }
    }
    return {
      ...result,
      details: { username, email, password, campus, department, name }
    }
  }
  render () {
    const { classes, dark } = this.props
    const {
      campus,
      tab,
      department,
      username,
      email,
      password,
      confirm,
      name
    } = this.state
    let { data } = this.props
    let campuses = data.campuses
      ? data.campuses.map(k => ({ label: k.name, value: k.name }))
      : []
    let current = find(data.campuses, { name: campus.value })
    let departments = current && current.departments
    departments = departments
      ? departments.map(k => ({ label: k.name, value: k.id }))
      : []
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.titleBar}>
            <Typography
              color='primary'
              variant='h5'
              className={classes.heading}
            >
              Register
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
          <Tabs
            value={tab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.handleTabChange}
          >
            <Tab label='Student' />
            <Tab label='Faculty' />
          </Tabs>
          <form onSubmit={this.onSubmit}>
            <div className={classes.input}>
              <TextField
                className={classes.input}
                variant='outlined'
                id='username'
                type='text'
                label={tab == 0 ? 'Register Number' : 'Faculty ID'}
                onChange={this.onInputChange}
                value={username}
              />

              <Dropdown
                className={classes.input}
                options={campuses}
                onChange={this.onDropdownChange}
                value={campus}
                placeholder={'Select your campus'}
                label='College Campus'
                name='campus'
              />
              <Dropdown
                className={classes.input}
                options={departments}
                onChange={this.onDropdownChange}
                value={department}
                placeholder={'Select your department'}
                label='College Department'
                name='department'
              />
              <TextField
                className={classes.input}
                variant='outlined'
                id='name'
                type='text'
                label='Name'
                onChange={this.onInputChange}
                value={name}
              />
              <TextField
                className={classes.input}
                variant='outlined'
                id='email'
                type='text'
                label='Email'
                onChange={this.onInputChange}
                value={email}
              />
              <TextField
                className={classes.input}
                id='password'
                type='password'
                variant='outlined'
                label='Password'
                onChange={this.onInputChange}
                value={password}
              />
              <TextField
                className={classes.input}
                id='confirm'
                type='password'
                variant='outlined'
                label='Confirm Password'
                onChange={this.onInputChange}
                value={confirm}
              />
            </div>
            <Button
              variant='contained'
              color='primary'
              size='medium'
              className={`${classes.button} ${classes.login}`}
              type='submit'
              style={{color: '#fff'}}
            >
              Register
            </Button>
          </form>
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
Register = withStyles(styles)(Register)
export default compose(
  graphql(GET_CAMPUSES),
  graphql(REGISTER),
  graphql(GET_DARK, { name: 'dark' }),
  graphql(CHANGE_DARK, { name: 'changeDark' })
)(Register)
