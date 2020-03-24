const router = require('express').Router();
const verify = require('../middleware/verifyToken');

// Import Model
const User = require('../model/User');

// Privare Route
router.get('/', verify, (req, res) => {
  res.send(req.user);
});

module.exports = router;
