<template>
  <div class="dashboard__page">
    <div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8">
          <el-card class="dashboard__card welcome" shadow="always">
            <svg-icon icon-class="yonghu" class-name="icon"/>
            <div class="content">
              <p>{{ greet }}, {{ userInfo.teaName }} 老师</p>
              <p :style="{paddingTop: '25px', fontSize: '15px'}">
                上次登录：{{ lastLoginTime }}
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-card class="dashboard__card visited" shadow="always">
            <svg-icon icon-class="ceshi" class-name="icon"/>
            <div class="content">
              <p>测试任务<span style="font-size: small;">(进行中)</span></p>
              <p :style="{paddingTop: '10px', fontSize: '15px'}"><span>{{ examinationNumber }}</span> 个</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-card class="dashboard__card document" shadow="always">
            <svg-icon icon-class="shiyan" class-name="icon"/>
            <div class="content">
              <p>课程实验</p>
              <p :style="{paddingTop: '10px', fontSize: '15px'}"><span>{{ experimentNumber }}</span> 个</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="18">
          <el-card class="dashboard__card activity" shadow="always">
            <div slot="header" class="clearfix">
              <span><svg-icon icon-class="dongtai" class-name="icon"/>学生动态</span>
            </div>
            <div class="content">
              <el-scrollbar style="width:95%; height: 400px">
                <el-timeline
                  style="margin: 5px 10px 5px 5px"
                >
                  <el-timeline-item
                    v-for="(activity, index) in list"
                    type="success"
                    :key="index">
                    <a @click="getActivityContent(activity.activityContent)">
                      <p><span style="font-size: 14px">{{activity.createTime}}</span>&emsp;{{activity.activityTopic}}
                      </p>
                    </a>
                    <hr style="height:1px;border:none;border-top:1px solid #868686;"/>
                  </el-timeline-item>
                </el-timeline>
              </el-scrollbar>
            </div>
            <div class="bottom">
              <pagination
                :small="pageSmall"
                v-show="total>0"
                :total="total"
                style="height: 25px; padding: 0 0 0 0"
                :page.sync="listQuery.currentPage"
                :limit.sync="listQuery.pageSize"
                class="fr"
                layout="prev, pager, next"
                @pagination="setPagination"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-card class="dashboard__card activity" shadow="always">
            <div slot="header" class="clearfix">
              <span><svg-icon icon-class="jiaoxuerenwu" class-name="icon"/>教学任务</span>
            </div>
            <div class="content">
              <el-scrollbar style="width:95%; height: 400px">
              <el-timeline
                style="margin: 5px 10px 5px 5px"
              >
                <el-timeline-item
                  v-for="(teachingTask, index) in teachingTaskList"
                  type="success"
                  :key="index">
                  <p><span style="font-size: 14px">{{teachingTask.term}}</span>&emsp;{{teachingTask.teachingTaskAlias}}</p>
                </el-timeline-item>
              </el-timeline>
              </el-scrollbar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Pagination from '@/components/Pagination'
import {axiosGet, axiosPost} from '@/utils/axios'
import {
  GET_EXPERIMENT_NUMBER_URL,
  GET_EXAMINATION_NUMBER_URL,
  PAGE_ACTIVITY_LIST_URL,
  GET_ALL_TEACHING_TASK_URL
} from '@/api/url'

export default {
  name: 'Home',

  components: {Pagination},
  props: [''],
  data() {
    return {
      experimentNumber: '',
      examinationNumber: '',
      total: 0,
      pageSmall: true,
      listQuery: {
        currentPage: 1,
        pageSize: 7
      },
      list: [],
      teachingTaskList: []
    }
  },

  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    greet() {
      const hour = new Date().getHours()
      let greet = ''
      if (hour >= 5 && hour <= 10) {
        greet = '早上好'
      } else if (hour === 11 || hour === 12) {
        greet = '中午好'
      } else if (hour >= 13 && hour <= 17) {
        greet = '下午好'
      } else {
        greet = '晚上好'
      }
      return greet
    },
    lastLoginTime() {
      if (this.userInfo) {
        return this.userInfo.lastLoginTime.split(' ')[0]
      }
      return ''
    }
  },

  watch: {},

  created() {
    this.getExperimentNumber();
    this.getExaminationNumber();
    this.getActivityList();
    this.getAllTeahingTask();
  },

  beforeMount() {
  },

  mounted() {

  },

  methods: {
    getExperimentNumber() {
      axiosGet(GET_EXPERIMENT_NUMBER_URL)
        .then(response => {
          this.experimentNumber = response.data
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
          this.listLoading = false
        })
    },
    getExaminationNumber() {
      axiosGet(GET_EXAMINATION_NUMBER_URL)
        .then(response => {
          this.examinationNumber = response.data
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
          this.listLoading = false
        })
    },
    getActivityList() {
      axiosGet(PAGE_ACTIVITY_LIST_URL, {params: this.listQuery})
        .then(response => {
          const {content, total} = response.data
          this.list = content
          this.total = total
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
          this.listLoading = false
        })
    },
    setPagination() {
      this.getActivityList();
    },
    getActivityContent(content) {
      this.$alert(content, '详情', {
        type: 'info',
        center: true,
        showConfirmButton: false,
        closeOnClickModal: true
      });
    },
    getAllTeahingTask(){
      axiosGet(GET_ALL_TEACHING_TASK_URL, {})
        .then(response => {
          this.teachingTaskList = response.data
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
          this.listLoading = false
        })
    }
  }

}

</script>
<style lang='scss' scoped>
  .dashboard {
    &__page {
      padding: 20px;
    }

    &__card {
      ::v-deep .el-card__body {
        display: flex;
        justify-content: space-between;

        p {
          color: #5d5d5d;

          span {
            font-weight: bold;
            font-size: 40px;
          }
        }

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #ceccc9;
        }
      }

      .content {
        height: 100px;
        width: 100%;
        text-align: center;
        margin-top: 15px;
      }

      &.welcome {
        height: 146px;
        background: #fff;

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #57cebe;
        }
      }

      &.visited {
        height: 146px;
        background: #fff;

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #ce887c;
        }
      }

      &.document {
        height: 146px;
        background: #fff;

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #6bb4ce;
        }
      }

      &.activity {
        background: #fff;
        position: relative;
        height: 500px;

        .content {
          text-align: left;
          margin-top: 5px;
        }
      }

      ::v-deep .el-card__header {
        padding-top: 15px;
        padding-bottom: 15px;

        .icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .bottom {
    position: absolute;
    bottom: 0px;
    text-align: right;
    width: 95%;

    .card-page {
    }
  }
</style>
<style lang='scss'>
</style>
