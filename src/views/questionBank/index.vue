<template>
  <div class="app-container question-bank">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.questionKnowledge"
        size="small"
        placeholder="知识模块"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.questionType"
        size="small"
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
      <el-button v-waves class="filter-item" size="small" round type="primary" @click="handleReset">
        重置
      </el-button>
      <el-button
        v-waves
        round
        size="small"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button class="filter-item fr" size="small" round style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleCreate">
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
      <el-table-column label="试题内容" show-overflow-tooltip align="center" min-width="120">
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
      <el-table-column label="试题选项" show-overflow-tooltip min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionOption || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试题答案" show-overflow-tooltip min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.questionKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
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
    <!-- 弹窗 -->
    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      class="question-bank__dialog"
      :visible.sync="dialogFormVisible"
    >
      <div class="form-wrap">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          size="small"
          label-position="left"
          label-width="80px"
        >
          <el-form-item label="教学任务" prop="teachingTaskId">
            <el-select v-model="temp.teachingTaskId" size="mini" :disabled="dialogStatus === 'update'">
              <el-option
                v-for="item in $store.getters.teachingTask"
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
          <el-form-item label="试题难度" prop="questionKnowledge">
            <el-select v-model="temp.questionDifficulty" size="mini">
              <el-option
                v-for="item in selectDifficultyMap"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <SelectQuestoinType
            :disabled="dialogStatus === 'update'"
            :type.sync="temp.questionType"
            :options.sync="temp.rawOption"
            :answer.sync="temp.questionKey"
            :option-rule="rules.value"
            option-prop="rawOption"
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
              <i
                v-if="previewImgUrl"
                class="el-icon-close avatar-uploader-delete"
                @click.stop="deleteImgUrl"
              />
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

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
import { filterObj } from '@/utils/index.js'
import { axiosGet, axiosPost, axios2 } from '@/utils/axios'
import { difficultyMap } from './config'
import {
  GET_QUESTION_PAGE_URL,
  ADD_QUESTION_URL,
  ADD_QUESTION_IMG_URL,
  DELETE_QUESTION_URL,
  UPDATE_QUESTION_URL
} from '@/api/url'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'QuestionBank',
  components: { Pagination, SelectQuestoinType },
  directives: { waves, elDragDialog },
  data() {
    return {
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: true,
      teachingTaskList: [],
      oldTeachingTaskId: '',
      difficultyMap: difficultyMap,
      typeList: [
        { label: '选择题', value: 1 },
        { label: '判断题', value: 2 },
        { label: '多选题', value: 3 },
        { label: '填空题', value: 4 }
      ],
      listQuery: {
        currentPage: 1,
        pageSize: 8,
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
        // rawKey: [],
        questionOption: '',
        questionDifficulty: ''
      },
      optionMap: { 1: '选择题', 2: '判断题', 3: '多选题', 4: '填空题' },
      previewImg: '', // 预览图片
      previewImgUrl: '', // 预览图片url
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
    selectDifficultyMap() {
      const tempMap = JSON.parse(JSON.stringify(difficultyMap))
      tempMap.splice(0, 1)
      return tempMap
    }
  },
  watch: {
    '$store.getters.teachingTaskId': {
      handler(value) {
        this.listQuery.teachingTaskId = value
        // this.getList()
      },
      immediate: true
    }
  },
  created() {
    this.getPagePars()
    this.getList()
  },
  methods: {
    getPagePars() {
      const { pagePars } = this.$store.getters
      const path = this.$route.path
      if (pagePars.has(path)) {
        const { currentPage, pageSize, filter } = pagePars.get(path)
        this.listQuery = {
          currentPage,
          pageSize,
          questionType: filter.questionType,
          questionKnowledge: filter.questionKnowledge,
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
          questionType: this.listQuery.questionType,
          questionKnowledge: this.listQuery.questionKnowledge
        }
      }
      this.$store.dispatch('pagePars/savePagePars', { path, pars })
    },
    // 更新试题
    updateQuestion() {
      return new Promise((resolve, reject) => {
        this.formatOptions()
        if (this.temp.questionKey instanceof Array) {
          this.temp.questionKey = this.temp.questionKey.join('|#|')
        }
        axiosPost(UPDATE_QUESTION_URL, this.temp)
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除图片url
    deleteImgUrl() {
      this.previewImgUrl = ''
      this.temp.questionUrl = ''
    },
    // 删除试题
    deleteQuestion(id) {
      return new Promise((resolve, reject) => {
        axiosGet(DELETE_QUESTION_URL, { params: { id }})
          .then(() => {
            resolve()
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
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
        this.previewImgUrl = this.getObjectURL(this.previewImg)
      }
      return false
    },
    // 格式化选项 [{label: A, value: 2}] => A=2|#|B=3
    formatOptions() {
      if (this.temp.rawOption instanceof Array) {
        const tempArr = this.temp.rawOption.map(option => { return `${option.label}=${option.value}` })
        this.temp.questionOption = tempArr.join('|#|')
      }
      // console.log(this.temp.questionOption)
    },
    // 逆格式化选项 A=2|#|B=3 => [{label: A, value: 2}]
    reverseFormatOptions() {
      const option = this.temp.questionOption
      if (option !== [] && option !== '') {
        const tempArr = option.split('|#|')
        return tempArr.map(item => {
          const tempArr2 = item.split('=')
          return {
            label: tempArr2[0],
            value: tempArr2[1]
          }
        })
      }
    },
    // 添加试题请求
    addQuestion(data) {
      return new Promise((resolve, reject) => {
        axiosPost(ADD_QUESTION_URL, data)
          .then(response => {
            resolve()
          })
          .catch(error => {
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
                const data = filterObj(this.temp, [
                  'questionDifficulty',
                  'questionKey',
                  'questionKnowledge',
                  'questionOption',
                  'questionText',
                  'questionType',
                  'questionUrl',
                  'teachingTaskId'
                ])
                if (data.questionKey instanceof Array) {
                  data.questionKey = data.questionKey.join('|#|')
                }
                this.addQuestion(data)
                  .then(response => {
                    this.$message.success('试题添加成功')
                    this.dialogFormVisible = false
                    this.getList()
                  })
              })
          } else {
            // 发送请求
            const data = filterObj(this.temp, [
              'questionDifficulty',
              'questionKey',
              'questionKnowledge',
              'questionOption',
              'questionText',
              'questionType',
              'questionUrl',
              'teachingTaskId'
            ])
            if (data.questionKey instanceof Array) {
              data.questionKey = data.questionKey.join('|#|')
            }
            this.addQuestion(data)
              .then(response => {
                this.$message.success('试题添加成功')
                this.dialogFormVisible = false
                this.getList()
              })
          }
        }
      })
    },
    // 修改
    updateData() {
      this.updateQuestion()
        .then(() => {
          this.$message.success('试题修改成功')
          this.dialogFormVisible = false
          this.getList()
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
        questionKey: '',
        questionDifficulty: ''
      }
      this.previewImg = ''
      this.previewImgUrl = ''
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
    // 获取表格数据
    getList() {
      if (this.listQuery.teachingTaskId) {
        this.savePagePars()
        this.listLoading = true
        axiosGet(GET_QUESTION_PAGE_URL, { params: this.listQuery })
          .then(response => {
            // console.log('试题', response.data)
            this.oldTeachingTaskId = this.listQuery.teachingTaskId // 同步teachingTaskId
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
    },
    // 删除试题
    handleDelete(row) {
      this.deleteQuestion(row.id)
        .then(() => {
          this.$message.success('试题删除成功')
          this.getList()
        })
    },
    // 修改试题点击事件
    handleUpdate(row) {
      const tempObj = filterObj(row, [
        'id',
        'questionDifficulty',
        'questionKey',
        'questionKnowledge',
        'questionOption',
        'questionText',
        'questionType',
        'questionUrl'
      ])
      Object.assign(this.temp, tempObj)
      this.temp.rawOption = this.reverseFormatOptions()
      if (this.temp.questionType === 3 || this.temp.questionType === 4) {
        this.temp.questionKey = this.temp.questionKey.split('|#|')
      }
      // TODO:
      this.temp.teachingTaskId = this.oldTeachingTaskId
      // this.temp = Object.assign({}, this.temp, row)
      this.previewImgUrl = this.temp.questionUrl
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
    }
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
    .form-wrap {
      height: 350px;
      overflow-y: scroll;
    }
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
    ::v-deep .avatar-uploader-delete {
      display: block;
      width: 15px;
      height: 15px;
      position: absolute;
      right: 0px;
      top: 0px;
      z-index: 999;
      font-style: normal;
      font-weight: bold;
      color: #F56C6C;
      cursor: pointer;
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

