const pool = require("../config/db");

// Get all visitors
const getAllVisitors = async () => {
  const [rows] = await pool.query("SELECT * FROM visitor ORDER BY created_at DESC");
  return rows;
};

// Get visitor by ID
const getVisitorById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM visitor WHERE id = ?", [id]);
  return rows[0];
};

// Get visitor by email
const getVisitorByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM visitor WHERE email = ?", [email]);
  return rows[0];
};

// Create new visitor
const createVisitor = async (userData) => {
  const {
    name, email, phone, password,
    profile_image, address, state,
    city, country, pincode, role
  } = userData;

  const [result] = await pool.query(
    `INSERT INTO visitor
    (name, email, phone, password, profile_image, address, state, city, country, pincode, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, password, profile_image, address, state, city, country, pincode, role || "user"]
  );

  return result.insertId;
};

// Delete visitor
const deleteVisitor = async (id) => {
  const [result] = await pool.query("DELETE FROM visitor WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getAllVisitors,
  getVisitorById,
  getVisitorByEmail,
  createVisitor,
  deleteVisitor
};
