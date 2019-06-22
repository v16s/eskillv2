import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { async } from 'q'
let question = `
query Questions($course: String!) {
    questions(where: {course: $course}){
        id
    }
}
`
function shuffle (array) {
  array.sort(() => Math.random() - 0.5)
}
export default {
  requestCourse: async (_parent, { course, facultyID }, { user }) => {
    if (user.level == 4) {
      try {
        let { questions: ques } = await prisma.$graphql(question, { course })
        shuffle(ques)
        let n = ques.length
        let obj = ques.slice(0, n).map(k => ({ ...k, status: 0 }))
        let total = n
        let completed = 0
        let studID = user.id
        return await prisma.createCourseInstance({
          studID,
          facultyID,
          questions: { create: obj },
          completed,
          total,
          course
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },
  createReport: async (
    _parent,
    { queID, description, status, course },
    { user }
  ) => {
    if (user.level == 4) {
      try {
        let studID = user.id
        let { campus, department } = user
        return await prisma.createReport({
          queID,
          studID,
          description,
          status,
          course,
          campus,
          department
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
