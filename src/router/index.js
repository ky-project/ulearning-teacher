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
    children: [
      {
        path: 'experiment-list',
        name: 'ExperimentList',
        component: () => import('@/views/experiment/experimentList'),
        meta: { title: '实验内容管理', icon: 'shiyanneirong' }
      },
      {
        path: 'experiment-content',
        name: 'ExperimentContent',
        hidden: true,
        component: () => import('@/views/experiment/experimentContent'),
        meta: { title: '添加修改实验' }
      },
      {
        path: 'student-experiment',
        name: 'StudentExperiment',
        component: () => import('@/views/experiment/studentExperiment'),
        meta: { title: '学生实验管理', icon: 'xueshengshiyan' }
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
