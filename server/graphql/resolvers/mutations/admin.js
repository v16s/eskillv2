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
          username: `${name.replace(/ /g, '_')}-Admin`,
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
          where: { username: `${name.replace(/ /g, '_')}-Admin` },
          data: {
            username: `${newName.replace(/ /g, '_')}-Admin`,
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

  // addBranch: async (parent, { name }, { user }) => {
  //   if (user.level < 1) {
  //     try {
  //       return await prisma.createBranch({ name })
  //     } catch (e) {
  //       console.log(e)
  //       throw new ValidationError(e.toString())
  //     }
  //   } else {
  //     throw new AuthenticationError('Unauthorized')
  //   }
  // },

  // removeBranch: async (parent, { name }, { user }) => {
  //   if (user.level < 1) {
  //     try {
  //       return await prisma.deleteBranch({ name })
  //     } catch (e) {
  //       console.log(e)
  //       throw new ValidationError(e.toString())
  //     }
  //   } else {
  //     throw new AuthenticationError('Unauthorized')
  //   }
  // },

  // updateBranch: async (parent, { name, newName }, { user }) => {
  //   if (user.level < 1) {
  //     try {
  //       return await prisma.updateBranch({
  //         where: { name },
  //         data: { name: newName }
  //       })
  //     } catch (e) {
  //       console.log(e)
  //       throw new ValidationError(e.toString())
  //     }
  //   } else {
  //     throw new AuthenticationError('Unauthorized')
  //   }
  // },

  addCourse: async (parent, { name, branch }, { user }) => {
    if (user.level < 1) {
      try {
        let branches = await prisma.branches({ where: { name: branch } })
        if (branches.length == 0) {
          await prisma.createBranch({ name: branch })
        }
        let identity = `${name}-${branch}`
        let salt = await promisify(bcrypt.genSalt)(10)
        let hash = await promisify(bcrypt.hash)('password', salt, null)
        let { username } = await prisma.createUser({
          username: `${identity.replace(/ /g, '_')}-Coordinator`,
          password: hash,
          name: `${identity} Coordinator`,
          email: '',
          level: 2
        })
        return await prisma.createCourse({
          name,
          coordinator_id: username,
          branch,
          automated: false
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
        let { coordinator_id, branch } = await prisma.course({ name })
        let courses = await prisma.courses({ where: { branch } })
        if (courses.length == 1) {
          await prisma.deleteBranch({ name: branch })
        }
        try {
        let a = await prisma.deleteUser({ username: coordinator_id })
        } catch (e) {}
        return await prisma.deleteCourse({ name })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  updateCourse: async (
    parent,
    { name, newName, branch, newAuto },
    { user }
  ) => {
    if (user.level < 1) {
      try {
        let identity = `${name}-${branch}`
        let iden = `${newName}-${branch}`
        console.log('asd', newName, newBranch)
        let courses = await prisma.courses({ where: { branch } })
        if (courses.length == 1) {
          await prisma.deleteBranch({ name: branch })
        }
        let branches = await prisma.branches({ where: { name: newBranch } })
        if (branches.length == 0) {
          await prisma.createBranch({ name: newBranch })
        }
        await prisma.updateUser({
          where: { username: `${identity.replace(/ /g, '_')}-Coordinator` },
          data: {
            username: `${iden.replace(/ /g, '_')}-Coordinator`,
            name: `${iden} Coordinator`
          }
        })
        return await prisma.updateCourse({
          where: { name },
          data: { name: newName, branch: newBranch, automated: newAuto }
        })
      } catch (e) {
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
        console.log(id, name)
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              deleteMany: { name: id }
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

  updateDepartment: async (parent, { name, update: updateMany }, { user }) => {
    if (user.level < 1) {
      try {
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              updateMany
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
  toggleCourseAutomation: async (_p, { name }, { user: { level } }) => {
    if (level < 1) {
      try {
        let { automated } = await prisma.course({ name })
        return await prisma.updateCourse({
          where: { name },
          data: {
            automated: !automated
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
