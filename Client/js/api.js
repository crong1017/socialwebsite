const api = {
  // 用戶註冊
  register: async (username, email, password) => {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    return await response.json();  // 返回伺服器的回應
  },

  // 用戶登入
  login: async (username, password) => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  },

  // 創建新貼文
  createPost: async (userId, content) => {
    const response = await fetch('/createPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, content })
    });
    return await response.json();
  },

  // 取得所有貼文
  getPosts: async () => {
    const response = await fetch('/getPosts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // 按讚貼文
  likePost: async (postId) => {
    const response = await fetch(`/likePost/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // 新增留言
  addComment: async (postId, comment) => {
    const response = await fetch(`/addComment/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment })
    });
    return await response.json();
  },

  // 取得某個貼文的留言
  getComments: async (postId) => {
    const response = await fetch(`/getComments/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }
};

// 範例使用
(async () => {
  // 註冊
  const registerResult = await api.register('username', 'email@example.com', 'password123');
  console.log(registerResult);

  // 登入
  const loginResult = await api.login('username', 'password123');
  console.log(loginResult);

  // 創建貼文
  const createPostResult = await api.createPost(1, '這是我的新貼文');
  console.log(createPostResult);

  // 顯示所有貼文
  const posts = await api.getPosts();
  console.log(posts);

  // 按讚貼文
  const likePostResult = await api.likePost(1);
  console.log(likePostResult);

  // 新增留言
  const addCommentResult = await api.addComment(1, '這是我的留言');
  console.log(addCommentResult);

  // 顯示貼文的留言
  const comments = await api.getComments(1);
  console.log(comments);
})();
