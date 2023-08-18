<template>
  <view class="exchange-wrap">
    <image
      src="@img/back.png"
      class="back-icon"
      @click="backHome"
      :style="{ top: state.backHeight + 'px' }"
    ></image>
    <view class="title" :style="{ top: state.backHeight + 'px' }">积分限时兑换</view>
    <view class="bg">
      <view class="personal-info"  v-if="userStore.token">
          <view class="left">
            <text class="top-text">我的说客英语积分</text>
            <text class="bottom-text">{{ state.ownScore }}</text>
          </view>
          <view class="right">
            <view class="top-wrap" @click="openRecord">
              <text class="text">兑换记录</text>
              <image src="@img/common/arrow.png" class="icon"></image>
            </view>
            <view class="button" @click="openPopup">立即兑换优币</view>
          </view>
      </view>
      <view class="login-wrap" v-else>
        <view class="login-text">登录后查看我的积分</view>
        <view class="login-btn" @click="pushLogin">立即登录</view>
      </view>

    </view>
    <view class="content">
      <rich-text :nodes="state.ruleCopy" class="text-wrap"></rich-text>
    </view>
    <view class="button-wrap">
      <view class="button" @click="openUxss">前往优学松鼠小程序</view>
    </view>
  </view>
  <MyPopup ref="popup" title="积分兑换优币" submitText="确定兑换" @submitAction="submitAction">
    <template #main>
      <view class="popup-content">
        <view class="label-text">当前说客英语账号</view>
        <view class="phone">{{ phoneMask(userStore.phone) }}</view>
        <view class="tip">当前账号与说客英语App一致，否则可能无积分</view>
        <view class="label-text mt-50">兑换手机号</view>
        <input
          class="normal-input"
          v-model="state.phone"
          type="number"
          maxlength="11"
          placeholder="请输入兑换的手机号"
        />
        <view class="tip mt-17">兑换成功后，请前往优学松鼠小程序查看</view>
        <view class="label-text mt-60">兑换数量</view>
        <view class="num-wrap">
          <input
            class="normal-input"
            maxlength="8"
            type="number"
            @input="inputScore"
            v-model="state.score"
            placeholder="请输入积分数"
          />
          <view class="text-wrap">
            <view class="max" @click.stop="setMaxNum">最大</view>
            <view
              >可兑<text class="active">{{ state.exchangeIconNum }}</text
              >优币</view
            >
          </view>
        </view>
        <view class="points-tip">
          <text class="tip">当前积分：{{ state.ownScore }}</text>
          <text class="tip">兑换比例: {{ state.rate }}积分兑1优币</text>
        </view>
      </view>
    </template>
  </MyPopup>
</template>

