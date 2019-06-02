import React from 'react'
import { Table } from '../../components'
import { Paper } from '@material-ui/core'
export default class Dashboard extends React.Component {
  state = {
    table: {
      columns: [{ title: 'ID', field: 'id' }, { title: 'Name', field: 'name' }],
      data: [
        { id: 'ktr', name: 'katankkulathur' },
        { id: 'vdp', name: 'vadapalani' }
      ]
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
  render () {
    return (
      <div>
        <div style={{ width: '50%', padding: '20px' }}>
          <Table
            onRowAdd={this.add}
            onRowDelete={this.delete}
            onRowUpdate={this.update}
            data={this.state.table.data}
            columns={this.state.table.columns}
            table='table'
            title='Campuses'
          />
        </div>
      </div>
    )
  }
}
