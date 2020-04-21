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
        @change="handleFilter"
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
        size="small"
        round
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        :disabled="isDisabled"
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
      <el-table-column label="姓名" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuGender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.examiningLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="ip" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.examiningHostIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="70" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="info"
            round
            @click="mointor(row)"
          >
            监控
          </el-button>
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
import { axiosGet } from '@/utils/axios'
import {
  GET_ALL_TEACHING_TASK_URL,
  GET_EXAM_LIST_URL,
  GET_STUDENT_EXAM_PAGE
} from '@/api/url'

export default {
  name: 'ExamMonitor',
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
        examinationTaskId: '',
        examiningState: 1
      },
      teachingTaskList: [],
      examList: [],
      examListMap: {},
      isDisabled: false
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
      immediate: true
    }
  },
  created() {
    this.changeHandler(this.listQuery.teachingTaskId)
      .then(() => {
        this.getList()
      })
  },
  methods: {
    // 监控
    mointor(row) {
      const { stuName, stuNumber, id, stuGender } = row
      this.$router.push(`/exam/exam-detail?examiningId=${id}&stuName=${stuName}&stuNumber=${stuNumber}&stuGender=${stuGender}`)
    },
    // 分页查询学生测试
    getList() {
      if (!this.listQuery.examinationTaskId) return
      return new Promise((resolve, reject) => {
        this.listLoading = true
        axiosGet(GET_STUDENT_EXAM_PAGE, { params: this.listQuery })
          .then(response => {
            const { content, total } = response.data
            this.currentExamnationTaskId = this.listQuery.examinationTaskId
            this.list = content
            this.total = total
            this.listLoading = false
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
          .catch(error => {
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
            this.isDisabled = true
          }
          resolve()
        } else {
        // 3. 失败，请求
          this.getExamList({ teachingTaskId })
            .then(response => {
              this.examList = response.data.filter(item => item.condition === 3) // 筛选出进行中的试卷
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
            .catch(() => {
              reject()
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
