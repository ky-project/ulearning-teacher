import {
  ADD_ATTACHMENT_URL,
  ADD_EXPERIMENT_URL,
  UPDATE_EXPERIMENT_URL
} from '@/api/url.js'
import { axios2, axiosPost } from '@/utils/axios'
import { Message } from 'element-ui'

function getDefaultExperiment() {
  return {
    experimentAttachment: '',
    experimentAttachmentName: '',
    experimentContent: '',
    experimentOrder: 0,
    experimentTitle: '',
    id: 0,
    teachingTaskAlias: '',
    teachingTaskId: 0,
    term: ''
  }
}

const state = {
  experiment: getDefaultExperiment(),
  mode: ''
}

const mutations = {
  RESET_EXPERIMENT: (state, data, rootState) => {
    state.experiment = getDefaultExperiment()
  },
  SET_EXPERIMENT: (state, data) => {
    state.experiment = Object.assign({}, state.experiment, data)
  },
  SET_MODE: (state, mode) => {
    state.mode = mode
  },
  DELETE_ATTACHMENT: (state, mode) => {
    state.experiment.experimentAttachment = ''
    state.experiment.experimentAttachmentName = ''
  }
}

const actions = {
  // 添加实验
  addExperiment({ commit, state }, attachment) {
    return new Promise((resolve, reject) => {
      const {
        experimentAttachment,
        experimentAttachmentName,
        experimentContent,
        experimentTitle,
        experimentOrder,
        teachingTaskId
      } = state.experiment
      const data = {
        experimentAttachment,
        experimentAttachmentName,
        experimentContent,
        experimentOrder,
        experimentTitle,
        teachingTaskId
      }
      axiosPost(ADD_EXPERIMENT_URL, data)
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
      } = state.experiment
      const data = {
        experimentAttachment,
        experimentAttachmentName,
        experimentContent,
        experimentTitle,
        id,
        teachingTaskId
      }
      axiosPost(UPDATE_EXPERIMENT_URL, data)
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
          commit('SET_EXPERIMENT', {
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

