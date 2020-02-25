<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.teachingTaskId"
        placeholder="教学任务"
        style="width: 200px;"
        class="filter-item"
      >
        <el-option
          v-for="item in teachingTaskList"
          :key="item.id"
          :label="item.teachingTaskAlias"
          :value="item.id"
        />
      </el-select>
      <el-input v-model="listQuery.stuName" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.stuNumber" placeholder="学号" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="学号" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.stuNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuGender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系部" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuDept }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.stuEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="70" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            :style="{color: '#F56C6C'}"
            size="mini"
            type="text"
            @click="handleDelete(row,$index)"
          >
            <i class="el-icon-delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { axiosGet, axiosPost } from '@/utils/axios'
import { GET_ALL_TEACHING_TASK_URL, GET_TEACHING_TASK_PAGE_URL, DELETE_SELECTED_STUDENT_URL } from '@/api/url'

export default {
  name: 'StudentManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: true,
      currentTeachingTaskId: '',
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        teachingTaskId: '',
        stuName: '',
        stuNumber: ''
      },
      teachingTaskList: []
    }
  },
  created() {
    this.getTeachingTaskList()
      .then(() => {
        this.getList()
      })
  },
  methods: {
    // 获取教学任务列表
    getTeachingTaskList() {
      return new Promise((resolve, reject) => {
        axiosGet(GET_ALL_TEACHING_TASK_URL)
          .then(response => {
            this.teachingTaskList = response.data
            if (this.teachingTaskList.length) {
              this.listQuery.teachingTaskId = this.teachingTaskList[0].id
            }
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错了!')
            reject()
          })
      })
    },
    getList() {
      if (this.listQuery.teachingTaskId) {
        this.listLoading = true
        this.currentTeachingTaskId = this.listQuery.teachingTaskId // 同步当前教学任务
        axiosGet(GET_TEACHING_TASK_PAGE_URL, { params: this.listQuery })
          .then(response => {
            const { content, total } = response.data
            this.list = content
            this.total = total
            this.listLoading = false
          })
      }
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleDelete(row, index) {
      this.$confirm('确定退选该学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        console.log('stuId', row.id)
        console.log('teachingTaskId', this.currentTeachingTaskId)
        axiosPost(DELETE_SELECTED_STUDENT_URL, { stuId: row.id, teachingTaskId: this.currentTeachingTaskId })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.app-container {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .el-select {
    width: 100%;
  }
}
</style>
