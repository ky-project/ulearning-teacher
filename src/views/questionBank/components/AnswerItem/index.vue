<template>
  <div v-if="type !== ''" class="answer-item">
    <el-form-item label="答案" :prop="prop">
      <!-- 填空题 -->
      <el-input
        v-if="type === 4"
        :value="value"
        size="mini"
        @input="(newValue)=>{$emit('update',newValue )}"
      />
      <!-- 判断题 -->
      <el-select
        v-else-if="type === 2"
        :value="value"
        size="mini"
        @change="(newValue)=>{$emit('update',newValue)}"
      >
        <el-option
          key="错误"
          label="错误"
          value="错误"
        />
        <el-option
          key="正确"
          label="正确"
          value="正确"
        />
      </el-select>
      <!-- 多选题, 单选题 -->
      <el-select
        v-else
        :value="value"
        :multiple="type === 3"
        size="mini"
        @change="(newValue)=>{$emit('update',newValue)}"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>

export default {
  name: 'AnswerItem',
  props: {
    prop: {
      type: String,
      default: ''
    },
    type: {
      type: [Number, String],
      default: 0 // 0-单选框 1-多选框 2-文本框
    },
    value: {
      type: [String, Array, Number],
      required: true
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
