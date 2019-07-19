let production = process.env.NODE_ENV == 'production'
const dburl = production
  ? process.env.DBURL
  : 'mongodb+srv://root:root@testdb-6kjha.mongodb.net'
// const dburl = 'mongodb+srv://root:root@testdb-6kjha.mongodb.net'
const dbname = 'default_default'
export { dburl, dbname }
