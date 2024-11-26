require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

// 中間件設置（用於解析 JSON 請求）
app.use(express.json());
   
// 設定基本路由
app.get('/', (req, res) => {
  res.send('Welcome to the Social Platform API');
});

// 設定伺服器監聽的端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// 設置 MySQL 資料庫連接
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 使 `db` 支援 Promise（異步操作）
const dbPromise = db.promise();

// 註冊用戶路由
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send({ message: 'Username, password, and email are required' });
}

  try {
    // 檢查用戶名是否已經存在
    const [usernameResults] = await dbPromise.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (usernameResults.length > 0) {
      return res.status(400).send({ message: 'Username already exists' });
    }
  
    // 檢查 email 是否已經存在
    const [emailResults] = await dbPromise.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (emailResults.length > 0) {
      return res.status(400).send({ message: 'Email already exists' });
    }
    
    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);
     
    // 儲存用戶資料
    await dbPromise.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in registration process:', error);
    res.status(500).send({ message: 'Error registering user', error: error.message });
  }
});
     
// 用戶登入路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
    
  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' });
  }
   
  try {
    // 查找用戶
    const [results] = await dbPromise.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length === 0) {
return res.status(400).send({ message: 'User does not exist' });
    }
    
    const user = results[0];
   
    // 比對密碼
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid password' });
       }

    // 生成 JWT 令牌
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error in login process:', error);
    res.status(500).send({ message: 'Error logging in' });
/Users/sarah/social-platform   }
});

// JWT 驗證中間件
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).send({ message: 'Access denied, token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid or expired token' });
    }

    req.user = user;  // 將用戶資料附加到請求中
    next();  // 呼叫下一個中間件或路由處理器
    });
};
  
// 貼文發表路由，這個路由被 JWT 中間件保護
app.post('/posts', authenticateToken, async (req, res) => {
  const { content } = req.body; 
  const userId = req.user.userId; // 從請求中獲取用戶資料

  if (!content) {
    return res.status(400).send({ message: 'Content is required' });
  }

  try {
    // 儲存貼文資料
    await dbPromise.execute('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, content]);

    res.status(201).send({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send({ message: 'Error creating post' });
  }
});
// 按讚功能
app.post('/posts/:postId/like', authenticateToken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.userId; // 從 JWT 中獲取用戶 ID

  try {
    // 檢查用戶是否已經對該貼文按過讚
    const [likeExists] = await dbPromise.execute('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
  
    if (likeExists.length > 0) {
      return res.status(400).send({ message: 'You have already liked this post' });
    }
  
    // 插入新的按讚記錄
    await dbPromise.execute('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]); 
    res.status(201).send({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).send({ message: 'Error liking post' });
  }
});
   
// 留言功能
app.post('/posts/:postId/comment', authenticateToken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.userId; // 從 JWT 中獲取用戶 ID
  const { content } = req.body;

  if (!content) {
    return res.status(400).send({ message: 'Content is required' });
  }
  
  try {
    // 儲存留言資料
    await dbPromise.execute('INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)', [userId, postId, content]);
    res.status(201).send({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).send({ message: 'Error creating comment' }); 
  } 
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