<script setup>
  import { useUserStore } from '@/store';
  import { validateMobile } from '@/utils/validate';
  import { getSystemInfo } from '@/utils';
  import MyPopup from '@/components/MyPopup';
  import UserService from '@/api/UserService';

  const userStore = useUserStore();
  const state = reactive({
    ruleCopy: '',
    rate: '',
    ownScore: '',
    score: '',
    value: '',
    phone: '',
    exchangeIconNum: 0,
    backHeight: 0,
  });
  const systemInfo = getSystemInfo();
  state.backHeight = systemInfo.statusBarHeight + systemInfo.navigationBarHeight / 2;
  const popup = ref(null);
  function openPopup() {
    popup.value.open();
  }
  function openRecord() {
    uni.navigateTo({
      url: '/subPackagesA/personal/exchangeRecord',
    });
  }
  function backHome() {
    let pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack();
    } else {
      uni.switchTab({
        url: '/pages/home/index',
      });
    }
  }
  function pushLogin() {
    uni.redirectTo({
      url: '/subPackagesA/personal/chooseLoginType?redirect=/subPackagesA/personal/uxssExchange',
    });
  }
  const submitAction = async () => {
    if (!validateMobile(state.phone)) {
      uni.showToast({
        title: '手机号码格式不正确！',
        icon: 'none',
        duration: 2500,
      });
      return;
    }
    if (!state.score) {
      uni.showToast({
        title: '请输入兑换的积分数！',
        icon: 'none',
        duration: 2500,
      });
      return;
    }
    uni.showModal({
      title: '温馨提示',
      content: '积分兑换优币一经确认，不支持取消、折现、补发等操作',
      confirmColor: '#0087FF',
      cancelColor: '#0087FF',
      success: async (res) => {
        if (res.confirm) {
          await UserService.exchangeScore({
            phone: state.phone,
            score: state.score,
          });
          popup.value.close();
          getUserScore();
          uni.showModal({
            title: '恭喜兑换',
            content: '您已经完成兑换操作，点击“前往”按钮，可进入“优学松鼠小程序”查看优币到账情况',
            confirmColor: '#0087FF',
            cancelColor: '#0087FF',
            confirmText: '确定前往',
            cancelText: '下次再去',
            success: async (res) => {
              if (res.confirm) {
                openUxss();
              }
            },
          });
        }
      },
    });
  };
  const getUserScore = async () => {
    try {
      const { resultData } = await UserService.queryUserScore();
      state.rate = resultData.rate;
      state.ownScore = resultData.score;
      state.ruleCopy = resultData.ruleCopy;
      if (state.ruleCopy) {
        state.ruleCopy = state.ruleCopy.replace(/<img/g, '<img class="richImg"');
      }
    } catch (e) {
      // if (e.resultCode === -1) {
      //   uni.navigateTo({
      //     url: '/subPackagesA/personal/chooseLoginType?redirect=/subPackagesA/personal/uxssExchange',
      //   });
      // } else {
      //   uni.showToast({
      //     title: e.resultMessage,
      //     icon: 'none',
      //     duration: 2500,
      //   });
      // }
    }
  };
  function openUxss() {
    uni.navigateToMiniProgram({
      appId: 'wx7c6b596dadbd45a4',
      success(res) {
        // 打开成功
      },
    });
  }
  const setMaxNum = () => {
    const rate = Number(state.rate);
    state.score = Number(state.ownScore);
    if (state.score) {
      state.exchangeIconNum = (Number(state.score) / rate).toFixed(2);
    } else {
      state.exchangeIconNum = '0.00';
    }
  };
  function inputScore(e) {
    // console.log(e.detail.value);
    const val = e.detail.value;
    const rate = Number(state.rate);
    const ownScore = Number(state.ownScore);
    nextTick(() => {
      let replaceVal = val.replace(/^(0+)|[^\d]+/g, '');
      if (Number(replaceVal) > ownScore) {
        replaceVal = ownScore;
      }
      state.score = replaceVal;
      if (state.score) {
        state.exchangeIconNum = (Number(state.score) / rate).toFixed(2);
      } else {
        state.exchangeIconNum = '0.00';
      }
    });
  }
  function phoneMask(tel) {
    if (!tel) return '';
    return tel.replace(tel.substring(3, 7), '****');
  }
  onLoad(() => {
    getUserScore();
  });
</script>

