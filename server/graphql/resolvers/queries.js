import { prisma } from 'prisma'
export default {
  global: async (parent, args, ctx, info) => {
    return await prisma.global({ id: 'global' })
  }
}
