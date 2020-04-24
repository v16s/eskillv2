import React from 'react'
import { Modal, Paper, Grid, Button, Fab, Icon } from '@material-ui/core'
import { Dropdown } from './index'
import { Send } from '@material-ui/icons'
import { graphql, withApollo } from '@apollo/react-hoc'
import { compose } from 'recompose'
import gql from 'graphql-tag'
const BRANCHES = gql`
  query Branches {
    branches {
      name
    }
  }
`
const FACULTIES = gql`
  query Faculties {
    faculties {
      id
      name
      username
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
const REQUEST_COURSE = gql`
  mutation RequestCourse($course: String!, $facultyID: String!) {
    requestCourse(course: $course, facultyID: $facultyID) {
      total
    }
  }
`

class RequestCourseBase extends React.Component {
  state = {
    branch: {},
    courses: [],
    faculties: []
  }
  onBranchChange = (value, e) => {
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
  onChange = (value, e) => {
    let newstate = this.state
    newstate[e.name] = value
    this.setState(newstate)
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.faculties.faculties) {
      nextState.faculties = nextProps.faculties.faculties.map(d => ({
        label: `${d.name} - ${d.username}`,
        value: d.id
      }))
    }
    return true
  }
  handleRequestSubmit = e => {
    this.props
      .requestCourse({
        variables: {
          facultyID: this.state.faculty.value,
          course: this.state.course.label
        }
      })
      .then(({ data }) => {
        console.log(data)
        this.props.close(true, this.props.refetch)
      })
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
    const { faculties } = this.state
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
              onChange={this.onBranchChange}
              label='Branch'
              name='branch'
            />
          </Grid>
          <Grid item xs={12}>
            <Dropdown
              options={courses}
              onChange={this.onChange}
              label='Course'
              name='course'
            />
          </Grid>
          <Grid item xs={12}>
            <Dropdown
              options={faculties}
              onChange={this.onChange}
              label='Faculty'
              name='faculty'
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
              onClick={this.handleRequestSubmit}
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
export const RequestCourse = compose(
  withApollo,
  graphql(REQUEST_COURSE, { name: 'requestCourse' }),
  graphql(BRANCHES, {
    name: 'branches',
    options: { fetchPolicy: 'network-only' }
  }),
  graphql(FACULTIES, { name: 'faculties' })
)(RequestCourseBase)
