import defaultSettings from '@/settings'

const title = defaultSettings.title || 'U-Learning教师管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
