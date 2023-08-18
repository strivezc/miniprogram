<template>
  <view class="stepTask">
    <view class="detail" @click="inviteRecord">明细</view>
    <image
        mode="widthFix"
        :src="state.detailData.topCoverImg"
        class="banner">
    </image>
    <view class="active-wrap">
      <view class="item" v-for="item in state.detailData.queryStepPrizeInfoRespDTOS" :key="item.id">
        <view class="top-text">邀
          <text class="yellow">{{item.inviteLimitsNum}}</text>
          人可领取
        </view>
        <image :src="item.prizeImg" class="img"></image>
        <view class="bottom-text">{{item.prizeName}}</view>
        <template v-if="item.prizeGrant===0">
          <button class="button bg0" open-type="share" v-if="isLogin">去邀请</button>
          <view class="button bg0" v-else @click="toLogin">去邀请</view>
        </template>
        <view class="button bg1" v-else-if="item.prizeGrant===1" @click="receive(item.id,item.prizeName)">领取</view>
        <view class="button bg2" v-else-if="item.prizeGrant===2" @click="alertReceive">待领取</view>
        <view class="button bg3" v-else-if="item.prizeGrant===3">已领取</view>
      </view>
    </view>
    <view class="notice-wrap">
      <view class="title-wrap">
        <image
            mode="widthFix"
            src="@/subPackagesA/images/notice.png"
            class="title">
        </image>
      </view>
      <rich-text :nodes="state.detailData.activityExplain" class="content"></rich-text>
    </view>

    <view class="button-wrap">
      <button class="button" open-type="share" v-if="isLogin">立即邀请好友</button>
      <view class="button" @click="toLogin" v-else>立即邀请好友</view>
    </view>
  </view>
</template>

<script setup>
import { getToken,getRecommendCode } from '@/utils/auth'
import CommonService from '@/api/CommonService'
import JigsawService from '@/api/JigsawService'
import StepTaskService from '@/api/StepTaskService'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const isLogin = ref(Boolean(getToken()))
const state=reactive({
  detailData:{}
})



const getDetails=async()=>{
  try {
    const {resultData} = await StepTaskService.queryStepInfo();
    state.detailData=resultData;
  } catch (e) {
    console.log(e, 'error')
  }
}
const receive=async (id,prizeName)=>{
  try {
    await StepTaskService.getPrize(id)
    uni.showModal({
      title: '提示',
      content: `恭喜你领取${prizeName}成功`,
      confirmColor: '#0087FF',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          getDetails()
        }
      }
    })
  } catch (e) {
    console.log(e, 'error')
  }
}
function alertReceive() {
  uni.showToast({
    title: '请先领取上一个奖励！',
    icon: 'none',
  });
}
onLoad(()=>{
  onShareAppMessage((res)=> {
    if (res.from === 'button') {
      // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: state.detailData.shareTitle,
      path: `/subPackagesA/home/giftPack?inviteSource=2&recommendCode=${getRecommendCode()}&userDistributorCode=${userStore.userDistributorCode}`,
      imageUrl: 'https://cos.talk915.com/data/image/8e3c3abf6e7c4a869c302198d88491e3.png'
    }
  })
})

function toLogin() {
  uni.redirectTo({
    url: `/subPackagesA/personal/chooseLoginType?redirect=/subPackagesA/home/stepTask`
  })
}
const checkLogin = async () => {
  try {
    if (getToken()) {
      await CommonService.checkLogin()
      isLogin.value = true
      getDistributorCode()
    }
  } catch (e) {
    if (e.resultCode === -1) {
      userStore.resetToken()
      isLogin.value = false
    }
  }
}
const getDistributorCode=async ()=> {
  try {
    const { resultData } = await JigsawService.inviteGetCode(1)
    userStore.setUserDistributorCode(resultData.userDistributorCode);
  } catch (e) {
    console.log(e, 'error')
  }
}
function inviteRecord() {
  if (!isLogin.value) {
    toLogin()
  } else {
    uni.navigateTo({
      url: '/subPackagesA/personal/invitationDetail?pageType=2'
    })
  }
}
checkLogin()
getDetails()
</script>

<style scoped lang="scss">
.stepTask{
  position: relative;
  background: linear-gradient(180deg, #F38D5E 0%, #FCDFA8 100%);
  padding: 30rpx 32rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  min-height: 100vh;
  .detail{
    position: fixed;
    top: 30rpx;
    right: 0;
    z-index: 2;
    width: 93rpx;
    height: 45rpx;
    background: rgba(0,0,0,0.4);
    border-radius: 60rpx 0rpx 0rpx 60rpx;
    font-size: 22rpx;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 45rpx;
    text-align: center;
  }
  .banner{
    width: 686rpx;
    height: 304rpx;
  }
  .active-wrap{
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    background: #FFFFFF;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    width: 100%;
    padding: 40rpx 20rpx;
    box-sizing: border-box;
    .item{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      .top-text{
        font-size: 22rpx;
        font-weight: 500;
        color: #333333;
        line-height: 32rpx;
        .yellow{
          color: #FF5E01;
        }
      }
      .img{
        margin-top: 15rpx;
        width: 120rpx;
        height: 120rpx;
      }
      .bottom-text{
        margin-top: 10rpx;
        font-size: 20rpx;
        font-weight: 500;
        color: #666666;
        line-height: 24rpx;
        height: 48rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .button{
        margin-top: 5rpx;
        width: 120rpx;
        height: 44rpx;
        background: #CCCCCC;
        border-radius: 200rpx 200rpx 200rpx 200rpx;
        font-size: 22rpx;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 44rpx;
        text-align: center;
        padding: 0;
        margin-left: 0;
        margin-right: 0;
      }
      .bg3{
        background: #CCCCCC;
      }
      .bg1{
        background: #FFAA00;
      }
      .bg2{
        background: #FFAA00;
      }
      .bg0{
        background: linear-gradient(90deg, #FE7501 0%, #FF9203 100%);
      }
    }
  }
  .notice-wrap{
    margin-top: 20rpx;
    background: #FFFFFF;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    width: 100%;
    .title-wrap{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 80rpx;
      background: #FDF2D6;
      border-radius: 16rpx 16rpx 0rpx 0rpx;
      .title{
        width: 324rpx;
        height: 34rpx;
      }
    }
    .content{
      padding: 20rpx 32rpx;
      display: block;
      line-height: 38rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #666666;
    }
  }
  .button-wrap {
    position: fixed;
    padding-bottom: env(safe-area-inset-bottom);
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 120rpx;
    background: #FFFFFF;

    .button {
      width: 686rpx;
      height: 83rpx;
      background: linear-gradient(90deg, #FE7501 0%, #FF9203 100%);
      border-radius: 200rpx 200rpx 200rpx 200rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 83rpx;
      text-align: center;
    }
  }
}
</style>
