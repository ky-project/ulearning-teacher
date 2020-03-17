<template>
  <div class="answer-item">
    <el-form-item label="试题类型" :prop="prop">
      <el-select
        :value="value"
        :disabled="disabled"
        size="mini"
        @change="(newValue)=>{$emit('change',newValue)}"
      >
        <el-option
          v-for="item in type"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
      <svg-icon
        v-if="showAdd"
        icon-class="jia"
        class-name="answer-item__add"
        @click="$emit('add')"
      />
    </el-form-item>
  </div>
</template>

<script>

export default {
  name: 'TypeItem',
  components: {},
  props: {
    prop: {
      type: String,
      default: ''
    },
    value: {
      type: [Number, String],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: [
        { id: 1, label: '选择题' },
        { id: 2, label: '判断题' },
        { id: 3, label: '多选题' },
        { id: 4, label: '填空题' }
      ]
    }
  },

  computed: {
    showAdd() {
      if (this.value === 1 || this.value === 3) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='scss' scoped>
.answer-item {
  &__add {
    color: #409EFF;
    font-size: 20px;
    margin-left: 10px;
    cursor: pointer;
    padding-top: 5px;
  }
}
</style>
