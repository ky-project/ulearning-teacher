import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
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
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
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
        component: () => import('@/views/personal/index'),
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
        component: () => import('@/views/studentManage/index'),
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
        component: () => import('@/views/questionBank/index'),
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
        component: () => import('@/views/fileManage/documentManage/index'),
        meta: { title: '文件资料管理', icon: 'ziliao' }
      },
      {
        path: 'resource-manage',
        name: 'ResourceManage',
        component: () =>
                 import('@/views/fileManage/resourceManage/index'),
        meta: { title: '教学资源管理', icon: 'ziyuan' }
      }
    ]
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
