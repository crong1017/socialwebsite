const express = require('express');
const router = express.Router();
const db = require('../data/db'); // 引入數據庫連接
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 確保 JWT_SECRET 環境變數存在
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET environment variable!');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

// 註冊功能
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 請求有效性檢查
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // 密碼長度檢查
  if (password.length < 6 || password.length > 72) {
    return res.status(400).json({ message: 'Password must be between 6 and 72 characters long' });
  }

  try {
    // 檢查用戶名或郵箱是否已存在
    const [existingUsers] = await db.promise().execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用戶數據
    await db.promise().execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// 登入功能
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 請求有效性檢查
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 查詢用戶
    const [users] = await db.promise().execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // 驗證密碼
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 簽發 JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Failed to log in user' });
  }
});

// 簡單登出功能
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
