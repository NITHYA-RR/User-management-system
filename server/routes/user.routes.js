const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

const {
  verifyToken,
  isAdmin
} = require('../middleware/auth.middleware');

const {
  updateValidation,
  handleValidationErrors
} = require('../middleware/validation.middleware');

const upload = require('../middleware/upload.middleware');

// 🔐 All routes must be authenticated + admin
router.use(verifyToken);  // Check login token
router.use(isAdmin);      // Check admin role

// GET /api/users → All users
router.get('/', getAllUsers);

// GET /api/users/:id → Get single user
router.get('/:id', getUserById);

// PUT /api/users/:id → Update user
router.put(
  '/:id',
  upload.single('profile_image'),
  updateValidation,
  handleValidationErrors,
  updateUser
);

// DELETE /api/users/:id → Delete user
router.delete('/:id', deleteUser);

module.exports = router;

