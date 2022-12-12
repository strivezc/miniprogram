import Fly from 'flyio/dist/npm/wx'
import { getStorage } from './storage'
import { $toast } from '.'
import { baseUrl } from '@/config'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const fly = new Fly()

fly.config.baseURL = baseUrl

const tokenFly = new Fly()
tokenFly.config.baseURL = baseUrl

fly.interceptors.request.use(function (request) {
  const company = getStorage('company')

  if (!request.skipToken) {
    if (request.method === 'POST') {
      request.body = {
        ...request.body,
        companyId: company.companyId,
      }
    } else if (request.method === 'GET') {
      request.params = {
        ...request.params,
        companyId: company.companyId,
      }
    }
  }

  if (!request.skipToken && !userStore.token && !userStore.openId) {
    //锁定当前实例，后续请求会在拦截器外排队
    fly.lock()
    return new Promise((resolve) => {
      uni.login({
        async success(loginRes) {
          const getOpenIdResp = await tokenFly.get(
            '/userCommon/queryWXOauthOpenIdByCode',
            { code: loginRes.code, companyId: company.companyId },
          )

          if (getOpenIdResp.data.resultData.openId) {
            userStore.openId = getOpenIdResp.data.resultData.openId
            const getTokenResp = await tokenFly.post(
              '/userCommon/userLoginByThirdPlatform',
              {
                appletFlag: 'applet',
                companyId: company.companyId,
                isApp: 2,
                thirdPlatform: 5,
                unionid: getOpenIdResp.data.resultData.openId,
              },
            )

            userStore.loginInfo = getTokenResp.data.resultData
            if (request.method === 'POST') {
              request.data = {
                ...request.data,
                token: getTokenResp.data.resultData.token,
              }
            } else if (request.method === 'GET') {
              request.params = {
                ...request.params,
                token: getTokenResp.data.resultData.token,
              }
            }
            userStore.token = getTokenResp.data.resultData.token
            resolve(request)
          }
        },
      })
    }).finally(() => {
      fly.unlock() //解锁后，会继续发起请求队列中的任务
    })
  } else {
    // 如果有openId但是没有token，代表用户没有登录账号
    if (!userStore.token && userStore.openId) {
      if (!request.skipToken) {
        fly.clear() // TODO 没有起作用，不会取消请求
        uni.hideLoading()
      }
    } else {
      if (request.method === 'POST') {
        request.body = {
          ...request.body,
          token: userStore.token,
        }
      } else if (request.method === 'GET') {
        request.params = {
          ...request.params,
          token: userStore.token,
        }
      }
      // console.log(request)
    }
  }
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    console.log(response)
    // 只将请求结果的data字段返回
    if (response.status !== 200 || response.data.resultCode !== 0) {
      $toast(response.data.resultMessage)
    }
    return response
  },
  (err) => {
    //发生网络错误后会走到这里
    //return Promise.resolve("ssss")
  },
)

export default fly
