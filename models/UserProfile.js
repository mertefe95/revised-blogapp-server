const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  firstname: {
    type: String,
    required: 0
  },
  lastname: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    default: "Currently Empty. Please adjust for something new."
  },
  pointOfInterests: {
    type: String,
    default: "Currently Empty. Please adjust for something new."
  }
}, {
  timestamps: true
})

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;