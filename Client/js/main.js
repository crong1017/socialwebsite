import auth from './auth.js';
import api from './api.js';

const main = {
  // 初始化應用
  init: async () => {
    const isLoggedIn = await main.checkLoginStatus();
    if (isLoggedIn) {
      main.loadDailyLearningList();
    } else {
      main.showLoginScreen();
    }
  },

  // 顯示登入畫面
  showLoginScreen: () => {
    console.log("請登入");
  },

  // 登入
  login: async (username, password) => {
    const response = await auth.login(username, password);
    if (response.success) {
      localStorage.setItem("token", response.token); // 儲存 token
      console.log(response.message);
      main.loadDailyLearningList();
    } else {
      console.error(response.message);
    }
  },

  // 登出
  logout: async () => {
    const response = await auth.logout();
    if (response.success) {
      localStorage.removeItem("token"); // 移除 token
      console.log(response.message);
      main.showLoginScreen();
    }
  },

  // 檢查登入狀態
  checkLoginStatus: async () => {
    return !!localStorage.getItem("token");
  },

  // 加載每日學習清單
  loadDailyLearningList: async () => {
    const learningList = await api.getDailyLearningList();
    console.log("每日學習清單:", learningList);
    main.displayLearningList(learningList);
  },

  // 顯示學習清單
  displayLearningList: (learningList) => {
    const container = document.getElementById("learning-list");
    container.innerHTML = ""; // 清空現有內容
    learningList.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.textContent = `學習項目：${item.name}, 進度：${item.progress}%`;
      container.appendChild(listItem);
    });
  },

  // 新增學習目標
  addLearningGoal: async (goalName) => {
    const response = await api.addLearningGoal(goalName);
    if (response.success) {
      console.log(response.message);
      main.loadDailyLearningList();
    } else {
      console.error("新增失敗");
    }
  },

  // 更新進度
  updateProgress: async (goalId, progress) => {
    const response = await api.updateProgress(goalId, progress);
    if (response.success) {
      console.log(response.message);
      main.loadDailyLearningList();
    } else {
      console.error("更新失敗");
    }
  },

  // 編輯學習目標名稱
  editLearningGoal: async (goalId, newName) => {
    const response = await api.editLearningGoal(goalId, newName);
    if (response.success) {
      console.log(response.message);
      main.loadDailyLearningList();
    } else {
      console.error("編輯失敗");
    }
  },

  // 刪除學習目標
  deleteLearningGoal: async (goalId) => {
    const response = await api.deleteLearningGoal(goalId);
    if (response.success) {
      console.log(response.message);
      main.loadDailyLearningList();
    } else {
      console.error("刪除失敗");
    }
  }
};

// 初始化應用程式
main.init();
