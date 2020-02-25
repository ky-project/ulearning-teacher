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
      <el-input
        v-model="listQuery.questionKnowledge"
        placeholder="知识模块"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.questionType"
        placeholder="题型"
        style="width: 200px;"
        class="filter-item"
      >
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" @click="handleReset">
        重置
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button class="filter-item fr" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
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
      <el-table-column label="题目" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.questionText }}</span>
        </template>
      </el-table-column>
      <el-table-column label="知识模块" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionKnowledge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题型" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考答案" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionKey }}</span>
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
    <!-- 弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="教学任务" prop="teachingTaskId">
          <el-select v-model="temp.teachingTaskId">
            <el-option
              v-for="item in teachingTaskList"
              :key="item.id"
              :label="item.teachingTaskAlias"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="题目" prop="questionText">
          <el-input v-model="temp.questionText" />
        </el-form-item>
        <el-form-item label="知识模块" prop="questionKnowledge">
          <el-input v-model="temp.questionKnowledge" />
        </el-form-item>
        <el-form-item label="试题类型" prop="questionType">
          <el-select
            v-model="temp.questionType"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参考答案" prop="questionKey">
          <el-input
            v-model="temp.questionKey"
            type="textarea"
            autosize
            :style="{resize: 'none'}"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
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
import {
  GET_ALL_TEACHING_TASK_URL,
  GET_QUESTION_PAGE_URL,
  ADD_QUESTION_URL
} from '@/api/url'

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
      teachingTaskList: [],
      typeList: [
        { label: '选择题', value: 1 },
        { label: '判断题', value: 2 },
        { label: '多选题', value: 3 },
        { label: '填空题', value: 4 }
      ],
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        teachingTaskId: '',
        questionType: '',
        questionKnowledge: ''
      },
      temp: {
        id: '',
        teachingTaskId: '',
        questionUrl: '',
        questionType: '',
        questionText: '',
        questionKnowledge: '',
        questionKey: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改试题',
        create: '添加试题'
      },
      rules: {
        teachingTaskId: [{ required: true, message: '请选择教学任务', trigger: 'change' }],
        questionType: [{ required: true, message: '请选择试题类型', trigger: 'change' }],
        questionText: [{ required: true, message: '请输入试题内容', trigger: 'blur' }],
        questionKnowledge: [{ required: true, message: '请输入知识模块', trigger: 'blur' }],
        questionKey: [{ required: true, message: '请输入参考答案', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTeachingTaskList()
      .then(() => {
        this.getList()
      })
  },
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 1. 添加试题
          axiosPost(ADD_QUESTION_URL, this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '试题添加成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: '',
        teachingTaskId: '',
        questionUrl: '',
        questionType: '',
        questionText: '',
        questionKnowledge: '',
        questionKey: ''
      }
    },
    // 添加
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置
    handleReset() {
      this.listQuery.teachingTaskId = this.teachingTaskList.length && this.teachingTaskList[0].id
      this.listQuery.questionType = ''
      this.listQuery.questionKnowledge = ''
    },
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
    // 获取表格数据
    getList() {
      if (this.listQuery.teachingTaskId) {
        this.listLoading = true
        axiosGet(GET_QUESTION_PAGE_URL, { params: this.listQuery })
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
    }
    /* handleDelete(row, index) {
      this.$confirm('确定退选该试题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        console.log('stuId', row.id)
        console.log('teachingTaskId', this.currentTeachingTaskId)
        axiosPost(DELETE_SELECTED_STUDENT, { stuId: row.id, teachingTaskId: this.currentTeachingTaskId })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      })
    } */
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
  textarea {
    resize: none;
  }
}
</style>

