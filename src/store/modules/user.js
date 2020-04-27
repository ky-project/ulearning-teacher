import {
  LOGIN_URL,
  LOG_OUT_URL,
  INFO_URL,
  UPLOAD_AVATAR_URL,
  UPDATE_INFO_URL,
  ROLE_INFO_URL,
  GET_ALL_TEACHING_TASK_URL
} from '@/api/url'
import { axiosPost, axiosGet, axios2 } from '@/utils/axios'
import { removeVuex, removeRefreshToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    userInfo: '',
    role: '',
    teachingTask: [],
    teachingTaskId: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_TEACHING_TASK: (state, teachingTask) => {
    state.teachingTask = teachingTask
  },
  SET_TEACHING_TASK_ID: (state, teachingTaskId) => {
    state.teachingTaskId = teachingTaskId
  }
}

const actions = {
  // 获取角色信息
  getRole({ commit }) {
    return new Promise((resolve, reject) => {
      axiosGet(ROLE_INFO_URL)
        .then(response => {
          const role = response.data[0]
          commit('SET_ROLE', role)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      axiosGet(INFO_URL)
        .then(response => {
          commit('SET_USER_INFO', response.data)
          resolve()
        })
        .catch(error => (
          reject(error)
        ))
    })
  },
  // 获取教学任务
  getTeachingTask({ commit }) {
    return new Promise((resolve, reject) => {
      axiosGet(GET_ALL_TEACHING_TASK_URL)
        .then((response) => {
          const teachingTask = response.data
          // console.log('teachingTask', teachingTask)
          commit('SET_TEACHING_TASK', teachingTask)
          // 初始化
          if (teachingTask.length) {
            commit('SET_TEACHING_TASK_ID', teachingTask[0].id)
          }
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 登录
  login({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      axiosPost(LOGIN_URL, userInfo)
        .then(response => {
          // 获取用户,角色信息,教学任务
          // Promise.all([dispatch('getInfo'), dispatch('getRole'), dispatch('getTeachingTask')])
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      axiosGet(LOG_OUT_URL)
        .then(() => {
          commit('RESET_STATE')
          removeVuex() // 删除sessionStorage
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // 移除token
      removeToken()
      removeRefreshToken()
      commit('RESET_STATE') // 重置状态
      resolve()
    })
  },

  // 上传头像
  uploadAvatar({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      // 1. 上传头像
      axios2({
        method: 'POST',
        url: UPLOAD_AVATAR_URL,
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          dispatch('getInfo')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  setInfo({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      // 更新用户信息
      axiosPost(UPDATE_INFO_URL, data)
        .then(response => {
          // 成功，重新获取用户信息
          dispatch('getInfo')
            .then(() => {
              resolve()
            })
            .catch(error => {
              reject(error)
            })
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

