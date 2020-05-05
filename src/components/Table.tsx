import React from 'react';

import { VariableMapper } from '../typings/misc';
import MaterialTable from './MaterialTable';
import { useMutation } from '@apollo/react-hooks';

function Table({
  title,
  columns,
  data,
  detailPanel,
  onRowAdd,
  onRowDelete,
  onRowUpdate,
  body,
  style,
  editable,
  onRowClick,
}) {
  return (
    <MaterialTable
      title={title}
      columns={columns}
      data={data}
      style={style}
      editable={
        editable && {
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              onRowAdd(newData).then(() => {
                resolve();
              });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              onRowUpdate(newData, oldData).then(() => {
                resolve();
              });
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              onRowDelete(oldData)
                .then(() => {
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                });
            }),
        }
      }
      localization={
        body && {
          body,
        }
      }
      onRowClick={onRowClick}
      detailPanel={detailPanel}
    />
  );
}

const TableBase: React.FC<{
  columns: any;
  title: string;
  onRowClick?: any;
  style?: React.CSSProperties;
  addMutation: any;
  editMutation: any;
  deleteMutation: any;
  variableMapper: VariableMapper;
  uneditable?: boolean;
  filter?: any;
  inner?: any;
  data: any[];
  refetch?: any;
  loading?: boolean;
}> = ({
  columns,
  title,
  inner,
  onRowClick,
  style,
  variableMapper,
  addMutation,
  editMutation,
  deleteMutation,
  uneditable,
  filter,
  data,
  refetch,
  loading,
}) => {
  // Hooks
  const [addCaller, { data: addData, error: addError }] = useMutation(
    addMutation
  );
  const [editCaller, { data: editData, error: editError }] = useMutation(
    editMutation
  );
  const [deleteCaller, { data: deleteData, error: deleteError }] = useMutation(
    deleteMutation
  );
  React.useEffect(() => {
    refetch();
  }, [addData, addError, editData, editError, deleteData, deleteError]);

  // Functions
  function add(data: any): void {
    if (uneditable) return;
    addCaller(variableMapper.add(data));
  }
  function edit(oldData: any, newData: any): void {
    if (uneditable) return;
    editCaller(variableMapper.edit(oldData, newData));
  }
  function del(data: any): void {
    if (uneditable) return;
    deleteCaller(variableMapper.delete(data));
  }
  if (loading) return <span>Loading</span>;
  return (
    <Table
      onRowAdd={add}
      onRowDelete={del}
      onRowUpdate={edit}
      data={data.map(filter ? filter : (d) => ({ ...d, refetch }))}
      columns={columns}
      title={title}
      onRowClick={onRowClick}
      style={style}
      editable={uneditable === false}
      body={{ editRow: { deleteText: `Remove the ${title}?` } }}
      detailPanel={inner && inner(refetch)}
    />
  );
};

export { TableBase as Table };
