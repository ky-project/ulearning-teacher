<template>
  <div class="step">
    <!-- <el-button type="text" @click="back">返回</el-button> -->
    <el-steps :active="active" simple finish-status="success">
      <!-- <el-button type="text" class="btn" @click="back">{{ '< 返回' }}</el-button> -->
      <el-step title="1. 基本信息" />
      <el-step title="2. 参数设置" />
      <el-step title="3. 状态设置" />
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'Step',
  components: {},
  props: {
    active: {
      type: Number,
      required: true
    }
  }
}

</script>
<style lang='scss' scoped>
.step {
  .btn {
    position: absolute;
    left: 20px;
    top: 2px;
  }
}
</style>
