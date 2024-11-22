const main = {
  init: () => {
    main.loadPosts(); // 預設載入貼文
    main.updateUserMenu(); // 更新右上角按鈕狀態
  },

  updateUserMenu: () => {
    const isLoggedIn = localStorage.getItem('auth_token') !== null;
    const userIcon = document.getElementById('userIcon');
    if (isLoggedIn) {
      userIcon.setAttribute('data-target', 'home.html');
    } else {
      userIcon.setAttribute('data-target', 'index.html');
    }
  },

  handleUserIconClick: () => {
    const isLoggedIn = localStorage.getItem('auth_token') !== null;
    if (isLoggedIn) {
      window.location.href = 'home.html';
    } else {
      document.getElementById('loginSection').style.display = 'block';
      document.getElementById('feedContainer').style.display = 'none';
    }
  },

  login: () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
      alert('請輸入帳號與密碼！');
      return;
    }

    if (email === "test@example.com" && password === "123456") {
      alert('登入成功！');
      localStorage.setItem('auth_token', 'fake-token');
      location.reload();
    } else {
      alert('登入失敗，請檢查您的帳號或密碼');
    }
  },

  loadPosts: () => {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';

    const posts = [
      { content: "這是第一篇貼文！", time: "2024-11-22" },
      { content: "這是第二篇貼文！", time: "2024-11-22" },
    ];

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

main.init();
window.handleUserIconClick = main.handleUserIconClick;
window.login = main.login;



