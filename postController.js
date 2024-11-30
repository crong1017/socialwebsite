// 引入必要的模組
const Post = require('../models/Post'); // 假設你有一個 Post 模型

// 創建新貼文
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.userId; // 通常從已認證的使用者中獲取

        // 創建貼文
        const post = new Post({
            title,
            content,
            author: userId
        });

        await post.save();
        res.status(201).json({ message: '貼文創建成功', post });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error });
    }
};

// 取得所有貼文
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username'); // 獲取貼文並顯示作者名稱
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error });
    }
};

// 取得單個貼文
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        // 查找貼文
        const post = await Post.findById(postId).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: '貼文未找到' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error });
    }
};

// 更新貼文
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;
        const userId = req.userId;

        // 查找並更新貼文
        const post = await Post.findOneAndUpdate(
            { _id: postId, author: userId }, // 確保只有作者可以更新
            { title, content },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: '貼文未找到或無權限更新' });
        }

        res.json({ message: '貼文更新成功', post });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error });
    }
};

// 刪除貼文
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        // 查找並刪除貼文
        const post = await Post.findOneAndDelete({ _id: postId, author: userId });

        if (!post) {
            return res.status(404).json({ message: '貼文未找到或無權限刪除' });
        }

        res.json({ message: '貼文刪除成功' });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error });
    }
};
