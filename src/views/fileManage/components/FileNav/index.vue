<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item,index) in data"
        :key="item.fileId"
      >
        <a href="#" @click="clickHandler(index)">{{ item.fileName }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  props: {
    data: {
      type: Array, // [{fileId: 1, fileName: '新建文件夹'}]
      required: true
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
    clickHandler(index) {
      const newData = this.data.slice(0, index + 1)
      this.$emit('update', newData)
    }
  }

}

</script>
<style lang='' scoped>

</style>
