const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/User');
const postRoute = require('./routes/Post');
const UserProfile = require('./routes/UserProfile');
const cors = require('cors');
require('dotenv').config();

const app = express();
asdas
app.use(cors());
app.use(express.json());
app.use('/users', userRoute);
app.use('/posts', postRoute);
app.use('/userprofiles', UserProfile);

const PORT = process.env.PORT || 8080;
const connection = mongoose.connection

connection.once('open', () => {
  console.log('MongoDB connection has been established.')
})

const uri = process.env.ATLAS_URI

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))