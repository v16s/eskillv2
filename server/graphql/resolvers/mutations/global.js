import { prisma } from 'prisma'
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
  addDepartment: (parent, { name }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              departments: {
                create: [{ name }]
              }
            }
          })
        )
      } catch (e) {
        reject()
      }
    })
  },
  removeDepartment: (parent, { name }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              departments: {
                deleteMany: { name }
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
  addCampus: (parent, { name }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              campuses: {
                create: [{ name }]
              }
            }
          })
        )
      } catch (e) {
        reject()
      }
    })
  },
  removeCampus: (parent, { name }, ctx, info) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updateGlobal({
            where: { id: 'global' },
            data: {
              campuses: {
                deleteMany: { name }
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
