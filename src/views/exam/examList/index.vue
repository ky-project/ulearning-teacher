<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.examinationName"
        placeholder="试题名称"
        style="width: 200px;"
        size="small"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.examinationState"
        placeholder="测试状态"
        style="width: 200px;"
        size="small"
        class="filter-item"
      >
        <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" size="small" round type="primary" @click="handleReset">
        重置
      </el-button>
      <el-button
        v-waves
        size="small"
        round
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item fr"
        size="small"
        round
        style="margin-left: 10px;"
        type="success"
        @click="generateExam"
      >
        组卷
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
      <el-table-column align="center" type="expand">
        <template slot-scope="{row}">
          <div class="row">
            <div class="item">
              <label>难度:</label>
              <div>{{ difficultyMap[row.examinationParameters.questionDifficulty] }}</div>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <label>题型及数量:</label>
              <div>
                <span v-for="item in row.examinationParameters.quantity" :key="item.questionType">
                  {{ `${typeMap[item.questionType]}${item.grade}分/道 共${item.amount}道` }}
                </span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <label>知识点:</label>
              <div>
                <el-tag
                  v-for="item in row.examinationParameters.questionKnowledges"
                  :key="item.key"
                  size="mini"
                >
                  {{ item.key }}
                </el-tag>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="测试名称" align="center" min-width="100">
        <template slot-scope="{row}">
          <el-input v-if="row.state" v-model="row.examinationName" type="text" size="mini" />
          <span v-else>{{ row.examinationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试时间" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-input-number
            v-if="row.state"
            v-model="row.examinationDuration"
            controls-position="right"
            :min="0"
            :step="5"
            step-strictly
            size="mini"
          />
          <span v-else>{{ row.examinationDuration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试状态" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-select v-if="row.state" v-model="row.examinationState" placeholder="请选择" size="mini">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span v-else>{{ stateMap[row.examinationState] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果反馈" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-select v-if="row.state" v-model="row.examinationShowResult" size="mini" placeholder="请选择">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
          <span v-else>{{ row.examinationShowResult ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            :type="row.state ? 'success' : 'primary' "
            round
            size="mini"
            @click="() => {handleChange(row)}"
          >
            {{ row.state ? '保存' : '修改' }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            round
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
          <el-button
            size="mini"
            type="primary"
            round
            @click="parameterUpdate(row)"
          >
            修改组卷参数
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
import { mapGetters, mapMutations } from 'vuex'
import { filterObj } from '@/utils/index.js'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
// import { isEmail, isPhone } from '@/utils/validate'
import { GET_EXAM_PAGE_URL, UPDATE_EXAM_URL, DELETE_EXAM_URL } from '@/api/url'
import { axiosGet, axiosPost } from '@/utils/axios'

export default {
  name: 'ExamList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        teachingTaskId: '',
        examinationName: '',
        examinationState: ''
      },
      stateOptions: [
        { label: '未发布', value: 1 },
        { label: '未开始', value: 2 },
        { label: '进行中', value: 3 },
        { label: '已结束', value: 4 }
      ],
      stateMap: {
        // 1：未发布 2：未开始 3：进行中 4：已结束
        1: '未发布',
        2: '未开始',
        3: '进行中',
        4: '已结束'
      },
      typeMap: {
        '1': '选择题',
        '2': '判断题',
        '3': '多选题',
        '4': '填空题'
      },
      difficultyMap: {
        0: '不限',
        1: '容易',
        2: '较易',
        3: '一般',
        4: '较难',
        5: '困难'
      }

    }
  },
  computed: {
    ...mapGetters(['teachingTask'])
  },
  watch: {
    '$store.getters.teachingTaskId': {
      handler(value) {
        this.listQuery.teachingTaskId = value
        this.getList()
      },
      immediate: false
    }
  },
  created() {
    this.listQuery.teachingTaskId = this.$store.getters.teachingTaskId // 第一次设置teachingTaskId
    this.getPagePars()
    this.getList()
  },
  methods: {
    ...mapMutations({
      'resetExam': 'exam/RESET_EXAM',
      'setMode': 'exam/SET_MODE',
      'setExam': 'exam/SET_EXAM'
    }),
    getPagePars() {
      const { pagePars } = this.$store.getters
      const path = this.$route.path
      if (pagePars.has(path)) {
        const { currentPage, pageSize, filter } = pagePars.get(path)
        this.listQuery = {
          currentPage,
          pageSize,
          examinationName: filter.examinationName,
          examinationState: filter.examinationState,
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
          examinationName: this.listQuery.examinationName,
          examinationState: this.listQuery.examinationState
        }
      }
      this.$store.dispatch('pagePars/savePagePars', { path, pars })
    },
    // 参数修改按钮点击事件
    parameterUpdate(row) {
      this.resetExam()
      const data = filterObj(row, ['examinationParameters', 'teachingTaskId', 'id'])
      this.setExam(data)
      this.setMode('update')
      this.$router.push('/exam/exam-parameter')
    },
    // 组卷按钮点击事件
    generateExam() {
      // 清空exam
      this.resetExam()
      this.setMode('add')
      this.$router.push('/exam/exam-initial')
    },
    // 更新测试任务
    updateExam(data) {
      return new Promise((resolve, reject) => {
        axiosPost(UPDATE_EXAM_URL, data)
          .then(response => {
            this.$message.success('测试任务更新成功')
            resolve()
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 重置
    handleReset() {
      this.listQuery.teachingTaskId = this.teachingTask.length && this.teachingTask[0].id
      this.listQuery.examinationState = ''
    },
    getExamPage() {
      return new Promise((resolve, reject) => {
        axiosGet(GET_EXAM_PAGE_URL, { params: this.listQuery })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    getList() {
      this.savePagePars()
      this.listLoading = true
      this.getExamPage()
        .then(response => {
          const { total, content } = response.data
          // 解析试题参数
          content.forEach(item => {
            // eslint-disable-next-line no-eval
            item.examinationParameters = eval('(' + item.examinationParameters + ')')
            item.state = 0 // 0-保存, 1-修改
          })
          this.list = content
          this.total = total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleChange(row) {
      if (!row.state) {
        row.state = 1
        return
      } else {
        const data = filterObj(row, [
          'examinationDuration',
          'examinationName',
          'examinationShowResult',
          'examinationState',
          'id'
        ])
        this.updateExam(data)
          .then(() => {
            row.state = 0
            this.getList()
          })
      }
    },
    deleteExam(data) {
      return new Promise((resolve, reject) => {
        axiosGet(DELETE_EXAM_URL, { params: data })
          .then(() => {
            resolve()
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.deleteExam({ id: row.id })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      }).catch(() => {

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
  .row {
    line-height: 20px;
    .item {
      label {
        margin-right: 10px;
        font-weight: normal;
      }
      div {
        display: inline-block;
        span {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
