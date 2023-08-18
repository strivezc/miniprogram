<template>
  <view class="giftPack">
    <image mode="widthFix" class="bg" src="https://cos.talk915.com/data/image/c0c88ef370cd48dfbd07d28684dc2455.png"></image>
    <image mode="widthFix" @click="toConsultant" class="btn" src="https://cos.talk915.com/data/image/bf8e74f6941d4fefa920b0a1823c5b6c.png"></image>
    <image mode="widthFix" class="click" src="https://cos.talk915.com/data/image/babd3a9a06024441b1a55f268f4af2b2.png"></image>
  </view>
</template>

<script setup>
import { getToken,getRecommendCode, setRecommendCode } from '@/utils/auth'
import LotteryService from '@/api/LotteryService'
import { useUserStore } from '@/store'
const userStore = useUserStore()
const isLogin = ref(Boolean(getToken()))
const inviteSource = ref('')

function toConsultant() {
  if (isLogin.value) {
    if (userStore.status==='3' && userStore.getTrialClass===0) { // 用户未领取体验课
      uni.navigateTo({
        url: '/subPackagesA/home/receiveExperienceClass'
      })
    } else { // 已领取
      uni.redirectTo({
        url: '/subPackagesA/home/consultant',
      });
    }
  } else {
    uni.redirectTo({
      url: `/subPackagesA/personal/chooseLoginType?redirect=/subPackagesA/home/consultant&inviteSource=${inviteSource.value}`
    })
  }
}
const checkLogin = async () => {
  try {
    if (getToken()) {
      await LotteryService.checkLogin()
      userStore.getExperienceCourseDetail()
    }
  } catch (e) {
    if (e.resultCode === -1) {
      userStore.resetToken()
      isLogin.value = false
    }
  }
}
onLoad((option) => {
  console.log(option, 'option')
  if (option.inviteSource) {
    inviteSource.value = option.inviteSource;
  }
  let recommendCode = option.recommendCode || getRecommendCode()
  let userDistributorCode = option.userDistributorCode || ''
  console.log(recommendCode, 'recommendCode')
  console.log(userDistributorCode, 'userDistributorCode')
  userStore.setUserDistributorCode(userDistributorCode);
  if (recommendCode) {
    setRecommendCode(recommendCode)
    userStore.setRecommendCode(recommendCode)
  }
});
checkLogin()
</script>

<style scoped lang="scss">
  .giftPack {
    position: relative;
    background: #fce3af;
    height: 100vh;

    .bg {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
    }

    .btn {
      position: absolute;
      bottom: env(safe-area-inset-bottom);
      margin-bottom: 66rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 490rpx;
      height: 184rpx;
    }

    .click {
      position: absolute;
      bottom: env(safe-area-inset-bottom);
      margin-bottom: 35rpx;
      right: 48rpx;
      width: 148rpx;
      height: 151rpx;
    }
  }
</style>
