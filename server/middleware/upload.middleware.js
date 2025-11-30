const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder path
const uploadDir = path.join(__dirname, '../uploads');

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `profile-${unique}${path.extname(file.originalname)}`);
  }
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG allowed'), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});

// IMPORTANT: Export upload correctly
module.exports = upload;


