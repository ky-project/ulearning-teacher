import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getRefreshToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken() && getRefreshToken()
  // console.log('hasToken', hasToken)
  // debugger
  if (hasToken) {
    // 如果已经登录
    if (to.path === '/login') {
      // 如果前往登录页，直接跳转
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断是否有必要信息
      const { userInfo, role, teachingTask } = store.getters
      // console.log('userInfo', userInfo)
      // console.log('role', role)
      // console.log('teachingTask', teachingTask)
      const hasInfo = userInfo && role && teachingTask
      // console.log('hasInfo', hasInfo)
      if (hasInfo) {
        // 如果有，跳转
        next()
      } else {
        // 没有，尝试获取
        try {
          // console.log('尝试获取')
          const promiseArr = [
            store.dispatch('user/getInfo'),
            store.dispatch('user/getRole'),
            store.dispatch('user/getTeachingTask')
          ]
          await Promise.all(promiseArr)
          // 成功, 跳转
          next()
        } catch (error) {
          // 失败，出错
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next('/login')
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
