<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.noticeTitle"
        placeholder="标题"
        style="width: 200px;"
        size="small"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.noticePostTime"
        type="date"
        style="width: 200px;"
        size="small"
        placeholder="选择日期"
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
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
      <el-table-column label="标题" align="center" show-overflow-tooltip width="120">
        <template slot-scope="{row}">
          <span>{{ row.noticeTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关键词" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.noticeKeywords }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.noticePostTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.noticeAttachmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.noticeContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
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
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { axiosGet } from '@/utils/axios'
import { GET_NOTICE_PAGE_URL, DELETE_NOTICE_URL } from '@/api/url'

export default {
  name: 'NoticeList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        noticeTitle: '',
        noticePostTime: '',
        teachingTaskId: ''
      }
    }
  },
  computed: {
    ...mapGetters(['notice'])
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
      'setNotice': 'notice/SET_NOTICE',
      'setMode': 'notice/SET_MODE',
      'resetNotice': 'notice/RESET_NOTICE'
    }),
    handleDelete(row) {
      this.deleteNotice(row.id)
        .then(() => {
          this.getList()
        })
    },
    // 删除通告
    deleteNotice(id) {
      return new Promise((resolve, reject) => {
        axiosGet(DELETE_NOTICE_URL, { params: { id }})
          .then(response => {
            this.$message.success('通告删除成功')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 添加事件
    handleCreate() {
      // 1. 清空
      this.resetNotice()
      // 2. 设置
      this.setMode('add')
      // 3. 跳转
      this.$router.push('/notice/notice-content')
    },
    // 修改事件
    handleUpdate(row) {
      // 1. 清空
      this.resetNotice()
      // 2. 设置
      this.setNotice(row)
      this.setMode('update')
      // 3. 跳转
      this.$router.push('/notice/notice-content')
    },
    // 获取表格数据
    getList() {
      this.listLoading = true
      axiosGet(GET_NOTICE_PAGE_URL, { params: this.listQuery })
        .then(response => {
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
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
