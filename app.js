// 引入必要的模組
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// 初始化 Express 應用
const app = express();

// 中間件設置
app.use(cors()); // 允許跨域請求
app.use(bodyParser.json()); // 支援 JSON 請求
app.use(bodyParser.urlencoded({ extended: true })); // 支援 URL 編碼的表單數據

// 設置基本路由
app.get('/', (req, res) => {
  res.send('Welcome to the Social Platform API');
});

// 使用 auth 和 post 路由
app.use('/auth', authRoutes); // 處理登入、註冊等驗證功能
app.use('/posts', postRoutes); // 處理貼文功能

// 連接資料庫的設定 (示例)
const db = require('./data/db'); // 假設你有一個資料庫連接設定文件
db.connect(err => {
  if (err) {
    console.error('無法連接到資料庫:', err);
  } else {
    console.log('成功連接到資料庫');
  }
});

// 設定伺服器監聽的端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
