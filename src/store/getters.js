const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  role: state => state.user.role,
  teachingTask: state => state.user.teachingTask,
  // 测试相关
  exam: state => state.exam.exam,
  mode: state => state.exam.mode,
  questionKnowledges: state => state.exam.exam.examinationParameters.questionKnowledges,
  questionDifficulty: state => state.exam.exam.examinationParameters.questionDifficulty,
  quantity: state => state.exam.exam.examinationParameters.quantity
  // quantity: state => state.exam.exam.examinationParameters.quantity
}
export default getters
