const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const auth = {
  // 用戶註冊
  register: async (username, email, password) => {
    // 檢查輸入欄位的有效性
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
      // 發送註冊請求到後端
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      // 獲取後端返回的數據
      const result = await response.json();

      if (response.ok) {
        // 註冊成功
        return { success: true, message: '註冊成功！' };
      } else {
        // 註冊失敗，返回錯誤信息
        return { success: false, message: result.message || '註冊失敗，請再試一次。' };
      }
    } catch (error) {
      console.error('註冊錯誤:', error);
      return { success: false, message: '註冊請求發生錯誤，請稍後再試。' };
    }
  },
};

export default auth;
