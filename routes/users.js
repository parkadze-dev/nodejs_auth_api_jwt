const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Joi Validations
const { registerValidation, loginValidation } = require('../validation');

// Import Model
const User = require('../model/User');

// REGISTER
router.post('/register', async (req, res) => {
  // Validation of Data
  const { name, email, password } = req.body;
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists in database
  const emailExist = await User.findOne({ email: email });
  if (emailExist) return res.status(400).send('Email already exists');

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  try {
    // Save user in database
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  // Validation of Data
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email exists
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).send('Email does not exist');

  // Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).send('Invalid password');

  // Create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
  // Create header "auth-token" and pass the token
  res.header('auth-token', token).send(token);
});

module.exports = router;