<style lang="scss" scoped>
  .exchange-wrap {
    .back-icon {
      position: fixed;
      top: 0;
      left: 20rpx;
      z-index: 2;
      width: 36rpx;
      height: 36rpx;
      transform: translateY(-34rpx);
      cursor: pointer;
      padding: 16rpx;
    }
    .title {
      position: fixed;
      top: 0;
      z-index: 1;
      width: 100%;
      text-align: center;
      font-size: 36rpx;
      font-weight: 500;
      color: #ffffff;
      line-height: 42rpx;
      transform: translateY(-21rpx);
    }
    .bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 480rpx;
      background: url(@/subPackagesA/images/bg.png) center no-repeat;
      background-size: cover;

      .login-wrap{
        position: absolute;
        top: 213rpx;
        left: 50%;
        transform: translateX(-50%);
        box-sizing: border-box;
        width: 676rpx;
        height: 265rpx;
        padding: 50rpx 0 50rpx 0;
        border: 2rpx solid transparent;
        .login-text {
          font-size: 40rpx;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 47rpx;
          text-align: center;
          margin-bottom: 27rpx;
        }

        .login-btn {
          width: 240rpx;
          height: 72rpx;
          background: #FFFFFF;
          border-radius: 36rpx 36rpx 36rpx 36rpx;
          font-size: 32rpx;
          font-weight: bold;
          color: #FFAA00;
          line-height: 72rpx;
          text-align: center;
          margin: auto;
        }
      }
      .personal-info {
        position: absolute;
        top: 213rpx;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        width: 676rpx;
        height: 265rpx;
        padding: 51rpx 40rpx 48rpx 48rpx;
        border: 2rpx solid transparent;
        .left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          .top-text {
            font-size: 32rpx;
            font-weight: 500;
            color: #ffffff;
            line-height: 38rpx;
          }
          .bottom-text {
            margin-top: 11rpx;
            font-size: 88rpx;
            font-weight: bold;
            color: #ffffff;
            line-height: 112rpx;
          }
        }

        .right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
          .top-wrap {
            display: flex;
            align-items: center;
            .text {
              font-size: 28rpx;
              font-weight: 400;
              color: #ffffff;
              line-height: 33rpx;
            }
            .icon {
              margin-left: 9rpx;
              width: 10rpx;
              height: 18rpx;
            }
          }
          .button {
            width: 240rpx;
            height: 72rpx;
            background: #ffffff;
            border-radius: 36rpx 36rpx 36rpx 36rpx;
            font-size: 32rpx;
            font-weight: bold;
            color: #ffaa00;
            line-height: 72rpx;
            text-align: center;
            margin-bottom: 18rpx;
          }
        }
      }
    }
    .content {
      padding-top: 480rpx;
      background: #ffffff;
      padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
      .text-wrap {
        display: block;
        padding: 35rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;
        line-height: 48rpx;
        img {
          width: 100%;
        }
      }
    }
    .button-wrap {
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120rpx;
      width: 100%;
      background: #ffffff;
      padding-bottom: env(safe-area-inset-bottom);
      .button {
        width: 686rpx;
        height: 88rpx;
        background: linear-gradient(158deg, #ff904b 0%, #ffb900 100%);
        border-radius: 200rpx 200rpx 200rpx 200rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #fcfcfd;
        line-height: 88rpx;
        text-align: center;
      }
    }
  }
  .popup-content {
    padding: 0 48rpx 48rpx 48rpx;
    .label-text {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      line-height: 39rpx;
    }
    .phone {
      margin-top: 42rpx;
      margin-bottom: 46rpx;
      margin-left: 30rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
    .tip {
      font-size: 28rpx;
      font-weight: 400;
      color: #999999;
      line-height: 28rpx;
    }
    .num-wrap {
      position: relative;
      .text-wrap {
        position: absolute;
        z-index: 2;
        right: 22rpx;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
        line-height: 38rpx;
        .max {
          height: 64rpx;
          font-size: 32rpx;
          color: #0087ff;
          line-height: 64rpx;
          padding-right: 34rpx;
          border-right: 1px solid #e4e4e4;
          margin-right: 30rpx;
        }
        .active {
          color: #ff5e01;
          padding: 0 10rpx;
        }
      }
    }
    .points-tip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 21rpx;
    }
    .normal-input {
      width: 594rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      border: 1rpx solid #e4e4e4;
      font-size: 32rpx;
      padding: 0 30rpx;
      margin-top: 10rpx;
    }
    .mt-50 {
      margin-top: 50rpx;
    }
    .mt-60 {
      margin-top: 60rpx;
    }
    .mt-17 {
      margin-top: 17rpx;
    }
  }
</style>
