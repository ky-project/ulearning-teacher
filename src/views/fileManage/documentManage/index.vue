<template>
  <div class="document-manage" @contextmenu.prevent="()=>{}">
    <!-- 操作栏 -->
    <div class="operator-bar">
      <ul class="operator-bar__list clear-fix">
        <li :class="['operator-bar__list-item', 'fl', {disabled: zone}]">
          <svg-icon icon-class="shangchuan" />
          <upload
            :url="uploadUrl"
            file-key="file"
            :data="uploadData"
            class-name="upload"
            :on-uploading="onUploading"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="!!zone"
          >
            <span>上传</span>
          </upload>
        </li>
        <li :class="['operator-bar__list-item', 'fl']">
          <svg-icon icon-class="xiazai" />
          <span>下载</span>
        </li>
        <li
          :class="['operator-bar__list-item', 'fl', {disabled: zone}]"
          @click="batchShare"
        >
          <svg-icon icon-class="gongxiang" />
          <span>共享</span>
        </li>
        <li
          :class="['operator-bar__list-item', 'fl', {disabled: zone}]"
          @click="batchDelete"
        >
          <svg-icon icon-class="shanchu" />
          <span>删除</span>
        </li>
        <li :class="['operator-bar__list-item', 'fl', {disabled: zone}]" @click="addFolder">
          <svg-icon icon-class="xinjian" />
          <span>新建文件夹</span>
        </li>
      </ul>
      <el-button class="zone fr" type="text" @click="changeZone">{{ zone ? '个人区' : '共享区' }}</el-button>
    </div>
    <!-- 二级导航 -->
    <div class="sub-nav">
      <file-nav :data="navList" @update="handleUpdate" />
      <div class="filter fr">
        <el-select
          v-if="zone"
          v-model="teachingTaskId"
          placeholder="课程"
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
        <el-select
          v-else
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
            :label="item.showName"
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
            <svg-icon
              v-if="!zone"
              :icon-class="scope.row.documentationShared ? 'quxiaogongxiang' : 'gongxiang'"
              class-name="item-icon"
              @click="share(scope.row)"
            />
            <svg-icon
              v-if="scope.row.fileType === 1"
              icon-class="xiazai"
              class-name="item-icon"
              @click="downloadFile(setFileName(scope.row), scope.row.id)"
            />
            <svg-icon
              v-if="!zone"
              icon-class="shanchu"
              class-name="item-icon"
              @click="deleteFolder(scope.row.id)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否共享"
        min-width="150px"
      >
        <template slot-scope="scope">
          {{ isShare(scope.row) }}
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
      <el-table-column
        label="更新时间"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
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
  UPLOAD_DOCUMENTATION_URL, // 上传文件
  DOWNLOAD_DOCUMENTAION_URL, // 下载文件
  SHARE_DOCUMENTATION_URL, // 分享文件资料
  BATCHSHARE_DOCUMENTATION_URL, // 批量分享文件资料
  BATCHDELETE_DOCUMENTATION_URL, // 批量删除文件资料
  GET_SHAREROOT_FOLDER_URL, // 查询文件资料分享区根节点
  GET_DOCUMENTATION_SHARELIST_URL // 查询文件资料分享区列表
} from '@/api/url'
import { isFile } from '@/utils/validate'
import FileNav from '@/views/fileManage/components/FileNav'
import RightMenu from '@/components/RightMenu/index'
import Upload from '@/components/Upload/index'
import { axiosGet, axiosPost } from '@/utils/axios'
import { setFileIcon, setFileSize } from '@/utils/index'
export default {
  // 文件资料管理
  name: 'DocumentManage',
  components: { FileNav, RightMenu, Upload },
  props: [''],
  data() {
    return {
      zone: 0, // 0-personal , 1-share
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
      fileName: '',
      multipleSelection: []
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
        this.initialFileList()
      }
    }
  },
  created() {
    if (this.teachingTask.length) {
      this.teachingTaskId = this.teachingTask[0].id
      this.initialFileList()
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    // 查询分享区根节点id
    getShareZoneRoot(data) {
      return new Promise((resolve, reject) => {

      })
    },
    // 个人/分享区切换
    changeZone() {
      this.zone = this.zone ? 0 : 1
      this.initialFileList()
    },
    // 格式化分享列
    isShare(item) {
      return item.documentationShared ? '是' : '否'
    },
    // 行选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除文件
    batchDeleteDocumentation(data) {
      return new Promise((resolve, reject) => {
        axiosGet(BATCHDELETE_DOCUMENTATION_URL, { params: data })
          .then(response => {
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 批量分享文件
    batchShareDocumentation(data) {
      return new Promise((resolve, reject) => {
        axiosPost(BATCHSHARE_DOCUMENTATION_URL, data)
          .then(response => {
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 批量删除事件
    batchDelete() {
      const tempArr = this.multipleSelection.map(item => item.id)
      const ids = tempArr.join(',')
      this.batchDeleteDocumentation({ ids })
        .then(() => {
          this.getFileList()
        })
    },
    // 批量分享事件
    batchShare() {
      const tempArr = this.multipleSelection.map(item => item.id)
      const ids = tempArr.join(',')
      const data = {
        ids,
        documentationShared: true
      }
      this.batchShareDocumentation(data)
        .then(() => {
          this.getFileList()
        })
    },
    // 分享/取消事件
    share(item) {
      // console.log(item.documentationShared)
      const data = {
        documentationShared: !item.documentationShared,
        id: item.id
      }
      this.shareDocumentation(data)
        .then(() => {
          this.getFileList()
        })
    },
    // 分享文件
    shareDocumentation(data) {
      return new Promise((resolve, reject) => {
        axiosPost(SHARE_DOCUMENTATION_URL, data)
          .then(response => {
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 设置文件图标
    setFileIcon(ext) {
      return setFileIcon(ext)
    },
    // 计算文件大小
    setFileSize(size) {
      return setFileSize(size)
    },
    // 下载文件
    downloadFile(fileName, id) {
      var a = document.createElement('a')
      a.download = fileName
      a.style.display = 'none'
      const fileurl = process.env.VUE_APP_BASE_API + DOWNLOAD_DOCUMENTAION_URL + '?id=' + id
      a.href = fileurl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    },
    // 初始化文件列表
    initialFileList() {
      // 获取根文件
      this.getRoot()
        .then((response) => {
          let fileId, fileName
          if (!this.zone) {
            fileId = response.data.fileId
            fileName = response.data.fileName
          } else {
            fileId = response.data
            fileName = '根目录'
          }
          this.fileParentId = fileId
          // 添加导航
          this.navList = []
          this.navList.push({ fileId, fileName })
          // 获取文件列表
          this.getFileList()
        })
    },
    // 设置文件名
    setFileName(item) {
      let fileName = item.fileName
      if (item.fileExt) {
        fileName += '.' + item.fileExt
      }
      return fileName
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
      this.updateFile(data)
        .then(() => {
          item.fileName = this.fileName
          item.nameModify = false
          this.fileName = ''
        })
        .catch(() => {
          item.nameModify = false
          this.fileName = ''
        })
    },
    // 修改文件
    updateFile(data) {
      return new Promise((resolve, reject) => {
        axiosPost(UPDATE_DOCUMENTATION_URL, data)
          .then(response => {
            console.log(response)
            resolve(response.data)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
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
        if (!this.zone) {
          this.loading = true
          axiosGet(GET_ROOT_FOLDER_URL, { params: { teachingTaskId: this.teachingTaskId }})
            .then(response => {
              this.loading = false
              resolve(response)
            })
            .catch(error => {
              this.$message.error(error.message || '出错')
              this.loading = false
              reject(error)
            })
        } else {
          this.loading = true
          axiosGet(GET_SHAREROOT_FOLDER_URL, { params: { teachingTaskId: this.teachingTaskId }})
            .then(response => {
              this.loading = false
              resolve(response)
            })
            .catch(error => {
              this.$message.error(error.message || '出错')
              this.loading = false
              reject(error)
            })
        }
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
        if (!this.zone) {
          this.loading = true
          axiosGet(GET_DOCUMENTATION_LIST_URL, { params: data })
            .then(response => {
              this.currentFileList = this.formatFileList(response.data)
              this.loading = false
              resolve()
            })
            .catch(error => {
              this.$message.error(error.message || '出错')
              this.loading = false
              reject(error)
            })
        } else {
          // GET_DOCUMENTATION_SHARELIST_URL
          this.loading = true
          axiosGet(GET_DOCUMENTATION_SHARELIST_URL, { params: data })
            .then(response => {
              this.currentFileList = this.formatFileList(response.data)
              this.loading = false
              resolve()
            })
            .catch(error => {
              this.$message.error(error.message || '出错')
              this.loading = false
              reject(error)
            })
        }
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
      if (this.zone) { return }
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
      span.disabled {
        color: #ccc;
      }
      &:hover {
        color:#409EFF;
        // border: 1px solid #409EFF;
        cursor: pointer;
      }
    }
    .zone {
      padding: 8px 10px;
    }
    .disabled {
      color: #ccc;
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
        cursor: pointer;
        .operator {
          display: inline-block;
        }
      }
    }
  }
}
</style>
