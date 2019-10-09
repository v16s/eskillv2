import { prisma } from 'prisma'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
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
          where: { studID, facultyID, course, campus }
        })
        if (courseinstances.length == 0) {
          let c = await prisma.courses({ where: { name: course, campus } })
          const { automated } = c[0]
          let status = automated
          let obj, n, total, completed
          if (status == true) {
            let { questions: ques } = await prisma.$graphql(question, {
              course
            })
            shuffle(ques)
            n = ques.length > 100 ? 100 : ques.length
            obj = ques.slice(0, n).map(k => ({ ...k, status: 0 }))
            total = n
            completed = 0
          } else {
            obj = []
          }
          return await prisma.createCourseInstance({
            studID,
            facultyID,
            questions: { create: obj },
            completed,
            total,
            course,
            campus,
            department,
            status,
            studentReg: user.username,
            studentName: user.name
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

  createProblem: async (_parent, { queID, description, course }, { user }) => {
    if (user.level == 4) {
      try {
        let studID = user.id
        let { facultyID } = await prisma.courseInstance({ id: course })
        let { campus, department } = user
        let existing = await prisma.problems({
          where: {
            queID,
            studID,
            status: 0
          }
        })
        if (existing.length > 0) {
          throw new ValidationError('Unresolved problems already exist')
        } else {
          return await prisma.createProblem({
            queID,
            studID,
            description,
            status: 0,
            course,
            campus,
            department,
            facultyID
          })
        }
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
      let instance = await prisma.courseInstance({ id: cid })

      let { completed } = instance
      try {
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
        instance = await prisma.updateCourseInstance({
          where: { id: cid },
          data: {
            completed: completed + 1,
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
