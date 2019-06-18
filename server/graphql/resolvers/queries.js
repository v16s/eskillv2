import { prisma } from 'prisma'
import { async } from 'q'
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
  }
}
