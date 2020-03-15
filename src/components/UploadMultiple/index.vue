<template>
  <div class="upload-multiple">
    <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :on-change="handleChange"
      :file-list="fileList"
      :limit="limit"
      :on-exceed="exceedHandler"
      class="upload-multiple-upload"
    >
      <i slot="default" class="el-icon-plus upload-multiple-add" />
      <div slot="file" slot-scope="{file}" class="upload-multiple-file">
        <div class="file flex">
          <div class="msg flex">
            <svg-icon :icon-class="setFileIcon(getExt(file))" class-name="icon fl" />
            <div>
              <h4>{{ file.name }}</h4>
              <p>{{ setFileSize(file.size) }}</p>
            </div>
          </div>
          <span class="del" @click="deleteHandler(file.uid)">删除</span>
        </div>
      </div>
    </el-upload>
  </div>

</template>

<script>
import { setFileIcon, setFileSize } from '@/utils/index'
export default {
  name: 'UploadMultiple',

  components: {},
  props: {
    fileList: {
      type: Array, // File
      required: true
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
    }
  },

  computed: {},

  watch: {

  },

  beforeMount() {},

  mounted() {},

  methods: {
    exceedHandler() {
      this.$message.warning(`最多提交${this.limit}个文件`)
    },
    handleChange(file, fileList) {
      // console.log('fileList', fileList)
      this.$emit('update:file-list', fileList)
    },
    setFileIcon(ext) {
      return setFileIcon(ext)
    },
    setFileSize(size) {
      return setFileSize(size)
    },
    getExt(file) {
      if (file && file.name) {
        const tempArr = file.name.split('.')
        return tempArr[tempArr.length - 1]
      }
    },
    deleteHandler(uid) {
      this.$emit('delete', uid)
      /* this.$emit('delete')
      this.$refs.upload.clear() */
    }
  }

}

</script>
<style lang='scss' scoped>
.upload-multiple {
  &-upload {
    ::v-deep .el-upload {
      width: 200px;
      height: 60px;
      margin-bottom: 10px;
    }
    ::v-deep .el-upload-list__item {
      width: 200px;
      height: 60px;
    }
  }
  &-add {
    vertical-align: 38px;
  }
  &-file {
    .file {
      padding: 5px 10px;
      background-color: #e3eaf4;
      margin-bottom: 10px;

      .msg {
        .icon {
          font-size: 40px;
          margin-right: 5px;
          margin-top: 5px;
        }
        h4 {
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis; //超出部分以省略号显示
          white-space: nowrap;
          width: 100px;
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
}
</style>
