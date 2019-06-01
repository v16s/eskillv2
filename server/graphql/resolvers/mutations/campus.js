import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
export default {
  addBranch: async (parent, { name }, { user }) => {
    if (user.level < 2) {
      try {
        return await prisma.createBranch({ name })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  removeBranch: async (parent, { name }, { user }) => {
    if (user.level < 2) {
      try {
        let { name } = await prisma.branch({ name })
        return await prisma.deleteBranch({ name })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  addCourse: async (parent, { course }, { user }) => {
    if (user.level < 2) {
      try {
        let salt = await promisify(bcrypt.genSalt)(10)
        let hash = await promisify(bcrypt.hash)('password', salt, null)
        let { username } = await prisma.createUser({
          username: `${name.replace(/ /g, '-')}-Coordinator`,
          password: hash,
          name: `${name} Coordinator`,
          course: name,
          email: '',
          level: 2
        })
        return await prisma.createCourse({ name, coordinator_id: username })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  removeCourse: async (parent, { name }, { user }) => {
    if (user.level < 2) {
      try {
        let { coordinator_id } = await prisma.course({ name })
        await prisma.deleteUser({ username: coordinator_id })
        return await prisma.deleteCourse({ name })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  }
}
