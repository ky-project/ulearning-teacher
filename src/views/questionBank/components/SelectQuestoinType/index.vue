<template>
  <div>
    <type-item
      :value="type"
      :prop="typeProp"
      @change="changeType"
      @add="addOption"
    />
    <option-item
      v-for="(option,index) in options"
      :key="option.label"
      :prop="getOptionProp(index)"
      :rules="optionRule"
      :value="option.value"
      :option="option"
      @input="(newValue) => { changeOptions(index, newValue) }"
      @delete="deleteOption(index)"
    />
    <answer-item
      :value="answer"
      :type="type"
      :options="answerOptions"
      :prop="answerProp"
      @update="(newValue) => {$emit('update:answer', newValue)}"
    />
  </div>
</template>
<script>
import TypeItem from '@/views/questionBank/components/TypeItem'
import OptionItem from '@/views/questionBank/components/OptionItem'
import AnswerItem from '@/views/questionBank/components/AnswerItem'
export default {
  name: 'SelectQuestionType',

  components: { TypeItem, OptionItem, AnswerItem },
  props: {
    optionProp: {
      type: String,
      default: ''
    },
    optionRule: {
      type: Array,
      default: () => []
    },
    answerProp: {
      type: String,
      default: ''
    },
    typeProp: {
      type: String,
      default: ''
    },
    type: {
      type: [Number, String],
      required: true
    },
    options: {
      type: Array,
      default: () => [] // [{label: xxx, value: xxx}]
    },
    answer: {
      type: [Array, String, Number],
      required: true
    }
  },
  data() {
    return {
      keys: []
    }
  },
  computed: {
    answerOptions() {
      if (this.type === 2 || this.type === 4) {
        return []
      } else {
        return this.options.map(item => item.label)
        // return options.length ? options : []
        // return options
      }
    }
  },

  watch: {},
  created() {
    this.getKeys()
  },

  beforeMount() {},

  mounted() {},

  methods: {
    getOptionProp(index) {
      if (this.optionProp) {
        return this.optionProp + '.' + index + '.value'
      }
      return ''
    },
    // 生成大写字母
    getKeys() {
      for (var i = 65; i < 75; i++) {
        this.keys.push(String.fromCharCode(i))
      }
    },
    // 重排序
    resort(options) {
      options.forEach((item, index) => {
        item.label = this.keys[index]
      })
    },
    // 添加选项
    addOption() {
      console.log('addOption')
      if (this.options.length === 6) {
        this.$message.warning('最多添加6个选项')
        return false
      }
      const options = [...this.options]
      options.push({ label: this.keys[this.options.length], value: '' })
      this.$emit('update:options', options)
    },
    // 清空选项
    clearOptions() {
      this.$emit('update:options', [])
      this.$emit('update:answer', '')
    },
    // 创建默认选项
    createDefaultOptions() {
      const options = [
        { label: 'A', value: '' },
        { label: 'B', value: '' },
        { label: 'C', value: '' },
        { label: 'D', value: '' }
      ]
      this.$emit('update:options', options)
      this.$emit('update:answer', '')
    },
    // 删除选项
    deleteOption(index) {
      const options = [...this.options]
      // const key = options[index].label
      // console.log(key)
      options.splice(index, 1)
      this.resort(options)
      if (this.type === 1 || this.type === 3) {
        this.$emit('update:answer', '')
      }
      this.$emit('update:options', options)
    },
    // 修改选项内容
    changeOptions(index, value) {
      const options = [...this.options]
      options[index].value = value
      this.$emit('update:options', options)
    },
    // 修改题型
    changeType(value) {
      if (value === 1 || value === 3) {
        this.createDefaultOptions()
      } else {
        this.clearOptions()
      }
      this.$emit('update:type', value)
    }
  }

}

</script>
<style lang="" scoped >
</style>
