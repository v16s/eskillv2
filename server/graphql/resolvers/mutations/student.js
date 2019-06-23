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
        let studID = user.id
        let { campus, department } = user
        let courseinstances = await prisma.courseInstances({
          where: { studID, facultyID, course }
        })
        if (courseinstances.length == 0) {
          let { questions: ques } = await prisma.$graphql(question, { course })
          shuffle(ques)
          let n = ques.length
          let obj = ques.slice(0, n).map(k => ({ ...k, status: 0 }))
          let total = n
          let completed = 0

          return await prisma.createCourseInstance({
            studID,
            facultyID,
            questions: { create: obj },
            completed,
            total,
            course,
            campus,
            department
          })
        } else {
          throw new ValidationError('Course already exists!')
        }
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
  },
  verifyQuestion: async (_parent, { question, cid }, { user }) => {
    if (user.level == 4) {
      try {
        let instance = await prisma.courseInstance({ id: cid })
        if (!instance) throw new ValidationError('no course')
        let { ans: verify } = await prisma.question({ id: question })
        let status = (() => {
          let { ans } = instance.questions.find(d => d.id == question)
          if (ans == verify) {
            return 2
          } else {
            return 1
          }
        })()
        console.log(status)
        instance = await prisma.updateCourseInstance({
          where: { id: cid },
          data: {
            questions: {
              updateMany: {
                where: { id: question },
                data: {
                  status
                }
              }
            }
          }
        })
        return instance
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    }
  },
  updateQuestionInstance: async (
    _parent,
    { question, cid, answer },
    { user }
  ) => {
    if (user.level == 4) {
      try {
        let instance = await prisma.updateCourseInstance({
          where: { id: cid },
          data: {
            questions: {
              updateMany: {
                where: { id: question },
                data: {
                  ans: answer
                }
              }
            }
          }
        })
        return instance
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    }
  }
}
