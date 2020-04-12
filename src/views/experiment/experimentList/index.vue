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
      <el-table-column label="是否共享" min-width="30" align="center">
        <template slot-scope="{row}">
          <span>{{ row.experimentShared ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" min-width="30" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="70" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            :style="{color: '#409EFF'}"
            size="mini"
            type="text"
            title="修改"
            @click="handleUpdate(row)"
          >
            <i class="el-icon-edit" />
          </el-button>
          <el-button
            :style="{color: '#F56C6C'}"
            size="mini"
            type="text"
            title="删除"
            @click="handleDelete(row)"
          >
            <i class="el-icon-delete" />
          </el-button>
          <el-button
            :style="{color: '#E6A23C'}"
            size="mini"
            type="text"
            title="排序"
            @click="handleSort(row)"
          >
            <svg-icon icon-class="xulie" class-name="icon" />
          </el-button>
          <el-button
            :style="{color: '#67C23A'}"
            size="mini"
            type="text"
            title="查看实验结果"
            @click="handleResult(row)"
          >
            <svg-icon icon-class="jieguo" class-name="icon" />
          </el-button>
          <el-button
            :style="{color: '#67C23A'}"
            size="mini"
            type="text"
            :title="row.experimentShared ? '取消分享' : '分享'"
            @click="share(row)"
          >
            <svg-icon
              :icon-class="row.experimentShared ? 'quxiaogongxiang' : 'gongxiang'"
              class-name="item-icon"
            />
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
import { axiosGet, axiosPost } from '@/utils/axios'
import { GET_EXPERIMENT_PAGE_URL, UPDATE_EXPERIMENT_URL, DELETE_EXPERIMENT_URL, UPDATE_SHARED_URL } from '@/api/url'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ExperimentList',
  components: { Pagination },
  directives: { waves },
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
      }
    }
  },
  watch: {
    '$store.getters.teachingTaskId': {
      handler(value) {
        this.listQuery.teachingTaskId = value
        this.getList()
      },
      immediate: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    ...mapMutations({
      'setMode': 'experiment/SET_MODE',
      'resetExperiment': 'experiment/RESET_EXPERIMENT',
      'setExperiment': 'experiment/SET_EXPERIMENT'
    }),
    // 结果事件
    handleResult(row) {
      console.log('实验id', row.id)
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
        .catch(error => {
          this.getList()
            .then(() => {
              row.state = false
            })
          // this.$message.error(error.message || '出错')
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
          .catch(error => {
            // this.$message.error(error.message || '出错')
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
            // this.$message.error(error.message || '出错了!')
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
          .catch(error => {
            // this.$message.error(error.message || '出错')
          })
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
    share(item){
      const data = {
        experimentShared: !item.experimentShared,
        id: item.id
      }
      if(item.experimentShared){
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
        })
      } else{
        this.updateShared(data)
          .then(() => {
            this.getList()
          })
      }
    },
    updateShared(data){
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
