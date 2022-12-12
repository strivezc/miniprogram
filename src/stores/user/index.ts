import { defineStore } from 'pinia'
import { RootState } from './types'

export const useUserStore = defineStore('user', {
  state: (): RootState => ({
    userInfo: {
      id: null,
      name: '',
    },
    token: '',
    userName: '',
    openId: '',
    loginInfo: {}, // 登录接口返回信息
  }),
  getters: {
    capName(state) {
      return state.userInfo.name.toUpperCase()
    },
    // 是否还没登录
    isNotLogin(state) {
      return state.openId && !state.token
    },
  },
  actions: {
    // 退出登录
    quitAccount() {
      this.token = ''
      this.loginInfo = {}
    },
  },
})
