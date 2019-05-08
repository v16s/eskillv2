import { Schema, model } from 'mongoose'
const FileSchema = new Schema(
  {},
  { strict: false, collection: 'questions.files' }
)
export default model('File', FileSchema, 'questions.files')
