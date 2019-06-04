import React from 'react'
import { Table, List, RegisterControl } from '../../components'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'

const CAMPUSES =
gql`
  {
    campuses {
      departments {
        name
        id
      }
      admin_id
      name
    }
  }`
const BRANCHES = gql`
  {
    branches {
      name
      courses {
        name
        coordinator_id
      }
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
const UPDATE_BRANCH = gql`
mutation UpdateBranch($name: String!, $newName: String!) {
  updateBranch(name: $name, newName: $newName){
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
const ADD_BRANCH = gql`
  mutation AddBranch($name: String!) {
    addBranch(name: $name) {
      name
    }
  }
`
const REMOVE_BRANCH = gql`
  mutation RemoveBranch($name: String!) {
    removeBranch(name: $name) {
      name
    }
  }
`
class Dashboard extends React.Component {
  state = {
    campuses: {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Admin ID', field: 'admin_id' }
      ],
      data: []
    },
    branches: {
      columns: [{ title: 'Name', field: 'name' }],
      data: []
    }
  }
  add = (newData, table) => {
    return new Promise((resolve, reject) => {
      if (table == 'campuses') {
        this.props
          .addCampus({ variables: { name: newData.name } })
          .then(data => {
            this.props.campuses.refetch()
            resolve()
          })
          .catch(err => {
            reject()
          })
      }
      if (table == 'branches') {
        this.props
          .addBranch({ variables: { name: newData.name } })
          .then(data => {
            this.props.branches.refetch()
            resolve()
          })
          .catch(err => {
            reject()
          })
      }
      resolve()
      let newstate = this.state
      newstate[table].data.push(newData)
      this.setState(newstate)

      // newstate[table].data.push(newData)
      // this.setState(newstate)
    })
  }
  update = (newData, oldData, table) => {
    return new Promise((resolve, reject) => {
      if(table == 'branches') {
        this.props.updateBranch({
          variables: {
            name: oldData.name,
            newName: newData.name
          }
        }).then(data => {
          this.props.branches.refetch().then(() => {
            resolve()
          }).catch(err => {
            reject()
          })
        })
      }
      resolve()
      let newstate = this.state
      newstate[table].data[newstate[table].data.indexOf(oldData)] = newData
      this.setState(newstate)
    })
  }
  delete = (oldData, table) => {
    return new Promise((resolve, reject) => {
      if (table == 'campuses') {
        this.props
          .removeCampus({ variables: { name: oldData.name } })
          .then(data => {
            this.props.campuses
              .refetch()
              .then(data => {
                resolve()
              })
              .catch(err => {
                reject()
              })
          })
          .catch(err => {
            reject()
          })
      }
      if (table == 'branches') {
        this.props
          .removeBranch({ variables: { name: oldData.name } })
          .then(data => {
            this.props.branches
              .refetch()
              .then(data => {
                resolve()
              })
              .catch(err => {
                reject()
              })
          })
          .catch(err => {
            reject()
          })
      }
      resolve()
      let newstate = this.state
      newstate[table].data.splice(newstate[table].data.indexOf(oldData), 1)
      this.setState(newstate)
    })
  }

  componentDidMount () {}
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.campuses.loading == false) {
      nextState.campuses.data = nextProps.campuses.campuses
      
    }
    if(nextProps.branches.loading == false) {
      nextState.branches.data = nextProps.branches.branches
    }
  }
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
            <Table
              onRowAdd={this.add}
              onRowDelete={this.delete}
              onRowUpdate={this.update}
              data={this.state.campuses.data}
              columns={this.state.campuses.columns}
              table='campuses'
              title='Campuses'
              body={{editRow: {deleteText: 'Remove the campus?'}}}
              detailPanel={({ departments }) => {
                if (departments.length > 0) {
                  return (
                    <div style={{ display: 'flex', boxSizing: 'border-box' }}>
                      <List
                        title='Departments'
                        data={departments.map(d => d.name)}
                      />
                    </div>
                  )
                }
                return undefined
              }}
            />
          </div>
          <div style={{ width: '50%', padding: '20px' }}>
            <Table
              onRowAdd={this.add}
              onRowDelete={this.delete}
              onRowUpdate={this.update}
              data={this.state.branches.data}
              columns={this.state.branches.columns}
              table='branches'
              title='Branches'
              detailPanel={({ courses }) => {
                if (courses && courses.length > 0) {
                  return (
                    <div style={{ display: 'flex', boxSizing: 'border-box' }}>
                      <List title='Courses' data={courses.map(d => d.name)} />
                    </div>
                  )
                }
                return undefined
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default compose(
  graphql(REMOVE_CAMPUS, { name: 'removeCampus' }),
  graphql(ADD_CAMPUS, { name: 'addCampus' }),
  graphql(REMOVE_BRANCH, { name: 'removeBranch' }),
  graphql(ADD_BRANCH, { name: 'addBranch' }),
  graphql(UPDATE_BRANCH, { name: 'updateBranch' }),
  graphql(CAMPUSES, {name: 'campuses'}),
  graphql(BRANCHES, {name: 'branches'})
)(Dashboard)
