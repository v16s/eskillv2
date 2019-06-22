import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { async } from 'q'
export default {
  requestCourse: async (_parent, { course, facultyID }, user) => {
    if (user.level == 4) {
      let ques = await prisma.questions({ where: course }, { random: 100 })
    }
  }
}
