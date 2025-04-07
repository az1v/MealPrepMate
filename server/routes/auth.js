const express = require('express');
const { signUp, signIn } = require('../controllers/authController');

const router = express.Router();

// Sign up route
router.post('/signup', signUp);

// Login route
router.post('/signin', signIn);

module.exports = router;