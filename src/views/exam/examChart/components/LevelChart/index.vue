<template>
  <div id="level_chart" class="level-chart">
    hello
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: '',

  components: {},
  props: [''],
  data() {
    return {

    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {
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
      barMaxWidth: 100,
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10],
        itemStyle: {
          color: '#409EFF',
          barBorderRadius: [5, 5, 0, 0]
        }
      }]
    })
  },

  methods: {}

}

</script>
<style lang='' scoped>

</style>
