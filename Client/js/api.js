// 模擬 API 端點
const api = {
  // 使用者學習清單
  getDailyLearningList: async () => {
    // 假設從伺服器獲取的學習清單
    return [
      { id: 1, name: '閱讀英文', progress: 30 },
      { id: 2, name: '數學練習', progress: 50 },
    ];
  },

  // 新增學習目標
  addLearningGoal: async (goalName) => {
    // 新增目標後返回成功訊息
    return { success: true, message: "新增學習目標成功" };
  },

  // 更新學習進度
  updateProgress: async (goalId, progress) => {
    // 更新進度後返回成功訊息
    return { success: true, message: "學習進度已更新" };
  },

  // 編輯學習目標名稱
  editLearningGoal: async (goalId, newName) => {
    // 編輯目標名稱後返回成功訊息
    return { success: true, message: "學習目標名稱已更改" };
  },

  // 刪除學習目標
  deleteLearningGoal: async (goalId) => {
    // 刪除目標後返回成功訊息
    return { success: true, message: "學習目標已刪除" };
  }
};

// 範例的使用方法
(async () => {
  // 獲取每日學習清單
  const learningList = await api.getDailyLearningList();
  console.log("每日學習清單", learningList);

  // 新增學習目標
  const addGoalResult = await api.addLearningGoal("學習JavaScript");
  console.log(addGoalResult.message);

  // 更新進度
  const updateProgressResult = await api.updateProgress(1, 40);
  console.log(updateProgressResult.message);

  // 編輯學習目標
  const editGoalResult = await api.editLearningGoal(1, "閱讀英文進階");
  console.log(editGoalResult.message);

  // 刪除學習目標
  const deleteGoalResult = await api.deleteLearningGoal(1);
  console.log(deleteGoalResult.message);
})();
