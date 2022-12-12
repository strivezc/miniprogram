import { ApiResp } from '../types'
import { ApiRespList } from './../types'

export interface AgreementParm {
  appType: number
}

export type AgreementResp = ApiResp<AgreementData[]>
export interface AgreementData {
  id: number
  type: number
  companyId: number
  name: string
  content: string
  agreementUrl: string
  secondLevelDomain: string
  adminUpdatedTime?: any
  adminUpdatedBy?: any
}

export type OrderListResp = ApiResp<OrderListData[]>

export interface OrderListData {
  companyId?: number
  id: number
  orderNum: string
  userId?: any
  commodityId: number
  groupBuyingName: string
  orderPrice: number
  realPrice: number
  orderStatus: number
  payChannel?: any
  payTime?: any
  isInvoice: number
  revision?: any
  createdBy?: any
  createdTime: string
  updatedBy?: any
  updatedTime?: any
  status: number
  commodityType: number
  serialNumber?: any
  toPayButtonStatus: number
  cancelButtonStatus: number
  segmentBuyParams?: any
}

export type MyCourseResp = ApiRespList<MyCourseData[]>
export interface MyCourseData {
  companyId?: number
  sellCourseScheduleId: number
  courseScheduleId: number
  courseScheduleName: string
  teacherName: string
  teacherId: number
  teacherImg: string
  subjectsName: string
  difficultyId?: any
  gradeId: string
  courseStartDate?: any
  courseEndDate?: any
  courseTimeInfoList: any[]
  courseCount: number
  exercisesAccuracy?: any
  exercisesComplete?: any
  courseScheduleStatus: number
  learnReportButtonStatus?: any
  fixedCodeUrl?: any
  classType: number
  isClassGroupCode: number
  courseScheduleImg: string
  courseUnlockWay: number
  oldDataFlag: number
}
