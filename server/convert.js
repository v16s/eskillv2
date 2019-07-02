const csv=require("csvtojson");
const {prisma} = require('./prisma')
async function convert() {
 const jsonfile = await csv().fromFile('./server/questions.csv')
 jsonfile.map(async f => {
     let str = f.number.slice(7, f.number.length - 2)
let objf = {
  course: str,
  name: f.field13,
  desc: f.field15,
  exp: f.field14,
  ans: f.options
  }
  
 let options = {
      a: f.qname.slice(8, f.qname.length),
      b: f.qdef.slice(6),
      c: f.hints.slice(6),
      d: f.__v.slice(6, f.__v.length - 2)
  }
let q = await prisma.createQuestion({...objf, opt: {create: options}})
console.log(q)
 })

}
convert()