<template>
  <div class="experiment-content__page">
    <div class="experiment-content__header flex justify-between">
      <el-button type="text" @click="back"><svg-icon icon-class="zuo" />返回</el-button>
      <el-button round type="primary" class="submit" :loading="isLoading" @click="submit">
        <svg-icon v-if="!isLoading" icon-class="tijiao" />
        <span>提交</span>
      </el-button>
    </div>
    <div class="experiment-content__container">
      <div class="experiment-content__title">
        <div class="line">
          <label for="">教学任务（请选择）：</label>
          <el-select
            :value="experiment.teachingTaskId"
            placeholder="教学任务"
            style="width: 200px;"
            class="filter-item"
            size="mini"
            :style="{marginTop: '5px'}"
            @change="(teachingTaskId)=>{setExperiment({teachingTaskId })}"
          >
            <el-option
              v-for="item in teachingTask"
              :key="item.id"
              :label="item.showName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="line">
          <label for="">实验标题：</label>
          <el-input
            :value="experiment.experimentTitle"
            style="width: 200px;"
            class="filter-item"
            size="mini"
            @input="(experimentTitle) => { setExperiment({experimentTitle})}"
          />
        </div>
      </div>
      <upload-attachment v-model="attachment" @delete="deleteHandler" />
      <tinymce
        :value="experiment.experimentContent"
        height="280px"
        :toolbar="toolbar"
        menubar=""
        @input="(experimentContent) => { setExperiment({experimentContent})}"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import UploadAttachment from '@/components/UploadAttachment'
import Tinymce from '@/components/Tinymce'
// import { ADD_ATTACHMENT_URL, ADD_EXPERIMENT_URL, UPDATE_EXPERIMENT_URL } from '@/api/url.js'
// import { axios2, axiosPost } from '@/utils/axios'
// import experiment from '../../../store/modules/experiment'
export default {
  name: 'ExperimentContent',
  components: { UploadAttachment, Tinymce },
  props: [''],
  data() {
    return {
      isLoading: false,
      attachment: '',
      hasDelete: false, // 是否删除过(更新用)
      initialAttachment: false, // 初始是否含有附件(更新用)
      toolbar: ['undo redo | fontselect fontsizeselect bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist indent outdent | image table link | hr emoticons']
    }
  },
  computed: {
    ...mapGetters(['teachingTask', 'experiment', 'experimentMode']),
    needRequired() {
      // 删除过且存在附件 或 初始不含附件后新增
      return (this.hasDelete && this.attachment) || (!this.initialAttachment && this.attachment)
    }
  },
  watch: {

  },
  created() {
    // 初始化教学任务
    if (this.experimentMode === 'add' && this.teachingTask.length) {
      this.setExperiment({ teachingTaskId: this.teachingTask[0].id })
    }
    // 初始化附件
    if (this.experimentMode === 'update' && this.experiment.experimentAttachmentName) {
      this.initialAttachment = true
      const { experimentAttachmentName, experimentAttachmentSize } = this.experiment
      this.attachment = {
        name: experimentAttachmentName,
        size: experimentAttachmentSize
      }
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'setExperiment': 'experiment/SET_EXPERIMENT',
      'deleteAttachment': 'experiment/DELETE_ATTACHMENT'
    }),
    ...mapActions({
      'getAttachmentUrl': 'experiment/getAttachmentUrl',
      'addExperiment': 'experiment/addExperiment',
      'updateExperiment': 'experiment/updateExperiment'
    }),
    // 删除附件
    deleteHandler() {
      this.attachment = ''
      this.hasDelete = true
      this.deleteAttachment()
    },
    // 回退
    back() {
      this.$router.push('/experiment-manage/experiment-list')
    },
    // 提交
    async submit() {
      const { experimentTitle, experimentContent } = this.experiment
      // 1. 验证
      if (!experimentTitle) {
        this.$message.warning('请输入实验标题')
        return false
      }
      if (!experimentContent) {
        this.$message.warning('请输入实验内容')
        return false
      }
      // 2. 添加请求
      if (this.experimentMode === 'add') {
        // 2.1 获取附件url
        if (this.attachment) {
          await this.getAttachmentUrl(this.attachment)
        }
        // 2.2 添加实验
        await this.addExperiment()
        this.back()
      }
      // 3. 更新请求
      if (this.experimentMode === 'update') {
        // 3.1 获取附件url
        if (this.needRequired) {
          await this.getAttachmentUrl(this.attachment)
        }
        // 3.2 更新实验
        await this.updateExperiment()
        this.back()
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
