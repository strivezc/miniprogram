import { createSSRApp } from 'vue'
import dayjs from 'dayjs'
import App from './App.vue'
import pinia from './stores'
import 'virtual:windi.css'
import { formatDate, $imgPath } from './utils'
import Empty from '@/components/empty'
import EmptyWrap from '@/components/empty-wrap'
import router from '@/router'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $dayjs: dayjs
    $router: router
    $formatDate: formatDate
    $imgPath: $imgPath
  }
}

export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$dayjs = dayjs
  app.config.globalProperties.$formatDate = formatDate
  app.config.globalProperties.$router = router
  app.config.globalProperties.$imgPath = $imgPath

  app.component('Empty', Empty)
  app.component('EmptyWrap', EmptyWrap)
  app.use(pinia)
  return {
    app,
  }
}
