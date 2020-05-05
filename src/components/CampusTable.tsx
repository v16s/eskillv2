import React from 'react';

import { Table } from './Table';
import { List } from './List';

export const CampusTable = ({
  data,
  refetch,
  loading,
  UPDATE,
  ADD,
  REMOVE,
  ADD_INNER,
  UPDATE_INNER,
  REMOVE_INNER,
  variableMapper,
  uneditable = false,
}) => {
  const [selected, setSelected] = React.useState('');
  console.log(selected);
  return (
    <Table
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'Admin ID', field: 'admin_id', editable: 'never' },
      ]}
      editMutation={UPDATE}
      deleteMutation={REMOVE}
      addMutation={ADD}
      variableMapper={variableMapper}
      title='Campuses'
      data={data}
      uneditable={uneditable}
      refetch={refetch}
      loading={loading}
      onRowClick={(_e, rowData) => {
        setSelected(rowData.name);
      }}
      inner={
        selected !== ''
          ? (refetch) => (data) => (
              <List
                title='Departments'
                data={data[selected].map((d) => d.name)}
                refetch={refetch}
                editMutation={UPDATE_INNER}
                deleteMutation={REMOVE_INNER}
                addMutation={ADD_INNER}
                variableMapper={variableMapper}
              ></List>
            )
          : null
      }
    ></Table>
  );
};
