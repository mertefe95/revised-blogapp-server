const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail, sendActivatedEmail, sendForgotPassword } = require('../utils/account');
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

router.get('/forgot-password/:forgotToken', async (req, res) => {
  const {forgotToken} = req.params
  
  const userK = await User.findOne({ forgotToken })
  
  if (!forgotToken) {
      return res
          .status(400)
          .send({ msg: "Forgot token not found in the URL. Please enter your Forgot Token. "})
  } else if (!userK) {
      return res
          .status(400)
          .send({ msg: "No user found with the related forgot token. Empty or wrong token. "})
  }
  
  return res
      .status(200)
      .send({ msg: "Token valid, please enter your new password. "})
})

router.get('/activation/:activationKey', async (req, res) => {
  const { activationKey } = req.params

  if (!activationKey) {
      return res.status(400).send({ msg: "Activation token missing. " } )
  }

  const user = await User.findOne({ activationKey })

  if (!user) {
      return res.status(404).send({ msg: "User not found with the activation token. "})
  } else if (!user.activatedDateTime === null) {
      return res.status(404).send({ msg: "User already activated. "})
  }

  const dateNow = Date.now().toString()

  await User.updateOne(
      { activationKey },
      { activatedDateTime: dateNow, lastUpdated: dateNow }
  )
  
  await sendActivatedEmail(user)

  return res.status(200).send({ msg: "User succesfully activated. "})
})


router.post('/register', async (req, res) => {
  const { email, password, username, firstname, lastname } = req.body

  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

  if (!username || !email || !password || !firstname || !lastname) {
    return res
      .status(400)
      .send({ msg: "Please fill all the credentials." })
  }

  if (!validator.isEmail(email) || !email) {
    return res  
      .status(400)
      .send({ msg: "Please enter a valid email format." })
  }


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


    let newUserProfile = {
      firstname,
      lastname,
      _id: user.id
    }

    const userProfile = new UserProfile(newUserProfile)
    await userProfile.save()

  sendVerificationEmail(user)

  return res
    .status(200)
    .send({ msg: 'Successful registration. Please verify your email.' })


  } catch (err) {
    return res
      .status(500)
      .send({ msg: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body 

        if (!email || !password) {
            return res
                .status(400)
                .send({ msg: "Please fill the missing fields. "})
        }

        const user = await User.findOne({ email  })
        if (!user) {
            return res
                .status(400)
                .send({ msg: "An account with this email or username does not exists."})
        } else if (user && user.activatedDateTime === null) {
            return res
                .status(400)
                .send({ msg: "Please activate your account from the link we've sent to your email. "})
        } else if (user && user.activatedDateTime) {
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                return res
                    .status(400)
                    .send({ msg: "Wrong or empty password." })
            } else if (passwordCompare) {
                const token = jwt.sign(
                    {  id: user.id },
                    process.env.SECRET_TOKEN
                );
            
                return res
                    .status(200)
                    .json({ token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }})
            }
        }
} catch (err) {
    res.status(500).send({ msg: err.message })
}
})


router.post('/change-password', async (req, res) => {

  try {
      const { newPassword, forgotToken } = req.body
      const digit = /^(?=.*\d)/
      const upperLetter = /^(?=.*[A-Z])/

      if (!newPassword || !forgotToken) {
      return res
          .status(400)
          .send({ msg: "Please enter your new password and your forgot password key token."})
      } 
  
      const userK = await User.findOne({ forgotToken })

      if (!userK) {
      return res.status(400).send({
          msg: 'Token does not match. Enter the valid token.'
      })}

      if (newPassword && userK){
      if (!digit.test(newPassword) || !upperLetter.test(newPassword)) {
      return res.status(400).send({
          msg:
          'Please enter at least a number and an uppercase letter with your password.',
      })} else if (newPassword.length < 8) {
      return res.status(400).send({
          msg: 'Please enter a password that is at least 8 or more characters.',
      })} else if (digit.test(newPassword) && upperLetter.test(newPassword) && !(newPassword.length < 8) ) {


      let encNewPassword = ''
      let theNewSalt = await bcrypt.genSalt(10)
      encNewPassword = await bcrypt.hash(newPassword, theNewSalt)

      await userK.updateOne({ password: encNewPassword, forgotToken: null  })

      return res.status(200).send("Password has been successfully changed.")
      }
      }} catch (err) {
      return res.status(500).send({ msg: err.message })
      }
})

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body
      
  const user = await User.findOne({ email })
      
  try {
      if (!validator.isEmail(email) || !email) {
          return res
              .status(400)
              .send({ msg: "Please enter a valid email. "})
              } else if (!user) {
                  return res
                      .status(404)
                      .send({ msg: 'No account has been found related to that email. '})
              } else if (!user.forgotToken === null || !user.forgotToken === undefined) {
                  return res
                      .status(400)
                      .send({ msg: "Password change mail is already been sent. Please check your email."})
              } else if (user || user.forgotToken === null || user.forgotToken === undefined) {
                  
                  const forgotT = uuidv4()

                  await user.updateOne({ forgotToken: forgotT })
      
                  await sendForgotPassword(user, forgotT)
              
              return res
                  .status(200)
                  .send("Password change mail has been sent. Please check your email.")
              }} catch (err) {
              return res
                  .status(500)
                  .send({ msg: err.message })
              }
      })
      

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.SECRET_TOKEN)
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json({
      username: user.username,
      id: user._id
    })
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
})


router.delete('/:id', async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id)
  
      if (!user) {
          return res.status(404).send()
      }
  
      res
          .status(200)
          .send(user)
      } catch (e) {
      res.status(500).send(e)
      }
})




module.exports = router;