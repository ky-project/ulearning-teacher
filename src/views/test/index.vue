<template>
  <div>
    <div id="main" :style="{ height: '400px'}" />
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Test',

  components: { },
  props: {

  },
  data() {
    return {
      // fileList: []
      fileList: []
    }
  },
  mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    myChart.setOption({
      xAxis: {
        data: ['不及格', '及格', '良好', '优秀']
      },
      yAxis: {
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
  }
}

</script>
<style lang='scss' scoped>
</style>
