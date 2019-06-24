import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { prisma } from 'prisma'
export default {
  acceptCourseInstance: async (_, { id }, { user }) => {
    if (user.level !== 3) throw new AuthenticationError()
    let instance = await prisma.courseInstance({ id })
    if (instance.facultyID != user.id) throw new AuthenticationError()
    await prisma.updateCourseInstance({ where: { id }, data: { status: true } })
    return true
  },
  rejectCourseInstance: async (_parent, { id }, { user }) => {
    if (user.level == 3) {
      try {
        return await prisma.deleteCourseInstance({ id })
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    }
  }
}
