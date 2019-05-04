import { gql } from 'apollo-server-express'
export default gql`
  type Query {
    user(id: String): User
    global: Global
  }
  type User {
    username: String!
    pass: String!
    email: String!
  }
  type Global {
    studentreg: Boolean!
    facultyreg: Boolean!
    coordinatorreg: Boolean
    branches: [String]!
    departments: [String]!
  }
  input Edit {
    old: String
    rep: String
  }
  input Details {
    branch: String
    department: String
  }

  input TestCase {
    id: String!
    content: String!
  }

  input UserDetails {
    username: String
    password: String
    email: String
    details: Details
  }

  input Question {
    qname: String!
    qdef: String!
    testcase: [TestCase]
    img: Upload!
    session: String!
    hint: String
    course: String!
  }

  input Session {
    course_name: String
    sess_name: String
    new_name: String
  }

  input Course {
    name: String
    edit_name: String
    session: [String]
  }
`
