import { $toast } from '.'

type ScopeTypes =
  | 'userInfo'
  | 'writePhotosAlbum'
  | 'userLocation'
  | 'address'
  | 'record'

// 以上是常用scopeType，所有scopeType请访问微信文档添加：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/AuthSetting.html

/**
 *  处理获取权限逻辑
 * @param scopeType 要授权的
 * @param warnMsg 用户拒绝授权提示信息
 * @returns Promise<Boolean>
 */
let authLock = false
export function handlePermission(
  scopeType: ScopeTypes,
  warnMsg?: string,
): Promise<boolean> {
  if (authLock) return
  authLock = true
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const permissionValue = await getPermission(scopeType)
    if (permissionValue === false) {
      // 用户拒绝
      uni.openSetting({
        success(res1) {
          if (res1.authSetting[`scope.${scopeType}`]) {
            // 用户在设置页选择同意授权
            resolve(true)
          }
        },
        complete() {
          authLock = false
        },
      })
    } else {
      uni.authorize({
        scope: `scope.${scopeType}`,
        success() {
          //这里是用户同意授权后的回调
          resolve(true)
        },
        fail() {
          // 这里是用户拒绝授权后的回调
          if (warnMsg) {
            $toast(warnMsg)
          }
          resolve(false)
        },
        complete() {
          authLock = false
        },
      })
    }
  })
}

// 获取授权情况
export function getPermission(type: ScopeTypes): Promise<undefined | boolean> {
  return new Promise((resolve) => {
    uni.getSetting({
      success(res) {
        // 注意：初始未授权的情况下返回undefined，拒绝后返回false
        resolve(res.authSetting[`scope.${type}`])
      },
      fail() {
        resolve(undefined)
      },
    })
  })
}
