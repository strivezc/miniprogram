<template>
  <uni-transition ref="ani" custom-class="transition" mode-class="fade" :show="show">
    <view>
      <view class="consultant" :class="isAlreadyClass?'short-height':''">
        <image mode="widthFix" v-if="!isAlreadyClass" class="bg" src="@/subPackagesA/images/coloredRibbon.png"></image>
        <view class="pencil-wrap">
          <view class="outside"></view>
          <view class="within"></view>
        </view>

        <view class="content-wrap">
          <template v-if="isAlreadyClass">
            <view class="success-title color-666 mt-37">非常抱歉！</view>
            <view class="success-title color-666">您已经完成过体验课程了</view>
          </template>
          <template v-else>
            <image mode="widthFix" class="success-icon" src="@/subPackagesA/images/success.png"></image>
            <view class="success-title">恭喜您成功领取</view>
            <view class="success-title">一节1v1外教体验课程！</view>
          </template>

          <template v-if="userStore.courseAdviserQrCode || userStore.mobileArea">
            <view class="tip">请联系课程顾问，顾问会给您安排1V1教学老师~</view>
            <image mode="widthFix" class="qrcode" :src="userStore.courseAdviserQrCode"></image>
            <view class="phone-btn" @click="callPhone(userStore.mobileArea)" v-if="userStore.mobileArea">
              <image mode="widthFix" class="icon" src="@/subPackagesA/images/phoneIcon.png"></image>
              <text class="text">电话联系</text>
            </view>
          </template>
          <template v-else>
            <view class="tip font-28">请拨打官方客服电话
              <text class="active" @click="callPhone('4009909915')">400-990-9915</text>
              与我们
            </view>
            <view class="tip font-28">联系，给您安排1V1教学老师~</view>
          </template>
        </view>

        <template v-if="!isAlreadyClass">
          <view class="tips">温馨提示：该奖励只能领取一次哦~</view>
          <view class="learn-wrap">
            <image mode="widthFix" class="learn-icon" src="@/subPackagesA/images/learnEntrance.png"></image>
            <text class="title">用网页学</text>
            <view class="line"></view>
            <text class="text">登录说客英语学习大厅，</text>
            <text class="text">支持自主预约课程和上课；</text>
            <view class="text">学习网址：
              <text class="active">www.talk915.com</text>
            </view>
            <text class="title mt-46">用APP学</text>
            <view class="line mb-30"></view>
            <text class="text">点击按钮下载二维码后，微信扫码下载</text>
            <image mode="widthFix" class="qrcode" :src="qrcode"></image>
            <view class="btn" @click="saveQrcode">下载二维码</view>
          </view>
        </template>
      </view>
      <view>
        <template v-if="isAlreadyClass && (haveLottery || haveStepTask)">
          <view class="task-title">做邀新任务得课时~</view>
          <view class="activity-wrap" v-if="haveLottery && haveStepTask">
            <image mode="widthFix"
                   class="item"
                   src="https://cos.talk915.com/data/image/4a8c7d63008b4bbd89e2478bbea15b32.png"></image>
            <image mode="widthFix"
                   class="item"
                   @click="toLottery"
                   src="https://cos.talk915.com/data/image/9411e51f6a174e72b61add064baee063.png"></image>
          </view>
          <view class="banner-wrap" v-else-if="haveLottery && !haveStepTask">
            <image mode="widthFix"
                   class="banner"
                   @click="toLottery"
                   src="https://cos.talk915.com/data/image/bc78862c3ab44688a815da301dab8cd7.png"></image>
          </view>
          <view class="banner-wrap" v-else-if="!haveLottery && haveStepTask">
            <image mode="widthFix"
                   class="banner"
                   src="https://cos.talk915.com/data/image/aa8586e734b74b50bd71c21a30d4eb8e.png"></image>
          </view>
        </template>
      </view>
    </view>
  </uni-transition>

</template>

<script setup>
import LotteryService from '@/api/LotteryService'
import qrcode from '@/subPackagesA/images/upload-pic.png'
import { saveNetWorkImage } from '@/utils'
import { useUserStore } from '@/store'

const userStore = useUserStore()
let isAlreadyClass = ref(false)
let lotteryCode = ref('')
let haveLottery = ref(false)
let haveStepTask = ref(false)
let show = ref(false)

function toLottery() {
  uni.navigateTo({
    url: `/subPackagesB/lottery/index?lotteryCode=${lotteryCode.value}`
  })
}

function callPhone(phone) {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}

function saveQrcode() {
  saveNetWorkImage(qrcode)
}

