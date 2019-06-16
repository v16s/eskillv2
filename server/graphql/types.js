import { gql } from 'apollo-server-express'
export default gql`
  scalar Date

  type Query {
    global: Global
    user: [User]
    branches: [Branch]
    validate: User
    campuses: [Campus]
    courses(where: CourseWhereInput): [Course]
    file: String
  }
  input CourseWhereInput {
    branch: String
    name: String
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
  type QuestionAdd {
    course: String!
    name: String!
    desc: String!
    exp: String!
    opt: [Obj]!
    ans: String!
    picture: Upload
  }
  type Obj {
    opt1: String!
    opt2: String!
    opt3: String!
    opt4: String!
    id: String
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
    addDepartment(tag: TagInput, name: String!): Campus
    removeDepartment(id: String!, name: String!): Campus
    updateDepartment(name: String!, update: UpdateTag!): Campus
    adminAddDepartment(tag: TagInput, name: String!): Campus
    adminRemoveDepartment(id: String!, name: String!): Campus
    adminUpdateDepartment(id: String!, name: String!, tag: TagInput): Campus
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
    adminAddCourse(name: String!, branch: String!): Course
    adminRemoveCourse(name: String!): Course
    adminUpdateCourse(name: String!, newName: String!, branch: String!): Course
    addQuestion(
      course: String!
      name: String!
      desc: String!
      exp: String!
      Obj: ObjInput!
      ans: String!
      picture: Upload
    ): QuestionAdd
    removeQuestion(id: String!): QuestionAdd
    updateQuestion(
      id: String!
      newCourse: String!
      newName: String!
      newDesc: String!
      newExp: String!
      update: updateObj!
      newAns: String!
      newPicture: Upload
    ): QuestionAdd
    questionTest(picture: Upload): User
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
  input ObjInput {
    opt1: String!
    opt2: String!
    opt3: String!
    opt4: String!
    id: String
  }
  input updateObj {
    where: ObjInput!
    data: ObjInput!
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
