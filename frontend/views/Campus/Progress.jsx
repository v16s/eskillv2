import React from 'react'
import gql from 'graphql-tag'
import { Query, compose, graphql, withApollo } from 'react-apollo'
import { withStyles } from '@material-ui/styles'
import { Grid, LinearProgress, Paper } from '@material-ui/core'
import { StudentProgressTable, Dropdown } from '../../components'
const styles = theme => ({
  root: {
    display: 'flex',
    color: theme.palette.text.primary,
    padding: '30px'
  },
  outer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '60%'
  },
  paper: {
    padding: 10,
    marginBottom: 20
  }
})
const BRANCHES = gql`
  query Branches {
    branches {
      name
    }
  }
`
const COURSES = gql`
  query Courses($name: String, $branch: String, $campus: String) {
    courses(where: { name: $name, branch: $branch, campus: $campus }) {
      name
    }
  }
`
const PROGRESS = gql`
  query Progress($where: CourseInstanceWhereInput!) {
    progress(where: $where) {
      id
      studentReg
      studentName
      completed
      total
    }
  }
`

const CAMPUSES = gql`
  {
    campuses {
      name
    }
  }
`
class Dashboard extends React.Component {
  state = {
    show: false,
    courses: [],
    where: {
      course: {
        label: 'All',
        value: 'All'
      }
    }
  }
  close = () => {
    this.setState({ show: !this.state.show })
  }
  onDropdownChange = (value, { name }) => {
    let newstate = this.state
    newstate.where[name] = value
    this.setState(newstate)
  }
  onBranchChange = (value, e) => {
    let newstate = this.state
    newstate[e.name] = value
    newstate.where[e.name] = value
    let { client } = this.props
    client
      .query({
        query: COURSES,
        variables: {
          branch: value.value
        }
      })
      .then(({ data }) => {
        this.setState({ courses: data.courses })
      })
    this.setState(newstate)
  }
  render () {
    const { classes } = this.props

    let branches = []
    if (this.props.branchQuery.branches) {
      branches = [
        ...this.props.branchQuery.branches.map(d => ({
          label: d.name,
          value: d.name
        }))
      ]
    }
    const courses = [
      ...this.state.courses.map(d => ({
        label: d.name,
        value: d.name
      })),
      { label: 'All', value: 'All' }
    ]
    let { where } = this.state
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={3}
          style={{ height: 'auto', justifyContent: 'center' }}
        >
          <div className={classes.outer}>
            <Paper className={classes.paper}>
              <Dropdown
                options={branches}
                onChange={this.onBranchChange}
                label='Branch'
                name='branch'
              />
            </Paper>
            <Paper className={classes.paper}>
              <Dropdown
                options={courses}
                onChange={this.onDropdownChange}
                label='Course'
                name='course'
                value={this.state.where.course}
              />
            </Paper>
            <Query
              query={PROGRESS}
              variables={{
                where: {
                  course:
                    where.course.value != 'All'
                      ? where.course.value
                      : undefined
                }
              }}
              fetchPolicy='network-only'
            >
              {({ data, loading, error }) => {
                console.log(data, error)
                if (loading) {
                  return null
                } else {
                  return (
                    <StudentProgressTable
                      columns={[
                        { title: 'Register Number', field: 'studentReg' },
                        { title: 'Name', field: 'studentName' },
                        {
                          title: 'Progress',
                          render: args => {
                            const { completed, total } = args
                            console.log(completed / total)
                            return (
                              <LinearProgress
                                variant='determinate'
                                value={parseInt(
                                  (parseFloat(completed) * 100.0) /
                                    parseFloat(total)
                                )}
                              />
                            )
                          }
                        },
                        {
                          title: '%',
                          render: ({ completed, total }) =>
                            `${parseInt(
                              (parseFloat(completed) * 100.0) /
                                parseFloat(total)
                            )}`
                        }
                      ]}
                      data={(data && data.progress) || []}
                    />
                  )
                }
              }}
            </Query>
          </div>
        </Grid>
      </div>
    )
  }
}

export default compose(
  withApollo,
  graphql(BRANCHES, { name: 'branchQuery', fetchOptions: 'network-only' })
)(withStyles(styles)(Dashboard))
