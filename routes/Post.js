const express = require('express');
const Post = require("../models/Post");
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

