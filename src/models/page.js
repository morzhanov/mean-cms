const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Page = new Schema({
  title: String,
  url: {
    type: String,
    index: {unique: true}
  },
  contentHeader: String,
  contentFooter: String,
  posts: [String],
  menuIndex: Number,
  date: Date
})

module.exports = mongoose.model('Page', Page)
