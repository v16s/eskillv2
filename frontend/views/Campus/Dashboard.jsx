import React from 'react'
import { Table, RegisterControl } from '../../components'
import gql from 'graphql-tag'
import { Switch } from '@material-ui/core'
import { compose, graphql } from 'react-apollo'

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
    updateOwnCampus(name: $name, newName: $newName) {
      name
    }
  }
`

const ADD_COURSE = gql`
  mutation AddCourse($name: String!, $branch: String!) {
    campusAddCourse(name: $name, branch: $branch) {
      name
    }
  }
`
const TOGGLE = gql`
  mutation ToggleAutomate($name: String!) {
    toggleCourseAutomation(name: $name) {
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
  ) {
    campusUpdateCourse(
      name: $name
      newName: $newName
      branch: $branch
      newBranch: $newBranch
    ) {
      name
    }
  }
`
const REMOVE_COURSE = gql`
  mutation RemoveCourse($name: String!) {
    campusRemoveCourse(name: $name) {
      name
    }
  }
`

const CampusTable = compose(
  graphql(CAMPUSES),
  graphql(UPDATE_CAMPUS, { name: 'updateOutside' }),
  graphql(ADD_DEPARTMENT, { name: 'addInside' }),
  graphql(REMOVE_DEPARTMENT, { name: 'removeInside' }),
  graphql(UPDATE_DEPARTMENT, { name: 'updateInside' })
)(Table)
const CourseTable = compose(
  graphql(COURSES),
  graphql(ADD_COURSE, { name: 'addOutside' }),
  graphql(REMOVE_COURSE, { name: 'removeOutside' }),
  graphql(UPDATE_COURSE, { name: 'updateOutside' })
)(Table)
class Dashboard extends React.Component {
  render () {
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
              inside='departments'
              title='Campus'
              name='campuses'
              insideTitle='Departments'
              uneditable={false}
            />
          </div>
          <div style={{ width: '50%', padding: '20px' }}>
            <CourseTable
              columns={[
                { title: 'Name', field: 'name' },
                {
                  title: 'Coordinator ID',
                  field: 'coordinator_id',
                  editable: 'never'
                },
                { title: 'Branch', field: 'branch' },
                {
                  title: 'Automated',
                  render: rowdata => {
                    if (rowdata != undefined) {
                      const { automated, refetch, name } = rowdata
                      return (
                        <Switch
                          checked={automated}
                          onChange={() => {
                            this.props
                              .mutate({ variables: { name } })
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
          </div>
        </div>
      </div>
    )
  }
}

export default graphql(TOGGLE)(Dashboard)
