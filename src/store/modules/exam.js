
import { noneDuplicate } from '@/utils'
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
    examinationShowResult: '',
    examinationState: '',
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
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
