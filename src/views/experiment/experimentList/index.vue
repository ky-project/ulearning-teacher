<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.experimentTitle"
        placeholder="实验名"
        style="width: 200px;"
        size="small"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="small"
        round
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item fr"
        style="margin-left: 10px;"
        size="small"
        round
        type="success"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        class="filter-item fr"
        style="margin-left: 10px;"
        size="small"
        round
        type="success"
        icon="el-icon-plus"
        @click="handleCopyBeforeExperiment"
      >
        拷贝历年实验
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
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
        :index="indexMethod"
      />
      <el-table-column label="实验编号" align="center" width="120">
        <template slot-scope="{row}">
          <el-input-number
            v-if="row.state"
            v-model="row.experimentOrder"
            controls-position="right"
            size="mini"
            type="number"
            :step="1"
            width="100"
            class="input-number"
            :step-strictly="true"
            @blur="setSort(row)"
          />
          <span v-else>{{ '实验'+row.experimentOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.experimentTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否共享" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{ row.experimentShared ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" min-width="90" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="90" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="390" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="primary"
            round
            @click="handleUpdate(row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            round
            @click="handleDelete(row)"
          >
            删除
          </el-button>
          <el-button
            size="mini"
            type="primary"
            round
            @click="handleSort(row)"
          >
            排序
          </el-button>
          <el-button
            size="mini"
            type="info"
            round
            @click="handleResult(row)"
          >
            查看实验结果
          </el-button>
          <el-button
            size="mini"
            :type="row.experimentShared ? 'warning' : 'primary'"
            round
            @click="share(row)"
          >
            {{ row.experimentShared ? '已分享' : '分享' }}
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
    <el-dialog
      v-el-drag-dialog
      title="拷贝历年实验"
      width="400px"
      :visible.sync="dialogFormVisible"
    >
      <div class="form-wrap">
        <el-form
          ref="dataForm"
          :rules="rules"
          size="small"
          :model="copyExperimentForm"
          label-position="left"
          label-width="80px"
        >
          <el-form-item label="教学任务" prop="teachingTaskId">
            <el-select
              v-model="copyExperimentForm.teachingTaskIdTmp"
              size="mini"
              @change="changeTeachingTaskId"
            >
              <el-option
                v-for="item in beforeTeachingTask"
                :key="item.id"
                :label="item.showName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="实验" prop="experimentId">
            <el-select v-model="copyExperimentForm.experimentId" size="mini">
              <el-option
                v-for="item in beforeTeachingTaskExperiment"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" round @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button size="small" round type="primary" @click="copyBeforeExperiment">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { axiosGet, axiosPost } from '@/utils/axios'
import { GET_EXPERIMENT_PAGE_URL,
  UPDATE_EXPERIMENT_URL,
  DELETE_EXPERIMENT_URL,
  UPDATE_SHARED_URL,
  GET_BEFORE_TEACHING_TASK_URL,
  GET_ALL_URL,
  COPY_EXPERIMENT_URL } from '@/api/url'
import { mapGetters, mapMutations } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'ExperimentList',
  components: { Pagination },
  directives: { waves, elDragDialog },
  computed: {
    ...mapGetters(['teachingTask', 'experiment'])
  },
  data() {
    return {
      /*
      currentTeachingTaskId: '',*/
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      currentTeachingTaskId: '',
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        teachingTaskId: '',
        experimentTitle: ''
      },
      dialogFormVisible: false,
      rules: {
        teachingTaskIdTmp: [{ required: true, message: '请选择教学任务', trigger: 'change' }],
        experimentId: [{ required: true, message: '请选择实验', trigger: 'change' }]
      },
      beforeTeachingTask: [],
      beforeTeachingTaskExperiment: [],
      copyExperimentForm: {
        teachingTaskIdTmp: '',
        teachingTaskId: '',
        experimentId: ''
      }
    }
  },
  watch: {
    '$store.getters.teachingTaskId': {
      handler(value) {
        this.listQuery.teachingTaskId = value
      },
      immediate: true
    }
  },
  created() {
    this.getPagePars()
    this.getList()
  },
  methods: {
    ...mapMutations({
      'setMode': 'experiment/SET_MODE',
      'resetExperiment': 'experiment/RESET_EXPERIMENT',
      'setExperiment': 'experiment/SET_EXPERIMENT'
    }),
    getPagePars() {
      const { pagePars } = this.$store.getters
      const path = this.$route.path
      if (pagePars.has(path)) {
        const { currentPage, pageSize, filter } = pagePars.get(path)
        console.log('experimentTitle', filter)
        this.listQuery = {
          currentPage,
          pageSize,
          experimentTitle: filter.experimentTitle,
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
          experimentTitle: this.listQuery.experimentTitle
        }
      }
      this.$store.dispatch('pagePars/savePagePars', { path, pars })
    },
    // 结果事件
    handleResult(row) {
      // console.log('实验id', row.id)
      this.$router.push('/experiment-manage/experiment-result?experimentId=' + row.id)
    },
    // 排序事件
    handleSort(row) {
      if (row.state) {
        this.setSort(row)
      } else {
        row.state = !row.state
      }
    },
    // 设置序列
    setSort(row) {
      // 获取参数
      const data = {
        teachingTaskId: this.currentTeachingTaskId,
        experimentOrder: row.experimentOrder,
        id: row.id
      }
      // 发送请求
      axiosPost(UPDATE_EXPERIMENT_URL, data)
        .then(response => {
          this.getList()
            .then(() => {
              row.state = false
            })
        })
        .catch(() => {
          this.getList()
            .then(() => {
              row.state = false
            })
        })
    },
    handleCreate() {
      // 1. 重置
      this.resetExperiment()
      this.setMode('add')
      // 2. 跳转
      this.$router.push('/experiment-manage/experiment-content')
    },
    // 查询实验信息
    getList() {
      this.savePagePars()
      new Promise((resolve, reject) => {
        this.listLoading = true
        axiosGet(GET_EXPERIMENT_PAGE_URL, { params: this.listQuery })
          .then(response => {
            const { data } = response
            this.total = data.total
            this.list = data.content.map(item => { item.state = false; return item })
            this.currentTeachingTaskId = this.listQuery.teachingTaskId
            this.listLoading = false
            resolve()
          })
          .catch(() => {
            this.listLoading = false
          })
      })
    },

    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleDelete(row) {
      this.$confirm('确定删除该实验, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        axiosGet(DELETE_EXPERIMENT_URL, { params: { id: row.id }})
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
    handleUpdate(row) {
      // 1. 重置
      this.resetExperiment()
      this.setMode('update')
      // 2. 设置
      this.setExperiment(row)
      // 3. 跳转
      this.$router.push('/experiment-manage/experiment-content')
    },
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
    },
    share(item) {
      const data = {
        experimentShared: !item.experimentShared,
        id: item.id
      }
      if (item.experimentShared) {
        this.$confirm('确定重复分享该实验, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 发送请求
          this.updateShared(data)
            .then(() => {
              this.getList()
            })
        }).catch(() => {

        })
      } else {
        this.updateShared(data)
          .then(() => {
            this.getList()
          })
      }
    },
    updateShared(data) {
      return new Promise((resolve, reject) => {
        axiosPost(UPDATE_SHARED_URL, data)
          .then(response => {
            resolve()
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    handleCopyBeforeExperiment() {
      axiosGet(GET_BEFORE_TEACHING_TASK_URL, { params: { id: this.currentTeachingTaskId }})
        .then(response => {
          this.beforeTeachingTask = response.data
          if (this.beforeTeachingTask.length) {
            this.copyExperimentForm.teachingTaskIdTmp = this.beforeTeachingTask[0].id
            axiosGet(GET_ALL_URL, { params: { teachingTaskId: this.copyExperimentForm.teachingTaskIdTmp }})
              .then(response => {
                this.beforeTeachingTaskExperiment = response.data
                if (this.beforeTeachingTaskExperiment.length) {
                  this.copyExperimentForm.experimentId = this.beforeTeachingTaskExperiment[0].key
                }
              })
              /* .catch(error => {
                reject(error)
              }) */
          }
          this.dialogFormVisible = true
        })
        /* .catch(error => {
          reject(error)
        }) */
    },
    changeTeachingTaskId() {
      axiosGet(GET_ALL_URL, { params: { teachingTaskId: this.copyExperimentForm.teachingTaskIdTmp }})
        .then(response => {
          this.beforeTeachingTaskExperiment = response.data
          if (this.beforeTeachingTaskExperiment.length) {
            this.copyExperimentForm.experimentId = this.beforeTeachingTaskExperiment[0].key
          }
        })
        /* .catch(error => {
          reject(error)
        }) */
    },
    resetForm() {
      this.copyExperimentForm.teachingTaskIdTmp = ''
      this.copyExperimentForm.teachingTaskId = ''
      this.copyExperimentForm.experimentId = ''
    },
    copyBeforeExperiment() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.copyExperimentForm.teachingTaskId = this.currentTeachingTaskId
          axiosPost(COPY_EXPERIMENT_URL, this.copyExperimentForm)
            .then(response => {
              this.$message.success('复制成功')
              this.dialogFormVisible = false
              this.getList()
            })
            /* .catch(error => {
              reject(error)
            }) */
        }
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
  .input-number {
    width: 100px;
  }
  .el-input-number.is-controls-right .el-input__inner {
      padding: 0;
    }

}
</style>
