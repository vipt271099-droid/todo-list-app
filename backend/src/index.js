// Import các thư viện cần thiết
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Tải các biến môi trường từ file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your_default_jwt_secret";
const SALT_ROUNDS = 10;

// Middlewares
app.use(cors());
app.use(express.json()); // Cho phép server đọc JSON từ request body

// --- Cấu hình kết nối Database (Render PostgreSQL) ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Hàm tự động tạo bảng 'users' nếu chưa có khi server khởi động
const initializeDatabase = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('Database table "users" is initialized and ready.');
  } catch (err) {
    console.error("Error initializing database table:", err.stack);
  }
};

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is healthy" });
});

// Route đăng ký - ĐÃ SỬA
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Dùng câu lệnh SQL để thêm user mới
    const queryText =
      "INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username";
    const values = [username, hashedPassword];

    const result = await pool.query(queryText, values);
    const newUser = result.rows[0];

    console.log("User registered in DB:", newUser);
    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    // Mã lỗi '23505' của PostgreSQL là lỗi trùng lặp key (username đã tồn tại)
    if (error.code === "23505") {
      return res.status(409).json({ message: "User already exists." });
    }
    console.error("Register Error:", error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Route đăng nhập - ĐÃ SỬA
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user trong database
    const queryText = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(queryText, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Tạo token nếu mật khẩu khớp
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login Error:", error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  // Gọi hàm khởi tạo DB khi server bắt đầu chạy
  initializeDatabase();
});
