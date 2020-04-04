<template>
  <div class="experiment-result">
    <div class="experiment-result-header flex justify-between">
      <el-button class="back" type="text" @click="back">{{ '< 返回' }}</el-button>
      <h4 class="title">{{ experimentResult.experimentTitle }}</h4>
      <el-button class="submit" type="primary" :loading="loading" @click="submit">
        <svg-icon v-if="!loading" icon-class="tijiao" class="icon--sumbit" />
        提交
      </el-button>
    </div>
    <div class="experiment-result-container flex">
      <div class="left">
        <card width="100%" :min-body-height="'calc(100vh - 280px)'" title="实验结果">
          <template v-slot:btn>
            学生姓名：{{ experimentResult.stuName }}
          </template>
          <template v-slot:body>
            <div class="result" v-html="experimentResult.experimentResult" />
          </template>
          <template v-if="experimentResult.experimentAttachmentName" v-slot:footer>
            <div class="attachment">
              <download-box
                :file="{
                  name: experimentResult.experimentAttachmentName,
                  size: experimentResult.experimentAttachmentSize,
                  id: experimentResult.id
                }"
              />
            </div>
          </template>
        </card>
      </div>
      <div class="right">
        <card width="100%" :min-body-height="'calc(100vh - 320px)'" title="综合评价">
          <template v-slot:btn>
            <span>实验展示</span>
            <el-switch
              :value="experimentResult.experimentShared"
              active-color="#13ce66"
              inactive-color="#eee"
              @change="(experimentShared) => setExperimentResult({experimentShared})"
            />
          </template>
          <template v-slot:body>
            <tinymce
              :value="experimentResult.experimentAdvice"
              width=""
              height="300px"
              :toolbar="toolbar"
              menubar=""
              :statusbar="false"
              @input="(experimentAdvice) => setExperimentResult({experimentAdvice})"
            />
          </template>
          <template v-slot:footer>
            <div class="score flex">
              <label for="">评分</label>
              <el-input-number
                :value="experimentResult.experimentScore"
                placeholder="评分"
                controls-position="right"
                :min="0"
                :step="0.5"
                :step-strictly="true"
                :style="{width: '100%'}"
                @input="(experimentScore) => setExperimentResult({experimentScore})"
              />
            </div>
          </template>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Tinymce from '@/components/Tinymce'
import DownloadBox from '@/views/experiment/components/DownloadBox'
import Card from '@/views/exam/examParameter/components/Card'

export default {
  name: 'ExperimentCorrect',

  components: { Card, DownloadBox, Tinymce },
  props: [''],
  data() {
    return {
      loading: false,
      toolbar: [' bold italic underline strikethrough | bullist numlist ']
    }
  },

  computed: {
    ...mapGetters(['experimentResult'])
  },

  watch: {},

  beforeMount() {},

  mounted() {

  },

  methods: {
    ...mapMutations({ 'setExperimentResult': 'experimentResult/SET_EXPERIMENT_RESULT' }),
    ...mapActions({ 'correctExperimentResult': 'experimentResult/correctExperimentResult' }),
    back() {
      this.$router.push('/experiment-manage/experiment-result?experimentId=' + this.experimentResult.experimentId)
    },
    submit() {
      this.loading = true
      this.correctExperimentResult()
        .then(() => {
          this.loading = false
          this.back()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }

}

</script>
<style lang='scss' scoped>
.experiment-result {
  width: 100%;
  // height: 46px;
  &-header {
    padding: 5px 20px;
    background: #F5F7FA;
    margin-bottom: 20px;
    .back {

    }
    .title {
      font-size: 20px;
      color: #333;
      line-height: 40px;
    }
    .submit {
      .icon--submit {
        margin-right: 5px;
      }
    }
  }
  &-container {
    background-color: #eee;
    padding: 20px;
    flex-wrap: nowrap;
    .left {
      flex-grow: 1;
      margin-right: 20px;
      .attachment {
        width: 100%;
        padding: 10px 20px;
        border-top: 1px dashed #eee;
      }
    }
    .right {
      width: 340px;
      .score {
        padding-left: 50px;
        position: relative;
        label {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
        // padding: 10px 20px;
      }
    }
  }
}
</style>
