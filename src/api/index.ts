import { ApiResp, ApiRespList } from './types'
import * as IndexModels from './model/index.model'
// import { fly } from '@/utils/fetch'
import fly from '@/utils/flyjs'

class IndexService {
  // 获取公司列表
  static getCompanyList(params = {}): Promise<ApiResp> {
    return fly.get('/sass/companyinfo/getSaasCompanyInfoList', params, {
      skipToken: true,
    })
  }
  // 获取公司信息
  static getCompanyInfo(params = {}): Promise<IndexModels.CompanyInfoResp> {
    return fly.get('/sass/companyinfo/getSaasCompanyInfoById', params)
  }
  // 获取公司隐私政策
  static getCompanyAgreement(params = {}): Promise<ApiResp> {
    return fly.get('/sass/companyinfo/getSaasAgreementInfoList', params)
  }
  // 获取课程列表
  static getCourseList(params = {}): Promise<ApiResp> {
    return fly.get('/sellCourseClockIn/queryClockinCoursesList', params)
  }
  // 获取课程详情
  static getCourseDetails(params = {}) {
    return fly.get<IndexModels.CourseDetaisResp>(
      '/courseDetail/getCourseDetailById',
      params,
    )
  }
  // 获取课表详情
  static getCourseSchedule(params = {}) {
    return fly.get<IndexModels.CourseScheduleResp>(
      '/courseDetail/getCourseScheduleById',
      params,
    )
  }
  // 课表评价
  static commentCourse(params = {}) {
    return fly.post<IndexModels.CourseScheduleResp>(
      '/datebook/commentCourse',
      params,
    )
  }
  // 获取课表评价
  static getCommentCourse(params = {}) {
    return fly.get<IndexModels.CourseScheduleResp>(
      '/courseDetail/getCourseAppraiseById',
      params,
    )
  }
  // 获取已购买课程列表
  static getBoughtCourseList(params = {}): Promise<ApiResp> {
    return fly.get('/sellCourseClockIn/queryBuyClockinCoursesList', params)
  }
  // 取打卡营课表主题列表
  static learnCourseSchedule(params = {}): Promise<ApiResp> {
    return fly.get(
      '/sellCourseClockIn/querySellCourseClockInSubjectList',
      params,
    )
  }
  // 获取课程标签
  static getTagList(params = {}): Promise<HttpResponse> {
    return fly.get('/datebook/querySysLableList', params)
  }
  // // 0元购买
  // static buyCourseFree(params = {}): Promise<HttpResponse> {
  //   return http.post('/payManage/courseZeroBuy', params)
  // }

  // 首页获取精选课程
  static getRecommendedCourse(params = {}) {
    return fly.get<IndexModels.GetRecommendedCourseResp>(
      '/userCommon/getRecommendedCourse',
      params,
    )
  }

  // 首页获取所有主题
  static getAllSubjectConstant(params = {}) {
    return fly.get<IndexModels.GetAllSubjectResp>(
      '/userCommon/getAllSubjectConstant',
      params,
    )
  }

  // 首页根据主题获取内容
  static getCourseBySubject(params = {}) {
    return fly.get<IndexModels.GetRecommendedCourseResp>(
      '/courseDetail/getCourses',
      params,
    )
  }

  // 兑换礼物
  static exchangeGoods(data = {}) {
    return fly.post<IndexModels.GetRecommendedCourseResp>(
      '/datebook/exchangeCodeExchangeGoods',
      data,
    )
  }

  // 获取课表
  static getScheduleList(params = {}) {
    return fly.get<IndexModels.CourseScheduleResp>(
      '/datebook/queryMyDatebookCourseScheduleList',
      params,
    )
  }

  // 获取课表详情
  static getScheduleDetails(params = {}) {
    return fly.get<IndexModels.CourseScheduleDetailsResp>(
      '/datebook/queryMyDatebookCourseListById',
      params,
    )
  }

  // 获取首页banner
  static getHomeBannerList(params = {}) {
    return fly.get<IndexModels.CourseScheduleDetailsResp>(
      '/userCommon/getAPPBanner',
      params,
    )
  }

  // 获取购买课程声明
  static getBuyCourseAgreement(params = {}) {
    return fly.get('/agreementManage/getAgreementContentById', params)
  }

  // 获取热门搜索网校
  static getHotSearchCompanyInfoList(params = {}) {
    return fly.get('/sass/companyinfo/getHotSearchCompanyInfoList', params, {
      skipToken: true,
    })
  }

  // 获取群关注二维码
  static getGroupCode(params = {}) {
    return fly.get('/datebook/queryCoueseScheduleTwoCodeInfoNew', params)
  }
}

export default IndexService
