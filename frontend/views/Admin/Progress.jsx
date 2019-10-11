import React from 'react'
import gql from 'graphql-tag'
import { Query, compose, graphql } from 'react-apollo'
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
    flexDirection: 'column'
  },
  paper: {
    padding: 10,
    marginBottom: 20
  }
})
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
    where: {
      label: 'All',
      value: 'All'
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

    let { where, campus } = this.state
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={3}
          style={{ height: 'auto', justifyContent: 'center' }}
        >
          <Query
            query={PROGRESS}
            variables={{
              where: {
                campus: where.value != 'All' ? where.value : undefined
              }
            }}
            fetchPolicy='no-cache'
          >
            {({ data, loading, error }) => {
              console.log(data, error)
              if (loading) {
                return null
              } else {
                return (
                  <div className={classes.outer}>
                    <Paper className={classes.paper}>
                      <Dropdown
                        options={campuses}
                        onChange={this.onDropdownChange}
                        value={campus}
                        placeholder={'Select your campus'}
                        label='College Campus'
                        name='campus'
                      />
                    </Paper>
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
                  </div>
                )
              }
            }}
          </Query>
        </Grid>
      </div>
    )
  }
}

export default compose(
  graphql(CAMPUSES, { name: 'campusQuery', fetchOptions: 'network-only' })
)(withStyles(styles)(Dashboard))
