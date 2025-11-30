const express = require('express');
const router = express.Router();

const { register, login, refreshToken } = require('../controllers/auth.controller');
const { 
  registerValidation, 
  loginValidation, 
  handleValidationErrors 
} = require('../middleware/validation.middleware');

const upload = require('../middleware/upload.middleware');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  '/register',
  upload.single('profile_image'),   // Make sure upload happens first
  registerValidation,
  handleValidationErrors,
  register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  login
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', refreshToken);

module.exports = router;

