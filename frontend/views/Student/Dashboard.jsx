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
    color: '#fff',
    paddingTop: 20
  },
  cardcontent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '75%',
    padding: 10,
    justifyContent: 'space-between'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    margin: '15px 0'
  },
  fab: {
    color: '#fff',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    maxWidth: '200px'
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
      <div>
        <div className={classes.root}>
          <Grid container spacing={3} style={{ height: 'auto' }}>
            <CourseCard course={'Course 1'} complete={15} correct={5} />
          </Grid>
          {!this.state.show && (
            <Fab
              className={classes.fab}
              variant='extended'
              color='secondary'
              aria-label='Add'
              onClick={this.close}
            >
              <Add />
              Request
            </Fab>
          )}
          <Modal
            aria-labelledby='request-course-modal'
            aria-describedby='request-course-here'
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100vw',
              alignItems: 'center',
              padding: 20,
              boxSizing: 'border-box'
            }}
            open={this.state.show}
            onClose={this.close}
          >
            <RequestCourse close={this.close} />
          </Modal>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard)
