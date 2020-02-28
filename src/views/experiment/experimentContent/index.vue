<template>
  <div class="experiment-content__page">
    <div class="experiment-content__header flex justify-between">
      <el-button type="text" @click="back"><svg-icon icon-class="zuo" />返回</el-button>
      <el-button type="primary" class="submit" :loading="isLoading" @click="submit">
        <svg-icon v-if="!isLoading" icon-class="tijiao" />
        <span>提交</span>
      </el-button>
    </div>
    <div class="experiment-content__container">
      <div class="experiment-content__title">
        <div class="line">
          <label for="">教学任务：</label>
          <el-select
            v-model="teachingTaskId"
            placeholder="教学任务"
            style="width: 200px;"
            class="filter-item"
            size="mini"
            :style="{marginTop: '5px'}"
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
          <label for="">实验标题：</label>
          <el-input
            v-model="experimentTitle"
            style="width: 200px;"
            class="filter-item"
            size="mini"
          />
        </div>
      </div>
      <upload-attachment v-model="attachment" />
      <tinymce v-model="experimentContent" :toolbar="toolbar" menubar="" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadAttachment from '@/components/UploadAttachment'
import Tinymce from '@/components/Tinymce'
import { ADD_ATTACHMENT_URL, ADD_EXPERIMENT_URL, UPDATE_EXPERIMENT_URL } from '@/api/url.js'
import { axios2, axiosPost } from '@/utils/axios'
export default {
  name: 'ExperimentContent',
  components: { UploadAttachment, Tinymce },
  props: [''],
  data() {
    return {
      isLoading: false,
      experimentTitle: '',
      teachingTaskId: '',
      experimentContent: '',
      experimentAttachment: '',
      experimentAttachmentName: '',
      attachment: '',
      id: '',
      data: '',
      toolbar: ['undo redo | fontselect fontsizeselect bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist indent outdent | image table link | hr emoticons']
    }
  },
  computed: {
    ...mapGetters(['teachingTask'])
  },

  watch: {
  },

  created() {
    if (this.$route.query.row) {
      this.data = JSON.parse(this.$route.query.row)
      const { teachingTaskId, experimentTitle, experimentContent, id } = this.data
      this.teachingTaskId = teachingTaskId
      this.experimentTitle = experimentTitle
      this.experimentContent = experimentContent
      this.id = id
      this.state = 'update'
    } else {
      this.state = 'add'
      if (this.teachingTask.length) {
        this.teachingTaskId = this.teachingTask[0].id
      }
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    back() {
      this.$router.push('/experiment-manage/experiment-list')
    },
    getAttachmentUrl() {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('attachment', this.attachment)
        // 2. 获取附件url
        axios2({
          method: 'POST',
          url: ADD_ATTACHMENT_URL,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
          console.log('response', response)
          const { data } = response
          console.log('附件url', data)
          this.experimentAttachment = data.experimentAttachment
          this.experimentAttachmentName = data.experimentAttachment
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    addExperiment(attachment) {
      return new Promise((resolve, reject) => {
        const data = {
          experimentAttachment: this.experimentAttachment,
          experimentAttachmentName: this.experimentAttachmentName,
          experimentContent: this.experimentContent,
          experimentOrder: 0,
          experimentTitle: this.experimentTitle,
          teachingTaskId: this.teachingTaskId
        }
        axiosPost(ADD_EXPERIMENT_URL, data)
          .then(response => {
            console.log('添加成功')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateExperiment() {
      return new Promise((resolve, reject) => {
        const { experimentAttachment, experimentAttachmentName, experimentContent, experimentTitle, id, teachingTaskId } = this
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
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    submit() {
      // 1. 验证
      if (!this.experimentTitle) {
        this.$message.warning('请输入实验标题')
        return false
      }
      if (!this.experimentContent) {
        this.$message.warning('请输入实验内容')
        return false
      }
      this.isLoading = true
      if (this.state === 'add') {
        if (this.attachment) {
          this.getAttachmentUrl()
            .then(() => {
              this.addExperiment()
                .then(() => {
                  this.$message.success('实验添加成功')
                  this.isLoading = false
                })
                .catch(error => {
                  console.log('报错')
                  this.$message.error(error.message || '出错')
                  this.isLoading = false
                })
            })
        } else {
          this.addExperiment()
            .then(() => {
              this.$message.success('实验添加成功')
              this.isLoading = false
            })
            .catch(error => {
              console.log('报错')
              this.$message.error(error.message || '出错')
              this.isLoading = false
            })
        }
      } else if (this.state === 'update') {
        this.updateExperiment()
          .then(() => {
            this.$message.success('实验更新成功')
            this.isLoading = false
            // this.back()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.isLoading = false
          })
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.experiment-content {
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
  /* &__container {
    overflow: scroll;
  } */
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
