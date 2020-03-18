<template>
  <div class="option-item">
    <el-form-item :label="'选项'+option.label" :prop="prop" :rules="rules">
      <el-input
        :value="option.value"
        size="mini"
        @input="(newValue)=>{$emit('input',newValue )}"
      />
      <svg-icon
        icon-class="jian"
        class-name="option-item__delete"
        @click="$emit('delete')"
      />
    </el-form-item>
  </div>
</template>

<script>

export default {
  name: 'OptionItem',

  components: {},
  props: {
    prop: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    option: {
      type: Object,
      required: true
    },
    minWidth: {
      type: String,
      default: '200px'
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

  methods: {}

}

</script>
<style lang='scss' scoped>
.option-item {
  &__delete {
    color: #409EFF;
    font-size: 22px;
    margin-left: 10px;
    cursor: pointer;
    padding-top: 6px;
  }
}
</style>
