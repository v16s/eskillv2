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
    let { questions: ques } = await prisma.$graphql(question, { course })
    shuffle(ques)
    let obj = ques.slice(0, 3).map(k => ({ ...k, status: 0 }))
    let total = ques.length
    let completed = 0
    let studID = user.id
    console.log(studID)
    return await prisma.createCourseInstance({
      studID,
      facultyID,
      questions: { create: obj },
      completed,
      total,
      course
    })
  },
  createReport: async (_parent, { queID, description, status }, { user }) => {
    let studID = user.id
    return await prisma.createReport({
      queID,
      studID,
      description,
      status
    })
  }
}
