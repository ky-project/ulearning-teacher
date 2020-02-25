<template>
  <div class="document-manage">
    <!-- 操作栏 -->
    <div class="operator-bar">
      <ul class="operator-bar__list clear-fix">
        <li class="operator-bar__list-item fl">
          <svg-icon icon-class="shangchuan" />
          <span>上传</span>
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
          <svg-icon icon-class="wenjian" class-name="icon" />
          <span>{{ scope.row.fileName }}</span>
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
          <span>{{ scope.row.fileSize || '--' }}</span>
        </template>
      </el-table-column>
    </el-table>
    </file-nav></div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GET_ROOT_FOLDER_URL, // 查询文件资料根节点
  GET_DOCUMENTATION_LIST_URL, // 查询文件资料列表
  ADD_FOLDER_URL, // 添加文件夹
  DELETE_DOCUMENTATION_URL, // 删除文件资料
  UPDATE_DOCUMENTATION_URL // 更新文件资料
} from '@/api/url'
import FileNav from '@/views/fileManage/components/FileNav'
import { axiosGet, axiosPost } from '@/utils/axios'
export default {
  // 文件资料管理
  name: 'DocumentManage',
  components: { FileNav },
  props: [''],
  data() {
    return {
      teachingTaskId: '', // 教学任务id
      fileParentId: '', // 父文件id
      currentFileList: [], // 当前文件列表
      navList: [], // 导航列表
      loading: false
    }
  },
  computed: {
    ...mapGetters(['teachingTask']),
    tableHeight() {
      return window.innerHeight - 126
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
    // 查询文件资料列表
    getFileList() {
      return new Promise((resolve, reject) => {
        const data = {
          fileParentId: this.fileParentId,
          teachingTaskId: this.teachingTaskId
        }
        this.loading = true
        console.log('request', data)
        axiosGet(GET_DOCUMENTATION_LIST_URL, { params: data })
          .then(response => {
            this.currentFileList = response.data
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
    // 新建文件夹
    addFolder() {
      const data = {
        fileParentId: this.fileParentId,
        fileName: '新建文件夹',
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
      font-size: 14px;
      margin-right: 5px;
    }
    .operator {
      display: none;
      .item-icon {
        margin-right: 10px;
        font-size: 14px;
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
