const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// ------------------------------
// GET ALL USERS
// ------------------------------
exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let users;

    if (search) {
      const searchTerm = `%${search}%`;
      const [rows] = await pool.execute(
        `SELECT id, name, email, phone, role, profile_image, address, state, city, country, pincode, created_at, updated_at 
         FROM visitor 
         WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR state LIKE ? OR city LIKE ?`,
        [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
      );
      users = rows;
    } else {
      const [rows] = await pool.execute(
        `SELECT id, name, email, phone, role, profile_image, address, state, city, country, pincode, created_at, updated_at 
         FROM visitor 
         ORDER BY created_at DESC`
      );
      users = rows;
    }

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

// ------------------------------
// GET USER BY ID
// ------------------------------
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT id, name, email, phone, role, profile_image, address, state, city, country, pincode, created_at, updated_at 
       FROM visitor WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User retrieved successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};

// ------------------------------
// UPDATE USER
// ------------------------------
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const [existingUserRows] = await pool.execute(
      `SELECT * FROM visitor WHERE id = ?`,
      [id]
    );
    if (existingUserRows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const existingUser = existingUserRows[0];

    // Check email duplication
    if (updateData.email && updateData.email !== existingUser.email) {
      const [emailExists] = await pool.execute(
        `SELECT id FROM visitor WHERE email = ? AND id != ?`,
        [updateData.email, id]
      );
      if (emailExists.length > 0) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
    }

    // Check phone duplication
    if (updateData.phone && updateData.phone !== existingUser.phone) {
      const [phoneExists] = await pool.execute(
        `SELECT id FROM visitor WHERE phone = ? AND id != ?`,
        [updateData.phone, id]
      );
      if (phoneExists.length > 0) {
        return res.status(409).json({ success: false, message: "Phone number already in use" });
      }
    }

    // Hash password if updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Handle profile image update
    if (req.file) {
      if (existingUser.profile_image) {
        const oldImagePath = path.join(__dirname, "..", existingUser.profile_image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updateData.profile_image = `/uploads/${req.file.filename}`;
    }

    // Build update query dynamically
    const fields = [];
    const values = [];
    for (const key in updateData) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }
    values.push(id);

    await pool.execute(
      `UPDATE visitor SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Return updated user
    const [updatedRows] = await pool.execute(
      `SELECT id, name, email, phone, role, profile_image, address, state, city, country, pincode, created_at, updated_at 
       FROM visitor WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// ------------------------------
// DELETE USER
// ------------------------------
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [userRows] = await pool.execute(`SELECT * FROM visitor WHERE id = ?`, [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const user = userRows[0];

    // Prevent self-delete (if you have auth middleware)
    if (req.user && user.id === req.user.id) {
      return res.status(403).json({ success: false, message: "You cannot delete your own account" });
    }

    // Delete profile image
    if (user.profile_image) {
      const imagePath = path.join(__dirname, "..", user.profile_image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await pool.execute(`DELETE FROM visitor WHERE id = ?`, [id]);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

