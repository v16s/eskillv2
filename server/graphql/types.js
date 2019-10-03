import { gql } from 'apollo-server-express'
export default gql`
  scalar Date
  type Query {
    global: Global
    branches: [Branch]
    validate: User
    campuses: [Campus]
    courses(where: CourseWhereInput): [Course]
    questions(where: QuestionWhereInput): [Question]
    question(id: String!): Question
    faculties: [User]
    answer: String
    instances: [CourseInstance]
    instance(id: String!): CourseInstance
    progress: [CourseInstance]
    acceptReject: [CourseInstance]
    problems: [Problem]
  }
  input CourseWhereInput {
    branch: String
    name: String
  }
  input QuestionWhereInput {
    course: String
    name: String
    desc: String
  }
  type Global {
    regs: Boolean!
    regf: Boolean!
    departments: [Tag]
    campuses: [Tag]
  }
  type User {
    id: String
    username: String!
    password: String!
    name: String!
    campus: String
    department: String
    dob: Date
    email: String!
    level: Int!
    jwt: String
    problems: [Problem]
  }
  type Problem {
    id: ID!
    queID: String!
    studID: String!
    description: String!
    status: Int!
    course: String!
    campus: String
    department: String
    facultyID: String!
  }
  type CourseInstance {
    id: ID!
    studID: String!
    facultyID: String!
    questions: [Link]!
    completed: Int!
    total: Int!
    course: String!
    status: Boolean!
    studentName: String!
    campus: String!
    studentReg: String!
  }
  type Link {
    id: String!
    status: Int!
    ans: String
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
    automated: Boolean
    campus: String
  }
  type Question {
    id: String!
    course: String!
    name: String!
    desc: String!
    exp: String!
    opt: Options!
    ans: String!
    picture: Upload
    display: String
  }
  type Options {
    a: String!
    b: String!
    c: String!
    d: String!
  }

  type Campus {
    admin_id: String!
    departments: [Tag]
    branches: [Branch]
    name: String!
  }
  type OperationResult {
    count: Int!
  }
  type Mutation {
    toggleStudentRegistration: ToggleResult
    toggleFacultyRegistration: ToggleResult
    addDepartment(tag: TagInput, name: String!): Campus
    toggleCourseAutomation(name: String!): Course
    removeDepartment(id: String!, name: String!): Campus
    updateDepartment(name: String!, update: UpdateTag!): Campus
    adminAddDepartment(tag: TagInput, name: String!): Campus
    adminRemoveDepartment(id: String!, name: String!): Campus
    adminUpdateDepartment(id: String!, name: String!, tag: TagInput): Campus
    addCampus(name: String!): Campus!
    removeCampus(name: String!): Campus!
    updateCampus(name: String!, newName: String!): Campus!
    updateOwnCampus(name: String!, newName: String!): Campus
    login(user: LoginInput): User
    register(user: RegisterInput): User
    addBranch(name: String!): Branch
    removeBranch(name: String!): Branch
    updateBranch(name: String!, newName: String!): Branch
    addCourse(name: String!, branch: String!): OperationResult!
    removeCourse(name: String!, campus: String!): Course!
    acceptCourseInstance(id: String!): CourseInstance
    updateCourse(
      name: String!
      newName: String!
      branch: String!
      campus: String!
      newBranch: String!
    ): Course!
    adminAddCourse(name: String!, branch: String!): Course
    adminRemoveCourse(name: String!): Course
    adminUpdateCourse(
      name: String!
      newName: String!
      branch: String!
      newAuto: Boolean
    ): Course
    addQuestion(
      course: String!
      name: String!
      desc: String!
      exp: String!
      Obj: OptionInput!
      ans: String!
      picture: Upload
    ): Question
    removeQuestion(id: String!, course: String!): Question
    updateQuestion(
      id: String!
      course: String!
      name: String!
      desc: String!
      exp: String!
      Obj: OptionInput!
      ans: String!
      picture: Upload
    ): Question
    requestCourse(course: String!, facultyID: String): CourseInstance
    rejectCourseInstance(id: String!): CourseInstance
    createProblem(
      queID: String!
      description: String!
      course: String!
    ): Problem
    updateQuestionInstance(
      question: String!
      cid: String!
      answer: String!
    ): CourseInstance
    verifyQuestion(question: String!, cid: String!): CourseInstance
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
  input OptionInput {
    a: String!
    b: String!
    c: String!
    d: String!
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
    a: String!
    b: String!
    c: String!
    d: String!
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
