const db = require('../data/db'); // 資料庫連接

const Post = {
  // 創建貼文
  createPost: async (userId, content) => {
    try {
      const [result] = await db.promise().execute(
        'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, NOW())',
        [userId, content]
      );
      return { success: true, postId: result.insertId };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取所有貼文
  getAllPosts: async () => {
    try {
      const [rows] = await db.promise().execute('SELECT * FROM posts ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error retrieving posts:', error);
      return [];
    }
  },

  // 根據貼文 ID 獲取單一貼文
  getPostById: async (postId) => {
    try {
      const [rows] = await db.promise().execute('SELECT * FROM posts WHERE id = ?', [postId]);
      return rows[0];
    } catch (error) {
      console.error('Error retrieving post by ID:', error);
      return null;
    }
  },

  // 根據用戶 ID 獲取貼文
  getPostsByUserId: async (userId) => {
    try {
      const [rows] = await db.promise().execute('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      return rows;
    } catch (error) {
      console.error('Error retrieving posts by user ID:', error);
      return [];
    }
  },

  // 刪除貼文
  deletePost: async (postId) => {
    try {
      await db.promise().execute('DELETE FROM posts WHERE id = ?', [postId]);
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = Post;
