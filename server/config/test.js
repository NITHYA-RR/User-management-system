const pool = require("./db");

async function testConnection() {
  try {
    console.log("⏳ Testing MySQL connection...");

    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL!");

    const [rows] = await conn.query("SELECT NOW() AS time");
    console.log("⏱️ Server Time:", rows[0].time);

    conn.release();
  } catch (err) {
    console.error("❌ MySQL Error:", err);
  }
}

testConnection();
