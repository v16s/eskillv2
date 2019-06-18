import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { async } from 'q'
export default {
  addQuestion: async (
    _parent,
    { course, name, desc, exp, Obj, ans, picture },
    { user, bucket }
  ) => {
    if (user.level < 1) {
      try {
        let question = await prisma.createQuestion({
          course,
          name,
          desc,
          exp,
          opt: { create: Obj },
          ans
        })
        return new Promise(async (resolve, reject) => {
          try {
            if (picture) {
              const { createReadStream, filename } = await picture
              let ar = filename.split('.')
              let ext = ar[ar.length - 1]
              let img = `${question.id}.jpg`
              createReadStream()
                .pipe(bucket.openUploadStream(img))
                .on('finish', () => {
                  resolve(question)
                })
            } else {
              resolve(question)
            }
          } catch (e) {
            reject(new ValidationError(e.toString()))
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

  removeQuestion: async (parent, { id }, { user, bucket }) => {
    if (user.level < 1) {
      try {
        try {
          let image = bucket.find({ filename: `${id}.jpg` })
          let { _id } = await image.next()
          bucket.delete(_id)
        } catch (e) {}
        return await prisma.deleteQuestion({ id })
      } catch (e) {
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
  }
}
