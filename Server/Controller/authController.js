const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 使用環境變數設定 JWT 密鑰
const JWT_SECRET = process.env.JWT_SECRET || 'ac3893af177f54168484d5fb0372600e2c5f8b8292f022f4e280502e7e8297c29c8dfc833fa4778e49c632faac91c83de8a70bc3a4679365df68474dbf8e379a';

// 註冊
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 請求有效性檢查
        if (!username || !password) {
            return res.status(400).json({ message: '使用者名稱和密碼為必填' });
        }
        if (password.length > 72) {
            return res.status(400).json({ message: '密碼過長，請限制在 72 個字符以內' });
        }

        // 檢查是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '使用者名稱已存在' });
        }

        // 密碼加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 創建新用戶
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: '使用者註冊成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
    }
};

// 登入
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 檢查請求有效性
        if (!username || !password) {
            return res.status(400).json({ message: '使用者名稱和密碼為必填' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '無效的使用者名稱或密碼' });
        }

        // 驗證密碼
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '無效的使用者名稱或密碼' });
        }

        // 簽發 JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: '登入成功', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
    }
};

// 驗證中間層
exports.isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: '未提供有效的授權令牌' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: '無效的授權令牌' });
    }
};

// 登出
exports.logout = (req, res) => {
    res.json({ message: '登出成功' });
};
