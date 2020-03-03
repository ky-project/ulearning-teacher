<template>
  <div class="exam-range">
    <card title="选择考核范围" class="range" width="100%">
      <template v-slot:btn>
        <el-button type="text" :style="{padding: 0}" @click="()=>{clearKnowledge()}">清空</el-button>
      </template>
      <template v-slot:body>
        <div class="scroll-wrapper">
          <el-scrollbar :style="{height: '100%'}">
            <span v-if="questionKnowledges.length === 0" class="empty">你还没有选择考试范围</span>
            <el-tag
              v-for="(item,index) in questionKnowledges"
              v-else
              :key="item.key"
              closable
              @close="() => {deleteKnowledge(index)}"
            >
              {{ item.label }}
            </el-tag>
          </el-scrollbar>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import Card from './../Card'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ExamRange',

  components: { Card },
  props: {
    rangeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },

  computed: {
    ...mapGetters(['questionKnowledges'])
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'deleteKnowledge': 'exam/DELETE_KNOWLEDGE',
      'clearKnowledge': 'exam/CLEAR_KNOWLEDGE'
    }),
    closeHandler(index) {
      const tempArr = [...this.rangeList]
      tempArr.splice(index, 1)
      this.$emit('update:rangeList', tempArr)
    },
    clearHandler() {

    }
  }

}

</script>
<style lang='scss' scoped>
.exam-range {
    position: relative;
    .empty {
      display: block;
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      color: #aaa;
      font-size: 14px;
    }
    .el-tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .scroll-wrapper {
      height: 150px;
    }
    //
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden
    }
  }
</style>
