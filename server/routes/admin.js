let router = require('express').Router()
let { Branch } = require('../models')
let { findIndex } = require('lodash')

router.post('/addBranch', function (req, res) {
  let newBranch = new Branch(req.body)
  newBranch.save(function (err, newB) {
    if (err) {
      return res.json({ success: false, err })
    }
    res.json({ success: true, branch: newB })
  })
})

router.post('/removeBranch', function (req, res) {
  let { name } = req.body
  Branch.remove({ name }, err => {
    if (!err) {
      res.json({ success: true, name })
    } else {
      res.json({ success: false, err })
    }
  })
})

router.get('/branches', async (req, res) => {
  try {
    let branches = await Branch.find()
    res.json({ success: true, branches })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/editBranch', async function (req, res) {
  let { name, newName } = req.body
  try {
    let branch = await Branch.updateOne(
      { name: name },
      { $set: { name: newName } }
    )
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
})
router.post('/addCourse', async function (req, res) {
  let { name, courseName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    branch.courses.push({ name: courseName, session: [] })
    await branch.save()
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/editCourse', async function (req, res) {
  let { name, courseName, newCourseName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.editCourse(courseName, newCourseName)
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/removeCourse', async function (req, res) {
  let { name, courseName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.removeCourse(courseName)
    res.json({ success: true, branch })
  } catch (err) {
    console.log(err)
    res.json({ success: false, err })
  }
})

router.post('/addSession', async function (req, res) {
  let { name, courseName, session } = req.body
  try {
    let branch = await Branch.findOne({
      name
    })
    let course = findIndex(branch.courses, { name: courseName })
    if (course != -1) {
      branch.courses[course].session.push(session)
      await branch.save()
      res.json({ success: true, branch })
    } else {
      res.json({ success: false }, err)
    }
  } catch (err) {
    console.log(err)
    res.json({ success: false, err: err })
  }
})

router.post('/editSession', async function (req, res) {
  let { name, courseName, session, newSesName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.editSession(courseName, session, newSesName)
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/removeSession', async function (req, res) {
  let { name, courseName, session } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.removeSession(courseName, session)
    res.json({ success: true, branch })
  } catch (err) {
    console.log(err)
    res.json({ success: false, err })
  }
})

module.exports = router
