const jsonfile=require("./questions.json");
const {prisma} = require('./prisma')
const mapthru = async (index) => {
  let length = jsonfile.length
  let f = jsonfile[index]
    let objf = {
  course: f.topic.name,
  name: f.qname,
  desc: f.qdef,
  exp: f.hints,
  ans: f.answer
  }
  
 let options = {
      a: f.options.a.slice(2),
      b: f.options.b.slice(2),
      c: f.options.c.slice(2),
      d: f.options.d.slice(2)
  }
let q = await prisma.createQuestion({...objf, opt: {create: options}})
console.log(q)
  
}
mapthru(31159)