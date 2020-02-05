//handle getting a json web token for authentication

const express = require('express');
var router = express.Router();

// @route GET api/auth
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;
