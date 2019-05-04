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
  }
}
