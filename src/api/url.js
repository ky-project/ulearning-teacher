// 系统认证接口
export const VCODE_URL = '/auth/vCode' // 获取验证码
export const LOGIN_URL = '/auth/login' // 登录
export const LOG_OUT_URL = '/auth/logout' // 登出
export const INFO_URL = '/auth/info' // 获取个人信息
export const UPLOAD_AVATAR_URL = '/auth/uploadPhoto' // 上传头像
export const UPDATE_PWD_URL = '/auth/updatePassword' // 修改密码
export const UPDATE_INFO_URL = '/auth/update/info' // 修改个人信息
export const ROLE_INFO_URL = '/auth/roleInfo' // 获取个人角色信息
// 教学任务管理
export const GET_ALL_TEACHING_TASK_URL = '/teacher/teachingTask/getAll' // 获取教师所有的教学任务
// 学生选课管理
export const GET_TEACHING_TASK_PAGE_URL = '/teacher/studentTeachingTask/pageList' // 分页查询选课学生信息
export const DELETE_SELECTED_STUDENT = '/teacher/studentTeachingTask/remove' // 移除选课学生信息

