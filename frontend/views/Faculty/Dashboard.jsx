import React from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withStyles } from '@material-ui/styles'
import { Grid, LinearProgress, IconButton, Button } from '@material-ui/core'
import { DeleteForever } from '@material-ui/icons'
import { AcceptRejectTable } from '../../components'
const styles = theme => ({
  root: {
    display: 'flex',
    color: theme.palette.text.primary,
    padding: '30px'
  }
})
const REQUESTS = gql`
  query AcceptReject {
    acceptReject {
      id
      studentReg
      studentName
    }
  }
`
const ACCEPT = gql`
  mutation($id: String!) {
    acceptCourseInstance(id: $id) {
      id
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
  action = (type, id) => {
    if (type) {
      this.props.accept({ variables: { id } })
    } else {
      this.props.reject({ variables: { id } })
    }
    this.props.data.refetch()
  }
  render () {
    const { classes, data } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3} style={{ height: 'auto' }}>
          <AcceptRejectTable
            columns={[
              { title: 'Register Number', field: 'studentReg' },
              { title: 'Name', field: 'studentName' },
              {
                title: 'Action',
                render: rowData => (
                  <div>
                    <Button
                      size='small'
                      variant='contained'
                      color='secondary'
                      style={{
                        marginRight: 5
                      }}
                      onClick={e => this.action(false, rowData.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      size='small'
                      variant='contained'
                      color='primary'
                      onClick={e => this.action(true, rowData.id)}
                    >
                      Accept
                    </Button>
                  </div>
                )
              }
            ]}
            data={data.acceptReject || []}
          />
        </Grid>
      </div>
    )
  }
}

export default compose(
  graphql(REQUESTS),
  graphql(ACCEPT, { name: 'accept' }),
  graphql(REJECT, { name: 'reject' })
)(withStyles(styles)(Dashboard))
