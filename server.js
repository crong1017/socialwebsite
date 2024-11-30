require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const JAWSDB_URL = process.env.JAWSDB_URL;
const bodyParser = require('body-parser');
const session = require('express-session'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session 設置
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 若為 HTTPS，請設定為 true
}));

// 靜態資源
app.use('/css', express.static(path.join(__dirname, 'Client', 'css')));
app.use(express.static(path.join(__dirname, 'public')));

// 檢查 JAWSDB_URL 環境變數
if (!JAWSDB_URL) {
  console.error('請設置 JAWSDB_URL 環境變數');
  process.exit(1);
}

// 解析 JAWSDB_URL
const dbConfig = JAWSDB_URL.match(/mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/);
if (!dbConfig) {
  console.error('JAWSDB_URL 格式錯誤，請檢查環境變數');
  process.exit(1);
}

// 初始化資料庫連接
const db = mysql.createConnection({
  host: dbConfig[3],
  user: dbConfig[1],
  password: dbConfig[2],
  database: dbConfig[5],
  port: dbConfig[4],
});

// 測試資料庫連接
db.connect((err) => {
  if (err) {
    console.error('資料庫連接失敗:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL Database');
  }
});

// 使用 db.promise() 提供異步支持
const dbPromise = db.promise();

// 中間件設置
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, 'Client', 'css')));
app.use(express.urlencoded({ extended: true }));

// 根路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// 檢查使用者登入狀態
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ username: req.session.user.username });
    } else {
        res.status(401).send({ message: '未登入' });
    }
});

// 登入路由
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: '請填寫所有欄位' });
    }

    try {
        const [user] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 0) {
            return res.status(401).send({ message: '用戶不存在' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
            return res.status(401).send({ message: '密碼錯誤' });
        }

// 登入成功，將用戶 ID 存入 session
req.session.userId = user[0].id;
        res.status(200).send({ message: '登入成功' });
    } catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤' });
    }
});

// 登出 API
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('登出錯誤:', err);
            return res.status(500).send({ message: '登出失敗' });
        }
        res.clearCookie('connect.sid');
        res.status(200).send({ message: '登出成功' });
    });
});

// 用戶註冊
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).send({ message: '請填寫所有欄位' });
    }

    try {
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

        if (existingUser.length > 0) {
            return res.status(400).send({ message: '用戶名稱或電子郵件已存在' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);

        res.status(201).send({ message: '註冊成功' });
    } catch (error) {
        console.error('註冊錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤' });
    }
});

// 個人資料 API
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await db.promise().query('SELECT username, bio FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).send({ message: '用戶不存在' });
        }

        const [posts] = await db.promise().query('SELECT content, date FROM posts WHERE user_id = ?', [id]);
        res.status(200).send({ ...user[0], posts });
    } catch (error) {
        console.error('取得用戶資料錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤' });
    }
});

// 個人資料 API
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
        
    try {
        const [user] = await db.promise().query('SELECT username, bio FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).send({ message: '用戶不存在' });
        }
   
        const [posts] = await db.promise().query('SELECT content, date FROM posts WHERE user_id = ?', [id]);
        res.status(200).send({ ...user[0], posts });
    } catch (error) {
        console.error('取得用戶資料錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤' });
    }
});

// 檢查登入狀態的 API
app.get('/api/auth', (req, res) => {
    if (req.session.userId) {
        db.promise()
            .query('SELECT username FROM users WHERE id = ?', [req.session.userId])
            .then(([result]) => {
                if (result.length > 0) {
                    res.status(200).send({ isLoggedIn: true, username: result[0].username });
                } else {
                    res.status(404).send({ isLoggedIn: false });
                }
            })
            .catch((err) => {
                console.error('伺服器錯誤:', err);
                res.status(500).send({ isLoggedIn: false });
            });
    } else {
        res.status(200).send({ isLoggedIn: false });
    }
});

// 更新個人資料 API
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { bio } = req.body;
    
    try {
        await db.promise().query('UPDATE users SET bio = ? WHERE id = ?', [bio, id]);
        res.status(200).send({ message: '個人資料已更新' });
    } catch (error) {
        console.error('更新個人資料錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤' });
    }
});

