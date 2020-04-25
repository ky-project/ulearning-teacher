<template>
  <div class="exam-detail flex">
    <div class="exam-detail-sidebar">
      <header-tag text="题卡" />
      <QuestionCard
        class="card"
        :data="cardData"
        :active-name.sync="activeName"
        :question-id="questionId"
        @update="selectQuestion"
      />
    </div>
    <div class="exam-detail-main">
      <el-scrollbar :style="{height: '100%'}">
        <div class="exam-detail-main-inner">
          <h3 class="header">{{ examinationName }}</h3>
          <h4 class="title">{{ questionSort + '、' + typeMap[questionType] }}</h4>
          <p class="question-title">
            {{ `${orderNumber}. ${currentQuestion.questionText}` }}
          </p>
          <div class="question-img">
            <img :src="currentQuestion.questionUrl" alt="">
          </div>
          <!-- 非填空题 -->
          <choice-question
            v-if="questionType !== '4'"
            :disabled="true"
            :question-option="questionOption"
            :value="result"
            :multiple="questionType === '3'"
            :show-value="questionType !== '2'"
          />
          <!-- 填空题 -->
          <completion-question v-else :disabled="true" :answer-list="result" />
          <div class="question-message flex">
            <div class="question-message-item">
              <label>【知识点】</label>
              <!-- <span>{{ currentQuestion.questionKnowledge.split('|#|').join(',') }}</span> -->
              <span>{{ currentQuestion.questionKnowledge }}</span>
            </div>
            <div class="question-message-item">
              <label>【难度】</label>
              <span>{{ difficultyMap[currentQuestion.questionDifficulty] }}</span>
            </div>
            <div class="question-message-item">
              <label>【答案】</label>
              <!-- <span>{{ currentQuestion.questionKey.split('|#|').join(',') }}</span> -->
              <span>{{ currentQuestion.questionKey ? currentQuestion.questionKey.split('|#|').join(',') : '' }}</span>
            </div>
          </div>
          <div class="btns flex justify-end">
            <el-button @click="prev">上一题</el-button>
            <el-button type="primary" @click="next">下一题</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="exam-detail-sidebar">
      <div class="timer side-top">
        <header-tag text="剩余时间">
          <template v-slot:right>
            <div class="time-update">
              <svg-icon :class="['icon--tongbu', {spin: isLoading}]" icon-class="tongbu" />
              <span>{{ time }}s后更新</span>
            </div>
          </template>
        </header-tag>
        <div class="time-meter">
          <span>{{ `${hour}:${minute}:${second}` }}</span>
        </div>
      </div>
      <div class="base-message side-middle">
        <header-tag text="基本信息" />
        <div class="line">
          <label>姓名：</label>
          <span>{{ $route.query.stuName }}</span>
        </div>
        <div class="line">
          <label>学号：</label>
          <span>{{ $route.query.stuNumber }}</span>
        </div>
        <div class="line">
          <label>性别：</label>
          <span>{{ $route.query.stuGender }}</span>
        </div>
      </div>
      <!-- <div class="operator side-bottom">
        <header-tag text="操作" />
        <el-button @click="save">保存</el-button><el-button type="primary" @click="submit">交卷</el-button>
      </div> -->
    </div>
    <!-- <div class="exam-detail-sidebar">
      <div class="side-top performance">
        <header-tag text="成绩" />
        <grade-progress :score="examDetail.stuTotalScore" :percentage="scorePercentage" />
        <div class="line">
          <label>排名：</label>
          <span>第 {{ examDetail.ranking }} 名</span>
        </div>
        <div class="line">
          <label>提交：</label>
          <span>{{ examDetail.submitNumber }} 人</span>
        </div>
        <div class="line">
          <label>总分：</label>
          <span>{{ examDetail.stuTotalScore }} 分</span>
        </div>
      </div>
      <div class="side-bottom">
        <header-tag text="正确率" />
        <accuracy :data="accuracyData" />
      </div>
    </div> -->
  </div>
</template>

