const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongoURI')

const connectDB = async () => {
  try {
    await mongoose.connect(db)
    console.log('mongodb connected')
  } catch (error) {
    console.error(error.message)
    //exite process with failure
    process.exit()
  }
}

module.exports = connectDB
