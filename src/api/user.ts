import * as UserModel from './model/user.model'
import fly from '@/utils/flyjs'

const UserService = {
  // 获取公司隐私政策
  getCompanyAgreement(params: UserModel.AgreementParm) {
    return fly.get<UserModel.AgreementResp>(
      '/sass/companyinfo/getSaasAgreementInfoList',
      params,
    )
  },
  // 获取用户订单
  getOrderList(params = {}) {
    return fly.get<UserModel.OrderListResp>(
      '/datebook/queryCourseOrderList',
      params,
    )
  },
  // 获取用户团购订单
  getGroupOrderList(params = {}) {
    return fly.get<UserModel.OrderListResp>(
      '/datebook/queryGroupBuyingOrderList',
      params,
    )
  },
  // 微信手机授权登录
  loginByCode(data) {
    return fly.post<UserModel.OrderListResp>(
      '/userCommon/getWxDecryptPhone',
      data,
    )
  },
  // 微信手机授权登录获取token
  loginCodeGetToken(data) {
    return fly.post<UserModel.OrderListResp>(
      '/userCommon/userLoginByPhoneApplet',
      data,
    )
  },
  // 我的课程
  getCourses(params) {
    return fly.get<UserModel.MyCourseResp>(
      '/datebook/getMyCourseSchedule',
      params,
    )
  },
  // 我的课程详情
  getCoursesDetails(params) {
    return fly.get<UserModel.OrderListResp>(
      '/courseDetail/getCourseScheduleById',
      params,
    )
  },
  // 获取验证码
  getCode(params) {
    return fly.post('/userCommon/generateCommonCaptchaCodeNew', params)
  },
  // 注销账号
  cancelAccount(params) {
    return fly.post('/userCommon/userLogOff', params)
  },
  // 注销账号
  checkIfCanCancel(params) {
    return fly.post('/userCommon/userLogOffCheck', params)
  },
}

export default UserService
