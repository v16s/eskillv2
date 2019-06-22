import global from './global'
import user from './user'
import admin from './admin'
import campus from './campus'
import question from './question'
import student from './student'

export default {
  ...global,
  ...user,
  ...admin,
  ...campus,
  ...question,
  ...student
}
