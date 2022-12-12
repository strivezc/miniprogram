// 创建人：Michael
// 创建时间：2020/08/19
// 各种常用方法封装,一般会复用到才放这个文件
import dayjs from 'dayjs'
import { getStorage } from './storage'

// toast提示封装
export function $toast(
  title: string,
  duration = 1500,
  icon: UniApp.ShowToastOptions.icon = 'none',
) {
  return uni.showToast({
    title,
    duration,
    icon,
  })
}

// modal提示封装
export function $modal(title: string, confirmText = ''): Promise<boolean> {
  return new Promise((resolve) => {
    const isEn = getStorage('isEn')
    uni.showModal({
      title,
      showCancel: false,
      confirmText: confirmText ? confirmText : isEn ? 'Confirm' : '确定',
      success(res) {
        if (res.confirm) {
          return resolve(true)
        }
        resolve(false)
      },
    })
  })
}

// // modal提示封装
export function $showModal(
  title: string,
  options = { confirmText: '', showCancel: false },
): Promise<boolean> {
  const { showCancel, confirmText } = options
  return new Promise((resolve) => {
    const isEn = getStorage('isEn')
    uni.showModal({
      title,
      showCancel,
      confirmText: confirmText ? confirmText : isEn ? 'Confirm' : '确定',
      success(res) {
        if (res.confirm) {
          return resolve(true)
        }
        resolve(false)
      },
    })
  })
}

// loading
export function $loading(title = '加载中...') {
  return uni.showLoading({
    title,
  })
}

// export function $hideLoading() {
//   wx.hideLoading({
//     noConflict: true,
//   })
// }

export function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 引入本地静态图片，缩短图片地址路径写法
export function $getImgPath({ path = '', format = 'png', isSubPack = false }) {
  return isSubPack
    ? `/package-sub/static/images/${path}.${format}`
    : `/static/images/${path}.${format}`
}

// 引入本地静态图片，缩短图片地址路径写法
export function $imgPath(path: string, option = {}) {
  const defaultOption = { format: 'png', isSub: false }
  const o = { ...defaultOption, ...option }
  const { format, isSub } = o
  return isSub
    ? `/package-sub/static/images/${path}.${format}`
    : `/static/images/${path}.${format}`
}

// setTabBarItem方法只能在tabbar页面调用
export function setTabBarItem(home: string, schedule: string, my: string) {
  uni.setTabBarItem({
    index: 0,
    text: home,
  })
  uni.setTabBarItem({
    index: 1,
    text: schedule,
  })
  uni.setTabBarItem({
    index: 2,
    text: my,
  })
}

export function getQueryVariable(
  url: string,
  variable: string,
): string | boolean {
  const paramsUrl = url.split('?')[1]
  const vars = paramsUrl.split('&')

  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')

    if (pair[0] == variable) {
      return pair[1]
    }
  }

  return false
}

// 深拷贝，FIXME
export function cloneDeep(data: unknown) {
  return JSON.parse(JSON.stringify(data))
}

// 检测是否包含emoji
export function checkHasEmoji(message: string) {
  // emoji 表情正则
  const emojiReg =
    /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/g
  return emojiReg.test(message)
}

// 校验手机号
export function isPhone(phone: sring) {
  return /^1[3456789]\d{9}$/.test(phone)
}
