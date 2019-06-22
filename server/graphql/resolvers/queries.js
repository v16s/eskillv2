import { prisma } from 'prisma'
import { async } from 'q'

let question = `
query Questions($id: String!){
  questions(where:{id:$id}){
    ans
  }
}`

export default {
  global: async (parent, args, ctx, info) => {
    return await prisma.global({ id: 'global' })
  },
  branches: async () => {
    return await prisma.branches()
  },
  validate: async (parent, args, { user }) => {
    if (user) {
      return user
    }
    return null
  },
  campuses: async () => {
    return await prisma.campuses()
  },
  branches: async () => {
    return await prisma.branches()
  },
  courses: async (_, { where }) => {
    console.log(where)
    return await prisma.courses({ where })
  },
  questions: async (_, { where }, { user }) => {
    return await prisma.questions({ where })
  },
  question: async (_, { id }, { bucket }) => {
    let question = await prisma.question({ id })
    return new Promise((resolve, reject) => {
      let string = ''
      bucket
        .openDownloadStreamByName(id + '.jpg')
        .on('data', str => {
          string += str.toString('base64')
        })
        .on('end', () => {
          question.display = `data:image/jpg;base64,${string}`
          resolve(question)
        })
        .on('error', () => {
          resolve(question)
        })
    })
  },
  faculties: async (_, _args, { user }) => {
    try {
      return await prisma.users({
        where: {
          campus: user.campus,
          departments: user.departments
        }
      })
    } catch (e) {
      console.log(e)
      throw new ValidationError(e.toString())
    }
  },
  answer: async (_, _args, { user }) => {
    try {
      return await prisma.$graphql(question, { id })
    } catch (e) {
      console.log(e)
      throw new ValidationError(e.toString())
    }
  }
}
