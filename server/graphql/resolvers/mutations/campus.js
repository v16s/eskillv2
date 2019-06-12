import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
export default {
  updateOwnCampus: async (parent, { name, newName }, { user }) => {
    if (user.level < 2 && user.username == `${name.replace(/ /g, '-')}-Admin`) {
      try {
        let { username } = await prisma.updateUser({
          where: { username: `${name.replace(/ /g, '-')}-Admin` },
          data: {
            username: `${newName.replace(/ /g, '-')}-Admin`,
            name: `${newName} Admin`,
            campus: newName
          }
        })
        return await prisma.updateCampus({
          where: { name },
          data: { name: newName }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  addCourse: async (parent, { name, branch }, { user }) => {
    if (user.level < 2) {
      try {
        let identity = `${name}-${branch}`
        let salt = await promisify(bcrypt.genSalt)(10)
        let hash = await promisify(bcrypt.hash)('password', salt, null)
        let { username } = await prisma.createUser({
          username: `${identity.replace(/ /g, '-')}-Coordinator`,
          password: hash,
          name: `${identity} Coordinator`,
          email: '',
          level: 2
        })
        return await prisma.createCourse({
          name,
          coordinator_id: username,
          branch
        })
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
  },

  updateCourse: async (parent, { name, newName, branch }, { user }) => {
    if (user.level < 2) {
      try {
        let identity = `${name}-${branch}`
        let iden = `${newName}-${branch}`
        let { username } = await prisma.updateUser({
          where: { username: `${identity.replace(/ /g, '-')}-Coordinator` },
          data: {
            username: `${iden.replace(/ /g, '-')}-Coordinator`,
            name: `${iden} Coordinator`
          }
        })
        return await prisma.updateCourse({
          where: { name },
          data: { name: newName }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  adminAddDepartment: async (parent, { tag, name }, { user }) => {
    if (user.level < 2 && user.username == `${name.replace(/ /g, '-')}-Admin`) {
      try {
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              create: [tag]
            }
          }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e)
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  adminRemoveDepartment: async (parent, { id, name }, { user }) => {
    if (user.level < 2 && user.username == `${name.replace(/ /g, '-')}-Admin`) {
      try {
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              deleteMany: { id }
            }
          }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  adminUpdateDepartment: async (parent, { id, name, tag }, { user }) => {
    if (user.level < 2 && user.username == `${name.replace(/ /g, '-')}-Admin`) {
      try {
        await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              deleteMany: { id }
            }
          }
        })
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              create: [tag]
            }
          }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  }
}
