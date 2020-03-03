<template>
  <div class="quantity-picker">
    <label>
      {{ typeMap[value.questionType] }}
    </label>
    <el-input-number
      :value="value.amount"
      controls-position="right"
      step-strictly
      :min="0"
      :step="1"
      size="mini"
      @change="updateAmount"
    />
    <span class="text">道</span>
    <el-input-number
      v-model="value.grade"
      controls-position="right"
      step-strictly
      :min="0"
      :step="1"
      size="mini"
      @change="updateGrade"
    />
    <span class="text">分/道</span>
  </div>
</template>

<script>

export default {
  name: 'QuantityPicker',

  components: {},
  props: {
    value: {
      type: Object,
      required: true // {questionType: 1, amount: 0,grade: 0}
    }
  },
  data() {
    return {
      typeMap: {
        1: '选择题',
        2: '判断题',
        3: '多选题',
        4: '填空题'
      }
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    updateAmount(newValue) {
      const data = {
        questionType: this.value.questionType,
        amount: newValue
      }
      this.$emit('update-amount', data)
    },
    updateGrade(newValue) {
      const data = {
        questionType: this.value.questionType,
        grade: newValue
      }
      this.$emit('update-grade', data)
    }
  }

}

</script>
<style lang='scss' scoped>
.quantity-picker {
  margin-bottom: 20px;
  margin-right: 5px;
  white-space: nowrap;
  label,.text {
    font-size: 14px;
    font-weight: normal;
    color: #666;
  }
  label {
    margin-right: 15px;
  }
}
</style>
