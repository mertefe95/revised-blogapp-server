const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    validator(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter your username.')
      }
    }
  },
  email: {
    type: String,
    required: true,
    validator(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter your email.')
      }
    }
  },
  password: {
    type: String,
    required: true,
    validator(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter your password.')
      }
    }
  },
  activationKey: {
    type: String,
    default: uuidv4
  },
  activatedDateTime: {
    type: Date,
    default: null
  },
  forgotToken: {
    type: String,
    default: null
  }},
  {
  timestamps: true
})


const User = mongoose.model('User', userSchema);

module.exports = User