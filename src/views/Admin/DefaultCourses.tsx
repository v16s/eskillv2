import React from 'react';
import { Table } from '../../components';
import gql from 'graphql-tag';
import { Switch } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { graphql } from '@apollo/react-hoc';
import { compose } from 'recompose';

const ADD_DEFAULT_COURSE = gql`
  mutation AddDefaultCourse($name: String!, $branch: String!) {
    addDefaultCourse(name: $name, branch: $branch) {
      name
      branch
      automated
    }
  }
`;

const UPDATE_DEFAULT_COURSE = gql`
  mutation UpdateDefaultCourse(
    $name: String!
    $newName: String!
    $branch: String!
    $newBranch: String!
  ) {
    updateDefaultCourse(
      name: $name
      newName: $newName
      branch: $branch
      newBranch: $newBranch
    ) {
      name
      branch
      automated
    }
  }
`;
const REMOVE_DEFAULT_COURSE = gql`
  mutation RemoveDefaultCourse($name: String!) {
    removeDefaultCourse(name: $name) {
      name
      branch
      automated
    }
  }
`;
const DEFAULT_COURSES = gql`
  {
    global {
      defaultCourses {
        name
        branch
        automated
      }
    }
  }
`;

const TOGGLE_DEFAULT = gql`
  mutation ToggleDefaultAutomate($name: String!, $action: Boolean!) {
    toggleDefaultCourse(name: $name, action: $action) {
      name
      branch
      automated
    }
  }
`;

const DefaultCourseTable = compose(
  graphql(ADD_DEFAULT_COURSE, { name: 'addOutside' }),
  graphql(REMOVE_DEFAULT_COURSE, { name: 'removeOutside' }),
  graphql(UPDATE_DEFAULT_COURSE, { name: 'updateOutside' })
)(Table);

export default () => {
  const { data, loading, refetch } = useQuery(DEFAULT_COURSES);
  const [toggle] = useMutation(TOGGLE_DEFAULT);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        padding: 20,
      }}
    >
      <DefaultCourseTable
        data={{
          loading,
          defaultCourses: data && data.global.defaultCourses,
          refetch,
        }}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Branch', field: 'branch' },
          {
            title: 'Automated',
            render: (rowdata) => {
              if (rowdata != undefined) {
                const { automated, name } = rowdata;
                return (
                  <Switch
                    checked={automated}
                    onChange={() => {
                      toggle({
                        variables: { action: automated, name },
                      }).then(() => refetch());
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
        title='Default Courses'
        name='defaultCourses'
        isCourse
        uneditable={false}
      />
    </div>
  );
};
