<template>
  <div>
    <UploadMultiple :file-list.sync="fileList" @delete="deleteFile" />
  </div>
</template>

<script>
import UploadMultiple from '@/components/UploadMultiple'
export default {
  name: 'Test',

  components: { UploadMultiple },
  props: {

  },
  data() {
    return {
      // fileList: []
      fileList: []
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    deleteFile(uid) {
      const index = this.fileList.findIndex(item => item.uid === uid)
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
    }
  }

}

</script>
<style lang='scss' scoped>
</style>
