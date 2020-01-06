import gql from 'graphql-tag'

export const FACULTY_REJECT = gql`
  mutation FacultyReject($id: String!) {
    facultyRejectProblem(id: $id) {
      status
    }
  }
`

// TEMPORARY, TO BE MOVED ELSEWHERE WHEN RESTRUCTURING
