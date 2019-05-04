import { Router } from 'express'
import { Global, Branch } from '../models'
let router = Router()

router.get('/', (req, res) => {
  Global.findOne({ id: 0 }, (err, doc) => {
    console.log(doc)
    res.send(doc)
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

export default router
