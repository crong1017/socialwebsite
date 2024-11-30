require('dotenv').config(); // 確保環境變數從 .env 文件加載
const mysql = require('mysql2');

// 檢查環境變數是否設置
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`缺少必要的環境變數: ${varName}`);
    process.exit(1); // 終止程式運行
  }
});

// 創建 MySQL 連線池
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // 等待可用連線
  connectionLimit: 10, // 最大連線數量
  queueLimit: 0, // 無限制的排隊數量
});

// 測試資料庫連接
db.getConnection((err, connection) => {
  if (err) {
    console.error('資料庫連接失敗:', err.message);
  } else {
    console.log('成功連接至 MySQL 資料庫');
    connection.release(); // 釋放測試連接
  }
});

// 將連線池的 Promise 包裝導出
module.exports = db.promise();
