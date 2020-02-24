//routes that have anything to do with profiles, fetching, adding, etc.

const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

/*
//@route GET api/profile
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('Profile route'));
*/

//@route GET api/profile/me
//@desc Get current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/profile
//@desc Create or update user profile
//@access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim()); //',' is the delimiter, map function will take care of inconsistency of spaces
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // console.log(profileFields.social.twitter);

    // res.send('Hello World');

    try {
      let profile = Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route Get api/profile
//@desc get all profiles
//@access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']); //populate from user collection
    res.json(profiles); //send along the profiles that we get
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route Delete api/profile
//@desc Delete profile, user, and posts
//@access Private
router.delete('/', auth, async (req, res) => {
  try {
    //remove the profile
    await Profile.findOneAndRemove({ user: req.user.id }); //no variable needed for deletion

    //this will remove the user
    await Profile.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User successfully deleted' }); //send along the profiles that we get
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route Get api/profile/user/:user_id
//@desc Get profile by user ID
//@access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']); //populate from user collection

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile); //send along the profiles that we get
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route PUT api/profile/experience
//@desc Add profile experience
//@access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body; //destructuring and pulling all the above data from req.body

    const newExp = {
      //this will deal with the data that the user submits and assigns the info from req
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp); //unshift will ensure the most recent additions appear first

      await profile.save();

      res.json(profile); //will come back into play with the front end later on
      //Even though it's en embedded array and not its own document in the database, it will still have its own unique id
      //Can have this structure in one collection rather than having relational stuff and tables, one of the advantages of mongodb
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route DELETE api/profile/experience/:exp_id
//@desc Delete experience from profile
//@access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); //getting profile of the user

    //Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1); //getting the index and splicing it out

    await profile.save(); //save the new, appended data

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route PUT api/profile/education
//@desc Add profile education
//@access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of Study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body; //destructuring and pulling all the above data from req.body

    const newEdu = {
      //this will deal with the data that the user submits and assigns the info from req
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu); //unshift will ensure the most recent additions appear first

      await profile.save();

      res.json(profile); //will come back into play with the front end later on
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route DELETE api/profile/education/:edu_id
//@desc Delete education from profile
//@access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); //getting profile of the user

    //Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1); //getting the index and splicing it out

    await profile.save(); //save the new, appended data

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route GET api/profile/github/:username
//@desc Get user repos from Github
//@access Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body)); //body is a regular string w/ escape quotes, so has to be wrapped in json function
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
