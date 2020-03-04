<template>
  <el-container class="exam-parameter">
    <el-header v-if="mode === 'add'" class="exam-parameter__header">
      <Step :active="1" :back="() => { $router.push('/exam/exam-initial')}" />
    </el-header>
    <el-container class="exam-parameter__main">
      <el-main>
        <ExamRange />
        <ExamDifficulty />
        <ExamQuantity />
      </el-main>
      <el-aside width="300px" class="exam-parameter__aside">
        <KnowledgeBar />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Step from '@/views/exam/components/Step'
import KnowledgeBar from './components/KnowledgeBar'
import ExamRange from './components/ExamRange'
import ExamDifficulty from './components/ExamDifficulty'
import ExamQuantity from './components/ExamQuantity'
export default {
  name: 'ExamParameter',

  components: { Step, KnowledgeBar, ExamRange, ExamDifficulty, ExamQuantity },
  props: [''],
  data() {
    return {
      selectKnowledge: []
    }
  },
  computed: {
    ...mapGetters(['exam', 'mode'])
  },

  watch: {},

  created() {
    // this.getKnowledge();
    console.log('questionDifficulty', this.exam)
  },

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapActions({
      'setExam': 'exam/setExam',
      'addKnowledge': 'exam/addKnowledge'
    }),
    // 设置题目难度
    setDifficulty(level) {
      const { examinationParameters } = this.exam
      examinationParameters.questionDifficulty = level
      this.setExam(examinationParameters)
    }
  }

}

</script>
<style lang='scss' scoped>
.exam-parameter {
  &__header {
    padding: 0
  }
  &__main {
    // width: calc(100% - 200px);
    height: calc(100vh - 110px);
    overflow-y: auto;
    background: #eee;
    .el-main {
      overflow: unset;
    }
    .el-aside {
      overflow: unset;
    }
  }
  &__aside {
    // width: 200px;
    padding-right: 20px;
    padding-top: 20px;
    background-color: #eee;
  }

}
</style>
