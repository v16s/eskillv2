import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { AuthenticationError } from 'apollo-server-express'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
export default {
  login: (parent, { user }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        let dbuser = await prisma.user({ username: user.username })
        if (!dbuser) {
          reject(new AuthenticationError('no user'))
        }
        bcrypt.compare(user.password, dbuser.password, (err, isMatch) => {
          if (isMatch) {
            let token = jwt.sign(dbuser, 'eskill@care')
            resolve({ ...dbuser, jwt: `Bearer ${token}` })
          }
          reject(new AuthenticationError('wrong password'))
        })
      } catch (e) {
        reject('error')
      }
    })
  },
  register: (parent, { user }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        let salt = await promisify(bcrypt.genSalt)(10)
        let hash = await promisify(bcrypt.hash)(user.password, salt, null)
        let dbuser = await prisma.createUser({
          ...user,
          type: undefined,
          level: user.type ? 3 : 4,
          password: hash
        })
        let token = jwt.sign(dbuser, 'eskill@care')
        resolve({ ...dbuser, jwt: `Bearer ${token}` })
      } catch (e) {
        reject(e)
      }
    })
  }
}
