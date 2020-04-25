<template>
  <div class="question-card">
    <el-tabs :type="type" size="mini" :value="activeName" class="question-card-tab" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in data"
        :key="item.name"
        :label="item.label"
        :name="item.name"
        class="question-card-tab-pane"
      >
        <ul class="question-card-list">
          <li
            v-for="(child,index) in item.items"
            :key="child.id"
            :class="['question-card-item',{active: child.id === questionId}]"
            :style="[{backgroundColor: child.id === questionId ? '' : child.studentAnswer ? 'rgba(94, 229, 69, 1)' : child.bgc}]"
            @click="itemClickHandler(child.id, index)"
          >
            {{ index + 1 }}
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'QuestionCard',

  components: {},
  props: {
    // { 0: [], 1: [], 2: [], 3: [] }
    // [{name: xxx, label: xxx, items: [{id: xxx, bgc: xxx}]}]
    data: {
      type: Array,
      required: true
    },
    activeName: {
      type: String,
      required: true
    },
    questionId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    handleClick(tab) {
      this.$emit('update:active-name', tab.name)
    },
    itemClickHandler(id, index) {
      this.$emit('update', { questionId: id, orderNumber: index + 1 })
    }
  }

}

</script>
<style lang='scss' scoped>
.question-card {
  width: 260px;
  &-list {
    padding: 5px 0 0 5px;
  }
  &-item {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #666;
    background-color: #fff;
    box-shadow: -1px -1px 1px #ccc;
    cursor: pointer;
  }
  .active {
    color: #fff;
    background-color: #409EFF;
  }
}
</style>
