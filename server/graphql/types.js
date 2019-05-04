import { gql } from 'apollo-server-express'
export default gql`
  type Query {
    global: Global
  }
  type Global {
    regs: Boolean!
    regf: Boolean!
    departments: [String]
    campuses: [String]
  }
  type Mutation {
    toggleStudentRegistration: ToggleResult
    toggleFacultyRegistration: ToggleResult
  }
  type ToggleResult {
    success: Boolean!
    result: Boolean!
  }
`
