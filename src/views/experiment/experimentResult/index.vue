<template>
  <div class="app-container experiment-result">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.stuName"
        placeholder="姓名"
        style="width: 200px;"
        size="small"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.stuNumber"
        placeholder="学号"
        style="width: 200px;"
        size="small"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.isCorrected"
        placeholder="是否批改"
        style="width: 200px;"
        size="small"
        class="filter-item"
      >
        <el-option label="已批改" :value="true" />
        <el-option label="未批改" :value="false" />
      </el-select>
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
        @click="handleExperimentResultArchive"
      >
        存档
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      class="experiment-result-table"
      :data="list"
      size="small"
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
      <el-table-column label="姓名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业班级" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuClass }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.experimentCommitTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.experimentScore ? row.experimentScore : '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-if="row.isCorrected"
            size="mini"
            type="primary"
            round
            @click="correctHandler(row)"
          >
            修改
          </el-button>
          <el-button
            v-else
            size="mini"
            type="success"
            round
            @click="correctHandler(row)"
          >
            批改
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
import { mapMutations } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { GET_EXPERIMENT_RESULT_PAGE_URL, DOWNLOAD_RESULT_ARCHIVE } from '@/api/url'
import { axiosGet } from '@/utils/axios'
export default {
  name: 'ExperimentResult',
  directives: { waves },
  components: { Pagination },
  props: [''],
  data() {
    return {
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        experimentId: '',
        isCorrected: '', // 是否批改
        stuNumber: '', // 学号
        stuName: '' // 学生名
      }
    }
  },

  computed: {},
  created() {
    // 设置实验id
    this.listQuery.experimentId = this.$route.query.experimentId
    this.getList()
  },

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'setExperimentResult': 'experimentResult/SET_EXPERIMENT_RESULT',
      'resetExperimentResult': 'experimentResult/RESET_EXPERIMENT_RESULT'
      // 'setMode': 'experimentResult/SET_MODE'
    }),
    /* updateHandler(row) {
      // 1. 清空
      this.resetExperimentResult()
      // 2. 设置
      this.setExperimentResult(row)
      // 3. 跳转
      this.$router.push('/experiment-manage/experiment-correct')
    }, */
    // 批改
    correctHandler(row) {
      // 1. 清空
      this.resetExperimentResult()
      // 2. 设置
      this.setExperimentResult(row)
      // 3. 跳转
      this.$router.push('/experiment-manage/experiment-correct')
    },
    // 查询实验信息
    getList() {
      new Promise((resolve, reject) => {
        this.listLoading = true
        axiosGet(GET_EXPERIMENT_RESULT_PAGE_URL, { params: this.listQuery })
          .then(response => {
            const { data } = response
            this.total = data.total
            this.list = data.content
            this.listLoading = false
            resolve(response)
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
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
    },
    handleExperimentResultArchive() {
      var a = document.createElement('a')
      a.style.display = 'none'
      const fileurl = process.env.VUE_APP_BASE_API + DOWNLOAD_RESULT_ARCHIVE + '?experimentId=' + this.listQuery.experimentId
      a.href = fileurl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    }
  }
}

</script>
<style lang='scss' scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
  .experiment-result-table {
    .icon-pigai {
      color: #E6A23C
    }
  }
}
</style>
