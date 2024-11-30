const express = require('express');
const router = express.Router();
const db = require('../data/db'); // 假設有個資料庫連接檔案

// 取得所有貼文
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.promise().query('SELECT * FROM posts');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }
});

// 創建新貼文
router.post('/', async (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content) {
    return res.status(400).json({ message: 'User ID and content are required' });
  }

  try {
    const [result] = await db.promise().execute(
      'INSERT INTO posts (user_id, content, time) VALUES (?, ?, NOW())',
      [user_id, content]
    );
    res.status(201).json({ success: true, post_id: result.insertId });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// 刪除貼文
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().execute('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// 更新貼文（如果需要編輯功能）
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const [result] = await db.promise().execute('UPDATE posts SET content = ? WHERE id = ?', [content, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ success: true, message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

module.exports = router;
