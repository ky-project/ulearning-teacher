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
export const DELETE_SELECTED_STUDENT_URL = '/teacher/studentTeachingTask/remove' // 移除选课学生信息
// 试题管理
export const GET_QUESTION_PAGE_URL = '/teacher/courseQuestion/pageList' // 分页查询课程试题
export const ADD_QUESTION_URL = '/teacher/courseQuestion/save' // 添加试题
// 文件资料管理
export const GET_ROOT_FOLDER_URL = '/teacher/courseDocumentation/getRootFolder' // 查询文件资料根节点
export const GET_DOCUMENTATION_LIST_URL = '/teacher/courseDocumentation/list' // 查询文件资料列表
export const ADD_FOLDER_URL = '/teacher/courseDocumentation/saveFolder' // 添加文件夹
export const DELETE_DOCUMENTATION_URL = '/teacher/courseDocumentation/delete' // 删除文件资料
export const UPDATE_DOCUMENTATION_URL = '/teacher/courseDocumentation/update' // 更新文件资料
export const UPLOAD_DOCUMENTATION_URL = '/teacher/courseDocumentation/saveFile' // 上传文件
export const DOWNLOAD_DOCUMENTAION_URL = '/teacher/courseDocumentation/download' // 下载文件资料
// 实验管理
export const GET_EXPERIMENT_PAGE_URL = '/teacher/teachingTaskExperiment/pageList' // 分页查询实验信息
export const ADD_ATTACHMENT_URL = '/teacher/teachingTaskExperiment/uploadAttachment' // 添加附件
export const ADD_EXPERIMENT_URL = '/teacher/teachingTaskExperiment/save' // 添加实验
export const UPDATE_EXPERIMENT_URL = '/teacher/teachingTaskExperiment/update' // 更新实验
export const DELETE_EXPERIMENT_URL = '/teacher/teachingTaskExperiment/delete' // 删除实验
