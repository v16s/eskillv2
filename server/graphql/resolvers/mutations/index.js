import global from './global'
import user from './user'
import admin from './admin'
import campus from './campus'
import question from './question'

export default {
  ...global,
  ...user,
  ...admin,
  ...campus,
  ...question
}
