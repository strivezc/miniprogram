<template>
  <view class="container">
    <view class="item-wrap">
      <view class="dot"></view>
      <view class="text">进入趣味拼图小程序后在给定时间内将混乱的英文碎片拼成完整的图片；</view>
    </view>
    <view class="item-wrap">
      <view class="dot"></view>
      <view class="text">每个账号，系统会给出默认的道具数量，可用于拼图遇到困难时使用；</view>
    </view>
    <view class="item-wrap">
      <view class="dot"></view>
      <view class="text">道具可结余，如道具消耗完成，可通过邀请新用户注册获得对应数量的道具；</view>
    </view>
    <view class="title">隐私保护提示</view>
    <view class="tip">我们将通过<text class="blue" @click="pushPrivacyPolicy">《隐私协议》</text>、<text class="blue" @click="pushUserAgreement">《用户协议》</text>帮助您了解我们收集、使用、存储个人信息情况。请您充分了解隐私政策中的相关条款内容。</view>
    <div class="mt-39" v-if="env === 'production'">
    <JigsawButton
        @handleAction.stop="handleAction"
        singleText="手机号快捷登录"
        :isLogin="isSelect"
        @loginAction="loginAction"
        :fontSize="40"
        :paddingTop="14"
    ></JigsawButton>
    </div>
    <view class="mt-29"></view>
    <JigsawButton
        @handleAction.stop="toLogin"
        singleText="手机号或密码登录/注册"
        type="yellow"
        :fontSize="32"
        :paddingTop="22"
    ></JigsawButton>
    <view class="bottom-wrap">
      <image class="left" src="@/subPackagesC/static/jigsaw/button/select.png" v-show="isSelect" @click="isSelect=!isSelect"></image>
      <image class="left" src="@/subPackagesC/static/jigsaw/button/unselect.png" v-show="!isSelect" @click="isSelect=!isSelect"></image>
      <view class="right">我已阅读并同意说客英语<text class="blue" @click="pushPrivacyPolicy">隐私协议</text>和<text class="blue" @click="pushUserAgreement">用户协议</text></view>
    </view>
  </view>
</template>

<script setup>
import JigsawButton from '../JsgsawButton/index.vue';
const emit = defineEmits(['loginRefreshData']);
const props = defineProps({
  redirectUrl: {
    type: String,
    default:'/subPackagesC/jigsawActivity/index'
  },
});

const isSelect=ref(false);
const env=import.meta.env.MODE;

function toLogin() {
  if (!isSelect.value) {
    uni.showToast({
      title: '请阅读并勾选用户协议',
      icon: 'none',
      duration: 3000,
    });
    return;
  }
  if (isSelect.value) {
    uni.redirectTo({
      url: `/subPackagesA/personal/phoneLogin?redirect=${props.redirectUrl}`,
    });
  }
}
function handleAction() {
  if (!isSelect.value) {
    uni.showToast({
      title: '请阅读并勾选用户协议',
      icon: 'none',
      duration: 3000,
    });
  }
}
function loginAction() {
  emit('loginRefreshData');
}
function pushPrivacyPolicy() {
  uni.navigateTo({
    url: '/subPackagesA/personal/privacyPolicy',
  });
}
function pushUserAgreement() {
  uni.navigateTo({
    url: '/subPackagesA/personal/userAgreement',
  });
}
</script>

<style scoped lang="scss">
.container{
  box-sizing: border-box;
  padding: 38rpx 34rpx;
  .item-wrap{
    display: flex;
    .dot{
      display: inline-block;
      margin-right: 21rpx;
      margin-top: 20rpx;
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: #FFAA00;
    }
    .text{
      display: inline-block;
      width: 485rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
      line-height: 54rpx;
    }
  }
  .title{
    margin-top: 30rpx;
    margin-bottom: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    line-height: 32rpx;
    text-align: center;
  }
  .tip{
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
    line-height: 54rpx;
  }
  .bottom-wrap{
    display: flex;
    align-items: center;
    margin-top: 21rpx;
    .left{
      /*margin-right: 12rpx;*/
      padding: 12rpx;
      width: 28rpx;
      height: 28rpx;
    }
    .right{
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
      line-height: 28rpx;
    }
  }
  .blue{
    color: #0087FF;
  }
  .mt-29{
    margin-top: 29rpx;
  }
  .mt-39{
    margin-top: 39rpx;
  }
}
</style>
