// 创建人：Michael
// 创建时间：2021/10/18
// 页面描述：路由简化写法封装

import { CourseDetails, SettingsTypes, Webview } from './types'
import pages from './pages'
import { CourseScheduleData } from '@/api/model/index.model'

type PageNames = keyof typeof pages

type ObjectType<T> = T extends 'courseDetails'
  ? CourseDetails
  : T extends 'settingsHtml'
  ? SettingsTypes
  : T extends 'myCourseDetails'
  ? CourseDetails
  : T extends 'Webview'
  ? Webview
  : T extends 'courseScheduleDetails'
  ? CourseScheduleData
  : never

const routeStore = {} as Record<PageNames, unknown>

export function getRouteParams<T extends PageNames>(
  page: T,
): DeepReadonly<ObjectType<T>> {
  const p = routeStore[page] as ObjectType<T>
  return readonly(p)
}

let navigateLock = false
function navigate<T extends PageNames>(
  page: T,
  params?: ObjectType<T>,
): Promise<any> {
  if (navigateLock) return
  const eventName = `${Math.floor(Math.random() * 1000) + new Date().getTime()}` // 生成唯一事件名
  navigateLock = true
  routeStore[page] = params
  uni.navigateTo({
    url: `${pages[page]}?eventName=${eventName}`,
    complete() {
      navigateLock = false
    },
  })

  return new Promise<any>(
    (resolve, reject) => (
      uni.$once(eventName, resolve), uni.$once(eventName, reject)
    ),
  )
}

function redirect<T extends PageNames>(page: T, params?: ObjectType<T>) {
  routeStore[page] = params
  uni.redirectTo({ url: pages[page] })
}

function reLaunch<T extends PageNames>(page: T, params?: ObjectType<T>) {
  routeStore[page] = params
  uni.reLaunch({ url: pages[page] })
}

function switchTab<T extends PageNames>(page: T, params?: ObjectType<T>) {
  routeStore[page] = params
  uni.switchTab({ url: pages[page] })
}

interface BackParams {
  /** 返回页面层级 */
  delta?: number
  /** 返回携带的数据 */
  data?: any
}

function back({ delta, data }: BackParams = { delta: 1, data: null }) {
  const currentRoute = getCurrentPages().pop()
  const eventName = currentRoute.options.eventName
  uni.$emit(eventName, data)
  uni.navigateBack({
    delta,
  })
}

const router = {
  navigate,
  redirect,
  reLaunch,
  switchTab,
  back,
}

export default router
