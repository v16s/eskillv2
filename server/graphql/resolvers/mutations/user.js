import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreplysrmeskill@gmail.com',
    pass: 'srmeskillnoreply'
  }
})

function makeid (length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
export default {
  forgot: async (_p, { username }, { user }) => {
    if (!user) {
      try {
        let { email } = await prisma.user({ username })
        let token
        const recovery = await prisma.recoveries({ where: { username, email } })
        if (recovery.length < 1) {
          token = makeid(12)
          await prisma.createRecovery({
            token,
            username,
            email
          })
        } else {
          token = recovery[0].token
        }
        await prisma.createRecovery
        const resetURL = 'http://care.srmist.edu.in/eskillnew/forgot/'
        transporter.sendMail({
          from: 'noreplysrmeskill@gmail.com',
          to: email,
          subject: 'eSkill Password Reset',
          html: `<p>Dear ${username}</p><p>In Order to reset the password, please click the link below: </p><p><a href="${resetURL}${token}">Reset Password</a></p>`
        })
        return true
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('already logged in')
    }
  },
  recover: async (_p, { input }, { user }) => {
    if (!user) {
      const { token, password } = input
      const { username } = await prisma.recovery({ token })
      let salt = await promisify(bcrypt.genSalt)(10)
      let hash = await promisify(bcrypt.hash)(password, salt, null)
      const updatedUser = await prisma.updateUser({
        where: {
          username
        },
        data: {
          password: hash
        }
      })
      let jwToken = jwt.sign(updatedUser, 'eskill@care')
      await prisma.deleteRecovery({ token })
      return {
        ...updatedUser,
        jwt: `Bearer ${jwToken}`
      }
    } else {
      throw new AuthenticationError('already logged in!')
    }
  },
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
