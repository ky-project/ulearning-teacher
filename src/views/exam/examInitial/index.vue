<template>
  <div class="exam-initial">
    <Step :active="0" :back="() => { $router.push('/exam/exam-list')}" />
    <div class="content">
      <div class="form-wrap">
        <el-form ref="form" :rules="rules" :model="exam" label-width="80px" hide-required-asterisk>

          <el-form-item label="教学任务" prop="teachingTaskId">
            <!-- <svg-icon icon-class="renwu" /> -->
            <el-select
              :value="exam.teachingTaskId"
              placeholder="请选择教学任务"
              @change="(newValue) => setExam({teachingTaskId: newValue})"
            >
              <el-option
                v-for="item in teachingTask"
                :key="item.id"
                :label="item.teachingTaskAlias"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="试卷名称" prop="examinationName">
            <!-- <svg-icon icon-class="ceshi" /> -->
            <el-input
              :value="exam.examinationName"
              placeholder="请输入试卷名称"
              @input="(newValue) => {setExam({examinationName: newValue})}"
            />
          </el-form-item>
          <el-form-item label="考试时长" prop="examinationDuration">
            <!-- <svg-icon icon-class="shichang" /> -->
            <el-input-number
              :value="exam.examinationDuration"
              :style="{width: '100%', textAlign: 'left'}"
              placeholder="请输入考试时长"
              controls-position="right"
              step-strictly
              :min="0"
              :step="5"
              @input="(newValue) => {setExam({examinationDuration: newValue})}"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextStep('form')">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Step from '@/views/exam/components/Step'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ExamInitial',
  components: { Step },
  props: [''],
  data() {
    var validateDuration = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('请输入考试时长'))
      } else {
        callback()
      }
    }
    return {
      form: {
        teachingTaskId: '',
        examinationName: '',
        examinationDuration: ''
      },
      rules: {
        'teachingTaskId': [
          { required: true, message: '请选择教学任务', trigger: 'change' }
        ],
        'examinationName': [
          { required: true, message: '请输入试卷名称', trigger: 'blur' }
        ],
        'examinationDuration': [
          { validator: validateDuration, trigger: ['blur', 'change'] }
        ]
      }
      // teachingTask: []
    }
  },
  computed: {
    ...mapGetters(['teachingTask', 'exam'])
  },

  watch: {},

  created() {
    if (this.teachingTask.length) {
      this.teachingTaskId = this.teachingTask[0].id
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'setExam': 'exam/SET_EXAM'
    }),
    nextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push('/exam/exam-parameter')
        } else {
          return false
        }
      })
    }
  }

}

</script>
<style lang='scss' scoped>
.exam-initial {
  .content {
    text-align: center;
    position: relative;
    .form-wrap {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      .el-form-item__label {
        font-size: 16px;
      }
      .el-select {
        width: 100%;
      }
      .el-button {
        width: 100%;
      }
      .el-form-item {
        margin-bottom: 15px;
      }
      .el-input__inner {
        line-height: 30px;
        height: 30px;
      }
    }
  }
  ::v-deep .el-form-item__label {
    font-size: 16px;
    font-weight: normal;
  }
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>
