import { gql } from 'apollo-server-express'
export default gql`
  scalar Date

  type Query {
    global: Global
    user(user: UserInput!): User
  }
  type Global {
    regs: Boolean!
    regf: Boolean!
    departments: [Tag]
    campuses: [Tag]
  }
  type User {
    username: String!
    password: String!
    name: String!
    campus: String!
    department: String!
    dob: Date
    email: String!
    level: Int!
  }
  type Tag {
    name: String!
  }
  type Mutation {
    toggleStudentRegistration: ToggleResult
    toggleFacultyRegistration: ToggleResult
    addDepartment(name: String): Global
    removeDepartment(name: String): Global
    updateDepartment(update: UpdateTag): Global
    addCampus(name: String): Global
    removeCampus(name: String): Global
    updateCampus(update: UpdateTag): Global
  }
  input UpdateTag {
    where: TagInput!
    data: TagInput!
  }
  input TagInput {
    name: String!
  }
  input UserInput {
    username: String
    email: String
  }
  type ToggleResult {
    success: Boolean!
    result: Boolean!
  }
`
