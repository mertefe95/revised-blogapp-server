const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  activationKey: {
    type: String
    default: uuidv4
  },
  activatedDateTime: {
    type: Date
    default: null
  },
  forgoToken: {
    type: String,
    default: null
  },
   {
  timestamps: true
})


const User = mongoose.model('User', userSchema);

module.exports = User