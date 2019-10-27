import React from 'react'
import gql from 'graphql-tag'
import { Query, compose, graphql, withApollo } from 'react-apollo'
import { withStyles } from '@material-ui/styles'
import { Grid, LinearProgress, Paper, Button } from '@material-ui/core'
import { StudentProgressTable, Dropdown, Document } from '../../components'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { withRouter } from 'react-router-dom'

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
const FACULTIES = gql`
  query Faculties($where: FacultyWhereInput) {
    faculties(where: $where) {
      name
      id
      username
    }
  }
`
class Progress extends React.Component {
  state = {
    show: false,
    courses: [],
    faculties: [],
    where: {
      campus: {
        label: 'All',
        value: 'All'
      },
      course: {
        label: 'All',
        value: 'All'
      },
      faculty: {
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
    let { client } = this.props
    newstate.where[name] = value
    let where = {}
    newstate.where.course.value == 'All'
      ? null
      : (where['course'] = newstate.where.course.value)

    newstate.where.campus.value == 'All'
      ? null
      : (where['campus'] = newstate.where.campus.value)
    client
      .query({ query: FACULTIES, variables: { where } })
      .then(({ data }) => {
        newstate.faculties = data.faculties
        this.setState(newstate)
      })
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
          branch: value.value,
          campus:
            this.state.where.campus.value != 'All'
              ? this.state.where.campus.value
              : undefined
        }
      })
      .then(({ data }) => {
        this.setState({ courses: data.courses })
      })
    this.setState(newstate)
  }

  render () {
    const { classes } = this.props
    const campuses = this.props.campusQuery.campuses
      ? [
        ...this.props.campusQuery.campuses.map(k => ({
          label: k.name,
          value: k.name
        })),
        { label: 'All', value: 'All' }
      ]
      : []
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
    const faculties = [
      ...this.state.faculties.map(d => ({
        label: `${d.username} - ${d.name}`,
        value: d.id
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
                options={campuses}
                onChange={this.onDropdownChange}
                value={where.campus}
                placeholder={'Select your campus'}
                label='College Campus'
                name='campus'
              />
            </Paper>
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
            <Paper className={classes.paper}>
              <Dropdown
                options={faculties}
                onChange={this.onDropdownChange}
                label='Faculty'
                name='faculty'
                value={this.state.where.faculty}
              />
            </Paper>
            <Query
              query={PROGRESS}
              variables={{
                where: {
                  campus:
                    where.campus.value != 'All'
                      ? where.campus.value
                      : undefined,
                  course:
                    where.course.value != 'All'
                      ? where.course.value
                      : undefined,
                  facultyID:
                    where.faculty.value != 'All'
                      ? where.faculty.value
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
                    <>
                      <PDFDownloadLink
                        style={{ marginBottom: 10 }}
                        document={
                          <Document
                            data={
                              data.progress
                                ? data.progress.map(d => ({
                                  regNumber: d.studentReg,
                                  name: d.studentName,
                                  percentage: parseInt(
                                    (parseFloat(d.completed) * 100.0) /
                                        parseFloat(d.total)
                                  ).toString()
                                }))
                                : []
                            }
                          />
                        }
                        fileName='report.pdf'
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? (
                            'Loading document...'
                          ) : (
                            <Button
                              color='primary'
                              variant='contained'
                              onClick={e => {
                                window.location.href = url
                              }}
                              style={{
                                width: '100%',
                                flexGrow: 1
                              }}
                            >
                              Print
                            </Button>
                          )
                        }
                      </PDFDownloadLink>

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
                    </>
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

export default withRouter(
  compose(
    graphql(CAMPUSES, { name: 'campusQuery', fetchOptions: 'network-only' }),
    withApollo,
    graphql(BRANCHES, { name: 'branchQuery', fetchOptions: 'network-only' })
  )(withStyles(styles)(Progress))
)
