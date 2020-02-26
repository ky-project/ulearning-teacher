<template>
  <div class="document-manage" @contextmenu.prevent="()=>{}">
    <!-- 操作栏 -->
    <div class="operator-bar">
      <ul class="operator-bar__list clear-fix">
        <li class="operator-bar__list-item fl">
          <svg-icon icon-class="shangchuan" />
          <upload
            :url="uploadUrl"
            file-key="file"
            :data="uploadData"
            class-name="upload"
            :on-uploading="onUploading"
            :on-success="onSuccess"
            :on-error="onError"
          >
            <span>上传</span>
          </upload>
        </li>
        <li class="operator-bar__list-item fl">
          <svg-icon icon-class="xiazai" />
          <span>下载</span>
        </li>
        <li class="operator-bar__list-item fl">
          <svg-icon icon-class="gongxiang" />
          <span>共享</span>
        </li>
        <li class="operator-bar__list-item fl">
          <svg-icon icon-class="shanchu" />
          <span>删除</span>
        </li>
        <li class="operator-bar__list-item fl" @click="addFolder">
          <svg-icon icon-class="xinjian" />
          <span>新建文件夹</span>
        </li>
      </ul>
    </div>
    <!-- 二级导航 -->
    <div class="sub-nav">
      <file-nav :data="navList" @update="handleUpdate" />
      <div class="filter fr">
        <el-select
          v-model="teachingTaskId"
          placeholder="教学任务"
          style="width: 200px;"
          class="filter-item"
          size="mini"
          :style="{marginTop: '5px'}"
        >
          <el-option
            v-for="item in teachingTask"
            :key="item.id"
            :label="item.teachingTaskAlias"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>
    <!-- 文件区 -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="currentFileList"
      tooltip-effect="dark"
      style="width: 100%"
      size="mini"
      class="file-zone"
      :height="tableHeight"
      @row-contextmenu="rightClick"
      @row-dblclick="handleDbclick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="文件名"
        min-width="300px"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="setFileIcon(scope.row.fileExt)" class-name="icon" />
          <input
            v-if="scope.row.nameModify"
            v-model="fileName"
            v-focus
            @blur="blurHandler(scope.row)"
          >
          <span v-else>{{ setFileName(scope.row) }}</span>
          <div class="operator fr">
            <svg-icon icon-class="gongxiang" class-name="item-icon" />
            <svg-icon v-if="scope.row.fileType === 1" icon-class="xiazai" class-name="item-icon" />
            <svg-icon icon-class="shanchu" class-name="item-icon" @click="deleteFolder(scope.row.id)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否共享"
        min-width="150px"
      >
        <template slot-scope="scope">
          {{ scope.row.documentatioinShared ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="大小"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span>{{ setFileSize(scope.row.fileSize) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 右键菜单 -->
    <right-menu
      :visible.sync="visible"
      :data="menuList"
      el="tbody"
      @click="rightMenuItemClick"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GET_ROOT_FOLDER_URL, // 查询文件资料根节点
  GET_DOCUMENTATION_LIST_URL, // 查询文件资料列表
  ADD_FOLDER_URL, // 添加文件夹
  DELETE_DOCUMENTATION_URL, // 删除文件资料
  UPDATE_DOCUMENTATION_URL, // 更新文件资料
  UPLOAD_DOCUMENTATION_URL // 上传文件
} from '@/api/url'
import { isFile } from '@/utils/validate'
import FileNav from '@/views/fileManage/components/FileNav'
import RightMenu from '@/components/RightMenu/index'
import Upload from '@/components/Upload/index'
import { axiosGet, axiosPost } from '@/utils/axios'
export default {
  // 文件资料管理
  name: 'DocumentManage',
  components: { FileNav, RightMenu, Upload },
  props: [''],
  data() {
    return {
      teachingTaskId: '', // 教学任务id
      fileParentId: '', // 父文件id
      currentFileList: [], // 当前文件列表
      navList: [], // 导航列表
      loading: false,
      // 右键菜单相关
      menuList: [
        { icon: 'rename', content: '重命名' }
      ],
      visible: false,
      currentRowData: {},
      // 重命名相关
      fileName: ''
    }
  },
  computed: {
    ...mapGetters(['teachingTask']),
    tableHeight() {
      return window.innerHeight - 126
    },
    uploadData() {
      return {
        fileParentId: this.fileParentId,
        teachingTaskId: this.teachingTaskId,
        documentationShared: false,
        documentationCategory: 1 // 暂时不用
      }
    },
    uploadUrl() {
      return UPLOAD_DOCUMENTATION_URL
    }
  },
  watch: {
    teachingTaskId() {
      if (this.fileParentId) {
        this.getFileList()
      }
    }
  },
  created() {
    // 设置默认教学任务
    if (this.teachingTask.length) {
      this.teachingTaskId = this.teachingTask[0].id
      // 获取根文件
      this.getRoot()
        .then(() => {
          // 获取文件列表
          this.getFileList()
        })
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    handleSelectionChange() {

    },
    // 设置图标
    setFileIcon(ext) {
      if (!ext) {
        return 'wenjian'
      }
      const map = {
        txt: ['txt'],
        wendang: ['doc', 'docx'],
        excel: ['xls', 'xlsx'],
        ppt: ['ppt', 'pptx'],
        tupian: ['jpg', 'jpeg', 'png'],
        pdf: ['pdf'],
        shiping: ['flv', 'rmvb', 'mp4', 'mvb'],
        yinping: ['wma', 'mp3'],
        yasuobao: ['rar', 'zip']
      }
      const result = Object.keys(map).find(key => map[key].includes(ext))
      if (!result) {
        return 'weizhi'
      }
      return result
    },
    // 设置文件名
    setFileName(item) {
      let fileName = item.fileName
      if (item.fileExt) {
        fileName += '.' + item.fileExt
      }
      return fileName
    },
    // 设置文件大小
    setFileSize(size) {
      if (!size) {
        return '--'
      }
      const level = ['B', 'KB', 'MB', 'GB', 'TB']
      let num = 0
      while (Math.floor(size / 1024) > 0) {
        size = size / 1024
        num++
      }
      return size.toFixed(2) + level[num]
    },
    // 重命名
    blurHandler(item) {
      // 判空
      this.fileName = this.fileName.trim()
      if (this.fileName === '') {
        item.nameModify = false
        return false
      }
      // 判断格式
      if (!isFile(this.fileName)) {
        this.$message.error('文件名不能包含以下任何字符: \ / : * ? " < > |')
        item.nameModify = false
        this.fileName = ''
        return false
      }
      // 发送请求
      const data = {
        fileName: this.fileName,
        id: item.id
      }
      axiosPost(UPDATE_DOCUMENTATION_URL, data)
        .then(response => {
          item.fileName = this.fileName
          item.nameModify = false
          this.fileName = ''
        })
        .catch(error => {
          this.$message.error(error.message || '出错')
          item.nameModify = false
          this.fileName = ''
        })
    },
    // 右键菜单项点击事件
    rightMenuItemClick(index) {
      switch (index) {
        case 0: this.currentRowData.nameModify = true // 切换文件名状态
      }
    },
    // 右键事件
    rightClick(row, column, event) {
      console.log('当前行', row)
      this.currentRowData = row
    },
    // 导航点击事件
    handleUpdate(navList) {
      this.navList = navList
      this.fileParentId = this.navList[this.navList.length - 1].fileId
      this.getFileList()
    },
    // 监听行双击事件
    handleDbclick(row, column, event) {
      const { fileType, fileId, fileName } = row
      // 1. 判断是否是文件夹
      if (fileType === 2) {
        // 2. 是，进入文件夹
        this.fileParentId = fileId
        this.getFileList()
          .then(() => {
            // 3. 添加导航
            this.navList.push({ fileId, fileName })
          })
      }
    },
    // 获取根节点
    getRoot() {
      return new Promise((resolve, reject) => {
        this.loading = true
        axiosGet(GET_ROOT_FOLDER_URL, { params: { teachingTaskId: this.teachingTaskId }})
          .then(response => {
            const { fileId, fileName } = response.data
            this.fileParentId = fileId
            // 添加导航
            this.navList = []
            this.navList.push({ fileId, fileName })
            this.loading = false
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.loading = false
            reject(error)
          })
      })
    },
    // 格式化文件资料列表
    formatFileList(fileList) {
      return fileList.map(item => { item.nameModify = false; return item }) // 添加修改名称状态属性
    },
    // 查询文件资料列表
    getFileList() {
      return new Promise((resolve, reject) => {
        const data = {
          fileParentId: this.fileParentId,
          teachingTaskId: this.teachingTaskId
        }
        this.loading = true
        axiosGet(GET_DOCUMENTATION_LIST_URL, { params: data })
          .then(response => {
            this.currentFileList = this.formatFileList(response.data)
            console.log(this.currentFileList)
            this.loading = false
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.loading = false
            reject(error)
          })
      })
    },
    // 获取新的文件名
    getNewFileName() {
      let findNewName = false
      const baseName = '新建文件夹'
      let count = 1
      let currentName = baseName
      while (!findNewName) {
        const result = this.currentFileList.findIndex(item => item.fileName === currentName)
        if (result === -1) {
          findNewName = true
        } else {
          currentName = baseName + count
          count++
        }
      }
      return currentName
    },
    // 新建文件夹
    addFolder() {
      const data = {
        fileParentId: this.fileParentId,
        fileName: this.getNewFileName(),
        teachingTaskId: this.teachingTaskId
      }
      axiosPost(ADD_FOLDER_URL, data)
        .then(response => {
          // 获取文件资料列表
          this.getFileList()
        })
        .catch(error => {
          this.$message.error(error.message || '出错')
        })
    },
    // 删除文件/文件夹
    deleteFolder(fileId) {
      axiosGet(DELETE_DOCUMENTATION_URL, { params: { id: fileId }})
        .then(response => {
          this.getFileList()
        })
        .catch(error => {
          this.$message(error.message || '出错')
        })
    },
    // 上传中
    onUploading() {
      this.loading = true
    },
    // 上传成功
    onSuccess() {
      this.getFileList()
      this.loading = false
    },
    // 上传失败
    onError(msg) {
      this.$message.error(msg)
      this.loading = false
    }
  }

}

</script>
<style lang='scss' scoped>
.document-manage {
  .operator-bar {
    width: 100%;
    height: 36px;
    padding: 3px 10px;
    // background-color: #DCDFE6;
    &__list-item {
      padding: 5px;
      border-radius: 3px;
      margin-right: 10px;
      box-sizing: border-box;
      .upload {
        display: inline-block;
      }
      span {
        font-size: 14px;
      }
      &:hover {
        color:#409EFF;
        // border: 1px solid #409EFF;
        cursor: pointer;
      }
    }
  }
  .sub-nav {
    height: 40px;
    padding: 0 10px;
    // background-color: #EBEEF5;
    border: 1px solid #ddd;
    overflow: hidden;
    ::v-deep .el-breadcrumb {
      margin-top: 13px;
      width: 70%;
      float: left;
    }
    ::v-deep .el-button {
      padding: 6px;
      margin-top: 5px;
    }
  }
  .file-zone {
    .icon {
      font-size: 18px;
      margin-right: 5px;
    }
    .operator {
      display: none;
      .item-icon {
        margin-right: 10px;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #409EFF;
        }
      }
    }
    &::v-deep .el-table__row {
      &:hover {
        .operator {
          display: inline-block;
        }
      }
    }
  }
}
</style>
