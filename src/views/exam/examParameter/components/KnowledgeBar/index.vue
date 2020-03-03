<template>
  <div class="knowledge-bar">
    <el-card>
      <template v-slot:header>
        <div class="knowledge-bar__header">
          <svg-icon icon-class="renwu" class="icon" />
          {{ teachingTaskAlias }}
        </div>
      </template>
      <div class="knowledge-bar__body">
        <el-scrollbar style="height:100%">
          <ul class="list">
            <li
              v-for="item in knowledgeList"
              :key="item.key"
              class="item"
              @click="() => {addKnowledge(item)}"
            >
              <svg-icon icon-class="jia" class="icon" />
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script>
import { GET_TEACHING_TASK_BY_ID_URL, GET_KNOWLEDGE_URL } from '@/api/url'
import { axiosPost, axiosGet } from '@/utils/axios'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'KnowledgeBar',
  data() {
    return {
      teachingTaskAlias: '',
      knowledgeList: []
    }
  },

  computed: {
    ...mapGetters(['exam'])
  },

  watch: {},

  created() {
    const { teachingTaskId } = this.exam
    if (teachingTaskId) {
      this.getTeachingTaskAlias({ id: teachingTaskId })
        .then(response => {
          console.log('response', response)
          this.teachingTaskAlias = response.data.teachingTaskAlias
        })
      this.getKnowledge({ teachingTaskId })
        .then(response => {
          this.knowledgeList = response.data // [{key: xxx, label: xxx}]
        })
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    // 添加知识点
    ...mapMutations({ 'addKnowledge': 'exam/ADD_KNOWLEDGE' }),
    // 获取教学名称
    getTeachingTaskAlias(data) {
      return new Promise((resolve, reject) => {
        axiosPost(GET_TEACHING_TASK_BY_ID_URL, data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 获取知识点
    getKnowledge(data) {
      return new Promise((resolve, reject) => {
        axiosGet(GET_KNOWLEDGE_URL, { params: data })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    }
  }

}

</script>
<style lang='scss' scoped>
.knowledge-bar {
  &__header {
    color: #409EFF;
    .icon {
      margin-right: 10px;
    }
  }
  &__body {
    height: calc(100vh - 205px);
    padding-bottom: 20px;
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .list {
      .item {
        position: relative;
        line-height: 20px;
        padding: 5px 10px;
        cursor: pointer;
        .icon {
          margin-right: 10px;
          color: #409EFF;
        }
        &:hover {
          color: #409EFF
        }
        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 24px;
          left: 17px;
          border-left: 1px dashed #409EFF;
          height: 12px;
        }
        &:last-child {
          &::before {
            border-left: none;
          }
        }
      }
    }
  }
  ::v-deep .el-card__header {
    padding: 18px 10px;
  }
  ::v-deep .el-card__body {
    padding: 0;
  }
}
</style>
