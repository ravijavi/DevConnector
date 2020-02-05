//point of this api folder is to create separate files for all of our routes
//for this file, intended to handle registering users, adding users

const express = require('express');
var router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator'); //from docs: express-validator is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.
//Note: express-validators/check is deprecated

const User = require('../../models/User');
/*
// @route GET api/users
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('User route'));
*/

// @route POST api/users
//@desc register user
//@access Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please emter a password with 6 or more characters'
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //bad request
    }

    const { name, email, password } = req.body;

    try {
      //See if user exists, get users gravatar, encrypt password w/ bcrypt, and then finally return jsonwebtoken
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200', //default size
        r: 'pg', //appropriate images
        d: 'mm' //default image
      });

      user = new User({
        //creates new instance of user, does not save it
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10); //10 rounds recommended in documentation

      user.password = await bcrypt.hash(password, salt);

      await user.save(); //should put 'await' before anything that will return a promise

      res.send('User registered'); //return our jsonwebtoken
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }

    //console.log(req.body); //can send whatever data I want and access it with req.body
  }
);

//you need a token to access a specific route, verifies that the request has access to make a change such as registering a user
module.exports = router;
