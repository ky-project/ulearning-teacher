<template>
  <div class="completion-question">
    <div v-for="(item,index) in answerList" :key="index" class="completion-question-item flex">
      <label>第 {{ index + 1 }} 空</label>
      <input
        type="text"
        placeholder="请输入答案"
        :disabled="disabled"
        :value="item"
        @input="(e) => inputHandler(e.target.value, index)"
      >
    </div>
  </div>
</template>

<script>

export default {
  name: 'CompletionQuestion',

  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    answerList: {
      type: [Array, String], // [xxx, xxx, xxx]
      default: () => []
    }
  },
  data() {
    return {

    }
  },

  computed: {},

  watch: {
    /* answerList(value) {
      if (value === '') {
        this.$emit('change', [''])
      }
    } */
  },

  beforeMount() {},

  mounted() {},

  methods: {
    inputHandler(value, index) {
      const newAnswerList = [...this.answerList]
      newAnswerList[index] = value
      this.$emit('change', newAnswerList)
    }
  }

}

</script>
<style lang='scss' scoped>
.completion-question {
  &-item {
    position: relative;
    height: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    line-height: 40px;
    padding: 0px 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 2px #ccc;
    color: #666;
    label {
      // font-weight: normal;
      margin-right: 10px;
    }
    input {
      border: none;
      flex-grow: 1;
      &:focus {
        outline: none;
      }
    }
  }
}
</style>
