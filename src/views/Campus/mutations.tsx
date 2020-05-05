import gql from 'graphql-tag';

export const ADD_DEPARTMENT = gql`
  mutation AddDepartment($name: String!, $id: String!, $tname: String!) {
    addDepartment(name: $name, tag: { id: $id, name: $tname }) {
      name
    }
  }
`;
export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($name: String!, $prev: String!, $next: String!) {
    updateDepartment(
      name: $name
      update: {
        where: { id: $prev, name: $prev }
        data: { id: $next, name: $next }
      }
    ) {
      name
    }
  }
`;
export const REMOVE_DEPARTMENT = gql`
  mutation RemoveDepartment($name: String!, $deptname: String!) {
    removeDepartment(name: $name, id: $deptname) {
      name
    }
  }
`;
export const UPDATE_CAMPUS = gql`
  mutation UpdateCampus($name: String!, $newName: String!) {
    updateOwnCampus(name: $name, newName: $newName) {
      name
    }
  }
`;

export const ADD_COURSE = gql`
  mutation AddCourse($name: String!, $branch: String!) {
    campusAddCourse(name: $name, branch: $branch) {
      name
    }
  }
`;
export const TOGGLE = gql`
  mutation ToggleAutomate($name: String!) {
    toggleCourseAutomation(name: $name) {
      name
    }
  }
`;
export const UPDATE_COURSE = gql`
  mutation UpdateCourse(
    $name: String!
    $newName: String!
    $branch: String!
    $newBranch: String!
  ) {
    campusUpdateCourse(
      name: $name
      newName: $newName
      branch: $branch
      newBranch: $newBranch
    ) {
      name
    }
  }
`;
export const REMOVE_COURSE = gql`
  mutation RemoveCourse($name: String!) {
    campusRemoveCourse(name: $name) {
      name
    }
  }
`;

export const variableMapperCourse = {
  add: (data) => ({
    variables: {
      name: data.name,
      branch: data.branch,
    },
  }),
  edit: (prev, next) => ({
    variables: {
      name: prev.name,
      newName: next.name,
      branch: prev.branch,
      newBranch: prev.newBranch,
      campus: prev.campus,
    },
  }),
  delete: (data) => ({
    variables: {
      name: data.name,
      branch: data.branch,
      campus: data.campus,
    },
  }),
};
export const variableMapperCampus = {
  add: (data) => ({
    variables: {
      name: data.name,
    },
  }),
  edit: (prev, next) => ({
    variables: {
      name: prev.name,
      newName: next.name,
    },
  }),
  delete: (data) => ({
    variables: {
      name: data.name,
    },
  }),
};
