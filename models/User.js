//create schema
const mongoose = require('mongoose');

//this will take in an object with all the fields that I want
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    //seperate field for username, also ensure each username is unique
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);
