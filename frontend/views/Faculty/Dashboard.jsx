import React from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { CourseCard, RequestCourse } from '../../components'
import { withStyles } from '@material-ui/styles'
import { Fab, Modal } from '@material-ui/core'
import {
  Card,
  Button,
  Grid,
  Typography,
  LinearProgress,
  CardMedia,
  CardActionArea,
  CardHeader,
  CardContent
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { CircularProgressbar } from 'react-circular-progressbar'
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
          WIP Table
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard)
