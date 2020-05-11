import axios from 'axios'
import { Message } from 'element-ui'
import { stringify } from 'qs'
import router from '@/router'
import store from '@/store'
import { getToken, getRefreshToken } from '@/utils/auth'

const baseApi = process.env.VUE_APP_BASE_API // '/auth/vCode'
const key = 'Bearer '

// 自动转换data格式
const service = axios.create({
  baseURL: baseApi,
  timeout: 15000,
  transformRequest: [
    function dataStringify(data) {
      return stringify(data)
    }
  ]
})

// 不转化data格式
const service2 = axios.create({
  baseURL: baseApi,
  timeout: 5000
})

// 拦截处理
function interceptor(service) {
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
      // console.log('请求成功')
      return response.data
    },
    async error => {
      // console.log('请求失败', error)
      const { response } = error
      const { code, message } = response.data
      switch (code) {
        case 400:
          Message.error(message || '400:业务失败或异常')
          break
        case 401:
        case 403:
          await store.dispatch('user/logout')
          router.push('/login')
          Message.error(message || '401/403:权限异常')
          break
        case 500:
          Message.error(message || '500:后台报错')
          break
      }
      return Promise.reject(error)
    }
  )
}

interceptor(service)
interceptor(service2)

export default service
export const { get: axiosGet } = service
export const { post: axiosPost } = service
export const { delete: axiosDelete } = service

export const axios2 = service2
