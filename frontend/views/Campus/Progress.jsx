import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
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
    return (
      <div className={classes.root}>
        <Grid container spacing={3} style={{ height: 'auto' }}>
          <Query query={progress} variables />
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard)
