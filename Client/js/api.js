// 模擬 API 端點
const api = {
  // 使用者學習清單
  getDailyLearningList: async () => {
    return [
      { id: 1, name: '閱讀英文', progress: 30 },
      { id: 2, name: '數學練習', progress: 50 },
    ];
  },

  // 新增學習目標
  addLearningGoal: async (goalName) => {
    return { success: true, message: "新增學習目標成功" };
  },

  // 更新學習進度
  updateProgress: async (goalId, progress) => {
    return { success: true, message: "學習進度已更新" };
  },

  // 編輯學習目標名稱
  editLearningGoal: async (goalId, newName) => {
    return { success: true, message: "學習目標名稱已更改" };
  },

  // 刪除學習目標
  deleteLearningGoal: async (goalId) => {
    return { success: true, message: "學習目標已刪除" };
  }
};

export default api;
