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
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('Database table "users" is initialized and ready.');

    // Thêm cột email nếu bảng đã tồn tại nhưng chưa có cột email
    const addEmailColumn = `
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;
        EXCEPTION
          WHEN duplicate_column THEN RAISE NOTICE 'Column email already exists in users table.';
        END;
      END $$;
    `;
    await pool.query(addEmailColumn);
  } catch (err) {
    console.error("Error initializing database table:", err.stack);
  }
};

// --- Middleware xác thực ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is healthy" });
});

// Route lấy thông tin user
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy thông tin user từ database (không lấy password)
    const queryText =
      "SELECT id, username, email, created_at FROM users WHERE id = $1";
    const result = await pool.query(queryText, [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile retrieved successfully",
      user: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Route đăng ký - ĐÃ SỬA
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required." });
    }

    // Kiểm tra định dạng email đơn giản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Dùng câu lệnh SQL để thêm user mới
    const queryText =
      "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email";
    const values = [username, email, hashedPassword];

    const result = await pool.query(queryText, values);
    const newUser = result.rows[0];

    console.log("User registered in DB:", newUser);
    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    // Mã lỗi '23505' của PostgreSQL là lỗi trùng lặp key (username hoặc email đã tồn tại)
    if (error.code === "23505") {
      const errorMessage = error.detail.includes("username")
        ? "Username already exists."
        : "Email already exists.";
      return res.status(409).json({ message: errorMessage });
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
      user: { id: user.id, username: user.username, email: user.email },
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
