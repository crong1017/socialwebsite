const express = require('express');
const router = express.Router();
const db = require('../data/db'); // 假設你有一個資料庫連接文件
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkToken } = require('../middleware/authMiddleware'); // 假設你有一個檢查 token 的中介層

// 使用環境變數設定 JWT 密鑰
const JWT_SECRET = process.env.JWT_SECRET || 'ac3893af177f54168484d5fb0372600e2c5f8b8292f022f4e280502e7e8297c29c8dfc833fa4778e49c632faac91c83de8a70bc3a4679365df68474dbf8e379a';

// 用戶註冊
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // 檢查是否有重複的用戶名或電子郵件
    const [userResults] = await db.promise().execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (userResults.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 儲存新用戶
    await db.promise().execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// 用戶登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 查找用戶
    const [userResults] = await db.promise().execute('SELECT * FROM users WHERE email = ?', [email]);
    if (userResults.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = userResults[0];

    // 驗證密碼
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 創建 JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Failed to log in user' });
  }
});

// 用戶登出 (這裡簡單模擬登出，只需前端刪除 token 即可)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
