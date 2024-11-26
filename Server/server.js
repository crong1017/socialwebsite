require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

// 中間件設置
app.use(express.json());

// 檢查環境變數
if (!process.env.JWT_SECRET) {
  console.error('缺少 JWT_SECRET 環境變數，請配置 .env 文件！');
  process.exit(1);
}

// 資料庫連接池
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const dbPromise = db.promise();

// 測試資料庫連接
db.getConnection((err, connection) => {
  if (err) {
    console.error('資料庫連接失敗:', err.message);
  } else {
    console.log('成功連接至 MySQL 資料庫');
    connection.release();
  }
});

// 基本路由
app.get('/', (req, res) => {
  res.send('Welcome to the Social Platform API');
});

// 註冊路由
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send({ message: 'Username, password, and email are required' });
  }
  if (password.length < 6) {
    return res.status(400).send({ message: '密碼至少需要 6 個字符' });
  }

  try {
    const [existingUsers] = await dbPromise.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbPromise.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [
      username,
      hashedPassword,
      email,
    ]);

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).send({ message: 'Error registering user' });
  }
});

// 登入路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' });
  }

  try {
    const [users] = await dbPromise.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(400).send({ message: 'User does not exist' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });

    res.status(200).send({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).send({ message: 'Error logging in' });
  }
});

// 全局錯誤處理
app.use((err, req, res, next) => {
  console.error('未捕获的錯誤:', err.message);
  res.status(500).send({ message: '伺服器內部錯誤' });
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
