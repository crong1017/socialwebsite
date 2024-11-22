// 引入認證模組 (auth.js) 和 API 模組 (api.js)
import auth from './auth.js';
import api from './api.js';

const main = {
  // 初始化應用
  init: async () => {
    main.loadPosts(); // 預設載入貼文
    main.updateUserMenu(); // 更新右上角按鈕狀態
  },

  // 更新右上角按鈕狀態
  updateUserMenu: () => {
    const isLoggedIn = localStorage.getItem('auth_token') !== null;
    const userIcon = document.getElementById('userIcon');
    if (isLoggedIn) {
      userIcon.setAttribute('data-target', 'home.html'); // 登入跳轉至個人頁面
    } else {
      userIcon.setAttribute('data-target', 'index.html'); // 未登入跳轉至登入表單
    }
  },

  // 處理右上角按鈕點擊
  handleUserIconClick: () => {
    const target = document.getElementById('userIcon').getAttribute('data-target');
    if (target === 'index.html') {
      document.getElementById('loginSection').style.display = 'block'; // 顯示登入表單
    } else {
      window.location.href = target; // 跳轉到個人頁面
    }
  },

  // 處理登入
  login: async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
      alert('請輸入帳號與密碼！');
      return;
    }

    const response = await auth.login(email, password); // 假設 auth.login 處理登入邏輯
    if (response.success) {
      alert('登入成功！');
      localStorage.setItem('auth_token', response.token);
      location.reload(); // 刷新頁面
    } else {
      alert(response.message || '登入失敗');
    }
  },

  // 載入貼文
  loadPosts: async () => {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = ''; // 清空貼文
    const posts = await api.getPosts(); // 假設從 API 獲取貼文
    posts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.className = 'post-card';
      postCard.innerHTML = `
        <div class="post-content">
          <p>${post.content}</p>
          <span class="post-time">${post.time}</span>
        </div>
      `;
      feedContainer.appendChild(postCard);
    });
  }
};

// 初始化應用
main.init();
window.handleUserIconClick = main.handleUserIconClick;
window.login = main.login;


