// 模擬驗證 API 端點
const auth = {
  // 使用者登入
  login: async (username, password) => {
    // 模擬伺服器驗證帳號密碼
    if (username === "testuser" && password === "password123") {
      return { success: true, token: "fake-jwt-token", message: "登入成功" };
    } else {
      return { success: false, message: "帳號或密碼錯誤" };
    }
  },

  // 使用者登出
  logout: async () => {
    // 假設登出不需傳遞任何參數
    return { success: true, message: "登出成功" };
  },