// 新增貼文 API
app.post('/posts', async (req, res) => {
    const { content } = req.body;

    if (!req.session.userId) {
        return res.status(401).send({ message: '未登入，請先登入再發文' });
    }

    if (!content) {
        return res.status(400).send({ message: '請填寫貼文內容' });
    }

    try {
        await db.promise().query(
            'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, NOW())',
            [req.session.userId, content]
        );
        res.status(201).send({ message: '貼文已新增' });
    } catch (error) {
        console.error('新增貼文錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤，無法新增貼文' });
    }
});

// 貼文列表 API
app.get('/posts', async (req, res) => {
    try {
        const [posts] = await db.promise().query(
            `SELECT posts.id, posts.content, posts.likes_count, posts.created_at, users.username
             FROM posts
             JOIN users ON posts.user_id = users.id
             ORDER BY posts.created_at DESC`
        );
        res.status(200).send(posts);
    } catch (error) {
        console.error('取得貼文錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤，無法取得貼文列表' });
    }
});

// 獲取使用者本人貼文 API
app.get('/posts/user', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send({ message: '未登入' });
    }
     
    try {
        const [posts] = await db.promise().query(
            `SELECT posts.id, posts.content, posts.likes_count, posts.created_at, users.username, posts.user_id AS userId
             FROM posts
             JOIN users ON posts.user_id = users.id
             WHERE posts.user_id = ?
             ORDER BY posts.created_at DESC`,
            [req.session.userId]
        );
        res.status(200).json(posts);
    } catch (error) {
        console.error('取得使用者貼文錯誤:', error);
        res.status(500).send({ message: '伺服器錯誤' });
    }
});

// 刪除貼文 API
app.delete('/posts/:id', async (req, res) => {
    const postId = req.params.id;

    if (!req.session.userId) {
        return res.status(401).send({ message: '未登入，無法刪除貼文' });
    }

    try {
        // 確認貼文是否屬於目前的使用者
        const [post] = await db.promise().query(
            'SELECT * FROM posts WHERE id = ? AND user_id = ?',
            [postId, req.session.userId]
        );

        if (post.length === 0) {
            return res.status(403).send({ message: '無權刪除此貼文' });
        }

        // 刪除貼文
        await db.promise().query('DELETE FROM posts WHERE id = ?', [postId]);
        res.status(200).send({ message: '貼文已成功刪除' });
    } catch (error) {
        console.error('刪除貼文失敗:', error);
        res.status(500).send({ message: '伺服器錯誤，無法刪除貼文' });
    }
});

// 按讚 API
app.post('/posts/:id/like', async (req, res) => {
    const postId = req.params.id;
    const userId = req.session.userId;

    if (!userId) return res.status(401).send({ message: '未登入' });

    try {
        // 檢查是否已按讚
        const [existingLike] = await db.promise().query(
            'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
            [postId, userId]
        );

        if (existingLike.length > 0) {
            // 如果已按讚，取消讚
            await db.promise().query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            await db.promise().query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?', [postId]);
            return res.status(200).send({ message: '取消讚成功' });
        } else {
            // 如果未按讚，新增讚
            await db.promise().query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            await db.promise().query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?', [postId]);
            return res.status(200).send({ message: '按讚成功' });
        }
    } catch (error) {
        console.error('按讚失敗:', error);
        return res.status(500).send({ message: '伺服器錯誤' });
    }
});

// 獲取按讚數 API
app.get('/posts/:id/likes', async (req, res) => {
    const postId = req.params.id;

    try {
        const [rows] = await db.promise().query(
            'SELECT likes_count FROM posts WHERE id = ?',
            [postId]
        );

        if (rows.length === 0) {
            return res.status(404).send({ message: '貼文不存在' });
        }

        res.status(200).send({ likes_count: rows[0].likes_count });
    } catch (error) {
        console.error('獲取按讚數失敗:', error);
        res.status(500).send({ message: '伺服器錯誤' });
    }
});


// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



