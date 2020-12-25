const express = require('express');
const UserProfile = require('../models/UserProfile');
const router = express.Router();


router.get('/', async (req, res) => {
  const userProfiles = await UserProfile.find({})

  if (!userProfiles) {
    return res
      .status(400)
      .send({ msg:"No user profile has been found." })
  }

  return res
    .status(200)
    .send(userProfiles)
})

router.get('/:id', async (req, res) => {
  const userProfile = await UserProfile.findById(req.params.id)

  if (!userProfile) {
    return res
      .status(400)
      .send({ msg: "User profile has not been found." })
  }

  return res
    .status(200)
    .send(userProfile)
})


module.exports = router;


