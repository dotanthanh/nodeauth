const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = new mongoose.Schema({
  local: {
    username: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    //email: String,
    name: String
  },
  google: {
    email: String,
    token: String,
    id: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    username: String,
    displayName: String
  }
})

userSchema.methods.generateHash = (password) =>{
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema)
