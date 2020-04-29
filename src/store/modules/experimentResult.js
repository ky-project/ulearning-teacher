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
    experimentShared: false,
    id: 0,
    isCorrected: false,
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
