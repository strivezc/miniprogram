import { CompanyInfo } from '@/api/model/index.model'
export interface RootState {
  systemInfo: SystemInfo
  isIOS: boolean
  isEn: boolean
  companyInfo: CompanyInfo
  courseStatus: string | number // 课表状态筛选
  classType: string | number // 课表类型筛选
  subjectId: string | number // 栏目筛选
}

export interface SystemInfo {
  safeArea: {
    top: number
  }
  screenWidth: number
  screenHeight: number
  statusBarHeight: number
  windowWidth: number
  windowHeight: number
  platform: string
}
