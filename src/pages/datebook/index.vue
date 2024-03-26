<template>
  <view class="datebook">
    <view class="title" :style="'padding-top:' + state.titleHeight + 'px'">口语课</view>
    <view :style="{ paddingTop: state.titleHeight + 'px', marginTop: '64rpx'}"></view>
    <view class="tip">上课时间：06:00-22:55</view>
    <view class="content">
      <view class="item" @click="toFreeClass">
        <text class="top">自由预约</text>
        <image mode="widthFix" src="@img/iv_new_zy.png" class="bottom"></image>
      </view>
      <view class="item" @click="toVipClass">
        <text class="top">VIP预约</text>
        <image mode="widthFix" src="@img/iv_new_vip.png" class="bottom"></image>
      </view>
      <view class="item" @click="toEvaluation">
        <text class="top">口语测评预约</text>
        <image mode="widthFix" src="@img/iv_new_ky.png" class="bottom"></image>
      </view>
    </view>
  </view>
</template>

<script setup>
import DatebookService from '@/api/DatebookService'

const state = reactive({
  titleHeight: ''
})

onLoad((query) => {
  getHeight()
})
const toFreeClass=async ()=>{
  try {
    const { resultData } = await DatebookService.appoitedCheckUser()
    if (resultData.status === 0) {
      uni.navigateTo({
        url: '/subPackagesD/freeClass/step1'
      })
    } else {
      if (resultData.page===2) {
        uni.navigateTo({
          url: `/subPackagesD/components/checkUserInfo?fromPage=freeClass`
        })
      }
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
const toVipClass=async ()=>{
  try {
    const { resultData } = await DatebookService.vipCheckUser()
    if (resultData.status === 0) {
      uni.navigateTo({
        url: '/subPackagesD/vipClass/step1'
      })
    } else {
      if (resultData.page===2) {
        uni.navigateTo({
          url: `/subPackagesD/components/checkUserInfo?fromPage=vipClass`
        })
      }
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
const toEvaluation = async () => {
  // 检查用户个人信息是否完善
  try {
    const { resultData } = await DatebookService.checkUserInfoIsComplete()
    if (resultData.status == 1) {
      const { qq, skype, age, sex } = resultData
      uni.navigateTo({
        url: `/subPackagesD/components/checkUserInfo?qq=${qq}&skype=${skype}&age=${age}&sex=${sex}&fromPage=evaluation`
      })
    } else {
      uni.navigateTo({
        url: '/subPackagesD/evaluation/step1'
      })
    }
  } catch (e) {
    console.log(e, 'error')
  }
}

function getHeight() {
  let res = wx.getMenuButtonBoundingClientRect()
  state.titleHeight = res.top
}
</script>

<style scoped lang="scss">
  .datebook {
    font-family: PingFang SC, PingFang SC;
    margin: 0 40rpx;
    padding-bottom: 100rpx;

    .title {
      position: fixed;
      top: 0;
      z-index: 99;
      width: 100%;
      background: #ffffff;
      font-size: 48rpx;
      font-weight: 500;
      color: #333333;
      line-height: 64rpx;
      margin-left: -40rpx;
      padding-left: 40rpx;
    }

    .tip {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 670rpx;
      height: 80rpx;
      background: #FFF8EC;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      font-weight: 400;
      font-size: 32rpx;
      color: #FF5C01;
      margin-top: 42rpx;
      margin-bottom: 10rpx;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        margin-top: 40rpx;
        width: 308rpx;
        height: 300rpx;
        border-radius: 20rpx 20rpx 20rpx 20rpx;
        border: 2rpx solid #E9E9E9;

        .top {
          margin-top: 30rpx;
          font-weight: 400;
          font-size: 36rpx;
          color: #333333;
          line-height: 48rpx;
        }

        .bottom {
          width: 150rpx;
          height: 150rpx;
          margin-top: 33rpx;
        }
      }

      &:after {
        content: "";
        width: 0;
      }
    }
  }
</style>
