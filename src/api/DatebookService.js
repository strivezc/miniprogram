import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  getTrialClassTime() {
    return request({
      url: `${requestPort.datebook}/studentExperienceCourse/getTrialClassTime`,
      method: 'get'
    });
  },
  receiveTrialClass(data) {
    return request({
      url: `${requestPort.datebook}/studentExperienceCourse/receiveTrialClass`,
      method: 'post',
      data
    })
  },
  checkUserInfoIsComplete() {
    //口语测评预约-检查用户个人信息是否完善
    return request({
      url: `${requestPort.datebook}/studentEvaluation/checkUserInfoIsComplete`,
      method: 'post'
    })
  },
  completeInfomation(data) {
    //口语测评预约-完善用户个人信息
    return request({
      url: `${requestPort.datebook}/studentEvaluation/completeInfomation`,
      method: 'post',
      data
    })
  },
  toChildEvaluationDatebook(data) {
    //口语测评预约-进入口语测评预约
    return request({
      url: `${requestPort.datebook}/studentEvaluation/toChildEvaluationDatebook`,
      method: 'post',
      data
    })
  },
  activateNeedRemindCheck(packageId) {
    //口语测评预约-激活-提示语校验
    return request({
      url: `${requestPort.datebook}/studentEvaluation/packageActivateNeedRemindCheck/${packageId}`,
      method: 'get'
    })
  },
  activePackage(data) {
    //口语测评预约-激活套餐
    return request({
      url: `${requestPort.datebook}/studentEvaluation/activePackage`,
      method: 'post',
      data
    })
  },
  checkDateBookDateTime(data) {
    //口语测评预约-校验测评预约
    return request({
      url: `${requestPort.datebook}/studentEvaluation/checkDateBookDateTime`,
      method: 'post',
      data,
    })
  },
  submitEvaluation(data) {
    //口语测评预约-提交测评预约
    return request({
      url: `${requestPort.datebook}/studentEvaluation/datermineMakeEvalua`,
      method: 'post',
      data,
    })
  },
  appoitedCheckUser() {
    //自由预约--用户检测
    return request({
      url: `${requestPort.datebook}/common/checkUserInfo`,
      method: 'get',
    })
  },
  vipCheckUser() {
    //vip预约--1.用户检测
    return request({
      url: `${requestPort.datebook}/vip/checkUserInfo`,
      method: 'get',
    })
  },
  getFreeAppointPackageInfo(teacherId) {
    //自由预约-获取套餐信息及预约首页老师列表
    return request({
      url: `${requestPort.datebook}/common/studentPackageInfo/${teacherId}`,
      method: 'get',
    })
  },
  activeMeal(packageId){ //激活套餐
    return request({
      url:`${requestPort.market}/myPackage/activatePackage/${packageId}`,
      method:'put',
    });
  },
  searchTeacherTime(data) {
    //自由预约-根据条件搜索老师时间
    return request({
      url: `${requestPort.datebook}/common/searchTeacherTime`,
      method: 'post',
      data,
    })
  },
  queryTeacherScheduleForApp(data) {
    //自由预约-App老师时间批量展示
    return request({
      url: `${requestPort.datebook}/common/queryTeacherScheduleForApp`,
      method: 'post',
      data,
    })
  },
  checkBatchTime(data) {
    //自由预约-老师多个时间检测
    return request({
      url: `${requestPort.datebook}/common/checkDatebookTime`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  checkDatebookNum(data) {
    //自由预约--检测约课课时是否足够
    return request({
      url: `${requestPort.datebook}/common/checkDatebookNum`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  getBookGroup() {
    //自由预约-选择教材获取学生可预约的教材
    return request({
      url: `${requestPort.datebook}/book/queryStudentBookGroup/-1`,
      method: 'get',
    })
  },
  getLessonGroup(bgId) {
    //自由预约-根据教材获取分册信息
    return request({
      url: `${requestPort.datebook}/book/queryBookForGroup/${bgId}`,
      method: 'get',
    })
  },
  getTextGroup(bookId) {
    //自由预约-根据分册获取课文信息
    return request({
      url: `${requestPort.datebook}/book/queryLessonForBook/${bookId}`,
      method: 'get',
    })
  },
  modifyMaterial(userId) {
    //自由预约--教材填充
    return request({
      url: `${requestPort.datebook}/common/selectClassBookInfo/${userId}`,
      method: 'get',
    })
  },
  autoFillCourse(data) {
    //自由预约--填充教材
    return request({
      url: `${requestPort.datebook}/book/autoFillCourse`,
      method: 'post',
      data
    })
  },
  checkBookInfoSubmit(data) {
    //约课提交前检测
    return request({
      url: `${requestPort.datebook}/common/checkDatebookInfoSubmit`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  dateBookSubmit(hash) {
    //自由预约--约课提交
    return request({
      url: `${requestPort.datebook}/common/datebookSubmitForCommon/${hash}`,
      method: 'get',
    })
  },
  vipUserPackageInfo() {
    //vip预约-2.用户套餐检测
    return request({
      url: `${requestPort.datebook}/vip/userPackageInfo`,
      method: 'get',
      hideMessage: true,
    })
  },
  vipTeacherTime(data) {
    //vip预约-3.老师时间搜索
    return request({
      url: `${requestPort.datebook}/vip/searchVipTeacherTime`,
      method: 'post',
      data,
    })
  },
  checkVipDatebookTime(data) {
    //vip预约--4.选中时间校验
    return request({
      url: `${requestPort.datebook}/vip/checkDatebookTime`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  cancelCheckTime(data) {
    //取消选中的时间
    return request({
      url: `${requestPort.datebook}/vip/cancelCheckTime`,
      method: 'post',
      data,
    })
  },
  checkVipDatebookStatus() {
    return request({
      url: `${requestPort.datebook}/vip/checkVipDatebookStatus`,
      method: 'get',
    })
  },
  childDatebookTimeList(data) {
    //vip预约--5.选完时间，点击下一步
    return request({
      url: `${requestPort.datebook}/vip/childDatebookTimeList`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  removeDateTime(data) {
    //vip预约--7.删除时间段
    return request({
      url: `${requestPort.datebook}/vip/removeDateTime`,
      method: 'post',
      data,
    })
  },
  continuedBooked(data) {
    //vip预约--6.选择续课周数
    return request({
      url: `${requestPort.datebook}/vip/continuedBooked`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  childVipSelectLesson(data) {
    //vip预约--8.vip预约跳转到选择教材页面
    return request({
      url: `${requestPort.datebook}/vip/childVipSelectLesson`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  vipDatebookSubmitBeforeCheck(data) {
    //vip预约--9.约课提交前检测
    return request({
      url: `${requestPort.datebook}/vip/vipDatebookSubmitCheck`,
      method: 'post',
      data,
      hideMessage: true,
    })
  },
  vipDatebookSubmitCheck(hash) {
    //vip预约--10.约课提交
    return request({
      url: `${requestPort.datebook}/vip/vipDatebookSubmit/${hash}`,
      method: 'get',
      hideMessage: true,
    })
  },
}
