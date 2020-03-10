<template>
  <div class="notice-content__page">
    <div class="notice-content__header flex justify-between">
      <el-button type="text" @click="back"><svg-icon icon-class="zuo" />返回</el-button>
      <el-button type="primary" class="submit" :loading="isLoading" @click="submit">
        <svg-icon v-if="!isLoading" icon-class="tijiao" />
        <span>提交</span>
      </el-button>
    </div>
    <div class="notice-content__container">
      <div class="notice-content__title">
        <div class="line">
          <label for="">教学任务：</label>
          <el-select
            :value="notice.teachingTaskId"
            placeholder="教学任务"
            style="width: 200px;"
            class="filter-item"
            size="mini"
            :style="{marginTop: '5px'}"
            @change="(teachingTaskId)=>{setNotice({teachingTaskId })}"
          >
            <el-option
              v-for="item in teachingTask"
              :key="item.id"
              :label="item.teachingTaskAlias"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="line">
          <label for="">通告标题：</label>
          <el-input
            :value="notice.noticeTitle"
            style="width: 200px;"
            class="filter-item"
            size="mini"
            @input="(noticeTitle) => { setNotice({noticeTitle})}"
          />
        </div>
        <div class="line">
          <label for="">关键字：</label>
          <el-input
            :value="notice.noticeKeywords"
            style="width: 200px;"
            class="filter-item"
            size="mini"
            @input="(noticeKeywords) => { setNotice({noticeKeywords})}"
          />
        </div>
      </div>
      <el-button type="text">
        <svg-icon icon-class="biezhen" />
        添加附件
      </el-button>
      <UploadMultiple :file-list.sync="fileList" @delete="deleteFile" />
      <tinymce
        :value="notice.noticeContent"
        height="280px"
        :toolbar="toolbar"
        menubar=""
        @input="(noticeContent) => { setNotice({noticeContent})}"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import UploadMultiple from '@/components/UploadMultiple'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'NoticeContent',
  components: { UploadMultiple, Tinymce },
  props: [''],
  data() {
    return {
      isLoading: false,
      // attachment: '', // 附件
      fileList: [],
      hasDelete: false, // 是否删除过(更新用)
      initialAttachment: false, // 初始是否含有附件(更新用)
      toolbar: ['undo redo | fontselect fontsizeselect bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist indent outdent | image table link | hr emoticons']
    }
  },
  computed: {
    ...mapGetters(['teachingTask', 'notice', 'noticeMode']),
    needRequired() {
      // 删除过且存在附件 或 初始不含附件后新增
      return (this.hasDelete && this.attachment) || (!this.initialAttachment && this.attachment)
    }
  },
  watch: {

  },
  created() {
    // 初始化教学任务
    if (this.noticeMode === 'add' && this.teachingTask.length) {
      this.setNotice({ teachingTaskId: this.teachingTask[0].id })
    }
    // 初始化附件
    if (this.noticeMode === 'update' && this.notice.noticeAttachmentName) {
      const names = this.notice.noticeAttachmentName.split(',')
      const urls = this.notice.noticeAttachment.split(',')
      this.fileList = []
      names.forEach((name, index) => {
        this.fileList[index] = {
          name,
          url: urls[index],
          uid: urls[index]
        }
      })
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'setNotice': 'notice/SET_NOTICE',
      'deleteAttachment': 'notice/DELETE_ATTACHMENT'
    }),
    ...mapActions({
      'getAttachmentUrl': 'notice/getAttachmentUrl',
      'addNotice': 'notice/addNotice',
      'updateNotice': 'notice/updateNotice'
    }),
    // 删除附件
    deleteFile(uid) {
      const index = this.fileList.findIndex(item => item.uid === uid)
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
    },
    // 回退
    back() {
      this.$router.push('/notice/notice-list')
    },
    // 提交
    async submit() {
      const { noticeTitle, noticeContent } = this.notice
      // 1. 验证
      if (!noticeTitle) {
        this.$message.warning('请输入通告标题')
        return false
      }
      if (!noticeContent) {
        this.$message.warning('请输入通告内容')
        return false
      }
      // 2. 添加请求
      if (this.noticeMode === 'add') {
        // 2.1 获取附件url
        if (this.fileList.length) {
          const response = await this.getAttachmentUrl(this.fileList.map(item => item.raw))
          const {
            noticeAttachment,
            noticeAttachmentName
          } = response.data
          this.setNotice({
            noticeAttachment,
            noticeAttachmentName
          })
        }
        // 2.2 添加通告
        await this.addNotice()
        this.back()
      }
      // 3. 更新请求
      if (this.noticeMode === 'update') {
        // 3.1 根据raw拆分新添加和原有附件数组
        const oldFileList = []
        const newFileList = []
        this.fileList.forEach(item => {
          if (item.raw) {
            newFileList.push(item)
          } else {
            oldFileList.push(item)
          }
        })
        // 3.2 获取附件url并拼接
        let newNoticeAttachment = ''
        let newNoticeAttachmentName = ''
        oldFileList.forEach((item, index) => {
          if (index !== oldFileList.length - 1) {
            newNoticeAttachment += item.url + ','
            newNoticeAttachmentName += item.name + ','
          } else {
            newNoticeAttachment += item.url
            newNoticeAttachmentName += item.name
          }
        })
        if (newFileList.length) {
          const response = await this.getAttachmentUrl(newFileList.map(item => item.raw))
          const {
            noticeAttachment,
            noticeAttachmentName
          } = response.data
          this.setNotice({
            noticeAttachment: newNoticeAttachment + ',' + noticeAttachment,
            noticeAttachmentName: newNoticeAttachmentName + ',' + noticeAttachmentName
          })
        } else {
          this.setNotice({
            noticeAttachment: newNoticeAttachment,
            noticeAttachmentName: newNoticeAttachmentName
          })
        }
        // 3.3 更新通告
        await this.updateNotice()
        this.back()
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.notice-content {
  &__page {
    padding: 20px 40px;
  }
  &__header {
    .submit {
      padding: 0px 10px;
      line-height: 0;
      height: 40px;
      span {
        margin-left: 5px;
      }
    }
  }
  &__title {
    .line {
      margin-bottom: 10px;
      line-height: 35px;
      border-bottom: 1px solid #ccc;
      ::v-deep .el-input__inner {
        border: none;
        padding: 0;
        font-size: 14px;
      }
      ::v-deep .el-input__suffix {
        display: none;
      }
      label {
        font-weight: normal;
        font-size: 14px;
        color: #666;
      }
    }

  }
}
</style>
