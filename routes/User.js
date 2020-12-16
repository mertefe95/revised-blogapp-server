const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { default: validator } = require('validator');
const { sendVerificationEmail } = require('../utils/account');
require('dotenv').config();


router('/', async (req, res) => {
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

router('/:id', async (req, res) => {
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

router.post('/add', async (req, res) => {
  const { email, password, username } = req.body

  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

  if (!digit.test(password)) {
    return res
      .status(400)
      .send({ msg: "Please enter a password that is including at least a number. " })
  } else if (!upperLetter.test(password)) {
    return res
      .status(400)
      .send({ msg: "Please enter at least one uppercase letter in the password" })
  } else if (!validator.isEmail(email)) {
    return res  
      .status(400)
      .send({ msg: "Please enter a valid email format." })
  }

  const salt = bcrypt.genSalt(10)

  const hashedPassword = bcrypt.hash(password, salt)

  let newUser = {
    username,
    email,
    hashedPassword
}

  const user = new User(newUser)

  user.save()

  sendVerificationEmail(user)

  return res
    .status(200)
    .send(user)
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