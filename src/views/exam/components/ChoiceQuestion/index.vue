<template>
  <div class="choice-question">
    <ul class="choice-question-list">
      <li
        v-for="item in questionOption"
        :key="item.value"
        :class="['choice-question-item', {active: isActive(item)}]"
        @click="clickHandler(item)"
      >
        <span v-if="showValue">{{ item.value }}</span> {{ item.content }}
        <svg-icon v-if="isActive(item)" class="icon--select" icon-class="xuanzhong" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChoiceQuestion',

  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    // [{value: xxx, content: xxx}]
    questionOption: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Array],
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeNumber: ''
    }
  },

  computed: {

  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    isActive(item) {
      // 单选模式
      if (!this.multiple) {
        return item.value === this.value
      } else {
        // 多选模式
        return this.value.includes(item.value)
      }
    },
    clickHandler(item) {
      if (this.disabled) {
        return false
      }
      // 单选模式
      if (!this.multiple) {
        this.$emit('change', item.value)
      } else {
        // 多选模式
        const newValue = this.value === '' ? [] : [...this.value]
        const index = newValue.findIndex(value => value === item.value)
        if (index !== -1) {
          newValue.splice(index, 1)
        } else {
          newValue.push(item.value)
        }
        this.$emit('change', newValue)
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.choice-question {
  &-list {
    margin-top: 20px;

  }
  &-item {
    position: relative;
    width: 100%;
    height: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    line-height: 40px;
    padding: 0px 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 2px #ccc;
    color: #666;
    cursor: pointer;
    span {
      font-weight: bold;
      font-size: 20px;
      color: #333;
      margin-right: 10px;
    }
    .icon--select {
      position: absolute;
      bottom: -4px;
      right: -4px;
      font-size: 30px;
      color: #4d555d;
    }
    &:hover {
      box-shadow: 4px 4px 4px #ccc;
    }
    &.active {
      border: 2px solid #4d555d;
    }
  }
}
</style>
