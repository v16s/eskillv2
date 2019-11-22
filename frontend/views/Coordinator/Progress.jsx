import React from 'react'
import gql from 'graphql-tag'
import { Query, compose, graphql, withApollo } from 'react-apollo'
import { withStyles } from '@material-ui/styles'
import { Grid, LinearProgress, Paper, Button } from '@material-ui/core'
import {
  StudentProgressTable,
  Dropdown,
  Document,
  DocumentAll
} from '../../components'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { withRouter } from 'react-router-dom'
import { groupBy } from 'lodash'

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
  query Courses($name: String, $branch: String) {
    courses(where: { name: $name, branch: $branch }) {
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
      course
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

    client
      .query({ query: FACULTIES, variables: { where } })
      .then(({ data }) => {
        newstate.faculties = data.faculties
        this.setState(newstate)
      })
  }

  render () {
    const { classes } = this.props

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
                      {where.course.value != 'All' ? (
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
                              course={where.course.value}
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
                      ) : (
                        <PDFDownloadLink
                          style={{ marginBottom: 10 }}
                          document={
                            <DocumentAll
                              data={
                                data.progress
                                  ? groupBy(
                                    data.progress.map(d => ({
                                      regNumber: d.studentReg,
                                      name: d.studentName,
                                      percentage: parseInt(
                                        (parseFloat(d.completed) * 100.0) /
                                            parseFloat(d.total)
                                      ).toString(),
                                      course: d.course
                                    })),
                                    d => d.course
                                  )
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
                                Print All
                              </Button>
                            )
                          }
                        </PDFDownloadLink>
                      )}

                      <StudentProgressTable
                        columns={[
                          { title: 'Register Number', field: 'studentReg' },
                          { title: 'Name', field: 'studentName' },
                          {
                            title: 'Progress',
                            render: args => {
                              const { completed, total } = args
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
                            title: 'Course',
                            field: 'course'
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
    withApollo,
    graphql(BRANCHES, { name: 'branchQuery', fetchOptions: 'network-only' })
  )(withStyles(styles)(Progress))
)
