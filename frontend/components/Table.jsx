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
export default function Table ({
  title,
  columns,
  data,
  table,
  detailPanel,
  onRowAdd,
  onRowDelete,
  onRowUpdate
}) {
  return (
    <MaterialTable
      title={title}
      columns={columns}
      icons={tableIcons}
      data={data}
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
      detailPanel={detailPanel}
    />
  )
}
