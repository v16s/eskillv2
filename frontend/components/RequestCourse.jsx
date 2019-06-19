import React from 'react'
import { Modal, Paper, Grid, Button, Fab, Icon } from '@material-ui/core'
import { Dropdown } from './index'
import { Send } from '@material-ui/icons'
import { compose, graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
const BRANCHES = gql`
  query Branches {
    branches {
      name
    }
  }
`

const COURSES = gql`
  query Courses($name: String, $branch: String) {
    courses(where: { name: $name, branch: $branch }) {
      name
    }
  }
`

class RequestCourse extends React.Component {
  state = {
    branch: {},
    courses: []
  }
  onDropdownChange = (value, e) => {
    let newstate = this.state
    newstate[e.name] = value
    let { client } = this.props
    client
      .query({
        query: COURSES,
        variables: { branch: value.value }
      })
      .then(({ data }) => {
        this.setState({ courses: data.courses })
      })
    this.setState(newstate)
  }
  onCourseChange = (value, e) => {
    let newstate = this.state
    newstate[e.name] = value
    let { client } = this.props
    this.setState(newstate)
  }
  render () {
    let branches = []
    if (this.props.branches.branches) {
      branches = this.props.branches.branches.map(d => ({
        label: d.name,
        value: d.name
      }))
    }
    const courses = this.state.courses.map(d => ({
      label: d.name,
      value: d.name
    }))
    return (
      <Paper
        style={{
          padding: '20px 0',
          flexDirection: 'column',
          display: 'flex',
          width: '90%',
          maxWidth: '400px',
          padding: 20
        }}
        tabIndex={-1}
      >
        <Grid container spacing={3} style={{ height: 'auto' }}>
          <Grid item xs={12}>
            <Dropdown
              options={branches}
              onChange={this.onDropdownChange}
              label='Branch'
              name='branch'
            />
          </Grid>
          <Grid item xs={12}>
            <Dropdown
              options={courses}
              onChange={this.onCourseChange}
              label='Course'
              name='course'
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Button
              style={{
                width: '100%'
              }}
              variant='text'
              onClick={e => this.props.close()}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item md={6} xs={12}>
            <Button
              style={{
                width: '100%'
              }}
              variant='contained'
              color='primary'
            >
              Request
              <Send
                style={{
                  marginLeft: '5px'
                }}
              />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}
export default compose(
  withApollo,
  graphql(BRANCHES, {
    name: 'branches',
    options: { fetchPolicy: 'network-only' }
  })
)(RequestCourse)
