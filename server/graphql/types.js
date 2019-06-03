import { gql } from 'apollo-server-express'
export default gql`
  scalar Date

  type Query {
    global: Global
    user(user: UserInput!): User
    branches: [Branch]
    validate: User
    campuses: [Campus]
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
    campus: String
    department: String
    dob: Date
    email: String!
    level: Int!
    jwt: String
  }
  type Tag {
    name: String!
    id: String!
  }
  type Branch {
    name: String!
    courses: [Course]
  }
  type Course {
    branch: String!
    name: String!
    coordinator_id: String!
  }
  type Campus {
    admin_id: String!
    departments: [Tag]
    branches: [Branch]
    name: String!
  }
  type Mutation {
    toggleStudentRegistration: ToggleResult
    toggleFacultyRegistration: ToggleResult
    addDepartment(tag: TagInput): Global
    removeDepartment(id: String): Global
    updateDepartment(update: UpdateTag): Global
    addCampus(name: String!): Campus
    removeCampus(name: String!): Campus
    updateCampus(name: String!, newName: String!): Campus
    updateOwnCampus(name: String!, newName: String!): Campus
    login(user: LoginInput): User
    register(user: RegisterInput): User
    addBranch(name: String!): Branch
    removeBranch(name: String!): Branch
    updateBranch(name: String!, newName: String!): Branch
    addCourse(name: String!, branch: String!): Course
    removeCourse(name: String!): Course
    updateCourse(name: String!, newName: String!, branch: String!): Course
  }
  input CourseInput {
    branch: String!
    name: String!
    update: String
  }
  input LoginInput {
    username: String!
    password: String!
  }
  input BranchUpdateInput {
    where: String!
    name: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    name: String!
    campus: String!
    department: String!
    dob: Date
    email: String!
    type: Boolean!
  }
  input UpdateTag {
    where: TagInput!
    data: TagInput!
  }
  input TagInput {
    name: String!
    id: String
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
