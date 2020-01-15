import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { prisma } from 'prisma'

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
  acceptCourseInstance: async (_, { id }, { user }) => {
    if (user.level == 3) {
      try {
        let instance = await prisma.courseInstance({ id })
        let { course, status } = instance
        if (instance.facultyID != user.id) throw new AuthenticationError()
        if (status) throw new ValidationError()
        await prisma.updateCourseInstance({
          where: { id },
          data: { status: true }
        })
        let { questions: ques } = await prisma.$graphql(question, {
          course
        })
        shuffle(ques)
        let n = ques.length > 100 ? 100 : ques.length
        let obj = ques.slice(0, n).map(k => ({ ...k, status: 0 }))
        let total = n
        let completed = 0
        return await prisma.updateCourseInstance({
          where: { id },
          data: { questions: { create: obj }, completed, total }
        })
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },
  rejectCourseInstance: async (_parent, { id }, { user }) => {
    if (user.level == 3) {
      try {
        return await prisma.deleteCourseInstance({ id })
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },
  facultyRejectProblem: async (_p, { id }, { user }) => {
    if (user.level != 3) throw new AuthenticationError('Unauthorized')
    try {
      let problem = await prisma.problem({ id: id })
      if (problem.facultyID != user.id) throw new ValidationError('Cant reject')
      problem = await prisma.updateProblem({
        where: { id },
        data: { status: -1 }
      })
      return problem
    } catch (e) {
      throw new ValidationError(e.toString())
    }
  },
  facultyResolveProblem: async (
    _p,
    { id, course, name, desc, exp, Obj, ans, picture },
    { user, bucket }
  ) => {
    if (user.level !== 3) throw new AuthenticationError('Unauthorized')
    try {
      let problem = await prisma.problem({ queID: id })
      if (problem.facultyID != user.id)
        throw new ValidationError('Cant resolve')
      let question = await prisma.updateQuestion({
        where: { id },
        data: {
          name,
          desc,
          exp,
          ans,
          opt: {
            create: Obj
          },
          course
        }
      })
      if (picture && question) {
        const { createReadStream } = await picture
        if (picture) {
          try {
            let image = bucket.find({ filename: `${id}.jpg` })
            let { _id } = await image.next()
            bucket.delete(_id)
          } catch (e) {}
        }
        let img = `${question.id}.jpg`
        createReadStream()
          .pipe(bucket.openUploadStream(img))
          .on('finish', () => {
            resolve(question)
          })
      } else {
        resolve(question)
      }
      problem = await prisma.updateProblem({
        where: { queID: id },
        data: { status: 2 }
      })
      return problem
    } catch (e) {
      throw new ValidationError(e.toString())
    }
  }
}
