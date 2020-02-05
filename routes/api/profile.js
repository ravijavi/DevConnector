//routes that have anything to do with profiles, fetching, adding, etc.

const express = require('express');
const router = express.Router();

//@route GET api/profile
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
