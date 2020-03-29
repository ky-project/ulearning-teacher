import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: { title: '主页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Personal',
        component: () => import('@/views/personal'),
        meta: { title: '个人信息' }
      }
    ]
  },
  {
    path: '/student-manage',
    component: Layout,
    redirect: '/student-manage/index',
    children: [
      {
        path: 'index',
        name: 'StudentManage',
        component: () => import('@/views/studentManage'),
        meta: { title: '学生选课管理', icon: 'yonghu' }
      }
    ]
  },
  {
    path: '/question-bank',
    component: Layout,
    redirect: '/question-bank/index',
    children: [
      {
        path: 'index',
        name: 'QuestionBank',
        component: () => import('@/views/questionBank'),
        meta: { title: '题库管理', icon: 'tiku' }
      }
    ]
  },
  {
    path: '/file-manage',
    component: Layout,
    meta: { title: '文件管理', icon: 'wenjian' },
    children: [
      {
        path: 'document-manage',
        name: 'DocumentManage',
        component: () => import('@/views/fileManage/documentManage'),
        meta: { title: '文件资料管理', icon: 'ziliao' }
      },
      {
        path: 'resource-manage',
        name: 'ResourceManage',
        component: () => import('@/views/fileManage/resourceManage'),
        meta: { title: '教学资源管理', icon: 'ziyuan' }
      }
    ]
  },
  {
    path: '/experiment-manage',
    component: Layout,
    meta: { title: '实验管理', icon: 'shiyan' },
    redirect: '/experiment-manage/experiment-list',
    children: [
      {
        path: 'experiment-list',
        name: 'ExperimentList',
        component: () => import('@/views/experiment/experimentList'),
        hidden: true,
        meta: { title: '实验内容管理' }
      },
      {
        path: 'experiment-result',
        name: 'ExperimentResult',
        hidden: true,
        component: () => import('@/views/experiment/experimentResult'),
        meta: { title: '实验结果' }
      },
      {
        path: 'experiment-content',
        name: 'ExperimentContent',
        hidden: true,
        component: () => import('@/views/experiment/experimentContent'),
        meta: { title: '添加修改实验' }
      },
      {
        path: 'experiment-correct',
        name: 'ExperimentCorrect',
        hidden: true,
        component: () => import('@/views/experiment/experimentCorrect'),
        meta: { title: '批改实验' }
      }
    ]
  },
  {
    path: '/exam',
    component: Layout,
    meta: { title: '测试管理', icon: 'ceshi' },
    children: [
      {
        path: 'exam-list',
        name: 'ExamList',
        component: () => import('@/views/exam/examList'),
        meta: { title: '测试任务管理', icon: 'renwu' }
      },
      {
        path: 'exam-monitor',
        name: 'ExamMonitor',
        component: () => import('@/views/exam/examMonitor'),
        meta: { title: '监控测试列表', icon: 'jiankong' }
      },
      {
        path: 'exam-detail',
        name: 'ExamDetail',
        hidden: true,
        component: () => import('@/views/exam/examDetail'),
        meta: { title: '监控学生测试' }
      },
      {
        path: 'exam-statistic',
        name: 'ExamStatistic',
        component: () => import('@/views/exam/examStatistic'),
        meta: { title: '统计学生成绩', icon: 'tongji' }
      },
      {
        path: 'exam-chart',
        name: 'ExamChart',
        hidden: true,
        component: () => import('@/views/exam/examChart'),
        meta: { title: '学生成绩图表' }
      },
      {
        path: 'exam-initial',
        name: 'ExamInitial',
        hidden: true,
        component: () => import('@/views/exam/examInitial'),
        meta: { title: '基本信息' }
      },
      {
        path: 'exam-parameter',
        name: 'ExamParameter',
        hidden: true,
        component: () => import('@/views/exam/examParameter'),
        meta: { title: '参数设置' }
      },
      {
        path: 'exam-state',
        name: 'ExamState',
        hidden: true,
        component: () => import('@/views/exam/examState'),
        meta: { title: '状态设置' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    meta: { title: '通告管理', icon: 'gonggao' },
    redirect: '/notice/notice-list',
    children: [
      {
        path: 'notice-list',
        name: 'NoticeList',
        component: () => import('@/views/notice/noticeList'),
        hidden: true,
        meta: { title: '通告管理' }
      },
      {
        path: 'notice-content',
        name: 'NoticeContent',
        component: () => import('@/views/notice/noticeContent'),
        hidden: true,
        meta: { title: '通告内容' }
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
