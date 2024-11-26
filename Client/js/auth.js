const BASE_URL = 'http://localhost:3000'; // 假設後端的 API 基本路徑

const auth = {
  // 用戶註冊
  register: async (username, email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
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
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
  logout: async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('auth_token');
        return { success: true, message: '登出成功！' };
      } else {
        return { success: false, message: '登出失敗，請稍後再試。' };
      }
    } catch (error) {
      console.error('登出錯誤:', error);
      return { success: false, message: '登出請求發生錯誤，請稍後再試。' };
    }
  },

  // 檢查是否已經登入
  isLoggedIn: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return false;
    }

    try {
      // 解碼並檢查 token 是否過期
      const { exp } = JSON.parse(atob(token.split('.')[1])); // 解碼 JWT 的 payload 部分
      return Date.now() < exp * 1000; // 比較當前時間與 token 的到期時間
    } catch (error) {
      console.error('Token 驗證錯誤:', error);
      return false;
    }
  },
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
  const logoutResult = await auth.logout();
  console.log(logoutResult);
})();
