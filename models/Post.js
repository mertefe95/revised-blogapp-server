const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const date = new Date(2)


console.log(date.getMonth)

const postSchema = new Schema({
  blogTitle: {
    type: String,
    required: true,
    validator (value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter a title for your blog post.')
      }
    }
  },
  blogText: {
    type: String,
    required: true,
    validator (value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter a text for your blog post.')
      }
    }
  },
  authorName: {
    type: String,
    required: true,
    validator (value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter an authorname.')
      }
    }
  },
  category: {
    type: String,
    required: true,
    validator (value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please choose your category.')
      }
    }
  },
  userId: {
    type: String,
    required: true,
    validator (value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter an userId.')
      }
    }
  },
  createdAt: {
  type: String,
  default: Date.now()
  }
},
 {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post