<script>
import QuestionCard from '@/views/exam/components/QuestionCard'
import CompletionQuestion from '@/views/exam/components/CompletionQuestion'
import ChoiceQuestion from '@/views/exam/components/ChoiceQuestion'
import { axiosGet } from '@/utils/axios'
import { GET_EXAM_DETAIL_URL } from '@/api/url'
import HeaderTag from '@/components/HeaderTag'
import { typeMap, difficultyMap } from './../config.js'

export default {
  name: 'ExamDetail',

  components: { QuestionCard, HeaderTag, CompletionQuestion, ChoiceQuestion },
  props: [''],
  data() {
    return {
      courseQuestion: {},
      examiningRemainTime: '',
      activeName: '',
      questionId: 0,
      orderNumber: 1,
      questionType: '',
      typeMap: typeMap,
      difficultyMap: difficultyMap,
      questionSort: '一', // 大题序列
      result: '', // 临时存储单选，多选，判断结果
      questionAnswerDtoList: [],
      examinationName: '', // 测试名称
      // 时间相关
      hour: 0,
      minute: 0,
      second: 0,
      // 更新相关
      timerId: '',
      time: 0,
      // 加载
      isLoading: false
    }
  },

  computed: {
    cardData() {
      /* courseQuestion格式
       {
        '1': [
          {
            id: 0,
            questionText: '',
            questionUrl: '',
            questionType: 0,
            questionOption: '',
            questionDifficulty: 0,
            grade: 0,
            questionKnowledge: '',
            studentAnswer: '',
            questionKey: '',
            studentScore: 0
          }
        ]
      }
       */
      const data = []
      if (this.courseQuestion) {
        const courseQuestion = this.courseQuestion
        Object.keys(courseQuestion).forEach(key => {
          if (courseQuestion[key].length) {
            const obj = { label: '', name: '', items: [] }
            obj.label = this.typeMap[key]
            obj.name = key
            courseQuestion[key].forEach(item => {
              /* let bgc = ''
              if (item.studentScore < item.grade) {
                bgc = 'red'
              }
              obj.items.push({ id: item.id, bgc }) */
              obj.items.push({ id: item.id })
            })
            data.push(obj)
          }
        })
      }
      return data
    },
    // 当前题目
    currentQuestion() {
      if (this.courseQuestion && this.questionType && this.orderNumber > 0) {
        return this.courseQuestion[this.questionType][this.orderNumber - 1]
      }
      return {}
    },
    // 题目选项
    questionOption() {
      let arr = []
      const type = this.questionType
      if (this.currentQuestion.questionOption) {
        const tempArr = this.currentQuestion.questionOption.split('|#|')
        tempArr.forEach(item => {
          const tempArr2 = item.split('=')
          arr.push({
            value: tempArr2[0],
            content: tempArr2[1]
          })
        })
      } else if (type === '2') {
        arr = [
          { value: '正确', content: '正确' },
          { value: '错误', content: '错误' }
        ]
      }
      return arr
    }
  },

  watch: {
    questionId: {
      handler(value) {
        // 更新result
        const index = this.getAnswerById(value)
        if (index !== -1) {
          // console.log('questionType', this.questionType)
          if (this.questionType === '4') {
            this.result = this.questionAnswerDtoList[index].studentAnswer || ['']
          } else {
            this.result = this.questionAnswerDtoList[index].studentAnswer || ''
          }
        }
        // 更新大题序号
        this.getQuestionSort()
      },
      immediate: true
    }
  },

  beforeMount() {},

  mounted() {},

  created() {
    this.initial()
  },

  methods: {
    async initial() {
      // 初始化题卡
      await this.getData()
      // 初始化时间
      this.initialTime()
      // 设置答案
      this.setQuestionAnswerDtoList(this.courseQuestion)
      if (this.cardData.length) {
        this.activeName = this.cardData[0].name
        this.questionId = this.cardData[0].items[0].id
        this.questionType = this.activeName
      }
      // 设置更新时间开启定时器
      if (this.examiningRemainTime > 0) {
        this.time = 300
        this.timerId = setInterval(async() => {
          if (this.isLoading) {
            return
          } else {
            this.time--
            if (this.time === 0) {
            // 重新初始化
              await this.getData()
              this.initialTime()
              this.setQuestionAnswerDtoList(this.courseQuestion)
              // 设置计数器
              this.time = 300
            }
          }
        }, 1000)
      }
    },
    // 初始化时间
    initialTime() {
      let count = 0
      let m = this.examiningRemainTime < 0 ? 0 : this.examiningRemainTime
      const arr = [0, 0, 0]
      while (m !== 0 && count <= 2) {
        arr[count] = m % 60
        m = parseInt(m / 60)
        count++
      }
      this.second = this.formatTime(arr[0])
      this.minute = this.formatTime(arr[1])
      this.hour = this.formatTime(arr[2])
    },
    // 格式化时间
    formatTime(time) {
      return String(time).length < 2 ? '0' + time : time
    },
    // 上一题
    prev() {
      // 设置题目id和序列
      const courseQuestion = this.courseQuestion
      if (this.orderNumber !== 1) {
        this.questionId = courseQuestion[this.questionType][this.orderNumber - 1 - 1].id
        this.orderNumber--
      } else {
        const types = this.cardData.map(item => item.name)
        const index = types.findIndex(item => item === this.questionType)
        if (index !== -1 && index !== 0) {
          // 设置题型
          this.activeName = types[index - 1]
          this.questionType = types[index - 1]
          // 设置题目id和序列
          const length = courseQuestion[this.questionType].length
          this.questionId = courseQuestion[this.questionType][length - 1].id
          this.orderNumber = length
        }
      }
    },
    // 下一题
    next() {
      // 设置题目id和序列
      const courseQuestion = this.courseQuestion
      const length = courseQuestion[this.questionType].length
      if (this.orderNumber !== length) {
        this.questionId = courseQuestion[this.questionType][this.orderNumber - 1 + 1].id
        this.orderNumber++
      } else {
        const types = this.cardData.map(item => item.name)
        const index = types.findIndex(item => item === this.questionType)
        if (index !== -1 && index !== types.length - 1) {
          // 设置题型
          this.activeName = types[index + 1]
          this.questionType = types[index + 1]
          // 设置题目id和序列
          this.questionId = courseQuestion[this.questionType][0].id
          this.orderNumber = 1
        }
      }
    },
    // 根据questionId获取索引
    getAnswerById(questionId) {
      return this.questionAnswerDtoList.findIndex(item => item.questionId === questionId)
    },
    // 设置答案
    setQuestionAnswerDtoList(exam) {
      /* 试卷格式
        "1": [
            {
              "id": 13,
              "questionText": "下列单位均为导出单位的是",
              "questionUrl": "",
              "questionType": 1,
              "questionOption": "A=牛顿安培 |#|B=千克 焦耳|#|C=欧姆 伏特|#|D=特斯拉 秒",
              "questionDifficulty": 1,
              "grade": 2,
              "questionKnowledge": "物理",
              "studentAnswer": null
            },
          ]
      */
      /* 答案格式
        {
          "questionId": 0,
          "studentAnswer": ""
        }
      */
      this.questionAnswerDtoList = []
      Object.keys(exam).forEach(key => {
        const questionList = exam[key]
        questionList.forEach(question => {
          let studentAnswer = question.studentAnswer
          if ((question.questionType === 3 || question.questionType === 4) && question.studentAnswer) {
            // 多选题和填空题答案拆分为数组
            studentAnswer = question.studentAnswer.split('|#|')
          }
          const answer = {
            questionId: question.id,
            studentAnswer
          }
          this.questionAnswerDtoList.push(answer)
        })
      })
    },
    // 获取大题序列
    getQuestionSort() {
      const courseQuestion = this.courseQuestion
      const typeOrders = Object.keys(courseQuestion).filter(key => courseQuestion[key].length !== 0)
      const index = typeOrders.findIndex(item => item === this.activeName)
      const orderMap = ['一', '二', '三', '四']
      this.questionSort = orderMap[index]
    },
    // 题卡切换试题
    selectQuestion({ questionId, orderNumber }) {
      if (this.questionId !== questionId) {
        // 设置题目id和序列
        this.questionId = questionId
        this.orderNumber = orderNumber
        // 设置题型
        this.questionType = this.activeName
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.isLoading = true
        axiosGet(GET_EXAM_DETAIL_URL, { params: { examiningId: this.$route.query.examiningId }})
          .then(response => {
            console.log('response', response)
            // const { courseQuestion, examiningRemainTime, examinationName, examiningState } = response.data
            const { courseQuestion, examiningRemainTime, examinationName } = response.data
            // if (examiningState === 1) {
            this.courseQuestion = courseQuestion // 设置题目
            this.examiningRemainTime = examiningRemainTime // 设置剩余时间
            this.examinationName = examinationName
            this.isLoading = false
            /* } else {
              // 关闭定时器
              clearInterval(this.timerId)
              // 提示弹窗
              this.$message.warning('检测结束，正在跳转...')
              // 跳转
              this.$router.push('/exam/exam-monitor')
            } */
            resolve()
          })
          .catch(error => {
            this.isLoading = false
            reject(error)
          })
      })
    }
  }

}

