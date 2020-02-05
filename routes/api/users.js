//point of this api folder is to create separate files for all of our routes
//for this file, intended to handle registering users, adding users

const express = require('express');
var router = express.Router();

// @route GET api/users
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('User route'));

//you need a token to access a specific route, verifies that the request has access to make a change such as registering a user
module.exports = router;
