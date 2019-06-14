import React from 'react'
import { Table, RegisterControl } from '../../components'
import gql from 'graphql-tag'
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
const REMOVE_DEPARTMENT = gql`
  mutation RemoveDepartment($name: String!, $id: String!) {
    removeDepartment(name: $name, id: $id) {
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
      name
    }
  }
`
const UPDATE_COURSE = gql`
  mutation UpdateCourse($name: String!, $newName: String!, $branch: String!) {
    updateCourse(name: $name, newName: $newName, branch: $branch) {
      name
    }
  }
`
const REMOVE_COURSE = gql`
  mutation RemoveCourse($name: String!) {
    removeCourse(name: $name) {
      name
    }
  }
`

const CampusTable = compose(
  graphql(CAMPUSES),
  graphql(ADD_CAMPUS, { name: 'addOutside' }),
  graphql(REMOVE_CAMPUS, { name: 'removeOutside' }),
  graphql(UPDATE_CAMPUS, { name: 'updateOutside' }),
  graphql(ADD_DEPARTMENT, { name: 'addInside' })
)(Table)
const CourseTable = compose(graphql(COURSES),graphql(ADD_COURSE, { name: 'addOutside' }),
graphql(REMOVE_COURSE, { name: 'removeOutside' }),
graphql(UPDATE_COURSE, { name: 'updateOutside' }),)(Table)
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
                { title: 'Admin ID', field: 'admin_id' }
              ]}
              inside='departments'
              title='Campus'
              name='campuses'
              insideTitle='Departments'
            />
          </div>
          <div style={{ width: '50%', padding: '20px' }}>
            <CourseTable columns={[
                { title: 'Name', field: 'name' },
                { title: 'Coordinator ID', field: 'coordinator_id' },
                {title: 'Branch', field: "branch"}
              ]} title='Course'
              name='courses' isCourse></CourseTable>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard
