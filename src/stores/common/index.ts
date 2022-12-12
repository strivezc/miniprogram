import { defineStore } from 'pinia'

import { RootState } from './types'
import { setStorage } from '@/utils/storage'

export const useCommonStore = defineStore('common', {
  state: (): RootState => ({
    systemInfo: {
      safeArea: '',
      screenWidth: '',
      screenHeight: '',
      statusBarHeight: '',
      windowWidth: '',
      windowHeight: '',
      platform: '',
    },
    isIOS: false, // 是否ios
    companyInfo: {}, // 公司信息
    isEn: false, // 是否英文
    courseStatus: '', // 课表状态筛选
    classType: '', // 课表类型筛选
    subjectId: '', // 栏目
  }),
  getters: {},
  actions: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.systemInfo = systemInfo
      this.isIOS = systemInfo.platform === 'ios'
    },
  },
})
