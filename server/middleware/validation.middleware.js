const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only alphabets'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone must be 10–15 digits')
    .isNumeric()
    .withMessage('Phone must contain only digits'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/(?=.*\d)/)
    .withMessage('Password must have at least one number'),

  body('address')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Address must not exceed 150 characters'),

  body('state').notEmpty().withMessage('State is required'),

  body('city').notEmpty().withMessage('City is required'),

  body('country').notEmpty().withMessage('Country is required'),

  body('pincode')
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage('Pincode must be 4–10 digits')
    .isNumeric()
    .withMessage('Pincode must contain only digits')
];

// Validation rules for user login
const loginValidation = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or phone is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for user update
const updateValidation = [
  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only alphabets'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone must be 10–15 digits')
    .isNumeric()
    .withMessage('Phone must contain only digits'),

  body('address')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Address must not exceed 150 characters'),

  body('state')
    .optional()
    .notEmpty()
    .withMessage('State cannot be empty'),

  body('city')
    .optional()
    .notEmpty()
    .withMessage('City cannot be empty'),

  body('country')
    .optional()
    .notEmpty()
    .withMessage('Country cannot be empty'),

  body('pincode')
    .optional()
    .isLength({ min: 4, max: 10 })
    .withMessage('Pincode must be 4–10 digits')
    .isNumeric()
    .withMessage('Pincode must contain only digits')
];

// Handles validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  updateValidation,
  handleValidationErrors
};

