// 引入認證模組 (auth.js) 和 API 模組 (api.js)
import auth from './auth.js';
import api from './api.js';

const main = {
  // 初始化應用
  init: async () => {
    // 檢查使用者是否已經登入
    const isLoggedIn = await main.checkLoginStatus();
    if (isLoggedIn) {
      main.loadPosts();  // 若登入，載入貼文
    } else {
      main.showLoginScreen();  // 若未登入，顯示登入頁面
    }
  },

  // 顯示登入頁面
  showLoginScreen: () => {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('post-section').style.display = 'none';
  },

  // 顯示發文頁面
  showPostScreen: () => {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('post-section').style.display = 'block';
  },

  // 檢查登入狀態
  checkLoginStatus: async () => {
    // 檢查 LocalStorage 是否有 auth_token
    return localStorage.getItem('auth_token') !== null;
  },

  // 處理登入
  login: async (username, password) => {
    const response = await auth.login(username, password);
    if (response.success) {
      alert('登入成功！');
      main.showPostScreen();  // 登入成功後顯示發文區
      main.loadPosts();  // 載入貼文
    } else {
      alert(response.message || '登入失敗');
    }
  },

  // 處理登出
  logout: async () => {
    const response = await auth.logout();
    if (response.success) {
      alert('登出成功！');
      main.showLoginScreen();  // 顯示登入頁面
    }
  },

  // 發佈新貼文
  createPost: async () => {
    const content = document.getElementById('post-content').value;
    if (content) {
      const response = await api.createPost(content);
      if (response.success) {
        alert('貼文發佈成功！');
        document.getElementById('post-content').value = '';  // 清空文本框
        main.loadPosts();  // 重新載入貼文
      } else {
        alert('貼文發佈失敗');
      }
    } else {
      alert('請填寫貼文內容');
    }
  },

  // 載入貼文
  loadPosts: async () => {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = ''; // 清空現有貼文
    const posts = await api.getPosts();  // 假設這個方法模擬載入貼文
    posts.forEach((post) => {
      const postCard = document.createElement('div');
      postCard.className = 'post-card';
      postCard.innerHTML = `
        <div class="post-content">
          <p>${post.content}</p>
          <span class="post-time">${post.time}</span>
        </div>
        <div class="interaction-buttons">
          <button onclick="main.likePost(${post.id})">👍 按讚</button>
          <button onclick="main.addComment(${post.id})">💬 留言</button>
        </div>
        <div class="comments-section" id="comments-${post.id}" style="display: none;">
          <textarea id="commentInput-${post.id}" placeholder="寫下留言..." rows="2"></textarea>
          <button onclick="main.submitComment(${post.id})">提交留言</button>
        </div>
      `;
      feedContainer.appendChild(postCard);
    });
  },

  // 模擬按讚功能
  likePost: async (postId) => {
    alert(`您對貼文 ${postId} 按讚！`);
    // 在此處理按讚邏輯（例如發送請求到後端）
  },

  // 顯示留言區
  addComment: async (postId) => {
    const commentSection = document.getElementById(`comments-${postId}`);
    commentSection.style.display = 'block';  // 顯示留言區
  },

  // 提交留言
  submitComment: async (postId) => {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const comment = commentInput.value;
    if (comment) {
      alert(`您對貼文 ${postId} 提交了留言：${comment}`);
      // 在此處理留言提交邏輯（例如發送請求到後端）
      commentInput.value = '';  // 清空留言框
    } else {
      alert('請輸入留言內容');
    }
  },
};

// 初始化應用
main.init();

