import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { stringify } from 'qs'
import { getToken, getRefreshToken } from '@/utils/auth'

const baseApi = process.env.VUE_APP_BASE_API
const key = 'Bearer '

const service = axios.create({
  baseURL: baseApi,
  timeout: 5000,
  transformRequest: [
    function dataStringify(data) {
      return stringify(data)
    }
  ]
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 添加token
      config.headers['Authorization-token'] = key + getToken()
      config.headers['Authorization-refresh-token'] = key + getRefreshToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

export const { get: axiosGet } = service

export const { post: axiosPost } = service

export const { delete: axiosDelete } = service
