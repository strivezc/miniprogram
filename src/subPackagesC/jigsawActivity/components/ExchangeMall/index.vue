<template>
  <!--  <van-popup-->
  <!--    ref="popup"-->
  <!--    :show="state.show"-->
  <!--    :close-on-click-overlay="false"-->
  <!--    position="center"-->
  <!--    :safe-area-inset-bottom="true"-->
  <!--    :safe-area-tab-bar="true"-->
  <!--    custom-style="background: transparent;border-radius: 24rpx;overflow: visible;"-->
  <!--  >-->
  <view class="container" v-if="state.showPopup">
    <view
      v-show="state.showTrans"
      @animationend="animationend"
      :class="state.ani"
      class="maskClass animate__animated"
    ></view>
    <view
      class="exchangeMall transClass animate__animated"
      v-show="state.showTrans"
      :class="state.ani"
    >
      <!--      <image src="@/subPackagesC/static/jigsaw/element/bg-shop.png" class="top-bg"></image>-->

      <view class="content">
        <view class="qiqi-price-wrap">
          <image
            src="@/subPackagesC/static/jigsaw/popup/button-close.png"
            @click.stop="close"
            class="close-icon"
          ></image>
          <view class="inner-wrap">
            <image src="@/subPackagesC/static/jigsaw/element/shopBg.png" class="bg"></image>
            <view class="qiqi-content" v-if="state.showUserCurrency">
              <image src="@/subPackagesC/static/jigsaw/element/bg_coin.png" class="left"></image>
              <view class="right">
                <text class="top">奇奇币</text>
                <text class="bottom">{{ state.userCurrency }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="tab-wrap">
          <view class="item" :class="state.activeTab === 0 ? 'active' : ''" @click="handleTab(0)">
            <image
              src="@/subPackagesC/static/jigsaw/button/element-arrow.png"
              class="icon-left"
            ></image>
            <text class="text">商城兑换</text>
            <image
              src="@/subPackagesC/static/jigsaw/button/element-arrow-right.png"
              class="icon-right"
            ></image>
          </view>
          <view class="item" v-if="state.showUserCurrency"
                :class="state.activeTab === 1 ? 'active' : ''"
                @click="handleTab(1)">
            <image
              src="@/subPackagesC/static/jigsaw/button/element-arrow.png"
              class="icon-left"
            ></image>
            <text class="text">已拥有</text>
            <image
              src="@/subPackagesC/static/jigsaw/button/element-arrow-right.png"
              class="icon-right"
            ></image>
          </view>
        </view>
        <view class="show-wrap">
          <TabList @handleTabItem="handleTabItem" :tabType="state.activeTab"></TabList>
          <SwiperGoods
            :key="0"
            v-show="state.activeTab === 0"
            @clickItem="setExchangeInfo"
            ref="qiqiShop"
          ></SwiperGoods>
          <SwiperGoods
            :key="1"
            v-show="state.activeTabItem === 0 && state.activeTab === 1"
            :isQiqiShop="false"
            @clickItem="setUseInfo"
            ref="haveWares"
          ></SwiperGoods>
          <ItemList
            ref="itemList"
            v-show="state.activeTabItem === 1 && state.activeTab === 1"
          ></ItemList>
          <JsgsawButton
            class="mt-50"
            :singleText="userStore.token?'兑换':'注册/登录'"
            type="yellow"
            v-show="state.activeTab === 0"
            @handleAction="exchange"
          ></JsgsawButton>
          <template v-if="state.activeTabItem === 0 && state.activeTab === 1">
            <JsgsawButton
              class="mt-50"
              singleText="使用"
              type="yellow"
              @handleAction="useWares"
            ></JsgsawButton>
            <view class="reset" @click="resetQiqi">重置默认皮肤</view>
          </template>
        </view>
      </view>
    </view>
  </view>
  <!--  </van-popup>-->
  <JigsawPopup
    ref="popupReward"
    :title="state.isConfirmText ? '温馨提示' : '恭喜获得'"
    :isConfirm="false"
  >
    <template #main>
      <view class="reward-wrap">
        <template v-if="state.isConfirmText">
          <view class="confirm-text">使用成功</view>
        </template>
        <template v-else>
          <image mode="widthFix" :src="state.rewardInfo.waresImg" class="reward-img"></image>
          <view class="notice"
            >{{ state.rewardInfo.waresName }} <br />消耗{{ state.rewardInfo.qiqiPrice }}奇奇币
          </view>
        </template>
        <JsgsawButton
          singleText="确认"
          type="yellow"
          @handleAction="closePopupReward"
        ></JsgsawButton>
      </view>
    </template>
  </JigsawPopup>
</template>

<script setup>
  import JigsawService from '@/api/JigsawService';
  import JigsawPopup from '../JigsawPopup/index.vue';
  import JsgsawButton from '../JsgsawButton/index.vue';
  import TabList from './components/TabList';
  import SwiperGoods from './components/SwiperGoods';
  import ItemList from './components/ItemList';
  import { useUserStore } from '@/store';

  const userStore=useUserStore();
  const props = defineProps({});
  const emit = defineEmits(['closeAction', 'useWares','handleLogin']);
  const qiqiShop = ref(null);
  const haveWares = ref(null);
  const itemList = ref(null);
  const popupReward = ref(null);
  const state = reactive({
    // show: false,
    showPopup: false,
    showTrans: false,
    ani: [],
    activeTab: 0,
    activeTabItem: 0,
    userCurrency: 0,
    rewardInfo: {},
    useInfo: {},
    isConfirmText: false,
    showUserCurrency: false,
  });
  const open = () => {
    state.ani = ['animate__fadeIn'];
    state.showPopup = true;
    state.showTrans = true;
    handleTab(0, true);
  };
  function animationend(e) {
    if (e.detail.animationName === 'fadeOut') {
      state.showPopup = false;
    }
  }
  const close = () => {
    state.ani = ['animate__fadeOut'];
    emit('closeAction');
    qiqiShop.value.resetData();
    haveWares.value.resetData();
    state.rewardInfo = {};
    // setTimeout(() => {
    //   state.activeTab = null;
    // }, 500);
  };
  const handleTab = (tab, flag) => {
    if (flag) {
      setTimeout(() => {
        qiqiShop.value.resetData();
        qiqiShop.value.getList({ isInit: true });
      }, 150);
    }
    if (state.activeTab !== tab) {
      state.activeTabItem = 0;
      state.activeTab = tab;
      if (tab === 0) {
        qiqiShop.value.resetData();
        qiqiShop.value.getList({ isInit: true });
      } else {
        haveWares.value.resetData();
        haveWares.value.getList({ isInit: true });
      }
    }
  };
  const closePopupReward = async () => {
    popupReward.value.close();
  };
  const openPopupReward = async () => {
    popupReward.value.open();
  };
  function handleTabItem(tab) {
    if (state.activeTabItem === tab) return;
    state.activeTabItem = tab;
    console.log(state.activeTabItem, '点击tab');
    if (tab === 1 && state.activeTab === 1) {
      itemList.value.initScrollData();
    } else {
      if (state.activeTab === 0) {
        qiqiShop.value.resetData();
        qiqiShop.value.getList({ isInit: true, waresType: tab });
      } else {
        haveWares.value.resetData();
        haveWares.value.getList({ isInit: true, waresType: tab });
      }
    }
  }
  const setExchangeInfo = (item) => {
    state.rewardInfo = {
      ...item,
    };
  };
  const setUseInfo = (item) => {
    state.useInfo = {
      ...item,
    };
  };
  const exchange = async () => {
    if (!userStore.token) {
      emit('handleLogin');
      close();
    } else {
      if (!state.rewardInfo.waresId) return;
      try {
        await JigsawService.exchangeWares(state.rewardInfo.waresId);
        state.isConfirmText = false;
        openPopupReward();
        queryUserCurrency();
      } catch (e) {
        console.log(e, 'error');
      }
    }
  };
  const resetQiqi = async () => {
    try {
      await JigsawService.useWares(0);
      state.isConfirmText = true;
      openPopupReward();
      emit('useWares', 0);
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const useWares = async () => {
    if (!state.useInfo.detailsId) return;
    try {
      await JigsawService.useWares(state.useInfo.detailsId);
      state.isConfirmText = true;
      openPopupReward();
      emit('useWares', state.useInfo.detailsId);
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const queryUserCurrency = async () => {
    try {
      const { resultData } = await JigsawService.queryUserCurrency();
      state.userCurrency = resultData.userCurrency;
      state.showUserCurrency=true;
    } catch (e) {
      if (e.resultCode === -1) {
        state.showUserCurrency=false;
        userStore.resetToken()
      }
    }
  };

  defineExpose({ open, close, queryUserCurrency });
</script>

<style scoped lang="scss">
  .animate__fadeIn {
    --animate-duration: 0.3s;
  }
  .animate__fadeOut {
    --animate-duration: 0.3s;
  }
  .container {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    background: transparent;

    .maskClass {
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
  .exchangeMall {
    display: flex;
    box-sizing: border-box;
    position: relative;
    width: 710rpx;
    /*padding: 4rpx;*/
    background: #ffffff;
    /*border: 4rpx solid #ffffff;*/
    overflow: visible;
    border-radius: 24rpx;

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 710rpx;
      /*margin: 4rpx;*/
      background: #fff2c6;
      box-sizing: border-box;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      /*padding-top: 22rpx;*/

      .qiqi-price-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 710rpx;
        height: 242rpx;
        position: relative;
        /*background: #faeeb2;*/
        opacity: 1;
        /*border: 1rpx solid #efdf9e;*/
        .close-icon {
          position: absolute;
          right: 4rpx;
          top: 4rpx;
          width: 64rpx;
          height: 69rpx;
          z-index: 1;
        }
        .inner-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 710rpx;
          height: 242rpx;
          /*background: #fefefe;*/
          opacity: 1;
          /*border: 1rpx solid #efdf9e;*/
          /*border-radius: 24rpx 24rpx 24rpx 24rpx;*/

          .bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 710rpx;
            height: 242rpx;
            z-index: 0;
          }
          .qiqi-content {
            position: absolute;
            z-index: 1;
            display: flex;
            align-items: center;
            width: 289rpx;
            height: 92rpx;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 16rpx 16rpx 16rpx 16rpx;
            margin-left: 53rpx;
            margin-top: 10rpx;
            .left {
              margin-left: 29rpx;
              width: 75rpx;
              height: 64rpx;
            }

            .right {
              margin-left: 10rpx;
              display: flex;
              flex-direction: column;

              .top {
                font-size: 24rpx;
                font-family: Resource Han Rounded CN;
                font-weight: 500;
                color: #ffffff;
                line-height: 28rpx;
              }

              .bottom {
                font-size: 32rpx;
                font-family: Resource Han Rounded CN;
                font-weight: 400;
                color: #ffffff;
                line-height: 36rpx;
              }
            }
          }
        }
      }

      .tab-wrap {
        margin-top: 25rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 602rpx;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 290rpx;
          height: 60rpx;
          background: #ffffff;
          border-radius: 16rpx 16rpx 0 0;

          .icon-left {
            width: 16rpx;
            height: 23rpx;
            margin-left: 55rpx;
          }

          .icon-right {
            width: 16rpx;
            height: 23rpx;
            margin-right: 55rpx;
          }

          .text {
            font-size: 32rpx;
            font-family: Resource Han Rounded CN;
            font-weight: 500;
            color: #d97626;
            line-height: 36rpx;
          }
        }

        .active {
          background: #d97626;

          .text {
            color: #fefefe;
          }
        }
      }

      .show-wrap {
        box-sizing: border-box;
        width: 664rpx;
        padding: 30rpx;
        background: #fff9dd;
        border: 1rpx solid #d97626;
        border-radius: 16rpx;
        margin-bottom: 30rpx;

        .mt-50 {
          margin-top: 50rpx;
        }
        .reset {
          margin-top: 30rpx;
          font-size: 32rpx;
          font-family: Resource Han Rounded CN;
          font-weight: bold;
          color: #ffaa00;
          line-height: 50rpx;
          text-align: center;
        }
      }
    }
  }
  .transClass {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .reward-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 38rpx;

    .reward-img {
      max-width: 338rpx;
      height: auto;
      margin-top: 50rpx;
    }

    .notice {
      margin-top: 20rpx;
      margin-bottom: 27rpx;
      font-size: 32rpx;
      font-family: Resource Han Rounded CN;
      font-weight: 500;
      color: #000000;
      line-height: 50rpx;
      text-align: center;
    }

    .confirm-text {
      padding: 100rpx 35rpx;
      font-family: Resource Han Rounded CN;
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
      line-height: 36px;
      text-align: center;
    }
  }
</style>
