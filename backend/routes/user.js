const express = require('express')

const USER = require('../models/User.models')
const ACCOUNT = require('../models/Account.model')
const jwt = require('jsonwebtoken')
const { signupBody, signinBody, updateUserBody } = require('../BodyValidation')
const authMiddleware = require('../middleware/auth')
const router = express.Router()




router.post('/signup', async (req, res) => {
     try {
          const { success, error } = signupBody.safeParse(req.body)
          if (!success) {
               return res.status(411).json({
                    message: "Please check your inputs",
                    error: error
               })
          }
          const isUserExist = await USER.findOne({
               username: req.body.username
          })

          if (isUserExist) {
               return res.status(411).json({
                    message: "Email already taken"
               })
          }

          const user = await USER.create(req.body)
          const { username, firstname, lastname } = req.body
          if (user) {
               const userId = user._id;


               await ACCOUNT.create({
                    userId,
                    balance: 1 + Math.random() * 10000
               })
               const token = jwt.sign({
                    userId,
                    username,
                    firstname,
                    lastname
               }, process.env.SECRET_KEY)
               return res.json({
                    message: 'User created',
                    token
               })
          }
     } catch (error) {
          return res.status(500).send({
               message: error.message
          })
     }
})



router.post('/signin', async (req, res) => {
     try {
          const { success, error } = signinBody.safeParse(req.body)
          if (!success) {
               return res.status(411).json({
                    message: "Please check your inputs",
                    error: error
               })
          }

          const user = await USER.findOne({
               username:
                    req.body.username,
               password: req.body.password
          })

          if (user) {
               const { username, _id, firstname, lastname } = user
               const token = jwt.sign({
                    _id,
                    username,
                    firstname,
                    lastname
               }, process.env.SECRET_KEY)
               return res.json({
                    message: 'User signed in',
                    token
               })
          }
     } catch (error) {
          return res.status(500).json({
               message: error.message
          })
     }
})


router.put("/", authMiddleware, async (req, res) => {
     const { success } = updateUserBody.safeParse(req.body)
     if (!success) {
          res.status(411).json({
               message: "Error while updating information"
          })
     }

     await User.updateOne(req.body, {
          id: req.userId
     })

     res.json({
          message: "Updated successfully"
     })
})


router.get('/bulk', async (req, res) => {
     try {
          const filter = req.query.filter || "";
          console.log(filter)
          const users = await USER.find({
               $or: [{
                    firstname: {
                         "$regex": filter
                    }
               }, {
                    lastname: {
                         "$regex": filter
                    }
               }]
          })
          return res.json({
               user: users.map(user => ({
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    _id: user._id
               }))
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
})


module.exports = router