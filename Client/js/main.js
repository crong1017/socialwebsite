const main = {
  init: () => {
    main.showGuide(); // 初次進入顯示引導
    main.loadPosts(); // 載入貼文
    main.updateUserMenu(); // 更新右上角按鈕狀態
  },

  // 檢查是否為首次進入並顯示引導
  showGuide: () => {
    const isFirstVisit = localStorage.getItem('firstVisit') === null;

    if (isFirstVisit) {
      // 顯示引導畫面
      const overlay = document.getElementById('overlay');
      if (overlay) {
        overlay.style.display = 'flex'; // 顯示引導提示
      }

      // 記錄用戶已經看過引導
      localStorage.setItem('firstVisit', 'no');
    } else {
      // 如果不是首次進入，直接顯示貼文
      main.showMainScreen();
    }
  },

  // 顯示主畫面
  showMainScreen: () => {
    const feedContainer = document.getElementById('feedContainer');
    if (feedContainer) {
      feedContainer.style.display = 'block'; // 顯示貼文區
    }
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none'; // 確保引導畫面被隱藏
    }
  },

  // 更新右上角按鈕狀態
  updateUserMenu: () => {
    const isLoggedIn = localStorage.getItem('auth_token') !== null;
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
      if (isLoggedIn) {
        userIcon.setAttribute('data-target', 'home.html');
      } else {
        userIcon.setAttribute('data-target', 'register.html');
      }
    }
  },

  // 處理右上角按鈕點擊
  handleUserIconClick: () => {
    const isLoggedIn = localStorage.getItem('auth_token') !== null;
    if (isLoggedIn) {
      window.location.href = 'home.html'; // 跳轉至主頁
    } else {
      window.location.href = 'register.html'; // 跳轉至註冊頁
    }
  },

  // 載入貼文
  loadPosts: () => {
    const feedContainer = document.getElementById('feedContainer');
    if (feedContainer) {
      feedContainer.innerHTML = ''; // 清空貼文區域

      // 模擬貼文數據
      const posts = [
        { content: "這是第一篇貼文！", time: "2024-11-22" },
        { content: "這是第二篇貼文！", time: "2024-11-22" },
      ];

      // 動態生成貼文
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
  }
};

// 關閉引導畫面
function closeGuide() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.style.display = 'none'; // 隱藏引導視窗
  }
  main.showMainScreen(); // 顯示主畫面
}

// 初始化主程式
main.init();

// 將處理函數公開給全局
window.handleUserIconClick = main.handleUserIconClick;






