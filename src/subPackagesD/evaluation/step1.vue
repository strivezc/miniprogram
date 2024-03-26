<template>
  <view class="step1">
    <view class="notice-bar" v-if="datebookStore.evaluation.times">
      <van-config-provider :theme-vars="state.themeVars">
        <van-notice-bar mode="closeable" :text="datebookStore.evaluation.times"/>
      </van-config-provider>
    </view>
    <text class="title">测评须知</text>
    <text class="text">1. 口语测评课是真人1对1外语口语能力测评的课程；</text>
    <text class="text">2. 每节口语测评时间最长25分钟，每节课消耗2课时，一旦预约成功则无法取消或退课；</text>
    <text class="text">3. 测评报告将在测试结束1个工作日后生成，您可在官网学习大厅和「说客英语」APP中查看；</text>
    <text class="text">4. 为保障测评有效性，您在30天内只能参与1次口语测评课，请您认真完成；</text>
    <text class="tip">【上课须知】为保护学员的用眼健康和充足的睡眠，请选择20:30之前的上课时段。</text>
    <view class="button flex-c" :class="{'disabled':datebookStore.evaluation.message || datebookStore.evaluation.times}" @click="next">下一步</view>
    <text class="mes" v-if="datebookStore.evaluation.message">{{datebookStore.evaluation.message}}</text>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'

const datebookStore = useDatebookStore()
const state = reactive({
  themeVars: {
    noticeBarHeight: '72rpx',
    noticeBarBackgroundColor: '#FFF8EB',
    noticeBarTextColor: '#FFAA00',
    noticeBarFontSize: '20rpx',
    noticeBarLineHeight: '72rpx'
  }
})

function next() {
  if (datebookStore.evaluation.message || datebookStore.evaluation.times) return
  uni.navigateTo({
    url: '/subPackagesD/evaluation/step2'
  })
}

onShow(() => {
  datebookStore.getEvaluationData()
})
</script>

<style scoped lang="scss">
  .step1 {
    margin: 0 32rpx;
    .notice-bar{
      margin: 0 -32rpx;
    }
    .title {
      display: block;
      font-weight: 500;
      font-size: 40rpx;
      color: #333333;
      line-height: 56rpx;
      margin-bottom: 28rpx;
      margin-top: 40rpx;
    }

    .text {
      display: block;
      margin-top: 20rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: justify;
    }

    .tip {
      display: block;
      margin-top: 30rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #0087FF;
      line-height: 40rpx;
      text-align: justify;
    }

    .button {
      margin-top: 60rpx;
      width: 686rpx;
      height: 88rpx;
      background: #0087FF;
      border-radius: 40rpx;
      font-size: 32rpx;
      color: #FFFFFF;
    }

    .disabled {
      background: #CCCCCC;
    }

    .mes {
      display: block;
      margin-top: 24rpx;
      font-size: 24rpx;
      color: #FF5C01;
      line-height: 33rpx;
      text-align: left;
    }
  }
</style>
