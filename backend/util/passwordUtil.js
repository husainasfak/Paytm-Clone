const bcrypt = require('bcrypt');
const hashedPassword = async (password) => {
     const saltRounds = 10
     try {
          bcrypt.hash(password, saltRounds, function (err, hash) {
               return hash;
          });
     } catch (error) {
          return error.message
     }
}


const comparePassword = async (password) => {
     bcrypt.compare(password, hash, function (err, result) {
          return result
     });
}

module.exports = {
     hashedPassword,
     comparePassword
}