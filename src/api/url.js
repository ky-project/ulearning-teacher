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
export const GET_TEACHING_TASK_BY_ID_URL = '/teacher/teachingTask/getById' // 根据id查询教学任务
// 学生选课管理
export const GET_TEACHING_TASK_PAGE_URL = '/teacher/studentTeachingTask/pageList' // 分页查询选课学生信息
export const DELETE_SELECTED_STUDENT_URL = '/teacher/studentTeachingTask/remove' // 移除选课学生信息
// 试题管理
export const GET_QUESTION_PAGE_URL = '/teacher/courseQuestion/pageList' // 分页查询课程试题
export const ADD_QUESTION_URL = '/teacher/courseQuestion/save' // 添加试题
export const ADD_QUESTION_IMG_URL = '/teacher/courseQuestion/saveQuestionFile' // 添加试题图片
export const DELETE_QUESTION_URL = '/teacher/courseQuestion/delete' // 删除试题图片
export const UPDATE_QUESTION_URL = '/teacher/courseQuestion/update' // 更新试题
export const GET_KNOWLEDGE_URL = '/teacher/courseQuestion/getKnowledgeByTeachingTaskId' // 根据教学任务id查询知识模块
// 文件资料管理
export const GET_ROOT_FOLDER_URL = '/teacher/courseDocumentation/getRootFolder' // 查询文件资料根节点
export const GET_SHAREROOT_FOLDER_URL = '/teacher/courseDocumentation/getSharedRootFolder' // 查询文件资料分享区根节点
export const GET_DOCUMENTATION_LIST_URL = '/teacher/courseDocumentation/list' // 查询文件资料列表
export const GET_DOCUMENTATION_SHARELIST_URL = '/teacher/courseDocumentation/sharedList' // 查询分享区列表
export const ADD_FOLDER_URL = '/teacher/courseDocumentation/saveFolder' // 添加文件夹
export const DELETE_DOCUMENTATION_URL = '/teacher/courseDocumentation/delete' // 删除文件资料
export const BATCHDELETE_DOCUMENTATION_URL = '/teacher/courseDocumentation/batchDelete' // 批量删除文件资料
export const UPDATE_DOCUMENTATION_URL = '/teacher/courseDocumentation/update' // 更新文件资料
export const UPLOAD_DOCUMENTATION_URL = '/teacher/courseDocumentation/saveFile' // 上传文件
export const DOWNLOAD_DOCUMENTAION_URL = '/teacher/courseDocumentation/download' // 下载文件资料
export const SHARE_DOCUMENTATION_URL = '/teacher/courseDocumentation/updateShared' // 分享文件资料
export const BATCHSHARE_DOCUMENTATION_URL = '/teacher/courseDocumentation/batchUpdateShared' // 批量分享文件资料
// 教学资源管理
export const GET_ROOT_FOLDER_URL2 = '/teacher/courseResource/getRootFolder' // 查询教学资源根节点
export const GET_SHAREROOT_FOLDER_URL2 = '/teacher/courseResource/getSharedRootFolder' // 查询教学资源分享区根节点
export const GET_RESOURCE_LIST_URL2 = '/teacher/courseResource/list' // 查询教学资源列表
export const GET_RESOURCE_SHARELIST_URL2 = '/teacher/courseResource/sharedList' // 查询分享区列表
export const ADD_FOLDER_URL2 = '/teacher/courseResource/saveFolder' // 添加文件夹
export const DELETE_RESOURCE_URL2 = '/teacher/courseResource/delete' // 删除教学资源
export const BATCHDELETE_RESOURCE_URL2 = '/teacher/courseResource/batchDelete' // 批量删除教学资源
export const UPDATE_RESOURCE_URL2 = '/teacher/courseResource/update' // 更新教学资源
export const UPLOAD_RESOURCE_URL2 = '/teacher/courseResource/saveFile' // 上传文件
export const DOWNLOAD_DOCUMENTAION_URL2 = '/teacher/courseResource/download' // 下载教学资源
export const SHARE_RESOURCE_URL2 = '/teacher/courseResource/updateShared' // 分享教学资源
export const BATCHSHARE_RESOURCE_URL2 = '/teacher/courseResource/batchUpdateShared' // 批量分享教学资源
// 实验管理
export const GET_EXPERIMENT_PAGE_URL = '/teacher/teachingTaskExperiment/pageList' // 分页查询实验信息
export const ADD_ATTACHMENT_URL = '/teacher/teachingTaskExperiment/uploadAttachment' // 添加附件
export const ADD_EXPERIMENT_URL = '/teacher/teachingTaskExperiment/save' // 添加实验
export const UPDATE_EXPERIMENT_URL = '/teacher/teachingTaskExperiment/update' // 更新实验
export const DELETE_EXPERIMENT_URL = '/teacher/teachingTaskExperiment/delete' // 删除实验
// 测试管理
export const GET_EXAM_PAGE_URL = '/teacher/examinationTask/pageList' // 分页查询测试任务
export const ADD_EXAM_URL = '/teacher/examinationTask/save' // 添加测试任务
export const UPDATE_EXAM_URL = '/teacher/examinationTask/update' // 添加测试任务
export const DELETE_EXAM_URL = '/teacher/examinationTask/delete' // 删除测试任务
export const GET_EXAM_LIST_URL = '/teacher/examinationTask/getArrByTeachingTaskId' // 根据教学任务id查询测试任务数组
// 通告管理
export const GET_NOTICE_PAGE_URL = '/teacher/teachingTaskNotice/pageList' // 分页查询通告
export const ADD_ATTACHMENT_URL2 = '/teacher/teachingTaskNotice/saveAttachments' // 添加附件
export const ADD_NOTICE_URL = '/teacher/teachingTaskNotice/save' // 添加通告
export const UPDATE_NOTICE_URL = '/teacher/teachingTaskNotice/update' // 修改通告
export const DELETE_NOTICE_URL = '/teacher/teachingTaskNotice/delete' // 删除通告
// 实验结果管理
export const GET_EXPERIMENT_RESULT_PAGE_URL = '/teacher/experimentResult/pageList' // 分页查询实验结果
export const DOWNLOAD_EXPERIMENT_RESULT_URL = '/teacher/experimentResult/downloadAttachment' // 下载附件
export const CORRECT_EXPERIMENT_RESULT_URL = '/teacher/experimentResult/correctResult' // 批改实验结果
// 测试结果统计
export const GET_STUDENT_EXAM_PAGE = '/teacher/studentExaminationTask/pageList' // 分页查询学生测试
export const GET_STUDENT_EXAM_RESULT_PAGE = '/teacher/studentExaminationTask/pageStudentExaminationResultList' // 分页查询学生测试结果统计信息
export const GET_STUDENT_EXAM_STATISTIC_URL = '/teacher/studentExaminationTask/getStudentExaminationStatistics' // 分页查询学生测试统计
export const GET_EXAM_DETAIL_URL = '/teacher/studentExaminationTask/getExaminationResultByExaminingId' // 根据学生测试id查询答题情况
export const EXPORT_EXAM_RESULT = '/teacher/studentExaminationTask/export' // 导出学生测试结果统计

