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
  variableMapperInner,
  uneditable = false,
}) => {
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
      
      inner={(refetch) => (data) => {
        console.log(data)
            return(
              <List
                name={data.name}
                title='Departments'
                data={data.departments.map((d) => d.name)}
                refetch={refetch}
                editMutation={UPDATE_INNER}
                deleteMutation={REMOVE_INNER}
                addMutation={ADD_INNER}
                variableMapper={variableMapperInner}
              ></List>
            )}
       
      }
    ></Table>
  );
};
