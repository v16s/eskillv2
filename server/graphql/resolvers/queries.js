import { prisma } from 'prisma'
import { async } from 'q'
import { AuthenticationError, ValidationError } from 'apollo-server-express'

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
      console.log(user.campus, user.department)
      return await prisma.users({
        where: {
          campus: user.campus,
          department: user.department,
          level: 3
        }
      })
    } catch (e) {
      throw new ValidationError(e.toString())
    }
  },
  answer: async (_, _args, { user }) => {
    try {
      return await prisma.$graphql(question, { id })
    } catch (e) {
      throw new ValidationError(e.toString())
    }
  },
  instances: async (_, args, { user }) => {
    try {
      let where
      if (user.level == 4) {
        where = {
          studID: user.id
        }
      } else if (user.level == 3) {
        where = {
          facultyID: user.id
        }
      } else if (user.level == 2) {
        let course = user.username.replace(/_/, ' ').split('-')[0]
        where = {
          course
        }
      } else if (user.level < 2) {
        where = {}
      } else {
        throw new AuthenticationError()
      }
      return await prisma.courseInstances({
        where
      })
    } catch (e) {
      throw new ValidationError(e.toString())
    }
  },
  instance: async (_, { id }) => {
    return await prisma.courseInstance({ id })
  },
  progress: async (_, _arg, { user }) => {
    return await prisma.courseInstances({
      where: {
        status: true,
        facultyID: user.id
      }
    })
  },
  acceptReject: async (_, _arg, { user }) => {
    if (user.level == 3) {
      let inst = await prisma.courseInstances({
        where: {
          status: false,
          facultyID: user.id
        }
      })
      return inst
    } else {
      throw new AuthenticationError()
    }
  },
  problems: async () => {
    return await prisma.problems()
  }
}
