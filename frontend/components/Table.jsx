import React from 'react'
import MaterialTable from 'material-table'
import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from '@material-ui/icons'
import { List } from './index'

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
}
function Table ({
  title,
  columns,
  data,
  table,
  detailPanel,
  onRowAdd,
  onRowDelete,
  onRowUpdate,
  body,
  style,
  editable,
  onRowClick
}) {
  return (
    <MaterialTable
      title={title}
      columns={columns}
      icons={tableIcons}
      data={data}
      style={style}
      editable={
        editable && {
          onRowAdd: newData =>
            new Promise(resolve => {
              onRowAdd(newData, table).then(() => {
                resolve()
              })
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              onRowUpdate(newData, oldData, table).then(() => {
                resolve()
              })
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              onRowDelete(oldData, table)
                .then(() => {
                  resolve()
                })
                .catch(err => {
                  console.log(err)
                })
            })
        }
      }
      localization={
        body && {
          body
        }
      }
      onRowClick={onRowClick}
      detailPanel={detailPanel}
    />
  )
}
export default class DashboardTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: props.columns,
      data: []
    }
  }
  add = (newData, table) => {
    return new Promise((resolve, reject) => {
      this.props
        .addOutside({
          variables: {
            name: newData.name,
            branch: this.props.isCourse && newData.branch
          }
        })
        .then(data => {
          this.props.data.refetch()
          resolve()
        })
        .catch(err => {
          reject()
        })
      // newstate[table].data.push(newData)
      // this.setState(newstate)
    })
  }
  update = (newData, oldData, table) => {
    return new Promise((resolve, reject) => {
      console.log(this.props.isCourse, oldData.branch, newData.branch)
      this.props
        .updateOutside({
          variables: {
            name: oldData.name,
            newName: newData.name,
            branch: this.props.isCourse && oldData.branch,
            newBranch: this.props.isCourse && newData.branch
          }
        })
        .then(data => {
          this.props.data
            .refetch()
            .then(() => {
              resolve()
            })
            .catch(err => {
              reject()
            })
        })
    })
  }
  delete = (oldData, table) => {
    return new Promise((resolve, reject) => {
      this.props
        .removeOutside({ variables: { name: oldData.name } })
        .then(data => {
          console.log(data)
          this.props.data
            .refetch()
            .then(data => {
              resolve()
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  componentDidMount () {
    let nextState = this.state
    if (this.props.data.loading == false) {
      nextState.data = this.props.data[this.props.name]
    }
    this.setState(nextState)
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.data.loading == false) {
      nextState.data = nextProps.data[nextProps.name]
    }
    return true
  }
  addInside = (name, newName) => {
    return new Promise(resolve => {
      this.props
        .addInside({
          variables: {
            name,
            id: newName,
            tname: newName
          }
        })
        .then(data => {
          this.props.data.refetch().then(() => {
            resolve()
          })
        })
    })
  }
  removeInside = (name, newName) => {
    return new Promise(resolve => {
      this.props
        .removeInside({
          variables: {
            name,
            id: newName
          }
        })
        .then(data => {
          this.props.data.refetch().then(() => {
            resolve()
          })
        })
    })
  }
  updateInside = (name, oldValue, newValue) => {
    return new Promise(resolve => {
      this.props
        .updateInside({
          variables: {
            name,
            prev: oldValue,
            next: newValue
          }
        })
        .then(data => {
          this.props.data.refetch().then(() => {
            resolve()
          })
        })
    })
  }
  render () {
    return (
      <Table
        onRowAdd={this.add}
        onRowDelete={this.delete}
        onRowUpdate={this.update}
        data={
          this.props.uneditable === true ? this.props.data : this.state.data
        }
        columns={this.state.columns}
        title={this.props.title}
        onRowClick={this.props.onRowClick}
        style={this.props.style}
        editable={this.props.uneditable === false}
        body={{ editRow: { deleteText: `Remove the ${this.props.title}?` } }}
        detailPanel={
          this.props.inside &&
          (k => {
            return (
              <div style={{ display: 'flex', boxSizing: 'border-box' }}>
                <List
                  current={k.name}
                  title={this.props.insideTitle}
                  data={k[this.props.inside].map(d => d.name)}
                  handleAdd={this.addInside}
                  handleRemove={this.removeInside}
                  key={k.name}
                  handleUpdate={this.updateInside}
                />
              </div>
            )
          })
        }
      />
    )
  }
}
