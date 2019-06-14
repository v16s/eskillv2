import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { async } from 'q'
export default {
  addQuestion: async (
    parent,
    { num, course, title, opt1, opt2, opt3, opt4, ans },
    { user }
  ) => {
    if (user.level < 1) {
      try {
        let n = await prisma
          .questionsConnection({ where: { course } })
          .aggregate()
          .count()
        num = n
        return await prisma.createQuestion({
          num,
          course,
          title,
          opt1,
          opt2,
          opt3,
          opt4,
          ans
        })
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  removeQuestion: async (parent, { title }, { user }) => {
    if (user.level < 1) {
      try {
        return await prisma.deleteQuestion({ title })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  updateQuestion: async (
    parent,
    { course, title, newTitle, newOpt1, newOpt2, newOpt3, newOpt4, newAns },
    { user }
  ) => {
    if (user.level < 1) {
      try {
        return await prisma.updateQuestion({
          where: { title },
          data: {
            course,
            title: newTitle,
            opt1: newOpt1,
            opt2: newOpt2,
            opt3: newOpt3,
            opt4: newOpt4,
            ans: newAns
          }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  }
}
