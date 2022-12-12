import { PreQuest, create } from '@prequest/miniprogram'
import Lock from '@prequest/lock'
import { MiddlewareCallback } from '@prequest/types'
import { getStorage } from './storage'
import { useUserStore } from '@/stores/user'
import { baseUrl } from '@/config'
const userStore = useUserStore()
declare module '@prequest/types' {
  interface PQRequest {
    name?: string
    url?: string
    filePath?: string
    formData?: Common
    skipTokenCheck?: boolean
  }
}

// 全局配置
PreQuest.defaults.baseURL = baseUrl
// 设置header
PreQuest.defaults.header = {}

const prequest = create(uni.request)
// const download = createDownload(uni.downloadFile, { name: 'imgFile' })

// 无痕刷新中间件
const lock = new Lock({
  getValue() {
    return Promise.resolve(userStore.token)
  },
  setValue(token) {
    userStore.token = token
  },
  clearValue() {
    userStore.token = ''
  },
})
const wrapper = Lock.createLockWrapper(lock)

const refreshToken: MiddlewareCallback = async (ctx, next) => {
  const company = getStorage('company')
  if (ctx.request.method === 'POST') {
    ctx.request.data = {
      ...ctx.request.data,
      companyId: company.companyId,
    }
  } else if (ctx.request.method === 'GET') {
    ctx.request.params = {
      ...ctx.request.params,
      companyId: company.companyId,
    }
  }

  if (ctx.request.skipTokenCheck) return next()

  const token = await wrapper(
    () =>
      new Promise((resolve) => {
        uni.login({
          async success(res) {
            if (res.code) {
              const getOpenIdResp = await prequest(
                '/userCommon/queryWXOauthOpenIdByCode',
                {
                  method: 'get',
                  skipTokenCheck: true,
                  data: { code: res.code, companyId: company.companyId },
                },
              )
              if (getOpenIdResp.data.resultData.openId) {
                userStore.openid = getOpenIdResp.data.resultData.openId
                const getTokenResp = await prequest(
                  '/userCommon/userLoginByThirdPlatform',
                  {
                    method: 'post',
                    skipTokenCheck: true,
                    data: {
                      appletFlag: 'applet',
                      companyId: company.companyId,
                      isApp: 2,
                      thirdPlatform: 5,
                      unionid: getOpenIdResp.data.resultData.openId,
                    },
                  },
                )
                userStore.loginInfo = getTokenResp.data.resultData
                resolve(getTokenResp.data.resultData.token)
              }
              // then((res1) => resolve(res1.data.data.token))
            }
          },
        })
      }),
  )
  if (ctx.request.method === 'POST') {
    ctx.request.data = {
      ...ctx.request.data,
      token,
    }
  } else if (ctx.request.method === 'GET') {
    ctx.request.params = {
      ...ctx.request.params,
      token,
    }
  }
  await next()
}

// 解析响应
const parse: MiddlewareCallback = async (ctx, next) => {
  await next()
  // 这里抛出异常，会被错误重试中间件捕获

  const { statusCode } = ctx.response
  if (![200, 301, 302].includes(statusCode)) {
    // 可以设置toast提示
    throw new Error(`${statusCode}`)
  }
  return ctx.response.data
}

// 实例中间件
prequest.use(refreshToken).use(parse)
prequest.use(parse)

export { prequest, download, upload }
