import gql from 'graphql-tag';

export const ADD_CAMPUS = gql`
  mutation AddCampus($name: String!) {
    addCampus(name: $name) {
      name
    }
  }
`;
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
    updateCampus(name: $name, newName: $newName) {
      name
    }
  }
`;
export const REMOVE_CAMPUS = gql`
  mutation RemoveCampus($name: String!) {
    removeCampus(name: $name) {
      name
    }
  }
`;
export const variableMapperCampus = {
  add: (data) => {
    console.log(data)
    return({
    variables: {
      name: data.name,
    },
  })},
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
export const variableMapperDepartment = {
  add: (data) => ({
    variables: data,
  }),
  edit: (prev, next) => ({
    variables: {
      name: prev.name,
      next: next,
      prev: prev.id
    },
  }),
  delete: (data) => ({
    variables: {
      name: data.name,
      deptname: data.id
    },
  }),
};
export const REMOVE_COURSE = gql`
  mutation RemoveCourse($name: String!, $campus: String!) {
    removeCourse(name: $name, campus: $campus) {
      name
    }
  }
`;

export const ADD_COURSE = gql`
  mutation AddCourse($name: String!, $branch: String!) {
    addCourse(name: $name, branch: $branch) {
      count
    }
  }
`;

export const TOGGLE = gql`
  mutation ToggleAutomate($name: String!, $campus: String!) {
    toggleCourseAutomation(name: $name, campus: $campus) {
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
    $campus: String!
  ) {
    updateCourse(
      name: $name
      newName: $newName
      branch: $branch
      newBranch: $newBranch
      campus: $campus
    ) {
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
  edit: (prev, next) => 
    ({
    variables: {
      name: prev.name,
      newName: next.name,
      branch: prev.branch,
      newBranch: next.branch,
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
