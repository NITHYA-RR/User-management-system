const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Generate Access + Refresh tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1h",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });

  return { accessToken, refreshToken };
};

// ------------------------------
// REGISTER
// ------------------------------
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      state,
      city,
      country,
      pincode,
    } = req.body;

    // Check Email Exists
    const [emailExists] = await pool.execute(
      "SELECT * FROM visitor WHERE email = ?",
      [email]
    );

    if (emailExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check Phone Exists
    const [phoneExists] = await pool.execute(
      "SELECT * FROM visitor WHERE phone = ?",
      [phone]
    );

    if (phoneExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Profile Image
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    // Insert User
    const [result] = await pool.execute(
      `INSERT INTO visitor 
      (name, email, phone, password, profile_image, address, state, city, country, pincode) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        hashedPassword,
        profile_image,
        address || null,
        state,
        city,
        country,
        pincode,
      ]
    );

    // Get inserted user
    const [newUserData] = await pool.execute(
      "SELECT id, name, email, phone, role FROM visitor WHERE id = ?",
      [result.insertId]
    );

    const newUser = newUserData[0];

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: newUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ------------------------------
// LOGIN
// ------------------------------
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // email or phone

    // Find User (email or phone)
    const [users] = await pool.execute(
      "SELECT * FROM visitor WHERE email = ? OR phone = ?",
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    const user = users[0];

    // Compare Password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Hide password
    delete user.password;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ------------------------------
// REFRESH TOKEN
// ------------------------------
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Get user from DB
    const [users] = await pool.execute(
      "SELECT id, name, email, phone, role FROM visitor WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // Generate New Tokens
    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};
