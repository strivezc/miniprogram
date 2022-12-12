import { ApiResp, ApiRespList } from '../types'

export interface Company {
  companyName: string
  companyId: number
}

export type GetRecommendedCourseResp = ApiRespList<RecommendCourse[]>

export interface RecommendCourse {
  companyId?: any
  sellCourseScheduleId: number
  courseScheduleId: number
  courseScheduleName: string
  teacherName: string
  courseScheduleVideo: string
  courseScheduleImg: string
  meetType: number
  toolType: number
  teacherId: number
  teacherImg: string
  subjectsName: string
  gradeId?: any
  courseStartDate: string
  courseEndDate: string
  courseTimeInfoList: CourseTimeInfoList[]
  courseCount: number
  coursePrice?: any
  courseSellPrice: string
  upperLimit?: any
  datebookNum?: any
  stopSaleTime: string
  currentDateTime: string
  stopSaleTimeStamp: string
  currentDateTimeStamp: string
  sysLableIds?: any
  sysLableObjects?: any
  sellStatus: number
  classType: number
  needExamination?: any
  questionBankId?: any
  isEvaluatingFinish?: any
  isRecommend: number
  segmentedSellPrice?: any
  allBuySellPrice?: any
  alreadyList?: any
  notList?: any
  distributionAmount?: any
  activityId?: any
}

export interface CourseTimeInfoList {
  companyId?: any
  startTime: string
  endTime: string
  week: number
}

export type GetAllSubjectResp = ApiResp<SubjectItem[]>

export interface SubjectItem {
  companyId: number
  constantId: number
  constantDescribe: string
  type: number
}

export type CourseDetaisResp = ApiRespList<CourseDetaisData>

export interface CourseDetaisData {
  companyId?: number
  sellCourseScheduleId: number
  courseScheduleId: number
  courseScheduleName: string
  courseScheduleVideo: string
  courseScheduleImg: string
  meetType: number
  toolType: number
  teacherName: string
  teacherId: number
  teacherImg: string
  teacherSelfIntroduce: string
  subjectsName: string
  gradeId?: any
  courseStartDate?: any
  courseEndDate?: any
  courseCount: number
  coursePrice?: any
  courseSellPrice: string
  stopSaleTime?: any
  currentDateTime: string
  stopSaleTimeStamp?: any
  currentDateTimeStamp: string
  scheduleSynopsis: string
  courseTimeInfoList: any[]
  needExamination: number
  questionBankId?: any
  upperLimit?: any
  datebookNum: number
  haveDatebook: number
  sysLableIds: string
  sellStatus: number
  isEvaluatingFinish: number
  classType: number
  keyword: string
  teachSubjects: string
  segmentedPay: number
  segmentedPayButtonStatus: number
  segmentedSellPrice: string
  segmentCourseCount: number
  inviteGiftActivityId?: any
  activityType?: any
  distributionAmount?: any
  learningMode: number
  clockInEndTime?: any
  clockInStartTime?: any
}

export type CourseScheduleResp = ApiResp<CourseScheduleData[]>
export interface CourseScheduleData {
  companyId?: any
  id: number
  sellCourseScheduleId: number
  courseScheduleId: number
  scheduleName: string
  courseName: string
  courseStartDate?: any
  courseStartTime?: any
  courseEndTime?: any
  teacherId: string
  teacherName: string
  imgUrl: string
  firstStartTime?: any
  lastStartTime?: any
  courseIndex: number
  evaluationSum: number
  noticeTimeStr?: any
  countDown: number
  countDownStr?: any
  waitNumberOfClasses: number
  playbackNumber: number
  timeSlot: number
  courseTimeInfoList?: any
  classType: number
  openAndCloseCourse: number
  learningMode: number
  clockInEndTime: string
  clockInStartTime: string
  courseStatus?: number
}

export interface UserLoginByThirdPlatform {
  companyId: number
  token: string
  userId: number
  userName: string
  userType: number
  firstLogin: number
  modifyTimeZone: number
  isPerfect?: any
  phone: string
  isShow: number
  isBand?: any
  isPlayShow: boolean
  inviteOffShelf?: any
  accountBindPhone: string
  giftList?: any
  branchName?: string
  email?: string
}

export type CourseScheduleDetailsResp = ApiRespList<ScheduleDetailData[]>

export interface ScheduleDetailData {
  companyId?: any
  sellCourseId: number
  sellCourseScheduleId: number
  courseScheduleId: number
  courseName: string
  courseStartDate?: any
  courseStartTime?: any
  courseEndTime?: any
  courseIndex: number
  whaDayIsToday?: any
  courseId: number
  videoId: number
  countDownStr?: any
  timeSlot: number
  countDown: number
  isPlayback: number
  playbackMonth: number
  enterClassroomButtonStatus?: any
  courseCommentButtonStatus: number
  playbackButtonStatus?: any
  watchCourseButtonStatus: number
  exerciseButtonStatus: number
  questionBankId?: number
  unlockTip?: any
  questionBankType?: number
  unlockDate?: any
  courseUnlockWay: number
  courseFileUrlList: any[]
  openAndCloseCourse: number
  learningMode: number
  punchInPhaseStatusRespDTO: {
    sellCourseStatus: number
    subjectStudyStatus: number
    contactChallengeStatus: number
    clockInStatus: number
  }
  clockInEndTime: string
  clockInStartTime: string
}

export type CompanyInfoResp = ApiResp<CompanyInfo>
export interface CompanyInfo {
  companyId: number
  companyName: string
  chindleName: string
  chindleShortName: string
  secondLevelDomain: string
  serviceQq: string
  servicePhone: string
  companyCreditCode: string
  icpAq: string
  publicSecurityRecords: string
  copyrightAffiliation: string
  logoColor: string
  logoBlackWhite: string
  logoBrowser: string
  agreementTypeZeroId: number
  branchName: string
}
