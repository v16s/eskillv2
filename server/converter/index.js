const { prisma } = require('../prisma')
const { promisify } = require('util')
const async = require('async')
const csv = require('csvtojson')
const fs = require('fs')

;(async () => {
  const path = './converter/question_dir'
  const files = await promisify(fs.readdir)(path)
  files.map(async filename => {
    parseFile.push({ filename, path })
  })
  await parseFile.drain()
  console.log('all done')
})()

const parseFile = async.queue(async ({ filename, path }, callback) => {
  const filepath = `${path}/${filename}`
  let [_branch, _code, name] = filename.split('+')
  const course = name.split('.')[0].replace(/_/g, ' ')
  const questions = await csv().fromFile(filepath)
  questions.map(question => {
    makeQuestion.push({ question, course })
  })
  await makeQuestion.drain()
  console.log(course, questions.length)
}, 1)

const makeQuestion = async.queue(async ({ question, course }, callback) => {
  const { Question: desc, Answer: ans, Explanation: exp } = question
  const options = {
    a: question['Option A'].slice(2),
    b: question['Option B'].slice(2),
    c: question['Option C'].slice(2),
    d: question['Option D'].slice(2)
  }
  const name = question['Question Name']
  await prisma
    .createQuestion({
      name,
      desc,
      ans,
      exp,
      course,
      opt: { create: options }
    })
    .catch(console.error)
}, 10)
