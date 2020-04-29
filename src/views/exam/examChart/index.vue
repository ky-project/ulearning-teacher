<template>
  <div class="exam-chart">
    <div class="exam-chart__header flex justify-between">
      <el-card class="exam-chart__header__item highest">
        <div class="flex">
          <div class="left">
            <el-progress type="dashboard" :percentage="highestRate" color="#67C23A" />
            <span>正确率</span>
          </div>
          <div class="right">
            <h3>{{ data.highestScore }}</h3>
            <span>最高分</span>
            <svg-icon icon-class="zuigao" class="icon" />
          </div>
        </div>
      </el-card>
      <el-card class="exam-chart__header__item average">
        <div class="flex">
          <div class="left">
            <el-progress type="dashboard" :percentage="averagetRate" color="#409EFF" />
            <span>正确率</span>
          </div>
          <div class="right">
            <h3>{{ data.averageScore }}</h3>
            <span>平均分</span>
            <svg-icon icon-class="pingjun" class="icon" />
          </div>
        </div>
      </el-card>
      <el-card class="exam-chart__header__item lowest">
        <div class="flex">
          <div class="left">
            <el-progress type="dashboard" :percentage="lowestRate" color="#F56C6C" />
            <span>正确率</span>
          </div>
          <div class="right">
            <h3>{{ data.lowestScore }}</h3>
            <span>最低分</span>
            <svg-icon icon-class="zuidi" class="icon" />
          </div>
        </div>
      </el-card>
    </div>
    <div class="exam-chart__bottom flex justify-between">
      <el-card class="level">
        <header-tag text="成绩等级" />
        <div id="level_chart" />
      </el-card>
      <el-card class="number">
        <header-tag text="参与人数" />
        <div id="number_chart" />
        <div class="total">
          <p>{{ data.totalStudent }}</p>
          <span>总人数</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import HeaderTag from '@/components/HeaderTag'
import { axiosGet } from '@/utils/axios'
import { GET_STUDENT_EXAM_STATISTIC_URL } from '@/api/url'
export default {
  name: 'ExamChart',

  components: { HeaderTag },
  props: [''],
  data() {
    return {
      data: {},
      highestRate: 0,
      lowestRate: 0,
      averagetRate: 0
    }
  },

  computed: {
  },

  watch: {},

  beforeMount() {},

  mounted() {

  },

  created() {
    const examinationTaskId = this.$route.query.examinationTaskId
    this.getStaticData({ examinationTaskId })
      .then(() => {
        const { highestScore, lowestScore, averageScore, examinationTotalScore: totalScore } = this.data
        this.highestRate = parseInt(highestScore / totalScore * 100)
        this.lowestRate = parseInt(lowestScore / totalScore * 100)
        this.averagetRate = parseInt(averageScore / totalScore * 100)
        // 初始化图表
        const levelList = []
        this.data.statisticalResultsList.forEach(item => {
          levelList.push(item.stuNumber)
        })
        this.initLevelChart(levelList)
        const numberList = []
        const numberMap = {
          0: '未考',
          1: '在考',
          2: '已考'
        }
        this.data.examinationStatusList.forEach(item => {
          numberList.push({
            value: item.stuNumber,
            name: numberMap[item.resultType]
          })
        })
        // 剔除在考人数
        const index = numberList.findIndex(item => item.name === '在考')
        if (index !== -1) {
          numberList.splice(index, 1)
        }
        this.initNumberChart(numberList)
      })
  },

  methods: {
    getStaticData(data) {
      return axiosGet(GET_STUDENT_EXAM_STATISTIC_URL, { params: data })
        .then(response => {
          this.data = response.data
        })
    },
    initLevelChart(levelList) {
      var myChart = echarts.init(document.getElementById('level_chart'))
      myChart.setOption({
        xAxis: {
          data: ['不及格', '及格', '良好', '优秀']
        },
        yAxis: {
          nameTextStyle: {
            fontSize: 0
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#333'
        },
        grid: {
          top: '30px',
          left: '30px',
          right: '20px'
          // height: '280px',
          // containLabel: true
        },
        barMaxWidth: 100,
        series: [{
          name: '销量',
          type: 'bar',
          data: levelList,
          itemStyle: {
            color: '#409EFF',
            barBorderRadius: [5, 5, 0, 0]
          }
        }]
      })
    },
    initNumberChart(numberList) {
      var myChart = echarts.init(document.getElementById('number_chart'))
      myChart.setOption({
        legend: {
          show: true,
          // orient: 'vertical',
          x: 'right',
          y: '20px'
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            data: numberList,
            color: ['#D1FBEF', '#67C23A', '#F9D858'],
            label: {
              formatter: '{b}: {c}',
              position: 'inside',
              color: '#333'
            }
          }
        ]
      })
    }
  }

}

</script>
<style lang='scss' scoped>
.exam-chart {
  padding: 20px;
  background-color: #eee;
  &__header {
    ::v-deep .el-card__body {
      padding: 0;
    }

    &__item {
      flex-grow: 1;
      height: 120px;
      margin-right: 20px;
      ::v-deep .el-progress-circle {
        width: 100px !important;
        height: 100px !important;
      }
      ::v-deep .el-progress__text {
        font-size: 20px !important;
      }
      &:last-child {
        margin-right: 0;
      }
      .left {
        position: relative;
        padding: 10px 0;
        text-align: center;
        width: 120px;
        height: 120px;
        span {
          position: absolute;
          bottom: 15px;
          font-size: 14px;
          color: #666;
          left: 50%;
          transform: translateX(-50%)
        }
      }
      .right {
        padding: 20px;
        flex-grow: 1;
        height: 120px;
        background: #fff;
        position: relative;
        h3 {
          font-size: 30px;
          margin-top: 10px;
        }
        span {
          color: #333;
          font-size: 14px;
          display: inline-block;
          margin-top: 10px;
        }
        .icon {
          position: absolute;
          right: 10px;
          top: 10px;
          padding: 5px;
          color: #fff;
          font-size: 30px;
          border-radius: 5px;
        }
      }
    }
    .highest {
      background-color:LightGreen;
      .right {
        h3 {
          color: #67C23A;
          border-bottom: 1px solid #67C23A;
        }
        .icon {
          position: absolute;
          background-color: #67C23A;
        }
      }
    }
    .lowest {
      background-color: LightCoral;
      .right {
        h3 {
          color: #F56C6C;
          border-bottom: 1px solid #F56C6C;
        }
        .icon {
          position: absolute;
          background-color: #F56C6C;
        }
      }
    }
    .average {
      background: LightBLue;
      .right {
        h3 {
          color: #409EFF;
          border-bottom: 1px solid #409EFF;
        }
        .icon {
          position: absolute;
          background-color: #409EFF;
        }
      }
    }
  }
  &__bottom {
    margin-top: 20px;
    .el-card {
      height: 400px;
    }
    .level {
      width: calc( (100% - 20px) * 2 / 3 );
      margin-right: 20px;
      #level_chart {
        // width: 100%;
        height: 350px;
      }
    }
    .number {
      position: relative;
      width: calc( (100% - 20px) * 1 / 3 );
      flex-shrink: 0;
      #number_chart {
        height: 350px;
      }
      .total {
        position: absolute;
        top: 200px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        p {
          font-size: 30px;
          color: #409EFF;
        }
        span {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>
