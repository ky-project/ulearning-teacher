<template>
  <div class="exam-initial">
    <Step :active="2" :back="() => { $router.push('/exam/exam-parameter')}" />
    <div class="content">
      <div class="form-wrap">
        <el-form ref="form" :rules="rules" :model="exam" label-width="80px" hide-required-asterisk>
          <el-form-item label="结果反馈" prop="examinationShowResult">
            <el-select
              :value="exam.examinationShowResult"
              placeholder="请选择结果反馈"
              @change="(newValue) => setExam({examinationShowResult: newValue})"
            >
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="测试状态" prop="examinationState">
            <el-select
              :value="exam.examinationState"
              placeholder="请选择测试状态"
              @change="(newValue) => setExam({examinationState: newValue})"
            >
              <el-option label="未发布" :value="1" />
              <el-option label="未开始" :value="2" />
              <el-option label="进行中" :value="3" />
              <el-option label="已结束" :value="4" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submit('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Step from '@/views/exam/components/Step'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ExamState',
  components: { Step },
  props: [''],
  data() {
    return {
      loading: false,
      form: {
        teachingTaskId: '',
        examinationName: '',
        examinationDuration: ''
      },
      rules: {
        'examinationShowResult': [
          { required: true, message: '请选择结果反馈', trigger: 'change' }
        ],
        'examinationState': [
          { required: true, message: '请选择测试状态', trigger: 'change' }
        ]
      }
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
    ...mapActions({
      'addExam': 'exam/addExam'
    }),
    ...mapMutations({
      'setExam': 'exam/SET_EXAM'
    }),
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.addExam()
            .then(() => {
              this.loading = false
              this.$router.push('/exam/exam-list')
            })
            .catch(() => {
              this.loading = false
            })
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
