<template>
  <div class="download-box flex">
    <div class="msg flex">
      <svg-icon :icon-class="setFileIcon(getExt(file))" class-name="icon fl" />
      <div>
        <h4>{{ file.name }}</h4>
        <p>{{ setFileSize(file.size) }}</p>
      </div>
    </div>
    <span class="del" @click="download(file)">下载</span>
  </div>
</template>

<script>
import { setFileIcon, setFileSize } from '@/utils/index'
import { DOWNLOAD_EXPERIMENT_RESULT_URL } from '@/api/url.js'
export default {
  name: 'DownloadBox',

  components: {},
  props: {
    file: {
      type: Object,
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
    download(file) {
      const { name, id } = file
      var a = document.createElement('a')
      a.download = name
      a.style.display = 'none'
      const fileurl = process.env.VUE_APP_BASE_API + DOWNLOAD_EXPERIMENT_RESULT_URL + '?id=' + id
      a.href = fileurl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    }
  }

}

</script>
<style lang='scss' scoped>
.download-box {
  padding: 5px 10px;
  background-color: #e3eaf4;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 200px;
  height: 60px;
  .msg {
    .icon {
      font-size: 40px;
      margin-right: 5px;
      margin-top: 5px;
    }
    h4 {
      margin-top: 5px;
      line-height: 23px;
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
</style>
