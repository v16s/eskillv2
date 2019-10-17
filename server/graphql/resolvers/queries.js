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
  tokenExistence: async (_p, { token }, { user }) => {
    if (!user) {
      try {
        let recovery = await prisma.recovery({ token })
        if (recovery) {
          return true
        }
        return false
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('already logged in')
    }
  },
  global: async (parent, args, ctx, info) => {
    let global = await prisma.global({ id: 'global' })
    return { ...global, recovery: undefined }
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
  campuses: async (_, _2, { user }) => {
    if (user.level == 1) {
      let campuses = await prisma.campuses({
        where: {
          admin_id: user.username
        }
      })
      return campuses
    }
    return await prisma.campuses()
  },
  branches: async () => {
    return await prisma.branches()
  },
  courses: async (_, { where }, { user }) => {
    if (user.level >= 1) {
      console.log(user.campus, where)
      return await prisma.courses({
        where: {
          ...where,
          campus: user.campus
        }
      })
    }
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
  instances: async (_, { where: course }, { user }) => {
    try {
      let where
      if (course) {
        where = course
      } else {
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
          where = {
            campus: user.campus
          }
        } else if (user.level == 0) {
          where = {}
        } else {
          throw new AuthenticationError()
        }
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
  progress: async (_, { where: clientWhere }, { user }) => {
    let where

    if (user.level == 3) {
      where = {
        facultyID: user.id
      }
    } else if (user.level == 2) {
      let course = user.username.replace(/_/, ' ').split('-')[0]
      where = {
        course
      }
    } else if (user.level == 1) {
      where = {
        campus: user.campus
      }
    } else if (user.level == 0) {
      where = {}
    } else {
      throw new AuthenticationError()
    }

    return await prisma.courseInstances({
      where: {
        status: true,
        ...where,
        ...clientWhere
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
  problems: async (_, _arg, { user }) => {
    if (user.level == 3) {
      console.log(user.id)
      let problems = await prisma.problems({ where: { facultyID: user.id } })

      return problems
    }
    return await prisma.problems()
  }
}
