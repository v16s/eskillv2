import React from 'react'
import { Table, RegisterControl, Dropdown } from '../../components'
import gql from 'graphql-tag'
import { Switch, Paper, Button, Modal } from '@material-ui/core'
import { graphql } from '@apollo/react-hoc'
import { compose } from 'recompose'

class Dashboard extends React.Component {
  state = {
    campus: {
      label: 'All',
      value: 'All'
    },
    open: false,
    courses: this.props.courseQuery
  }
  onDropdownChange = (value, { name }) => {
    let newstate = this.state
    newstate[name] = value
    this.setState(newstate)
  }
  shouldComponentUpdate (nextProps, nextState) {
    nextState.courses = nextProps.courseQuery
    return true
  }
  handleClick = e => {
    this.setState({ open: true })
  }
  handleClose = () => {
    this.setState({ open: false })
  }
  render () {
    const campuses = this.props.campusQuery.campuses
      ? [
          ...this.props.campusQuery.campuses.map(k => ({
            label: k.name,
            value: k.name
          })),
          { label: 'All', value: 'All' }
        ]
      : []

    let { campus } = this.state
    return (
      <div>
        <RegisterControl />
        <div
          style={{
            display: 'flex'
          }}
        >
          <div style={{ width: '50%', padding: '20px' }}>
            <CampusTable
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Admin ID', field: 'admin_id', editable: 'never' }
              ]}
              data={this.props.campusQuery}
              inside='departments'
              title='Campus'
              name='campuses'
              insideTitle='Departments'
              uneditable={false}
            />
          </div>
          <div style={{ width: '50%', padding: '20px' }}>
            <Button
              style={{ margin: '0 auto', marginBottom: 15, width: '100%' }}
              color='primary'
              variant='contained'
            >
              Set Default Courses
            </Button>
            <Paper
              style={{
                marginBottom: 15,
                padding: 15,
                zIndex: 5
              }}
            >
              <div>
                <Dropdown
                  options={campuses}
                  onChange={this.onDropdownChange}
                  value={campus}
                  placeholder={'Select your campus'}
                  label='College Campus'
                  name='campus'
                />
              </div>
            </Paper>

            <CourseTable
              data={{
                ...this.props.courseQuery,
                courses: this.props.courseQuery.courses
                  ? this.props.courseQuery.courses.filter(
                      d =>
                        this.state.campus.label == 'All' ||
                        d.campus == this.state.campus.label
                    )
                  : []
              }}
              campus={this.state.campus.label}
              columns={[
                { title: 'Name', field: 'name' },
                {
                  title: 'Coordinator ID',
                  field: 'coordinator_id',
                  editable: 'never'
                },
                { title: 'Branch', field: 'branch' },
                { title: 'Campus', field: 'campus', editable: 'never' },
                {
                  title: 'Automated',
                  render: rowdata => {
                    if (rowdata != undefined) {
                      const { automated, refetch, name, campus } = rowdata
                      return (
                        <Switch
                          checked={automated}
                          onChange={() => {
                            this.props
                              .mutate({ variables: { name, campus } })
                              .then(data => {
                                refetch()
                              })
                          }}
                          value='faculty'
                          color='primary'
                        />
                      )
                    }
                    return ''
                  },
                  editable: 'never'
                }
              ]}
              title='Course'
              name='courses'
              isCourse
              uneditable={false}
            />
            <Button
              style={{ margin: '0 auto', marginTop: 15, width: '100%' }}
              color='secondary'
              variant='contained'
              onClick={this.handleClick}
            >
              Delete All Course Instances
            </Button>
            <Modal
              aria-labelledby='simple-modal-title'
              aria-describedby='simple-modal-description'
              open={this.state.open}
              onClose={this.handleClose}
              style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Paper
                style={{
                  width: 400,
                  padding: 20
                }}
              >
                <h2 id='simple-modal-title' style={{ color: '#ff0000' }}>
                  DANGER
                </h2>
                <p id='simple-modal-description'>Please Confirm your action</p>
                <Button
                  style={{
                    margin: '0 auto',
                    backgroundColor: '#ff0000',
                    color: '#fff'
                  }}
                  variant='contained'
                  onClick={e => {
                    this.props.DANGEROUS__delete()
                    this.handleClose()
                  }}
                >
                  Confirm
                </Button>
              </Paper>
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}

