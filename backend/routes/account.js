const express = require('express')
const ACCOUNT = require('../models/Account.model')
const authMiddleware = require('../middleware/auth')
const { Mongoose } = require('mongoose')
const router = express.Router()


router.get('/balance', authMiddleware, async (req, res) => {
     try {
          const account = await ACCOUNT.findOne({
               userId: req.user.userId
          });

          res.json({
               balance: account.balance
          })
     } catch (error) {
          return res.status(500).json({
               message: error.message
          })
     }

})


router.post('/transfer', authMiddleware, async (req, res) => {
     try {
          const session = await Mongoose.startSession();
          session.startTransaction();
          const { amount, to } = req.body;
          // Fetch the accounts within the transaction
          const account = await ACCOUNT.findOne({ userId: req.userId }).session(session);

          if (!account || account.balance < amount) {
               await session.abortTransaction();
               return res.status(400).json({
                    message: "Insufficient balance"
               });
          }

          const toAccount = await ACCOUNT.findOne({ userId: to }).session(session);

          if (!toAccount) {
               await session.abortTransaction();
               return res.status(400).json({
                    message: "Invalid account"
               });
          }
          // Perform the transfer
          await ACCOUNT.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
          await ACCOUNT.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

          // Commit the transaction
          await session.commitTransaction();
          res.json({
               message: "Transfer successful"
          });
     } catch (error) {
          return res.status(500).json({
               message: error.message
          })
     }

})

module.exports = router