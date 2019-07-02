import React from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withStyles } from '@material-ui/styles'
import { Grid, LinearProgress, IconButton } from '@material-ui/core'
import { DeleteForever } from '@material-ui/icons'
import { StudentProgressTable } from '../../components'
const styles = theme => ({
  root: {
    display: 'flex',
    color: theme.palette.text.primary,
    padding: '30px'
  }
})
const REQUESTS = gql`
  query Progress {
    progress {
      id
      studentReg
      studentName
      completed
      total
    }
  }
`

const REJECT = gql`
  mutation($id: String!) {
    rejectCourseInstance(id: $id) {
      id
    }
  }
`
class Dashboard extends React.Component {
  state = {
    show: false
  }
  close = () => {
    this.setState({ show: !this.state.show })
  }
  delete = id => {
    this.props.reject({ variables: { id } })
    this.props.data.refetch()
  }
  render () {
    const { classes, data } = this.props
    console.log(data.progress)
    return (
      <div className={classes.root}>
        <Grid container spacing={3} style={{ height: 'auto' }}>
          <StudentProgressTable
            columns={[
              { title: 'Register Number', field: 'studentReg' },
              { title: 'Name', field: 'studentName' },
              {
                title: 'Progress',
                render: ({ completed, total }) => (
                  <LinearProgress
                    variant='determinate'
                    value={parseInt(completed / total)}
                  />
                )
              },
              {
                title: '%',
                render: ({ completed, total }) =>
                  `${parseInt(completed / total)}`
              },
              {
                title: '',
                render: rowData => (
                  <IconButton
                    color='secondary'
                    onClick={e => this.delete(rowData.id)}
                  >
                    <DeleteForever />
                  </IconButton>
                )
              }
            ]}
            data={data.progress || []}
          />
        </Grid>
      </div>
    )
  }
}

export default compose(
  graphql(REQUESTS),
  graphql(REJECT, { name: 'reject' })
)(withStyles(styles)(Dashboard))
