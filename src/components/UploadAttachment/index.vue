<template>
  <div class="upload-attachment">
    <upload-base ref="upload" @onLoaded="onLoaded">
      <el-button type="text" :disabled="disabled">
        <svg-icon icon-class="biezhen" />
        添加附件（仅限一个）
      </el-button>
    </upload-base>
    <div v-if="value" class="file flex">
      <div class="msg flex">
        <svg-icon :icon-class="setFileIcon(getExt(value))" class-name="icon fl" />
        <div>
          <h4>{{ value.name }}</h4>
          <p>{{ setFileSize(value.size) }}</p>
        </div>
      </div>
      <span class="del" @click="deleteHandle">删除</span>
    </div>
  </div>
</template>

<script>
import UploadBase from '@/components/UploadBase'
import { setFileIcon, setFileSize } from '@/utils/index'
export default {
  name: 'UploadAttachment',

  components: { UploadBase },
  props: {
    value: {
      type: [File, String, Object],
      required: true
    }
  },

  computed: {
    disabled() {
      return !!this.value
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    deleteHandle() {
      this.$emit('delete')
      this.$refs.upload.clear()
    },
    setFileIcon(ext) {
      return setFileIcon(ext)
    },
    setFileSize(size) {
      return setFileSize(size)
    },
    onLoaded(file) {
      this.$emit('input', file)
    },
    getExt(file) {
      if (file && file.name) {
        const tempArr = file.name.split('.')
        return tempArr[tempArr.length - 1]
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.upload-attachment {
  .file {
    width: 200px;
    height: 60px;
    padding: 10px 5px;
    background-color: #e3eaf4;
    margin-bottom: 10px;

    .msg {
      .icon {
        font-size: 40px;
        margin-right: 5px;
      }
      h4 {
        margin-top: 5px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis; //超出部分以省略号显示
        white-space: nowrap;
        width: 110px;
      }
      p {
        font-size: 12px;
        color: #b0b0b0;
      }
    }
    .del {
      color: #409EFF;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
