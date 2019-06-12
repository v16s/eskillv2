import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { async } from 'q'
export default {
  toggleStudentRegistration: async (p, a, { user }) => {
    if (user.level < 1) {
      try {
        let global = await prisma.global({ id: 'global' })
        await prisma.updateGlobal({
          data: { regs: !global.regs },
          where: { id: 'global' }
        })
        return { result: !global.regs }
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },
  toggleFacultyRegistration: async (p, a, { user }) => {
    if (user.level < 1) {
      try {
        let global = await prisma.global({ id: 'global' })
        await prisma.updateGlobal({
          data: { regf: !global.regf },
          where: { id: 'global' }
        })
        return { result: !global.regs }
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },
  addCampus: async (parent, { name }, { user }) => {
    if (user.level < 1) {
      try {
        let salt = await promisify(bcrypt.genSalt)(10)
        let hash = await promisify(bcrypt.hash)('password', salt, null)
        let { username } = await prisma.createUser({
          username: `${name.replace(/ /g, '-')}-Admin`,
          password: hash,
          name: `${name} Admin`,
          campus: name,
          email: '',
          level: 1
        })
        return await prisma.createCampus({ name, admin_id: username })
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },
  removeCampus: async (parent, { name }, { user }) => {
    if (user.level < 1) {
      try {
        let { admin_id } = await prisma.campus({ name })
        await prisma.deleteUser({ username: admin_id })
        return await prisma.deleteCampus({ name })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  updateCampus: async (parent, { name, newName }, { user }) => {
    if (user.level < 1) {
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

  addBranch: async (parent, { name }, { user }) => {
    if (user.level < 1) {
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
    if (user.level < 1) {
      try {
        return await prisma.deleteBranch({ name })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  updateBranch: async (parent, { name, newName }, { user }) => {
    if (user.level < 1) {
      try {
        return await prisma.updateBranch({
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
    if (user.level < 1) {
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
    if (user.level < 1) {
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
    if (user.level < 1) {
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

  addDepartment: async (parent, { tag, name }, { user }) => {
    if (user.level < 1) {
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

  removeDepartment: async (parent, { id, name }, { user }) => {
    if (user.level < 1) {
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

  updateDepartment: async (parent, { id, name, tag }, { user }) => {
    if (user.level < 1) {
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
