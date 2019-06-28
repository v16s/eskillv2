import React from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { CourseCard, RequestCourse, ApprovalCard } from '../../components'
import { withStyles } from '@material-ui/styles'
import { Fab, Modal } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { Add } from '@material-ui/icons'
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

const COURSES = gql`
  query Instances {
    instances {
      total
      course
      completed
      id
      status
    }
  }
`

class Dashboard extends React.Component {
  state = {
    show: false
  }
  close = refresh => {
    if (refresh) {
      this.props.data.refetch()
    }
    this.setState({ show: !this.state.show })
  }
  render () {
    const { classes, data } = this.props
    let instances = data.instances || []
    console.log(instances)
    return (
      <div>
        <div className={classes.root}>
          <Grid container spacing={3} style={{ height: 'auto' }}>
            {instances.map(({ course, completed, total, id, status }) => {
              if (status) {
                return (
                  <CourseCard
                    key={id}
                    course={course}
                    completed={completed}
                    complete={parseInt((completed / total) * 100)}
                    id={id}
                  />
                )
              } else return <ApprovalCard key={id} course={course} id={id} />
            })}
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

export default compose(graphql(COURSES))(withStyles(styles)(Dashboard))
