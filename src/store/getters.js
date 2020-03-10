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
  questionKnowledges: state =>
    state.exam.exam.examinationParameters.questionKnowledges,
  questionDifficulty: state =>
    state.exam.exam.examinationParameters.questionDifficulty,
  quantity: state => state.exam.exam.examinationParameters.quantity,
  // 实验相关
  experiment: state => state.experiment.experiment,
  experimentMode: state => state.experiment.mode,
  // quantity: state => state.exam.exam.examinationParameters.quantity
  // 通告相关
  notice: state => state.notice.notice,
  noticeMode: state => state.notice.mode
}
export default getters
