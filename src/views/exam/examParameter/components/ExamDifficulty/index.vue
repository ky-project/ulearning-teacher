<template>
  <div class="exam-difficulty">
    <card title="设置试卷条件" class="condition" width="100%" height="150px">
      <template v-slot:body>
        <div class="item">
          <label>
            试题难度
          </label>
          <el-select
            :value="questionDifficulty"
            size="mini"
            placeholder="请选择难度"
            @change="changeHandler"
          >
            <el-option
              v-for="item in level"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Card from './../Card'
export default {
  name: 'ExamDifficulty',
  components: { Card },
  data() {
    return {
      level: [
        { label: '不限', value: 0 },
        { label: '容易', value: 1 },
        { label: '较易', value: 2 },
        { label: '一般', value: 3 },
        { label: '较难', value: 4 },
        { label: '困难', value: 5 }
      ]
    }
  },
  computed: {
    ...mapGetters(['questionDifficulty'])
  },
  methods: {
    ...mapMutations({ 'setDifficulty': 'exam/SET_DIFFICULTY' }),
    changeHandler(newValue) {
      this.setDifficulty(newValue)
    }
  }
}

</script>
<style lang='scss' scoped>
.exam-difficulty {
  ::v-deep .card {
    .card__body {
      label {
        font-size: 14px;
        font-weight: normal;
        color: #666;
        margin-right: 20px;
      }
    }
  }
}
</style>