const CAMPUSES = gql`
  {
    campuses {
      departments {
        name
        id
      }
      admin_id
      name
    }
  }
`
const COURSES = gql`
  {
    courses {
      branch
      name
      coordinator_id
      automated
      campus
    }
  }
`
const ADD_CAMPUS = gql`
  mutation AddCampus($name: String!) {
    addCampus(name: $name) {
      name
    }
  }
`
const ADD_DEPARTMENT = gql`
  mutation AddDepartment($name: String!, $id: String!, $tname: String!) {
    addDepartment(name: $name, tag: { id: $id, name: $tname }) {
      name
    }
  }
`
const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($name: String!, $prev: String!, $next: String!) {
    updateDepartment(
      name: $name
      update: {
        where: { id: $prev, name: $prev }
        data: { id: $next, name: $next }
      }
    ) {
      name
    }
  }
`
const REMOVE_DEPARTMENT = gql`
  mutation RemoveDepartment($name: String!, $deptname: String!) {
    removeDepartment(name: $name, id: $deptname) {
      name
    }
  }
`
const UPDATE_CAMPUS = gql`
  mutation UpdateCampus($name: String!, $newName: String!) {
    updateCampus(name: $name, newName: $newName) {
      name
    }
  }
`
const REMOVE_CAMPUS = gql`
  mutation RemoveCampus($name: String!) {
    removeCampus(name: $name) {
      name
    }
  }
`
const ADD_COURSE = gql`
  mutation AddCourse($name: String!, $branch: String!) {
    addCourse(name: $name, branch: $branch) {
      count
    }
  }
`

const DANGEROUS__REMOVE_ALL_INSTANCES = gql`
  mutation {
    adminDeleteAllCourseInstances__DANGEROUS
  }
`

const TOGGLE = gql`
  mutation ToggleAutomate($name: String!, $campus: String!) {
    toggleCourseAutomation(name: $name, campus: $campus) {
      name
    }
  }
`
const UPDATE_COURSE = gql`
  mutation UpdateCourse(
    $name: String!
    $newName: String!
    $branch: String!
    $newBranch: String!
    $campus: String!
  ) {
    updateCourse(
      name: $name
      newName: $newName
      branch: $branch
      newBranch: $newBranch
      campus: $campus
    ) {
      name
    }
  }
`
const REMOVE_COURSE = gql`
  mutation RemoveCourse($name: String!, $campus: String!) {
    removeCourse(name: $name, campus: $campus) {
      name
    }
  }
`

const CampusTable = compose(
  graphql(ADD_CAMPUS, { name: 'addOutside' }),
  graphql(REMOVE_CAMPUS, { name: 'removeOutside' }),
  graphql(UPDATE_CAMPUS, { name: 'updateOutside' }),
  graphql(ADD_DEPARTMENT, { name: 'addInside' }),
  graphql(REMOVE_DEPARTMENT, { name: 'removeInside' }),
  graphql(UPDATE_DEPARTMENT, { name: 'updateInside' })
)(Table)
const CourseTable = compose(
  graphql(ADD_COURSE, { name: 'addOutside' }),
  graphql(REMOVE_COURSE, { name: 'removeOutside' }),
  graphql(UPDATE_COURSE, { name: 'updateOutside' })
)(Table)

export default compose(
  graphql(TOGGLE),
  graphql(CAMPUSES, { name: 'campusQuery', fetchPolicy: 'network-only' }),
  graphql(COURSES, { name: 'courseQuery', fetchPolicy: 'network-only' }),
  graphql(DANGEROUS__REMOVE_ALL_INSTANCES, { name: 'DANGEROUS__delete' })
)(Dashboard)
