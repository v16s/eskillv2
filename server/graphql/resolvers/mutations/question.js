import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { async } from 'q'
export default {
  addQuestion: async (
    parent,
    { course, name, desc, exp, Obj, ans, picture },
    { user, bucket }
  ) => {
    if (user.level < 1) {
      try {
        return new Promise(async (resolve, reject) => {
           if (!!picture) {
            const { createReadStream, filename } = await picture
            let { id } = await question
            let ar = filename.split('.')
            let ext = ar(ar.length - 1)
            let img = `${id}-${ext}`
            createReadStream()
              .pipe(bucket.openUploadStream(img))
              .on('finish', () => {
                console.log(user)
                resolve(user)
              })
          }
          return await prisma.createQuestionAdd({
            course,
            name,
            desc,
            exp,
            opt: { create: [Obj] },
            ans
          })
         
        })
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  removeQuestion: async (parent, { id }, { user }) => {
    if (user.level < 1) {
      try {
        return await prisma.deleteQuestionAdd({ id })
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
    {
      id,
      newCourse,
      newName,
      newDesc,
      newExp,
      update: updateMany,
      newAns,
      newPicture
    },
    { user }
  ) => {
    if (user.level < 1) {
      try {
        return await prisma.updateQuestionAdd({
          where: { id },
          data: {
            course: newCourse,
            name: newName,
            desc: newDesc,
            exp: newExp,
            opts: { updateMany },
            ans: newAns,
            picture: newPicture
          }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },
  questionTest: async (_, { picture }, { user, bucket }) => {
    const { createReadStream, filename } = await picture
    return new Promise((resolve, reject) => {
      createReadStream()
        .pipe(bucket.openUploadStream(filename))
        .on('finish', () => {
          console.log(user)
          resolve(user)
        })
    })
  }
}