const queryNowRaffleInfo = async () => {
  try {
    const { resultData } = await LotteryService.appletQueryNowRaffleInfo()
    lotteryCode.value = resultData.activityCode
    haveLottery.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}

userStore.getExperienceCourseDetail().then((res) => {
  isAlreadyClass.value = res.status !== '3'
})
queryNowRaffleInfo()
setTimeout(() => {
  show.value = !show.value
},200)
</script>

<style scoped lang="scss">
  .consultant {
    background: linear-gradient(180deg, #F38D5E 0%, #FCDFA8 100%);
    position: relative;
    padding-top: 61rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 50rpx);

    .bg {
      position: absolute;
      width: 750rpx;
      height: 458rpx;
      top: 0;
      left: 0;
      z-index: 9;
      pointer-events: none;
    }

    .pencil-wrap {
      position: relative;
      width: 676rpx;
      margin: auto;
      top: -17rpx;

      .outside {
        position: absolute;
        left: 0;
        top: 0;
        width: 676rpx;
        height: 33rpx;
        background: linear-gradient(135deg, #FFBD98 0%, #FFAA00 100%);
        border-radius: 60rpx 60rpx 60rpx 60rpx;
      }

      .within {
        position: absolute;
        top: 10rpx;
        left: 11rpx;
        width: 655rpx;
        height: 14rpx;
        background: #FFD47F;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
      }
    }

    .content-wrap {
      position: relative;
      box-sizing: border-box;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 641rpx;
      background: #FFFFFF;
      border-radius: 0rpx 0rpx 16rpx 16rpx;
      margin: auto;
      padding-bottom: 40rpx;
      padding-left: 42rpx;
      padding-right: 42rpx;

      .success-icon {
        margin: 48rpx auto 20rpx;
        height: 140rpx;
        width: 140rpx;
      }

      .success-title {
        font-size: 40rpx;
        font-weight: bold;
        color: #FF5E01;
        line-height: 47rpx;
        text-align: center;
      }

      .color-666 {
        color: #666666;
      }

      .mt-37 {
        margin-top: 37rpx;
      }

      .tip {
        margin-top: 10rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
        line-height: 28rpx;
        text-align: center;
      }

      .font-28 {
        line-height: 33rpx;
        font-size: 28rpx;
        margin-bottom: 9rpx;
      }

      .phone-btn {
        display: flex;
        align-items: center;
        margin-top: 30rpx;
        width: 300rpx;
        height: 88rpx;
        background: #0087FF;
        border-radius: 200rpx 200rpx 200rpx 200rpx;

        .icon {
          margin-left: 60rpx;
          height: 43rpx;
          width: 43rpx;
        }

        .text {
          margin-left: 10rpx;
          font-size: 32rpx;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 88rpx;
        }
      }
    }

    .tips {
      margin-top: 14rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 33rpx;
      text-align: center;
    }

    .learn-wrap {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 641rpx;
      background: #FFFFFF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin: auto;
      margin-top: 47rpx;
      padding-bottom: 40rpx;

      .learn-icon {
        position: absolute;
        top: -13rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 267rpx;
        height: 61rpx;
      }

      .title {
        position: relative;
        z-index: 2;
        margin-top: 88rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        line-height: 32rpx;
      }

      .line {
        width: 140rpx;
        height: 8rpx;
        background: #F9BC88;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        margin-top: -5rpx;
        margin-bottom: 17rpx;
      }

      .text {
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;
        line-height: 33rpx;
      }

      .mt-46 {
        margin-top: 46rpx;
      }

      .mb-30 {
        margin-bottom: 30rpx;
      }

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30rpx;
        width: 300rpx;
        height: 88rpx;
        background: #0087FF;
        border-radius: 200rpx 200rpx 200rpx 200rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 88rpx;
      }
    }

    .qrcode {
      margin-top: 30rpx;
      height: 242rpx;
      width: 242rpx;
    }

    .active {
      color: #2297ff;
    }
  }

  .short-height {
    max-height: 698rpx;
    min-height: 380rpx;
    background: linear-gradient(180deg, #F38D5E 0%, #FFFFFF 100%);
    padding-bottom: 0;
  }

  .task-title {
    position: relative;
    margin-top: -23rpx;
    margin-bottom: 41rpx;
    color: #FF5C01;
    font-size: 36rpx;
    text-align: center;
    font-weight: bold;
  }

  .activity-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding: 0 32rpx 0 33rpx;

    .item {
      width: 330rpx;
      height: 199rpx;
    }
  }
  .banner-wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 32rpx 0 33rpx;
    .banner {
      height: 304rpx;
      width: 686rpx;
      border-radius: 16rpx;
    }
  }

</style>