</script>
<style lang='scss' scoped>
.exam-detail {
  height: 100%;
  &-main {
    &-inner {
      padding: 20px;
    }
    flex-grow: 1;
    height: calc(100vh - 50px);
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .header {
      text-align: center;
      font-size: 25px;
    }
    .title {
      color: #333;
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
    }
    .question-title {
      color: #666;
      font-size: 16px;
      line-height: 32px;
    }
    .question-message {
      padding: 20px 0;
      border-top: 1px dashed #ccc;
      flex-wrap: wrap;
      &-item {
        margin-bottom: 10px;
        flex-grow: 1;
        label {
          color: #409EFF;
          margin-right: 5px;
          white-space: nowrap;
        }
        span {
          color: #666
        }
      }
    }

    .btns {
      margin-top: 20px;
    }
  }
  &-sidebar {
    padding: 10px;
    width: 280px;
    height: calc(100vh - 50px);
    border-right: 1px solid #eee;
    border-left: 1px solid #eee;
    flex-shrink: 0;
    .timer {
      border-bottom: 1px solid #eee;
      .time-update {
        height: 30px;
        vertical-align: middle;
        color: #409EFF;
        .icon--tongbu {
          vertical-align: 5px;
          cursor: pointer;
        }
      }
      .time-meter {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: #409EFF;
        font-weight: bold;
        height: 100px;
      }
    }
    .base-message {
      padding-top: 10px;
      .header-tag {
        margin-bottom: 20px;
      }
      .line {
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        background-color: #eee;
        padding-left: 70px;
        color: #666;
        margin-bottom: 10px;
        label {
          font-weight: normal;
          // margin-right: 10px;
        }
      }
    }
    /* .side-top {
      width: 100%;
      border-bottom: 1px dashed #ccc;
      text-align: center;
      .grade-progress {
        margin: 10px 0
      }
    }
    .side-bottom {
      padding-top: 10px;
      .header-tag {
        margin-bottom: 10px;
      }
    }
    .side-middle {
      padding-top: 10px;
      height: 200px;
      border-bottom: 1px dashed #ccc;

    }
    .performance {
      .line {
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        background-color: #eee;
        padding-left: 70px;
        text-align: left;
        color: #666;
        margin-bottom: 10px;
        label {
          font-weight: normal;
          // margin-right: 10px;
        }
      }
    }
    .exam-message {
      .task {
        text-align: center;
        line-height: 100px;
        font-size: 30px;
        color: #409EFF;
        font-weight: bold;
        .icon--task {
          font-size: 30px;
          color: #409EFF;
          margin-right: 10px;
        }
      }
    }
    .question-card {
      .card {
        margin-top: 10px;
      }
    }
    .student-message {
      text-align: center;
      .line {
        line-height: 32px;
        font-size: 16px;
        label {
          font-weight: normal;
        }
      }
    } */
  }

}
</style>
