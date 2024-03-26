<template>
  <view class="result">
    <view class="back" @click="goDatebook" :style="{ height: state.navigationBarHeight + 'px',paddingTop: state.statusBarHeight + 'px'}">
    <image mode="widthFix"
           class="img" src="@/subPackagesD/images/back.png"></image>
    </view>
    <image mode="widthFix"
           class="icon" src="@/subPackagesD/images/result.png"></image>
    <view class="title">恭喜您，预约课程成功！</view>
    <view class="tip" v-if="state.fromPage==='evaluation'">您已成功预约1节课口语测评课！预约详情已通过短信发送至您的手机！</view>
    <view class="tip" v-else-if="state.fromPage==='freeClass' || state.fromPage==='vipClass'">您已成功预约{{state.times}}节课！预约详情已通过短信发送至您的手机！</view>
    <view class="btn-group flex-c">
      <view class="btn flex-c" @click="goDatebook">返回约课首页</view>
    </view>
    <view class="title2">课前准备</view>
    <view class="text">1.您可以通过说客英语官网 (talk915.com) 或说客英语APP进入教室上课，为了您的视力健康，推荐使用电脑或平板电脑上课;</view>
    <view class="text">2.请在距离开始上课前10分钟内进入教室，提前检查好您的耳机、麦克风、摄像头和网络是否正常工作，确保良好的上课体验;</view>
    <view class="text">3.我们为部分课程准备了预习内容，您可在上课前前往「官网-我的课程-已约课程」APP内「我的课表」查看;</view>
    <view class="text">4.如有更多问题，可在官网或APP首页联系您的课程顾问或说客英语在线客服解决。</view>
    <view class="text">温馨提示：要取消课程的，请在距离开始上课2小时前，前往个人中心取消课程</view>
  </view>
</template>

<script setup>
import {goBack,getSystemInfo} from '@/utils'

const title={
  evaluation:'口语测评预约',
  freeClass:'自由预约',
  vipClass:'VIP预约',
}
const state = reactive({
  navigationBarHeight: '',
  statusBarHeight: '',
  times: '',
  fromPage: '',
})
onLoad((query) => {
  getHeight()
  state.times=query.times
  state.fromPage=query.fromPage
  uni.setNavigationBarTitle({
    title: title[state.fromPage]
  });
})
function goDatebook(){
  goBack('pages/datebook/index')
}
function getHeight() {
  const info=getSystemInfo()
  state.navigationBarHeight = info.navigationBarHeight
  state.statusBarHeight = info.statusBarHeight
}
</script>

<style scoped lang="scss">
  .result {
    margin: 0 30rpx;
    .back{
      display: flex;
      align-items: center;
      margin-left: -30rpx;
      .img{
        width: 44rpx;
        height: 44rpx;
        padding: 15rpx;
      }
    }
    .icon {
      display: block;
      width: 293rpx;
      height: 239rpx;
      margin: auto;
      margin-top: 120rpx;
    }

    .title {
      font-weight: 500;
      font-size: 40rpx;
      color: #333333;
      text-align: center;
      margin-top: 50rpx;
    }

    .tip {
      font-weight: 400;
      font-size: 28rpx;
      color: #666666;
      line-height: 40rpx;
      text-align: left;
      margin-top: 20rpx;
    }

    .btn-group{
      margin-top: 40rpx;
      padding-bottom: 60rpx;
      border-bottom: 1PX solid #EEEEEF;
      .btn {
        width: 320rpx;
        height: 88rpx;
        background: #0084FF;
        border-radius: 44rpx;
        font-size: 32rpx;
        color: #FFFFFF;
      }
    }
    .title2{
      font-weight: 500;
      font-size: 28rpx;
      color: #666666;
      line-height: 28rpx;
      margin-top: 60rpx;
    }
    .text{
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 40rpx;
      text-align: justify;
      margin-top: 30rpx;
    }


  }
</style>
