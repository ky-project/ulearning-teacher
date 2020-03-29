<template>
  <div v-if="type !== ''" class="answer-item">
    <template v-if="type === 4">
      <el-form-item
        v-for="(answer,index) in value"
        :key="index"
        :label="`第 ${index + 1} 空`"
      >
        <div>
          <el-input
            :value="answer"
            size="mini"
            @input="(newAnswer) => changeAnswer(index, newAnswer)"
          />
          <svg-icon
            icon-class="jian"
            class-name="answer-item__delete"
            @click="deleteAnswer(index)"
          />
        </div>
      </el-form-item>
    </template>
    <el-form-item v-else label="答案" :prop="prop">
      <!-- 填空题 -->
      <!-- <el-input
          v-for="answer in value"
          :value="value"
          size="mini"
          @input="(newValue)=>{$emit('update',newValue )}"
        /> -->
      <!-- 判断题 -->
      <el-select
        v-if="type === 2"
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
      <!-- 单选题 -->
      <el-select
        v-else-if="type === 1"
        :value="value"
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
      <!-- 多选题 -->
      <el-select
        v-else
        :value="value"
        multiple
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
// import { GetId } from '@/utils/index.js'
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
  },
  methods: {
    /* getId() {
      return GetId()
    }, */
    // 修改答案内容
    changeAnswer(index, value) {
      const answer = [...this.value]
      answer[index] = value
      this.$emit('change', answer)
    },
    // 删除答案项
    deleteAnswer(index) {
      const answer = [...this.value]
      answer.splice(index, 1)
      this.$emit('change', answer)
    }
  }
}

</script>
<style lang='scss' scoped>
.answer-item {
  &__delete {
    color: #409EFF;
    font-size: 20px;
    margin-left: 10px;
    cursor: pointer;
    padding-top: 5px;
  }
}
</style>
