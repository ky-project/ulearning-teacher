<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.teachingTaskId"
        placeholder="教学任务"
        style="width: 225px;"
        class="filter-item"
      >
        <el-option
          v-for="item in teachingTask"
          :key="item.id"
          :label="'[' + item.term + ']' + item.teachingTaskAlias"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.experimentTitle"
        placeholder="实验名"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item fr"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        添加
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
      <el-table-column label="实验编号" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ '实验'+row.experimentOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.experimentTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="center" min-width="70" class-name="small-padding fixed-width">
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
      </el-table-column> -->
    </el-table>
    <!-- 分页器 -->
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    /> -->
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { axiosGet, axiosPost } from '@/utils/axios'
import { GET_EXPERIMENT_PAGE_URL } from '@/api/url'
import { mapGetters } from 'vuex'
export default {
  name: 'ExperimentList',
  components: { Pagination },
  directives: { waves },
  computed: {
    ...mapGetters(['teachingTask'])
  },
  data() {
    return {
      /*
      currentTeachingTaskId: '',*/
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        teachingTaskId: '',
        experimentTitle: ''
      }
    }
  },
  created() {
    if (this.teachingTask.length) {
      this.listQuery.teachingTaskId = this.teachingTask[0].id
    }
    // 请求表格数据
    this.getList()
  },
  methods: {
    handleCreate() {
      this.$router.push('/experiment-manage/experiment-content')
    },
    // 查询实验信息
    getList() {
      new Promise((resolve, reject) => {
        this.listLoading = true
        axiosGet(GET_EXPERIMENT_PAGE_URL, { params: this.listQuery })
          .then(response => {
            this.list = response.data.content
            this.listLoading = false
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.listLoading = false
          })
      })
    },
    // 获取教学任务列表
    /* getTeachingTaskList() {
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
    },*/
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    }
    /* setPagination(currentPage, pageSize) {
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
    }  */
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
