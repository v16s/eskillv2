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
import {List} from './index'

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
  style
}) {
  console.log(data)
  return (
    <MaterialTable
      title={title}
      columns={columns}
      icons={tableIcons}
      data={data}
      style={style}
      editable={{
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
            onRowDelete(oldData, table).then(() => {
              resolve()
            })
          })
      }}
      localization={
        body && {
          body
        }
      }
      detailPanel={detailPanel}
    />
  )
}
export default class DashboardTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: props.columns,
      data: []
  }
  }
  add = (newData, table) => {
    return new Promise((resolve, reject) => {
        this.props
          .addOutside({ variables: { name: newData.name, branch: this.props.isCourse && newData.branch } })
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
        this.props
          .updateOutside({
            variables: {
              name: oldData.name,
              newName: newData.name,
              branch: this.props.isCourse && oldData.branch
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
            this.props.data
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
      console.log(nextProps.data)
    }
    return true
  }
  addInside = (name, newName) => {
    return new Promise(resolve => {
      console.log(name, newName)
    this.props.addInside({variables: {
      name,
      id: newName,
      tname: newName
    }}).then(data => {

      this.props.data.refetch().then(() => {
        resolve()
      })
    })
    })
  }
render() {
  return <Table
  onRowAdd={this.add}
  onRowDelete={this.delete}
  onRowUpdate={this.update}
  data={this.state.data}
  columns={this.state.columns}
  title={this.props.title}
  body={{ editRow: { deleteText: `Remove the ${this.props.title}?` } }}
  detailPanel={this.props.inside && (
    k => {
    return (
      <div style={{ display: 'flex', boxSizing: 'border-box' }}>
        <List
          current={k.name}
          title={this.props.insideTitle}
          data={k[this.props.inside].map(d => d.name)}
          handleAdd={this.addInside}
          key={k.name}
        />
      </div>
    )
  }
  )}
/>
}
}