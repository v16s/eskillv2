import { prisma } from 'prisma'
import { AuthenticationError, ValidationError } from 'apollo-server-express'

export default {
  toggleCourseAutomation: async (
    _p,
    { name, campus: providedCampus },
    { user: { level, campus } }
  ) => {
    if (level <= 1) {
      if (level == 1) {
        providedCampus = campus
      }
      try {
        const courses = await prisma.courses({
          where: { name, campus: providedCampus }
        })
        let { automated } = courses[0]
        await prisma.updateManyCourses({
          where: { name, campus: providedCampus },
          data: {
            automated: !automated
          }
        })
        return courses[0]
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  }
}
