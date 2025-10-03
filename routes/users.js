const {User, validate} = require('../model/user');

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');



// router.post('/', async (req, res) => {
    
//   const { error } = validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   let user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).json({ message: 'User already registered.' });
        
//             user = new User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 confirmPassword: req.body.confirmPassword
//             });

//             // using lodash to create new user
//         // user = new User(_.pick(req.body, ['name', 'email', 'password']));

// const salt = await bcrypt.genSalt(10);
// user.password = await bcrypt.hash(user.password, salt);

// await user.save();
// // res.send(_.pick(user, ['_id', 'name', 'email']))
// const token = user.generateAuthToken();
// res.header('x-auth-token', token).json(_.pick(user, ['_id', 'name', 'email', token]))
// });

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ message: 'User already registered.' });

  // only pick the fields we want to store
  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token
  });
});



module.exports = router