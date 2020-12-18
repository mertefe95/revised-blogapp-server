const express = require('express');
const Post = require("../models/Post");
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

  if (!post) {
    return res
      .status(400)
      .send({ msg: "Post not found." })
  }

  return res
    .status(200)
    .send(post)
})


router.post('/add', async (req, res) => {
  const newPost = new Post({
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText,
    authorName: req.body.authorName,
    userId: req.body.userId
  })

  newPost.save()

  const createdAt = newPost.createdAt 

    .then(() => res.send(createdAt, { msg: "New blog post is created." }))
    .catch(err => res.status(400).send({ msg: err.message }))
})


router.put('/edit/:id', async (req, res) => {

  Post.findOne({ _id: req.params.id, userId: req.body.userId }).then(post => {
    post.blogTitle = req.body.blogTitle;
    post.blogText = req.body.blogText;

    post 
        .save()
        .then(() => res.status(200).send({msg: "The post is updated successfully."}))
        .catch(err => res.status(400).send({ msg: "No match." }))
  })
  .catch(err => res.status(500).send({ msg: "Wrong Request" }))
})

router.delete('/:id', async (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json('The POST is deleted.'))
    .catch(err => res.status(400).json({ msg: err.message }))
})

module.exports = router;