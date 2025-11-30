const jwt = require("jsonwebtoken");

// Verify Access Token Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Expect: Authorization: Bearer TOKEN
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Put user data into request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Login again.",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// Check Admin Role
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only.",
    });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
