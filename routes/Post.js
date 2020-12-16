const express = require('express');
const Post = require("../models/Post");
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Post = require('../models/Post');


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
  
  if (!email) {

  }
}
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

