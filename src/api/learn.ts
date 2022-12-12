import * as LearnModel from './model/learn.model'
import fly from '@/utils/flyjs'
import { HttpResponse } from '@/@types'

class LearnService {
  // 录播课详情
  static reviewCourse(params = {}): Promise<HttpResponse> {
    return fly.get('/datebook/queryMyDatebookCourseListById', params)
  }
  // 直播课详情
  static liveCourse(params = {}): Promise<HttpResponse> {
    return fly.get('/datebook/queryMyDatebookCourseListByIdApp', params)
  }
  // 获取课程详情
  static getCourseDetails(params = {}): Promise<HttpResponse> {
    return fly.get('/courseDetail/getCourseDetailById', params)
  }
  // 获取规划详情
  static getScheduleDetails(params = {}): Promise<HttpResponse> {
    return fly.get('/datebook/queryMyDatebookCourseDetailById', params)
  }
  // 获取海报信息
  static getPosterInfo(params = {}): Promise<HttpResponse> {
    return fly.get('/sellCourseClockIn/queryPunchInPosterDetail', params)
  }
  // 去打卡详情
  static clockInSubjectList(params = {}): Promise<HttpResponse> {
    return fly.get(
      '/sellCourseClockIn/querySellCourseClockInSubjectList',
      params,
    )
  }
  // 获取题库简单信息
  static getQuestionBankSimpleInfo(params = {}): Promise<HttpResponse> {
    return fly.get(
      '/evaluationDetail/getQuestionBankSimpleInfoByBankId',
      params,
    )
  }
  // 获取单节课程测评题库信息
  static getEvaluationQuestionBankInfo(params = {}): Promise<HttpResponse> {
    return fly.get(
      '/evaluationDetail/getEvaluationQuestionBankInfoByCourseId',
      params,
    )
  }
  // 获取单节课程测评题库信息
  static getSubjectiveQuestionBankInfoByCourseId(
    params = {},
  ): Promise<HttpResponse> {
    return fly.get(
      '/evaluationDetail/getSubjectiveQuestionBankInfoByCourseId',
      params,
    )
  }
  // 打卡日期是否结束
  static queryIsClockInEnd(params = {}): Promise<HttpResponse> {
    return fly.get('/sellCourseClockIn/queryIsClockInEnd', params)
  }
  // 获取测评id
  static queryExercisesreLevantId(params = {}): Promise<HttpResponse> {
    return fly.get('/sellCourseClockIn/queryExercisesreLevantId', params)
  }
  // 获取答题结果
  static getAnswerResult(params = {}): Promise<HttpResponse> {
    return fly.get('/evaluationDetail/queryQuestionResult', params)
  }
  // 保存打卡记录
  static saveSellCourseClockInRecord(params = {}): Promise<HttpResponse> {
    return fly.post('/sellCourseClockIn/saveSellCourseClockInRecord', params)
  }
  // 保存打卡营主题学习记录
  static saveSellCourseSubjectStudyRecord(params = {}): Promise<HttpResponse> {
    return fly.post(
      '/sellCourseClockIn/saveSellCourseSubjectStudyRecord',
      params,
    )
  }
  // 提交客观作答
  static submitAnswer(params = {}): Promise<HttpResponse> {
    return fly.post('/evaluationDetail/submitEvaluationRecord', params)
  }
  // 提交主观作答
  static submitSubjectiveAnswer(params = {}): Promise<HttpResponse> {
    return fly.post('/evaluationDetail/submitSubjectiveQuestionRecord', params)
  }
  // 获取直播房间参数
  static getRoomParams(data = {}) {
    return fly.post('/classRoom/joinClassRoom', data)
  }
  // 获取直播房间参数
  static joinLiveClass(data = {}) {
    return fly.get('/common/live/joinClass', data)
  }
  // 获取直播房间参数
  static getRecordRoomParams(data = {}) {
    return fly.get('/common/video/viewVideo', data)
  }
}

export default LearnService
