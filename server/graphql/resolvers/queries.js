import { prisma } from 'prisma'
export default {
  global: async (parent, args, ctx, info) => {
    console.log(ctx)
    return await prisma.global({ id: 'global' })
  },
  branches: async () => {
    return await prisma.branches()
  }
}
