require('dotenv').config();
const express = require('express');
const app = express();

// 中間件設置（如果有需要可以加入更多中間件）
app.use(express.json()); // 用於解析 JSON 請求

// 設定基本路由
app.get('/', (req, res) => {
  res.send('Welcome to the Social Platform API');
});

// 設定伺服器監聽的端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const mysql = require('mysql2');

// 設置 MySQL 資料庫連接
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 連接到資料庫
db.connect((err) => {
  if (err) {
    console.error('資料庫連接失敗:', err);
  } else {
    console.log('Connected to MySQL Database');
  }
});

app.set('db', db); // 可選：將 db 設置到 app 物件中，以便於在其他路由中使用

