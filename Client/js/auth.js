const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const auth = {
  // 用戶註冊
  register: async (username, email, password) => {
    if (!username || !email || !password) {
      return { success: false, message: '所有字段都是必填的' };
    }
    if (password.length < 6) {
      return { success: false, message: '密碼必須至少 6 個字符' };
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return { success: false, message: '請輸入有效的電子郵件地址' };
    }

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
    if (!username || !password) {
      return { success: false, message: '所有字段都是必填的' };
    }

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
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      return Date.now() < exp * 1000;
    } catch (error) {
      console.error('Token 驗證錯誤:', error);
      return false;
    }
  },
};

export default auth;
