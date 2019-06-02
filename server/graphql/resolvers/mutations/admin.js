import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
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
        return await prisma.updateCampus({
          where: { name },data: {name: newName}})
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
          data:  { name: newName }
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
