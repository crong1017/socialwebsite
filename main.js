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
      const overlay = document.getElementById('overlay');
      if (overlay) {
        overlay.style.display = 'flex';
      }
      localStorage.setItem('firstVisit', 'no');
    } else {
      main.showMainScreen();
    }
  },

  // 顯示主畫面
  showMainScreen: () => {
    const feedContainer = document.getElementById('feedContainer');
    if (feedContainer) {
      feedContainer.style.display = 'block';
    }
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none';
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
      window.location.href = 'home.html';
    } else {
      window.location.href = 'register.html';
    }
  },

  // 載入貼文
  loadPosts: () => {
    const feedContainer = document.getElementById('feedContainer');
    if (feedContainer) {
      feedContainer.innerHTML = '';

      // 模擬貼文數據
      const posts = [
        { id: 1, content: "這是第一篇貼文！", time: "2024-11-22", likes: 0, comments: [] },
        { id: 2, content: "這是第二篇貼文！", time: "2024-11-22", likes: 0, comments: [] },
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
          <div class="post-actions">
            <button class="like-button" onclick="main.likePost(${post.id})">👍 按讚 <span id="like-count-${post.id}">${post.likes}</span></button>
            <button class="comment-button" onclick="main.toggleCommentSection(${post.id})">💬 留言</button>
          </div>
          <div class="comment-section" id="comment-section-${post.id}" style="display: none;">
            <textarea id="comment-input-${post.id}" placeholder="輸入您的留言..."></textarea>
            <button onclick="main.addComment(${post.id})">送出</button>
            <div class="comment-list" id="comment-list-${post.id}">
              <!-- 留言將動態插入 -->
            </div>
          </div>
        `;
        feedContainer.appendChild(postCard);
      });
    }
  },

  // 按讚功能
  likePost: (postId) => {
    const likeCountElement = document.getElementById(`like-count-${postId}`);
    if (likeCountElement) {
      let currentLikes = parseInt(likeCountElement.textContent, 10) || 0;
      currentLikes += 1;
      likeCountElement.textContent = currentLikes;
    }
  },

  // 切換留言區顯示
  toggleCommentSection: (postId) => {
    const commentSection = document.getElementById(`comment-section-${postId}`);
    if (commentSection) {
      commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    }
  },

  // 添加留言
  addComment: (postId) => {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentList = document.getElementById(`comment-list-${postId}`);
    if (commentInput && commentList) {
      const commentText = commentInput.value.trim();
      if (commentText) {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.textContent = commentText;
        commentList.appendChild(commentElement);
        commentInput.value = ''; // 清空輸入框
      }
    }
  },
};

// 關閉引導畫面
function closeGuide() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  main.showMainScreen();
}

// 初始化主程式
main.init();
window.handleUserIconClick = main.handleUserIconClick;
