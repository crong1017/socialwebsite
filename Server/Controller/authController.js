// 引入必要的模組
const bcrypt = require('bcrypt'); // 用於密碼雜湊
const jwt = require('jsonwebtoken'); // 用於生成 JWT 令牌
const User = require('../models/User'); // 假設你有一個 User 模型

// JWT 的密鑰
const JWT_SECRET = 'your_jwt_secret'; // 在正式環境中替換為安全的密鑰

// 註冊新使用者
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 檢查使用者是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '使用者名稱已存在' });
        }

        // 雜湊密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 創建新使用者
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: '使用者註冊成功' });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error });
    }
};

// 登入現有使用者
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 根據使用者名稱查找使用者
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '無效的使用者名稱或密碼' });
        }

        // 驗證密碼是否匹配
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '無效的使用者名稱或密碼' });
        }

        // 生成 JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: '登入成功', token });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error });
    }
};

// 檢查使用者是否已認證
exports.isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: '訪問被拒絕' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(400).json({ message: '無效的令牌' });
    }
};

// 登出（在前端清除令牌即可）
exports.logout = (req, res) => {
    res.json({ message: '登出成功' });
};
