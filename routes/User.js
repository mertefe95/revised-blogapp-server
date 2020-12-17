const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');
const { sendVerificationEmail, sendActivatedEmail } = require('../utils/account');
require('dotenv').config();


router.get('/', async (req, res) => {
  const users = await User.find({})

  if (!users) {
    return res
      .status(400)
      .send({ msg: "Users don't exist." })
  }

  return res
    .status(200)
    .send(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res
      .status(400)
      .send({ msg: "User does not exists." })
  }

  return res
    .status(200)
    .send(user)
})

router.post('/register', async (req, res) => {
  const { email, password, username } = req.body

  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

  if (!digit.test(password) || !upperLetter.test(password)) {
    return res
      .status(400)
      .send({ msg: "Please enter atleast one uppercase letter and one number in the password" })
  } else if (password.length < 8) {
    return res
      .status(400)
      .send({ msg: "Please enter a password that is higher than 8 characters." })
  }
  
  if (!validator.isEmail(email)) {
    return res  
      .status(400)
      .send({ msg: "Please enter a valid email format." })
  }

  try {
    let userExistsByUsername = await User.findOne({ username: username })
    let userExistsByEmail = await User.findOne({ email: email })

    if (userExistsByEmail) {
      return res
        .status(400)
        .send({ msg: "User with this email address exists. Please enter a different email address." })
    } else if (userExistsByUsername) {
      return res
        .status(400)
        .send({ msg: "This username is already being used. Please enter a different username." })
    }

    let salt = await bcrypt.genSalt(10)

    let hashedPassword = await bcrypt.hash(password, salt)

    let newUser = {
    username,
    email,
    password: hashedPassword
    }

  const user = new User(newUser)
  await user.save()

  sendVerificationEmail(user)

  return res
    .status(200)
    .send(user)


  } catch (err) {
    return res
      .status(500)
      .send({ msg: err.message })
  }
})

router.post('/login', async (req, res) => {
    try {

    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .send({ msg: "Please enter your email." })
    } else if (!password) {
      return res
        .status(400)
        .send({ msg: "Please enter your password. "})
    } else if (!validator.isEmail(email)) {
      return res
        .status(400)
        .send({ msg: "Please enter a valid email format."})
    }

    const user = findOne({ email: email })

    if (!user) {
      return res
        .status(400)
        .send({ msg: "User not found." })
    } 
  } catch (err) {
    return res
      .status(400)
      .send({ msg: err.message})
  }
})

router.get('/activation/:activationKey', async (req, res) => {
  const { activationKey } = req.params

  const user = await findOne({ activationKey })

  if (!activationKey) {
    return res
      .status(400)
      .send({ msg: "No token found."})
  } else if (!user) {
    return res
      .status(400)
      .send({ msg: "No user not found with this token. Empty or wrong token." })
  }
  
  user.activatedDateTime = Date.now()
  sendActivatedEmail(user)

  return res
    .status(200)
    .send({ msg: "User activated. You may proceed to log in. "})
})


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = User.findOne({ email, password })

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .send({ msg: "Please enter a valid email format." })
  } else if (!user) {
    return res
      .status(400)
      .send({ msg: "User not found. "})
  } else if (user.activatedDateTime === null) {
    return res
      .status(400)
      .send({ msg: "Please verify your email." })
  } 
  
  const comparePassword = bcrypt.compare(password, user.password)

  if (!comparePassword) {
    return res
      .status(400)
      .send({ msg: "Wrong or empty password"})
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN)

  return res
    .status(200)
    .send({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
})

router.put('/change-password', async (req, res) => {
  const { newPassword } = req.body;
  
  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

  if (!newPassword) {
    return res
      .status(400)
      .send({ msg: "Please enter a new password." })
  } else if (!digit.test(newPassword)) {
    return res
      .status(400)
      .send({ msg: "Please enter atleast a number with your password." })
  } else if (!upperLetter.test(newPassword)) {
    return res
      .status(400)
      .send({ msg: "Please enter at least one upper letter with your password. "})
  } 


})





router.delete('/:id', async (req, res) => {
  const deletedUser = User.findByIdAndDelete(req.params.id)

  if (!deletedUser) {
    return res
      .status(400)
      .send({ msg: "User not found." })
  }

  return res
    .status(200)
    .send(deletedUser)
})

module.exports = router;