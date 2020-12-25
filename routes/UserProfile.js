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


router.put('/edit/:id', async (req, res) => {

  UserProfile.findOne({ _id: req.params.id }).then(userprofile => {
    userprofile.firstname = req.body.firstname;
    userprofile.lastname = req.body.lastname;
    userprofile.nationality = req.body.nationality;
    userprofile.pointOfInterests = req.body.pointOfInterests;

    userprofile 
        .save()
        .then(() => res.status(200).send({msg: "The user profile is updated successfully."}))
        .catch(err => res.status(400).send({ msg: "No match." }))
  })
  .catch(err => res.status(500).send({ msg: "Wrong Request" }))
})


module.exports = router;


