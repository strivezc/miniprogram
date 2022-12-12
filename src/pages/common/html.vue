<!--
  功能：渲染富文本
  作者：Michael
  时间：2022年08月26日 14:47:54
  版本：v0.0.1
-->
<template>
  <mp-html :content="html" @load="richLoad"></mp-html>
</template>

<script setup lang="ts">
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue'
import InviteService from '@/api/invite'
import IndexService from '@/api/index'
import { getRouteParams } from '@/router'

const html = ref('')

function richLoad() {
  uni.hideLoading()
}

const routeParams = getRouteParams('html')

async function getData() {
  const res = await InviteService.getInviteRules({
    activityId: routeParams.activityId,
  })
  if (res.data.resultCode === 0) {
    html.value = res.data.resultData.rule
  }
}

async function getBuyCourseAgreement() {
  const res = await IndexService.getBuyCourseAgreement({
    id: routeParams.id,
  })
  if (res.data.resultCode === 0) {
    html.value = res.data.resultData.agreementContent
  }
}

async function getCancelAccountAgreement() {
  const res = await IndexService.getCompanyAgreement({
    appType: 2,
  })
  if (res.data.resultCode === 0) {
    const i = res.data.resultData.find((item) => item.type === 3)
    html.value = i.content
  }
}

if (!routeParams.type) {
  getData()
} else if (routeParams.type === 'buyCourse') {
  getBuyCourseAgreement()
} else if (routeParams.type === 'cancelAccountAgreement') {
  getCancelAccountAgreement()
}
</script>

<style lang="scss">
page {
  padding: 40rpx;
}
page,
view {
  box-sizing: border-box;
  white-space: normal !important;
}
</style>
