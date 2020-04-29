
import {
  ADD_ATTACHMENT_URL2,
  ADD_NOTICE_URL,
  UPDATE_NOTICE_URL
} from '@/api/url.js'
import { axios2, axiosPost } from '@/utils/axios'
import { Message } from 'element-ui'
function getDefaultNotice() {
  return {
    createBy: '',
    createTime: '', // 创建时间
    id: 0,
    memo: '',
    noticeAttachment: '',
    noticeAttachmentName: '',
    noticeContent: '',
    noticeKeywords: '',
    noticePostTime: '',
    noticeShared: true,
    noticeTitle: '',
    teachingTaskId: 0,
    updateBy: '',
    updateTime: '',
    valid: true
  }
}

const state = {
  notice: getDefaultNotice(),
  mode: ''
}

const mutations = {
  RESET_NOTICE: (state) => {
    state.notice = getDefaultNotice()
  },
  SET_NOTICE: (state, data) => {
    state.notice = Object.assign({}, state.notice, data)
  },
  SET_MODE: (state, mode) => {
    state.mode = mode
  },
  DELETE_ATTACHMENT: (state) => {
    state.notice.noticeAttachment = ''
    state.notice.noticeAttachmentName = ''
  }
}

const actions = {
  // 添加通告
  addNotice({ commit, state }) {
    return new Promise((resolve, reject) => {
      const {
        noticeAttachment,
        noticeAttachmentName,
        noticeContent,
        noticeKeywords,
        noticeTitle,
        teachingTaskId
      } = state.notice
      const data = {
        noticeAttachment,
        noticeAttachmentName,
        noticeContent,
        noticeKeywords,
        noticeTitle,
        teachingTaskId
      }
      axiosPost(ADD_NOTICE_URL, data)
        .then(response => {
          Message.success('实验添加成功')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新通告
  updateNotice({ commit, state }) {
    return new Promise((resolve, reject) => {
      const {
        noticeAttachment,
        noticeAttachmentName,
        noticeContent,
        noticeTitle,
        noticeKeywords,
        id,
        teachingTaskId
      } = state.notice
      const data = {
        noticeAttachment,
        noticeAttachmentName,
        noticeContent,
        noticeTitle,
        noticeKeywords,
        id,
        teachingTaskId
      }
      axiosPost(UPDATE_NOTICE_URL, data)
        .then(response => {
          Message.success('实验更新成功')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取附件url 和 附件名
  getAttachmentUrl({ commit }, fileList) {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      fileList.forEach(item => formData.append('attachments', item))
      axios2({
        method: 'POST',
        url: ADD_ATTACHMENT_URL2,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
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
