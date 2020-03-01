<template>
  <div class="app-container question-bank">
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
      <el-table-column label="试题内容" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.questionText }}</span>
        </template>
      </el-table-column>
      <el-table-column label="知识模块" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionKnowledge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试题类型" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ optionMap[row.questionType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试题类型" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ optionMap[row.questionType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试题选项" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionOption }}</span>
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
    <el-dialog class="question-bank__dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="教学任务" prop="teachingTaskId">
          <el-select v-model="temp.teachingTaskId" size="mini">
            <el-option
              v-for="item in teachingTaskList"
              :key="item.id"
              :label="item.teachingTaskAlias"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="试题内容" prop="questionText">
          <el-input
            v-model="temp.questionText"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="知识模块" prop="questionKnowledge">
          <el-input
            v-model="temp.questionKnowledge"
            size="mini"
          />
        </el-form-item>
        <SelectQuestoinType
          :type.sync="temp.questionType"
          :options.sync="temp.rawOption"
          :answer.sync="temp.questionKey"
          option-prop="rawOption"
          :option-rule="rules.value"
          type-prop="questionType"
          answer-prop="questionKey"
        />
        <el-form-item label="试题图片">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="previewImgUrl" :src="previewImgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
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
import SelectQuestoinType from './components/SelectQuestoinType'
import { axiosGet, axiosPost, axios2 } from '@/utils/axios'
import {
  GET_ALL_TEACHING_TASK_URL,
  GET_QUESTION_PAGE_URL,
  ADD_QUESTION_URL,
  ADD_QUESTION_IMG_URL
} from '@/api/url'

export default {
  name: 'QuestionBank',
  components: { Pagination, SelectQuestoinType },
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
        questionKey: '',
        rawOption: [],
        questionOption: ''
      },
      optionMap: { 1: '选择题', 2: '判断题', 3: '多选题', 4: '填空天' },
      previewImg: '', // 预览图片
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
        questionKey: [{ required: true, message: '请输入参考答案', trigger: 'blur' }],
        value: [{ required: true, message: '请输入选项内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    previewImgUrl() {
      return this.previewImg ? this.getObjectURL(this.previewImg) : ''
    }
  },
  created() {
    this.getTeachingTaskList()
      .then(() => {
        this.getList()
      })
  },
  methods: {
    getType(type) {

    },
    // 获取本地图片url
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL) {
        url = window.createObjectURL(file)
      } else if (window.URL) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 图片校验及预览
    beforeAvatarUpload(file) {
      // 校验格式
      const isIMG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isIMG) {
        this.$message.error('题目图片只能是 JPG或png 格式!')
      }
      if (!isLt4M) {
        this.$message.error('上传题目图片大小不能超过 4MB!')
      }
      // 预览本地图片
      if (isIMG && isLt4M) {
        this.previewImg = file
      }
      return false
    },
    // 格式化选项 [{label: A, value: 2}] => A=2|#|B=3
    formatOptions() {
      const tempArr = this.temp.rawOption.map(option => { return `${option.label}=${option.value}` })
      this.temp.questionOption = tempArr.join('|#|')
      // console.log(this.temp.questionOption)
    },
    // 添加试题请求
    addQuestion(data) {
      return new Promise((resolve, reject) => {
        axiosPost(ADD_QUESTION_URL, data)
          .then(response => {
            resolve()
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 获取图片url请求
    addQuestionImg(imgFile) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('questionFile', imgFile)
        axios2({
          url: ADD_QUESTION_IMG_URL,
          method: 'POST',
          data: formData,
          header: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
          resolve(response.data.questionUrl)
        }).catch(error => {
          this.$message.error(error.message || '出错')
          reject(error)
        })
      })
    },
    // 添加试题
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 格式化选项
          this.formatOptions()
          // 获取图片url
          if (this.previewImg) {
            this.addQuestionImg((this.previewImg))
              .then(imgUrl => {
                this.temp.questionUrl = imgUrl
                this.addQuestion(this.temp)
                  .then(response => {
                    this.$message.success('试题添加成功')
                    this.dialogFormVisible = false
                  })
              })
          } else {
            // 发送请求
            this.addQuestion(this.temp)
              .then(response => {
                this.$message.success('试题添加成功')
                this.dialogFormVisible = false
              })
          }
        }
      })
    },
    // 重置添加修改表单
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
      this.previewImg = ''
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
.question-bank {
  .filter-container {
    padding-bottom: 10px;
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
    }
  }
  &__dialog {
    ::v-deep .el-input {
      width: calc(100% - 50px);
    }
    ::v-deep .el-select {
      width: calc(100% - 50px);
      .el-input {
        width: 100%;
      }
    }
    ::v-deep .avatar-uploader .el-upload {
      border: 2px dashed #eeeeee;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    ::v-deep .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    ::v-deep .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}

</style>
<style lang="scss">
.app-container {
  .el-dialog__body {
    padding-bottom: 0;
  }
  textarea {
    resize: none;
  }
}
</style>

