import React from 'react'
import gql from 'graphql-tag'
import { Query } from '@apollo/react-components'
import { CourseCard, RequestCourse, ApprovalCard } from '../../components'
import { withStyles } from '@material-ui/styles'
import { Fab, Modal, TextField, Typography, Grid } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
const styles = theme => ({
  root: {
    display: 'flex',
    color: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20
  },
  search: {
    width: '98%',
    maxWidth: 400,
    margin: 5
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
  },
  none: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.primary,
    flexGrow: 1,
    height: 'calc(100vh - 64px)'
  }
})

const COURSES = gql`
  query Instances {
    instances {
      total
      course
      completed
      id
      correct
      status
    }
  }
`

class Dashboard extends React.Component {
  state = {
    show: false,
    search: ''
  }
  onSearchChange = e => {
    this.setState({ search: e.target.value })
  }
  close = (refresh, refetch) => {
    if (refresh) {
      refetch()
    }
    this.setState({ show: !this.state.show })
  }
  render () {
    const { classes } = this.props

    return (
      <div>
        <div className={classes.root}>
          <Query query={COURSES} fetchPolicy='no-cache'>
            {({ data, loading, refetch }) => {
              let instances = !loading ? data.instances || [] : []
              return (
                <>
                  {instances.length > 0 && (
                    <div className={classes.search}>
                      <TextField
                        value={this.state.search}
                        onChange={this.onSearchChange}
                        placeholder='Search'
                        style={{ width: '100%' }}
                        variant='outlined'
                      />
                    </div>
                  )}
                  <Grid container spacing={3} style={{ height: 'auto' }}>
                    {instances.length > 0 ? (
                      instances.map(
                        ({ course, completed, total, id, status, correct }) => {
                          if (
                            new RegExp(this.state.search, 'gi').test(course)
                          ) {
                            if (status) {
                              return (
                                <CourseCard
                                  key={id}
                                  course={course}
                                  completed={completed}
                                  complete={parseInt((completed / total) * 100)}
                                  correct={correct}
                                  id={id}
                                />
                              )
                            } else {
                              return (
                                <ApprovalCard
                                  key={id}
                                  course={course}
                                  id={id}
                                />
                              )
                            }
                          } else {
                            return null
                          }
                        }
                      )
                    ) : loading ? (
                      <div className={classes.none} />
                    ) : (
                      <div className={classes.none}>
                        <Typography variant='h3'>No Courses</Typography>{' '}
                      </div>
                    )}
                  </Grid>
                  {!this.state.show && (
                    <Fab
                      className={classes.fab}
                      variant='extended'
                      color='secondary'
                      aria-label='Add'
                      onClick={e => this.close(e, refetch)}
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
                    onClose={e => this.close(e, refetch)}
                  >
                    <RequestCourse close={this.close} refetch={refetch} />
                  </Modal>
                </>
              )
            }}
          </Query>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(withRouter(Dashboard))
