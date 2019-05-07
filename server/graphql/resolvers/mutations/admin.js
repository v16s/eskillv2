import { prisma } from 'prisma'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
export default {
  addBranch: async (parent, { name }, ctx) => {
    if (ctx.user.level <= 1) {
      return await prisma.createBranch({ name })
    }
    throw new AuthenticationError('Not Authorized')
  },
  removeBranch: async (parent, { name }, ctx) => {
    if (ctx.user.level <= 1) {
      try {
        await prisma.deleteBranch({ name })
        return await prisma.branches()
      } catch (e) {
        throw new ValidationError('Error Deleting Branch')
      }
    }
    throw new AuthenticationError('Not Authorized')
  },
  updateBranch: async (parent, { branch }, ctx) => {
    if (ctx.user.level <= 1) {
      try {
        return await prisma.updateBranch({
          where: { name: branch.where },
          data: { name: branch.name }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError('Error Updating Branch')
      }
    }
    throw new AuthenticationError('Not Authorized')
  },
  addCourse: async (parent, { course }, ctx) => {
    if (ctx.user.level <= 1) {
      return await prisma.updateBranch({
        where: {
          name: course.branch
        },
        data: {
          courses: {
            create: [{ name: course.name, id: 'course' }]
          }
        }
      })
    }
    throw new AuthenticationError('Not Authorized')
  },
  removeCourse: async (parent, { course }, ctx) => {
    if (ctx.user.level <= 1) {
      try {
        return await prisma.updateBranch({
          where: {
            name: course.branch
          },
          data: {
            courses: {
              deleteMany: { name: course.name }
            }
          }
        })
      } catch (e) {
        throw new ValidationError('Error Deleting Course')
      }
    }
    throw new AuthenticationError('Not Authorized')
  },
  updateCourse: async (parent, { course }, ctx) => {
    if (ctx.user.level <= 1) {
      try {
        return await prisma.updateBranch({
          where: {
            name: course.branch
          },
          data: {
            courses: {
              updateMany: {
                where: { name: course.name },
                data: { name: course.update }
              }
            }
          }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError('Error Updating Branch')
      }
    }
    throw new AuthenticationError('Not Authorized')
  }
}
