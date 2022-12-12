import { UserLoginByThirdPlatform } from '@/api/model/index.model'

export interface RootState {
  token: string
  userName: string
  userInfo: UserInfo
  openId: string
  loginInfo: UserLoginByThirdPlatform
}

export interface UserInfo {
  id: string
  name: string
  grade: {
    studentNum: string
    studentLevel: number
  }
}
