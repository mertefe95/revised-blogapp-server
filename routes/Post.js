const express = require('express');
const Post = require("../models/Post");
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Post = require('../models/Post');
const { default: validator } = require('validator');
const { sendVerificationEmail } = require('../utils/account');


router.get('/', async (req, res) => {
    const posts = await Post.find({})

    if (!posts) {
      return res
        .status(400)
        .send({ msg: "No post existing. "})
    }

    return res
      .status(200)
      .send(posts)
})

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    return res
      .status(400)
      .send({ msg: "User not found." })
  }

  return res
    .status(200)
    .send(post)
})


router.post('/add', async (req, res) => {
  const { email, username, password } = req.body
  
  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

  if (digit.test(password)) {
    return res
      .status(400)
      .send({ msg: "Please write a password that is containing a number."})
  } else if (upperLetter.test(password)) {
    return res  
      .status(400)
      .send({ msg: "Please include at least one uppercase letter in your password. "})
  } else if (!validator.isEmail(email)) {
    return res
      .status(400)
      .send({ "Please enter a valid email. "})
  }

  let salt = bcrypt.genSalt(10)
  const hashPassword = bcrypt.hash(password, salt);

  let newUser = {
    username,
    email,
    hashPassword
  }

  const user = new User(newUser)
  user.save()
  sendVerificationEmail(user)

  return res
    .status(200)
    .send({ msg: "User registration succesful. Please verify your email. "})
})


router.put('/edit', async (req, res) => {

})

router.delete('/:id', async (req, res) => {
  const post = Post.findByIdAndDelete(req.params.id)

  if (!post) {
    return res
      .status(400)
      .send({ msg: "User does not exists. "})
  }

  return res
    .status(200)
    .send(post)
})

