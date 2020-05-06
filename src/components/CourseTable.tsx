import React from 'react';
import { Table } from './Table';
import Switch from '@material-ui/core/Switch';
import { useMutation } from '@apollo/react-hooks';

export const CourseTable = ({
  data,
  loading,
  refetch,
  TOGGLE,
  ADD,
  REMOVE,
  UPDATE,
  variableMapper,
}) => {
  const [toggle] = useMutation(TOGGLE);
  return (
    <Table
      columns={[
        { title: 'Name', field: 'name' },
        {
          title: 'Coordinator ID',
          field: 'coordinator_id',
          editable: 'never',
        },
        { title: 'Branch', field: 'branch' },
        { title: 'Campus', field: 'campus', editable: 'never' },
        {
          title: 'Automated',
          render: (rowdata) => {
            if (rowdata != undefined) {
              const { automated, name, campus, refetch } = rowdata;
              return (
                <Switch
                  checked={automated}
                  onChange={() => {
                    toggle({ variables: { name, campus } });
                    refetch();
                  }}
                  value='faculty'
                  color='primary'
                />
              );
            }
            return '';
          },
          editable: 'never',
        },
      ]}
      data={data}
      refetch={refetch}
      loading={loading}
      editMutation={UPDATE}
      deleteMutation={REMOVE}
      addMutation={ADD}
      variableMapper={variableMapper}
      title='Courses'
    ></Table>
  );
};
