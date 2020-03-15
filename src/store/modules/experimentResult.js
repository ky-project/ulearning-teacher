import { CORRECT_EXPERIMENT_RESULT_URL } from '@/api/url.js'
import { axiosPost } from '@/utils/axios'
import { Message } from 'element-ui'
import { filterObj } from '@/utils/index'

function getDefaultExperimentResult() {
  return {
    experimentAdvice: '',
    experimentAttachmentName: '',
    experimentCommitTime: '',
    experimentId: 0,
    experimentResult: '',
    experimentScore: 0,
    experimentShared: true,
    id: 0,
    isCorrected: true,
    memo: '',
    stuId: 0,
    stuName: '',
    stuNumber: ''
  }
}

const state = {
  experimentResult: getDefaultExperimentResult(),
  mode: ''
}

const mutations = {
  RESET_EXPERIMENT_RESULT: (state) => {
    state.experimentResult = getDefaultExperimentResult()
  },
  SET_EXPERIMENT_RESULT: (state, data) => {
    state.experimentResult = Object.assign({}, state.experimentResult, data)
  },
  SET_MODE: (state, mode) => {
    state.mode = mode
  },
  DELETE_ATTACHMENT: (state, mode) => {
    state.experimentResult.experimentAttachment = ''
    state.experimentResult.experimentAttachmentName = ''
  }
}

const actions = {
  correctExperimentResult({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = filterObj(state.experimentResult, [
        'experimentAdvice',
        'experimentScore',
        'experimentShared',
        'id'
      ])
      axiosPost(CORRECT_EXPERIMENT_RESULT_URL, data)
        .then(response => {
          Message.success('实验批改成功')
          resolve(response)
        })
        .catch(error => {
          Message.error(error.message || '出错')
          reject(error)
        })
    })
  }
  /* // 添加实验
  addExperiment({ commit, state }, attachment) {
    return new Promise((resolve, reject) => {
      const {
        experimentAttachment,
        experimentAttachmentName,
        experimentContent,
        experimentTitle,
        experimentOrder,
        teachingTaskId
      } = state.experimentResult
      const data = {
        experimentAttachment,
        experimentAttachmentName,
        experimentContent,
        experimentOrder,
        experimentTitle,
        teachingTaskId
      }
      axiosPost(ADD_EXPERIMENT_RESULT_URL, data)
        .then(response => {
          Message.success('实验添加成功')
          resolve()
        })
        .catch(error => {
          Message.error(error.message || '出错')
          reject(error)
        })
    })
  },
  // 更新实验
  updateExperiment({ commit, state }) {
    return new Promise((resolve, reject) => {
      const {
        experimentAttachment,
        experimentAttachmentName,
        experimentContent,
        experimentTitle,
        id,
        teachingTaskId
      } = state.experimentResult
      const data = {
        experimentAttachment,
        experimentAttachmentName,
        experimentContent,
        experimentTitle,
        id,
        teachingTaskId
      }
      axiosPost(UPDATE_EXPERIMENT_RESULT_URL, data)
        .then(response => {
          Message.success('实验更新成功')
          resolve()
        })
        .catch(error => {
          Message.error(error.message || '出错')
          reject(error)
        })
    })
  },
  // 获取附件url 和 附件名
  getAttachmentUrl({ commit }, attachment) {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('attachment', attachment)
      axios2({
        method: 'POST',
        url: ADD_ATTACHMENT_URL,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          const {
            experimentAttachment,
            experimentAttachmentName
          } = response.data
          commit('SET_EXPERIMENT_RESULT', {
            experimentAttachment,
            experimentAttachmentName
          })
          resolve()
        })
        .catch(error => {
          Message.error(error.message || '出错')
          reject(error)
        })
    })
  } */
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
