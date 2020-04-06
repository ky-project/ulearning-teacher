<template>
  <div class="exam-quantity">
    <card title="设置题型及数量" class="condition" width="100%" min-body-height="150px">
      <template v-slot:body>
        <div class="line flex justify-between wrap">
          <quantity-picker
            v-for="item in quantity"
            :key="item.questionType"
            :value="item"
            @update-amount="setAmount"
            @update-grade="setGrade"
          />
        </div>

      </template>
      <template v-slot:footer>
        <div class="next">
          <el-button
            type="primary"
            :style="{width: '100%'}"
            size="mini"
            @click="mode === 'add' ? next() : update()"
          >
            {{ mode === 'add' ? '下一步' : '修 改' }}
          </el-button>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Card from './../Card'
import QuantityPicker from './../QuantityPicker'
import { UPDATE_EXAM_URL } from '@/api/url'
import { axiosPost } from '@/utils/axios'
export default {
  name: 'ExamQuantity',

  components: { Card, QuantityPicker },
  props: [''],
  data() {
    return {
      typeMap: {
        '1': '选择题',
        '2': '判断题',
        '3': '多选题',
        '4': '填空题'
      }
    }
  },

  computed: {
    ...mapGetters(['quantity', 'exam', 'mode'])
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'setAmount': 'exam/SET_AMOUNT',
      'setGrade': 'exam/SET_GRADE',
      'validateParameters': 'exam/VALIDATE_PARAMETERS'
    }),
    // 更新测试任务
    updateExam(data) {
      return new Promise((resolve, reject) => {
        axiosPost(UPDATE_EXAM_URL, data)
          .then(response => {
            this.$message.success('测试任务更新成功')
            resolve()
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    update() {
      this.updateExam({
        id: this.exam.id,
        examinationParameters: JSON.stringify(this.exam.examinationParameters),
        teachingTaskId: this.teachingTaskId
      }).then(() => {
        this.$router.push('/exam/exam-list')
      })
    },
    next() {
      const result = this.validateParameters()
      if (result === true) {
        this.$confirm('请确保试题发布时，试题库数量充足，否则按最大题目数量出题（全部学生题目一样）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/exam/exam-state')
        }).catch(() => {
          this.$router.push('/exam/exam-state')
        })
      } else {
        this.$message.warning(result)
      }
    },
    validateParameters() {
      const { questionKnowledges, quantity } = this.exam.examinationParameters
      if (questionKnowledges.length === 0) {
        return '你还没有选择考试范围'
      } else {
        const result = quantity.findIndex(item => item.amount !== 0)
        // console.log(result)
        if (result === -1) {
          return '你还没有设置题型及数量'
        } else {
          for (let i = 0; i < quantity.length; i++) {
            const item = quantity[i]
            if (item.amount !== 0 && item.grade === 0) {
              return `你还没有设置${this.typeMap[item.questionType]}的分数`
            }
          }
        }
      }
      return true
    }
  }

}

</script>
<style lang='scss' scoped>
.exam-quantity {
  .next {
    /* width: 100%;
    position: absolute;
    bottom: 20px;
    left: 0; */
    padding-top: 20px;
    border-top: 1px dashed #ccc;
    text-align: center;
  }
}
</style>
