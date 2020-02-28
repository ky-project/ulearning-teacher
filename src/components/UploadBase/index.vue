<template>
  <div :class="className">
    <input v-show="false" ref="input" type="file" @change="changeHandler">
    <div @click="clickHandler">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    clear() {
      this.$refs.input.value = ''
    },
    clickHandler() {
      this.$refs.input.click()
    },
    changeHandler() {
      // 1. 获取文件
      const curFiles = this.$refs.input.files
      if (curFiles.length) {
        this.$emit('onLoaded', curFiles[0])
      }
    }
  }

}

</script>
<style lang='' scoped>

</style>
