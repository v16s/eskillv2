import React from 'react'
import { Table, List } from '../../components'
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
class Dashboard extends React.Component {
  state = {
    campuses: {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Admin ID', field: 'admin_id' }
      ],
      data: []
    }
  }
  add = (newData, table) => {
    return new Promise(resolve => {
      resolve()
      let newstate = this.state
      newstate[table].data.push(newData)
      this.setState(newstate)
    })
  }
  update = (newData, oldData, table) => {
    return new Promise(resolve => {
      resolve()
      let newstate = this.state
      newstate[table].data[newstate[table].data.indexOf(oldData)] = newData
      this.setState(newstate)
    })
  }
  delete = (oldData, table) => {
    return new Promise(resolve => {
      resolve()
      let newstate = this.state
      newstate[table].data.splice(newstate[table].data.indexOf(oldData), 1)
      this.setState(newstate)
    })
  }
  componentDidMount () {}
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.data.loading == false) {
      nextState.campuses.data = nextProps.data.campuses
    }
  }
  render () {
    console.log(this.props.data)
    return (
      <div>
        <div style={{ width: '50%', padding: '20px' }}>
          <Table
            onRowAdd={this.add}
            onRowDelete={this.delete}
            onRowUpdate={this.update}
            data={this.state.campuses.data}
            columns={this.state.campuses.columns}
            table='campuses'
            title='Campuses'
            detailPanel={({ departments }) => {
              if (departments.length > 0) {
                return (
                  <div style={{ padding: '20px' }}>
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
      </div>
    )
  }
}
export default graphql(CAMPUSES)(Dashboard)
