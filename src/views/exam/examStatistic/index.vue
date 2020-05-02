<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.examinationTaskId"
        placeholder="测试任务"
        style="width: 200px;"
        size="small"
        class="filter-item"
      >
        <el-option
          v-for="item in examList"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left: 10px;"
        size="small"
        round
        icon="el-icon-search"
        :disabled="isDisabled"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        v-waves
        class="filter-item fr"
        type="primary"
        style="margin-left: 10px;"
        size="small"
        round
        @click="handleExport"
      >
        <svg-icon icon-class="daochu" />
        导出
      </el-button>
      <el-button
        v-waves
        class="filter-item fr"
        type="primary"
        size="small"
        round
        @click="() => {$router.push('/exam/exam-chart?examinationTaskId=' + currentExamnationTaskId)}"
      >
        <svg-icon icon-class="tongji2" />
        统计
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="small"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
        :index="indexMethod"
      />
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
      <el-table-column label="系部" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuDept }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ranking }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正确率" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ (row.accuracy * 100).toFixed(2) + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.examiningStateSwitchTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[8, 16, 32, 64]"
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
import {
  DELETE_SELECTED_STUDENT_URL,
  GET_EXAM_LIST_URL,
  GET_STUDENT_EXAM_RESULT_PAGE,
  EXPORT_EXAM_RESULT
} from '@/api/url'

export default {
  name: 'ExamStatistic',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      currentTeachingTaskId: '',
      currentExamnationTaskId: '',
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        teachingTaskId: '',
        examinationTaskId: ''
      },
      teachingTaskList: [],
      examList: [],
      examListMap: {},
      isDisabled: false // 是否禁用查询
    }
  },
  watch: {
    '$store.getters.teachingTaskId': {
      handler(value) {
        this.listQuery.teachingTaskId = value
        this.changeHandler(value)
          .then(() => {
            this.getList()
          })
      },
      immediate: false
    }
  },
  created() {
    this.changeHandler(this.$store.getters.teachingTaskId)
      .then(() => {
        this.getPagePars()
        this.getList()
      })
  },
  methods: {
    isInExamList(examinationTaskId) {
      return this.examList.findIndex(examItem => examItem.key === examinationTaskId) > -1
    },
    getPagePars() {
      const { pagePars } = this.$store.getters
      const path = this.$route.path
      if (pagePars.has(path)) {
        const { currentPage, pageSize, filter } = pagePars.get(path)
        const flag = this.isInExamList(filter.examinationTaskId)
        if (flag) {
          this.examinationTaskId = filter.examinationTaskId
        }
        this.listQuery = {
          currentPage,
          pageSize,
          teachingTaskId: this.listQuery.teachingTaskId
        }
        return true
      } else {
        return false
      }
    },
    savePagePars() {
      const path = this.$route.path
      const pars = {
        currentPage: this.listQuery.currentPage,
        pageSize: this.listQuery.pageSize,
        filter: {
          examinationTaskId: this.listQuery.examinationTaskId
        }
      }
      this.$store.dispatch('pagePars/savePagePars', { path, pars })
    },
    // 下载文件
    handleExport() {
      var a = document.createElement('a')
      a.download = ''
      a.style.display = 'none'
      const fileurl = process.env.VUE_APP_BASE_API + EXPORT_EXAM_RESULT + '?examinationTaskId=' + this.currentExamnationTaskId
      a.href = fileurl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    },
    // 分页查询学生测试
    getList() {
      this.savePagePars()
      if (!this.listQuery.examinationTaskId) {
        this.currentExamnationTaskId = ''
        this.list = []
        this.total = 0
        return
      }
      return new Promise((resolve, reject) => {
        this.listLoading = true
        axiosGet(GET_STUDENT_EXAM_RESULT_PAGE, { params: this.listQuery })
          .then(response => {
            const { content, total } = response.data
            this.currentExamnationTaskId = this.listQuery.examinationTaskId
            this.list = content
            this.total = total
            this.listLoading = false
            resolve()
          })
          .catch((error) => {
            this.listLoading = false
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 根据教学任务id查询测试任务数组
    getExamList(data) {
      return new Promise((resolve, reject) => {
        axiosGet(GET_EXAM_LIST_URL, { params: data })
          .then(response => {
            resolve(response)
          })
          .catch((error) => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 切换教学任务
    changeHandler(teachingTaskId) {
      return new Promise((resolve, reject) => {
        // 0. 清空
        this.examList = []
        this.listQuery.examinationTaskId = ''
        // 1. 尝试根据id直接获取
        if (this.examListMap[teachingTaskId]) {
          // 2. 成功，替换
          if (this.examListMap[teachingTaskId].length) {
            this.isDisabled = false
            this.examList = [...this.examListMap[teachingTaskId]]
            this.listQuery.examinationTaskId = this.examList[0].key
          } else {
            // 2. 成功，但无值
            this.isDisabled = true
            // this.examListMap[teachingTaskId] = []
          }
          resolve()
        } else {
        // 3. 失败，请求
          this.getExamList({ teachingTaskId })
            .then(response => {
              // 3.1 筛选出测试结束的试卷
              this.examList = response.data.filter(item => item.condition === 4)
              // 3.2 有，赋值并存储
              if (this.examList.length) {
                this.isDisabled = false
                this.examListMap[teachingTaskId] = this.examList
                this.listQuery.examinationTaskId = this.examList[0].key
              } else {
                // 3.2 没有, 设置并禁用查询按钮
                this.isDisabled = true
                this.examListMap[teachingTaskId] = []
              }
              resolve()
            })
        }
      })
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
        // console.log('stuId', row.id)
        // console.log('teachingTaskId', this.currentTeachingTaskId)
        axiosPost(DELETE_SELECTED_STUDENT_URL, { stuId: row.id, teachingTaskId: this.currentTeachingTaskId })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      }).catch(() => {

      })
    },
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
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
