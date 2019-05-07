import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
export default {
  toggleStudentRegistration: (parent, args, ctx, info) => {
    return new Promise(async resolve => {
      try {
        let global = await prisma.global({ id: 'global' })
        await prisma.updateGlobal({
          data: { regs: !global.regs },
          where: { id: 'global' }
        })
        resolve({ success: true, result: !global.regs })
      } catch (e) {
        resolve({ success: false, result: false })
      }
    })
  },
  toggleFacultyRegistration: async (parent, args, ctx, info) => {
    return new Promise(async resolve => {
      try {
        let global = await prisma.global({ id: 'global' })
        await prisma.updateGlobal({
          data: { regf: !global.regf },
          where: { id: 'global' }
        })
        resolve({ success: true, result: !global.regs })
      } catch (e) {
        resolve({ success: false, result: false })
      }
    })
  },
  addDepartment: (parent, { tag }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { campuses } = await prisma.global({ id: 'global' })
        let salt = await promisify(bcrypt.genSalt)(10)
        let hash = await promisify(bcrypt.hash)('password', salt, null)
        campuses.map(async ({ id, name }) => {
          await prisma.createUser({
            username: `${id}-${tag.id}-admin`,
            password: hash,
            name: `${name} ${tag.name} Admin`,
            campus: id,
            department: tag.id,
            email: '',
            level: 1
          })
        })
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              departments: {
                create: [tag]
              }
            }
          })
        )
      } catch (e) {
        console.log(e)
        reject()
      }
    })
  },
  removeDepartment: (parent, { id }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.deleteManyUsers({ level: 1, department: id })
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              departments: {
                deleteMany: { id }
              }
            }
          })
        )
      } catch (e) {
        reject()
      }
    })
  },
  updateDepartment: (parent, { update: updateMany }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              departments: {
                updateMany
              }
            }
          })
        )
      } catch (e) {
        reject()
      }
    })
  },
  addCampus: (parent, { tag }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              campuses: {
                create: [tag]
              }
            }
          })
        )
      } catch (e) {
        reject()
      }
    })
  },
  removeCampus: (parent, { id }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              campuses: {
                deleteMany: { id }
              }
            }
          })
        )
      } catch (e) {
        reject()
      }
    })
  },
  updateCampus: (parent, { update: updateMany }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              campuses: {
                updateMany
              }
            }
          })
        )
      } catch (e) {
        reject()
      }
    })
  }
}
