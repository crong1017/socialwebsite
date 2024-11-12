const db = require('../data/db'); // 資料庫連接
const bcrypt = require('bcrypt');

const User = {
  // 創建用戶
  createUser: async (username, email, password) => {
    try {
      // 加密密碼
      const hashedPassword = await bcrypt.hash(password, 10);

      // 插入用戶到資料庫
      const [result] = await db.promise().execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      return { success: true, userId: result.insertId };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  },

  // 根據用戶 ID 查找用戶
  findById: async (id) => {
    try {
      const [rows] = await db.promise().execute('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  },

  // 根據用戶名查找用戶
  findByUsername: async (username) => {
    try {
      const [rows] = await db.promise().execute('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  },

  // 根據電子郵件查找用戶
  findByEmail: async (email) => {
    try {
      const [rows] = await db.promise().execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  },

  // 驗證密碼
  validatePassword: async (inputPassword, storedPassword) => {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }
};

module.exports = User;
