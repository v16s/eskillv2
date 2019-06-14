import { prisma } from 'prisma'
import { async } from 'q'
export default {
  global: async (parent, args, ctx, info) => {
    return await prisma.global({ id: 'global' })
  },
  branches: async () => {
    return await prisma.branches()
  },
  validate: async (parent, args, { user }) => {
    if (user) {
      return user
    }
    return null
  },
  campuses: async () => {
    return await prisma.campuses()
  },
  branches: async () => {
    return await prisma.branches()
  },
  courses: async () => {
    return await prisma.courses()
  }
}
