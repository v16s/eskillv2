import { gql } from 'apollo-server-express'
export default gql`
  scalar Date

  type Query {
    global: Global
    user(user: UserInput!): User
    branches: [Branch]
    validate: User
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
    addCampus(name: String): Campus
    removeCampus(id: String): Global
    updateCampus(update: UpdateTag): Global
    login(user: LoginInput): User
    register(user: RegisterInput): User
    addBranch(name: String): Branch
    removeBranch(name: String): [Branch]
    updateBranch(branch: BranchUpdateInput): Branch
    addCourse(course: CourseInput): Branch
    removeCourse(course: CourseInput): Branch
    updateCourse(course: CourseInput): Branch
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
