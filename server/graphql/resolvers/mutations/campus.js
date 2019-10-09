import { prisma } from 'prisma'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'util'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
export default {
  updateOwnCampus: async (parent, { name, newName }, { user }) => {
    if (user.level < 2 && user.username == `${name.replace(/ /g, '-')}-Admin`) {
      try {
        let { username } = await prisma.updateUser({
          where: { username: `${name.replace(/ /g, '-')}-Admin` },
          data: {
            username: `${newName.replace(/ /g, '-')}-Admin`,
            name: `${newName} Admin`,
            campus: newName
          }
        })
        return await prisma.updateCampus({
          where: { name },
          data: { name: newName }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  campusAddCourse: async (parent, { name, branch }, { user }) => {
    if (user.level == 1) {
      try {
        let salt = await promisify(bcrypt.genSalt)(10)
        let hash = await promisify(bcrypt.hash)('password', salt, null)
        let branches = await prisma.branches({ where: { name: branch } })
        if (branches.length == 0) {
          await prisma.createBranch({ name: branch })
        }
        let identity = `${name}-${branch}-${user.username
          .split('-')[0]
          .toLowerCase()}`
        let { username } = await prisma.createUser({
          username: `${identity.replace(/ /g, '_')}-coordinator`,
          password: hash,
          name: `${identity} Coordinator`,
          campus: user.campus,
          email: '',
          level: 2
        })
        return await prisma.createCourse({
          name,
          coordinator_id: username,
          branch,
          campus: user.campus,
          automated: false
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  campusRemoveCourse: async (parent, { name }, { user }) => {
    if (user.level == 1) {
      try {
        let courses = await prisma.courses({
          where: { name, campus: user.campus }
        })
        let { coordinator_id, branch } = courses[0]
        let coursesBranch = await prisma.courses({ where: { branch } })
        if (coursesBranch.length == 1) {
          await prisma.deleteBranch({ name: branch })
        }
        await prisma.deleteUser({ username: coordinator_id })
        await prisma.deleteManyCourses({ name, campus: user.campus })
        return courses[0]
      } catch (e) {
        console.log(e)
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  campusUpdateCourse: async (
    parent,
    { name, newName, branch, newBranch },
    { user }
  ) => {
    if (user.level == 1) {
      try {
        let courses = await prisma.courses({ where: { branch } })
        if (courses.length == 1) {
          await prisma.deleteBranch({ name: branch })
        }
        let branches = await prisma.branches({ where: { name: newBranch } })
        if (branches.length == 0) {
          await prisma.createBranch({ name: newBranch })
        }
        let course = await prisma.courses({
          where: { campus: user.campus, name, branch }
        })
        course = course[0]
        let identity = course.coordinator_id
        let iden_raw = identity.split('-').slice(0, -1)
        iden_raw[0] = newName
        iden_raw[1] = newBranch
        let iden = iden_raw.join('-')
        await prisma.updateUser({
          where: { username: identity },
          data: {
            username: course.coordinator_id,
            name: `${iden} Coordinator`
          }
        })
        await prisma.updateManyCourses({
          where: { name, campus: user.campus },
          data: { name: newName, branch: newBranch }
        })
        return course
      } catch (e) {
        throw new ValidationError(e.toString())
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  adminAddDepartment: async (parent, { tag, name }, { user }) => {
    if (
      (user.level == 1 &&
        user.username == `${name.replace(/ /g, '-')}-Admin`) ||
      user.level < 1
    ) {
      try {
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              create: [tag]
            }
          }
        })
      } catch (e) {
        console.log(e)
        throw new ValidationError(e)
      }
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  },

  adminRemoveDepartment: async (parent, { id, name }, { user }) => {
    if (
      (user.level == 1 &&
        user.username == `${name.replace(/ /g, '-')}-Admin`) ||
      user.level < 1
    ) {
      try {
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              deleteMany: { id }
            }
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

  adminUpdateDepartment: async (parent, { id, name, tag }, { user }) => {
    if (
      (user.level == 1 &&
        user.username == `${name.replace(/ /g, '-')}-Admin`) ||
      user.level < 1
    ) {
      try {
        await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              deleteMany: { id }
            }
          }
        })
        return await prisma.updateCampus({
          where: { name },
          data: {
            departments: {
              create: [tag]
            }
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
