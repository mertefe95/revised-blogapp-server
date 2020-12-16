const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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

router('/add', async (req, res) => {

})