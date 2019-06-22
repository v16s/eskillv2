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

class Dashboard extends React.Component {
  state = {
    show: false
  }
  close = () => {
    this.setState({ show: !this.state.show })
  }
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={3} style={{ height: 'auto' }}>
          <StudentProgressTable
            columns={[
              { title: 'Name', field: 'name' },
              {
                title: 'Progress',
                render: rowData => (
                  <LinearProgress variant='determinate' value={20} />
                )
              },
              {
                title: '%',
                render: rowData => '20%'
              },
              {
                title: '',
                render: rowData => (
                  <IconButton color='secondary'>
                    <DeleteForever />
                  </IconButton>
                )
              }
            ]}
            data={[
              {
                name: 'student2'
              },
              {
                name: 'student1'
              }
            ]}
          />
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard)
