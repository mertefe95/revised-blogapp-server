const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  blogTitle: {
    type: String,
    required: true
  },
  blogText: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post