<template>
  <div class="My-progress">
    <el-progress
      type="dashboard"
      :show-text="false"
      :stroke-width="10"
      :percentage="percentage"
      :color="color"
    />
    <span class="grade-progress-text" :style="{color: color}">{{ score }}</span>
    <span class="grade-progress-title">分数</span>
  </div>
</template>

<script>

export default {
  name: 'GradeProgress',

  components: {},
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      colorMap: [
        { color: '#f56c6c', grade: 59 },
        { color: '#e6a23c', grade: 69 },
        { color: '#5cb87a', grade: 79 },
        { color: '#1989fa', grade: 89 },
        { color: '#6f7ad3', grade: 100 }
      ]
    }
  },

  computed: {
    color() {
      const index = this.colorMap.findIndex(item => this.percentage <= item.grade)
      return this.colorMap[index].color
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='scss' scoped>
.grade-progress {
  position: relative;
  display: inline-block;
  &-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    white-space: nowrap;
    font-family: Tahoma, Geneva, sans-serif;
    font-weight: bold;
    font-size: 50px;
  }
  &-title {
    font-family: Tahoma, Geneva, sans-serif;
    font-weight: bold;
    font-size: 20px;
    color: #666;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%)
  }
}
</style>
