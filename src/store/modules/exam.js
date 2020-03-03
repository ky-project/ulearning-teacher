
import { noneDuplicate } from '@/utils'
import { ADD_EXAM_URL } from '@/api/url'
import { axiosPost } from '@/utils/axios'
import { Message } from 'element-ui'
function getDefaultExam() {
  return {
    examinationDuration: '',
    examinationName: '',
    examinationParameters: {
      questionKnowledges: [],
      questionDifficulty: 0,
      quantity: [
        {
          questionType: 1, // 选择
          amount: 0,
          grade: 0
        },
        {
          questionType: 2, // 判断
          amount: 0,
          grade: 0
        },
        {
          questionType: 3, // 多选
          amount: 0,
          grade: 0
        },
        {
          questionType: 4, // 填空
          amount: 0,
          grade: 0
        }
      ]
    },
    examinationShowResult: 1,
    examinationState: 1, // 1：未发布 2：未开始 3：进行中 4：已结束
    teachingTaskId: ''
  }
}

const state = {
  exam: getDefaultExam()
}

const mutations = {
  SET_EXAM: (state, data) => {
    state.exam = Object.assign({}, state.exam, data)
  },
  SET_AMOUNT: (state, data) => {
    const { questionType, amount } = data
    const quantity = state.exam.examinationParameters.quantity
    quantity.forEach(item => {
      if (item.questionType === questionType) {
        item.amount = amount
      }
    })
  },
  SET_GRADE: (state, data) => {
    const { questionType, grade } = data
    const quantity = state.exam.examinationParameters.quantity
    quantity.forEach(item => {
      if (item.questionType === questionType) {
        item.grade = grade
      }
    })
  },
  SET_DIFFICULTY: (state, data) => {
    state.exam.examinationParameters.questionDifficulty = data
  },
  ADD_KNOWLEDGE: (state, data) => {
    const { questionKnowledges } = state.exam.examinationParameters
    const tempArr = [...questionKnowledges]
    tempArr.push(data)
    state.exam.examinationParameters.questionKnowledges = noneDuplicate(
      tempArr
    )
  },
  DELETE_KNOWLEDGE: (state, index) => {
    state.exam.examinationParameters.questionKnowledges.splice(index, 1)
  },
  CLEAR_KNOWLEDGE: state => {
    state.exam.examinationParameters.questionKnowledges = []
  },
  RESET_EXAM: state => {
    state.exam = getDefaultExam()
  }
}

const actions = {
  addExam({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = Object.assign({}, state.exam)
      data.examinationParameters = JSON.stringify(data.examinationParameters)
      axiosPost(ADD_EXAM_URL, data)
        .then(response => {
          commit('RESET_EXAM')
          this.$message.success('测试添加成功')
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
