const auth = {
  // 用戶註冊
  register: async (username, email, password) => {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, message: '註冊成功！' };
      } else {
        return { success: false, message: result.message || '註冊失敗，請再試一次。' };
      }
    } catch (error) {
      console.error('註冊錯誤:', error);
      return { success: false, message: '註冊請求發生錯誤，請稍後再試。' };
    }
  },

  // 用戶登入
  login: async (username, password) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // 假設成功登入後，儲存 token
        localStorage.setItem('auth_token', result.token);
        return { success: true, message: '登入成功！' };
      } else {
        return { success: false, message: result.message || '登入失敗，請檢查帳號或密碼。' };
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      return { success: false, message: '登入請求發生錯誤，請稍後再試。' };
    }
  },

  // 用戶登出
  logout: () => {
    // 移除 localStorage 中的 token
    localStorage.removeItem('auth_token');
    return { success: true, message: '登出成功！' };
  },

  // 檢查是否已經登入
  isLoggedIn: () => {
    // 檢查 localStorage 中是否存在有效的 token
    return localStorage.getItem('auth_token') !== null;
  }
};

// 範例使用
(async () => {
  // 註冊一個新用戶
  const registerResult = await auth.register('testUser', 'test@example.com', 'password123');
  console.log(registerResult);

  // 登入
  const loginResult = await auth.login('testUser', 'password123');
  console.log(loginResult);

  // 檢查是否已經登入
  const loggedIn = auth.isLoggedIn();
  console.log('已登入:', loggedIn);

  // 登出
  const logoutResult = auth.logout();
  console.log(logoutResult);
})();
