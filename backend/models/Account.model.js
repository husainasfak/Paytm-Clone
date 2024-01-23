const { Schema, model } = require('mongoose')


const AccountSchema = Schema({
     userId: {
          type: Schema.Types.ObjectId,
          ref: 'user',
          required: true
     },
     balance: {
          type: Number,
          required: true
     }
})


const Account = model('account', AccountSchema)

module.exports = Account;