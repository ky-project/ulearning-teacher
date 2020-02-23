import { LOGIN_URL, LOG_OUT_URL, INFO_URL, UPLOAD_AVATAR_URL } from '@/api/url'
import axios, { axiosPost, axiosGet, axios2 } from '@/utils/axios'
import { removeVuex, removeRefreshToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    userInfo: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  RESET_STATE: state => {
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
  }
}

const actions = {
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
  // 登录
  login({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      axiosPost(LOGIN_URL, userInfo)
        .then(response => {
          console.log('登录成功')
          resolve()
          // 获取用户信息
          dispatch('getInfo')
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

