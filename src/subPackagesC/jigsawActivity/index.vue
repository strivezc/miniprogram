<template>
  <view class="container">
    <!--    <image src="@/subPackagesC/static/jigsaw/element/bg-1.png" class="bg"></image>-->
    <image src="@/subPackagesC/static/jigsaw/element/bg-1.png" class="bg"></image>
    <view class="canvas-wrap" :style="{ 'z-index': state.zIndex }">
      <canvas id="canvas" type="webgl" class="canvas"></canvas>
    </view>
    <view class="element-doll">
      <image v-if="state.qiqiImage" :src="state.qiqiImage" class="frame"></image>
      <view v-else class="frame"></view>
      <view
        class="button-wrapper animate__animated"
        :class="state.animateClass.button"
        @animationend="animationend($event, 'button')"
        @click="startGame(true)"
      >
        <image
          src="@/subPackagesC/static/jigsaw/button/button-yellow-l.png"
          class="button-yellow"
        ></image>
        <text class="text">{{ state.firstPlay === 1 ? '继续游戏' : '开始游戏' }}</text>
      </view>
    </view>
    <!--    <view class="content" :style="{ top: navHeight + 'px' }">-->
    <view class="content">
      <MoveText
        class="move-wrap"
        v-if="state.firstPageCopy"
        :moveText="state.firstPageCopy"
      ></MoveText>
      <view class="button">
        <view class="item">
          <image
            class="img animate__animated"
            :class="state.animateClass.buttonUser"
            @click="openUserCenter('buttonUser')"
            @animationend="animationend($event, 'buttonUser')"
            src="@/subPackagesC/static/jigsaw/button/button-user.png"
          ></image>
        </view>
        <view class="item">
          <image
            class="img animate__animated"
            @click="openPopup('buttonSet')"
            :class="state.animateClass.buttonSet"
            @animationend="animationend($event, 'buttonSet')"
            src="@/subPackagesC/static/jigsaw/button/button-set.png"
          ></image>
        </view>
        <view class="item">
          <image
            class="img animate__animated"
            @click="openRank('buttonRank')"
            :class="state.animateClass.buttonRank"
            @animationend="animationend($event, 'buttonRank')"
            src="@/subPackagesC/static/jigsaw/button/button-rank.png"
          ></image>
        </view>
        <view class="item">
          <image
            class="img animate__animated"
            @click="openRules('buttonTips')"
            :class="state.animateClass.buttonTips"
            @animationend="animationend($event, 'buttonTips')"
            src="@/subPackagesC/static/jigsaw/button/button-tips.png"
          ></image>
        </view>
        <view class="item">
          <image
            class="img animate__animated"
            :class="state.animateClass.buttonLog"
            @click="openRewardRecord('buttonLog')"
            @animationend="animationend($event, 'buttonLog')"
            src="@/subPackagesC/static/jigsaw/button/button-log.png"
          ></image>
        </view>
      </view>
      <view class="content-bottom">
        <view class="button">
          <view class="item">
            <image
              class="img animate__animated"
              :class="state.animateClass.buttonRoadblock"
              @click="toGameRank('buttonRoadblock')"
              @animationend="animationend($event, 'buttonRoadblock')"
              src="@/subPackagesC/static/jigsaw/button/button-roadblock.png"
            ></image>
          </view>
          <view class="item">
            <image
              class="img animate__animated"
              :class="state.animateClass.buttonShop"
              @click="openMall('buttonShop')"
              @animationend="animationend($event, 'buttonShop')"
              src="@/subPackagesC/static/jigsaw/button/button-shop.png"
            ></image>
          </view>
        </view>
      </view>
    </view>

    <JigsawPopup
      ref="popup"
      :title="state.normalTitle"
      :content="state.normalContent"
      @submitAction="submitAction"
    ></JigsawPopup>
    <JigsawPopup ref="center" title="个人中心" :isConfirm="false">
      <template #main>
        <JigsawUserCenter ref="userCenter"></JigsawUserCenter>
      </template>
    </JigsawPopup>
    <JigsawPopup
      ref="record"
      title="关卡奖励记录"
      type="bottom"
      :safeArea="false"
      :isConfirm="false"
      :isFullScreen="true"
    >
      <template #main>
        <RewardRecord ref="rewardRecord" :regionId="state.regionId"></RewardRecord>
      </template>
    </JigsawPopup>
    <JigsawPopup ref="rank" title="排行榜" :isConfirm="false">
      <template #main>
        <JigsawRank ref="jigsawRank"></JigsawRank>
      </template>
    </JigsawPopup>
    <JigsawNotice ref="notice" :text="state.backgroundCopy" @startGame="startGame"></JigsawNotice>
    <JigsawPopup ref="gameRules" title="游戏规则" :isConfirm="false">
      <template #main>
        <view class="game-rules">{{ state.ruleCopy }}</view>
      </template>
    </JigsawPopup>
    <JigsawPopup ref="loginPopup" title="小游戏说明" :isConfirm="false">
      <template #main>
        <LoginPopup @loginRefreshData="loginRefreshData"></LoginPopup>
      </template>
    </JigsawPopup>
    <ExchangeMall ref="popupMall" @handleLogin="handleLogin" @useWares="useWares"></ExchangeMall>
  </view>
</template>

<script setup>
  import { preLoadPag } from '@/utils/preLoadPag';
  import { Player } from 'svgaplayer-weapp';
  import { preLoadSvga } from '@/utils/preLoadSvga';
  import JigsawService from '@/api/JigsawService';
  import { getSystemInfo } from '@/utils';
  import { getRecommendCode, setRecommendCode,getToken } from '@/utils/auth';
  import { useContentStore, useUserStore } from '@/store';
  import JigsawPopup from './components/JigsawPopup/index.vue';
  import JigsawRank from './components/JigsawRank/index.vue';
  import JigsawUserCenter from './components/JigsawUserCenter/index.vue';
  import RewardRecord from './components/RewardRecord/index.vue';
  import MoveText from './components/MoveText/index.vue';
  import JigsawNotice from './components/JigsawNotice/index.vue';
  import ExchangeMall from './components/ExchangeMall/index.vue';
  import LoginPopup from './components/LoginPopup/index.vue';

  let navHeight = ref();
  navHeight.value = getSystemInfo().navHeight;

  const contentStore = useContentStore();
  const userStore = useUserStore();
  // 弹窗ref
  const popup = ref();
  const notice = ref();
  const center = ref();
  const userCenter = ref();
  const record = ref();
  const rewardRecord = ref();
  const gameRules = ref();
  const rank = ref();
  const jigsawRank = ref();
  const popupMall = ref();
  const loginPopup = ref();
  // state
  const state = reactive({
    backgroundCopy: '', //背景文案
    firstPageCopy: '', // 首页公告
    ruleCopy: '', // 规则文案
    maintainSwitch: '', //拼图维护 0.开放 1.停服
    qiqiImage: '', // 奇奇猴形象
    firstPlay: '', // 是否第一次玩
    normalTitle: '设置',
    normalContent: '退出拼图将退至小程序首页',
    regionId: '',
    zIndex: -99,
    animateClass: {
      button: [],
      buttonUser: [],
      buttonSet: [],
      buttonRank: [],
      buttonTips: [],
      buttonLog: [],
      buttonRoadblock: [],
      buttonShop: [],
    },
  });

  let player = null;
  const initParser = async () => {
    console.log('动画初始开始');
    let time = new Date().getTime();
    preLoadPag('qiqimonkey', async (pagFile, PAG) => {
      wx.createSelectorQuery()
        .select('#canvas')
        .node()
        .exec(async (res) => {
          const canvas = res[0].node;
          player = await PAG.PAGView.init(pagFile, canvas);
          player.setRepeatCount(0);
          player.play();
          console.log('开始动画，耗时', new Date().getTime() - time + '毫秒');
        });
    });
  };

  onLoad((query) => {
    let recommendCode = query.recommendCode || getRecommendCode();
    let jigsawCode = query.jigsawCode || '';
    let userDistributorCode = query.userDistributorCode || '';
    if (query.openRecord) {
      state.regionId = 0; // 打开系统发放记录
      nextTick(() => {
        rewardRecord.value.initScrollData();
        record.value.open();
      });
    }
    console.log(recommendCode, 'recommendCode');
    console.log(jigsawCode, 'jigsawCode');
    console.log(userDistributorCode, 'userDistributorCode');
    userStore.setJigsawCode(jigsawCode);
    userStore.setUserDistributorCode(userDistributorCode);
    if (recommendCode) {
      setRecommendCode(recommendCode);
      userStore.setRecommendCode(recommendCode);
    }
  });
  onUnload(() => {
    if (userStore.jigsawExistPath) {
      //如果页面有跳转记录，则清空记录并且回到小程序首页
      userStore.jigsawExistPath = '';
      uni.switchTab({
        url: '/pages/home/index',
      });
    }
    uni.$off('refreshSwitch');
    player.freeCache();
    player.destroy();
  });
  onMounted(() => {
    console.log('onMounted');
    initParser();
    uni.$on('refreshSwitch', getStartGameInfo);
    if (!getToken()) {
      queryInitialContent(false);
    } else {
      getStartGameInfo();
    }
    preLoadSvga('time');
    preLoadSvga('xgray');
    preLoadSvga('reset');
    preLoadSvga('reward');
    preLoadPag('radioplay');
  });
  function animationend(e, name) {
    state.animateClass[name] = [];
  }
  const openRank = (name) => {
    state.animateClass[name].push('my_animate__pulse');
    jigsawRank.value.initScrollData();
    rank.value.open();
  };
  const openNotice = () => {
    notice.value.open();
  };
  const openRules = (name) => {
    state.animateClass[name].push('my_animate__pulse');
    gameRules.value.open();
  };
  const openPopup = (name) => {
    state.animateClass[name].push('my_animate__pulse');
    state.normalTitle = '设置';
    state.normalContent = '退出拼图将退至小程序首页';
    popup.value.open();
  };
  const openMall = (name) => {
    state.animateClass[name].push('my_animate__pulse');
    popupMall.value.queryUserCurrency();
    popupMall.value.open();
  };
  const toGameRank = (name) => {
    state.animateClass[name].push('my_animate__pulse');
    uni.navigateTo({
      url: '/subPackagesC/jigsawActivity/gameArea',
    });
  };
  const openUserCenter = (name) => {
    if (!getToken()) {
      loginPopup.value.open();
    } else {
      state.animateClass[name].push('my_animate__pulse');
      center.value.open();
      userCenter.value.getUserCenter();
    }
  };
  const openRewardRecord = (name) => {
    if (!getToken()) {
      loginPopup.value.open();
    } else {
      state.animateClass[name].push('my_animate__pulse');
      rewardRecord.value.initScrollData();
      record.value.open();
    }
  };
  function handleLogin() {
    loginPopup.value.open();
  }
  const submitAction = () => {
    uni.switchTab({
      url: '/pages/home/index',
    });
  };
  const startGame = async (animate = false) => {
    if (!getToken()) {
      loginPopup.value.open();
    } else {
      if (animate) {
        state.animateClass.button.push('my_animate__pulse');
      }
      await JigsawService.startGame();
      contentStore.getJigsawDataFromHome().then((resultData) => {
        if (resultData === 94) {
          state.normalTitle = '提示';
          state.normalContent = '游戏维护中...';
          popup.value.open();
        } else {
          if (resultData.gameType === 4) {
            state.normalTitle = '提示';
            state.normalContent = '游戏已全部通关，敬请期待';
            popup.value.open();
            return;
          }
          uni.navigateTo({
            url: '/subPackagesC/jigsawActivity/gamePage',
          });
        }
      });
    }

  };
  const queryInitialContent = async (showBackground=true) => {
    try {
      const { resultData } = await JigsawService.queryInitialContent();
      state.backgroundCopy = resultData.backgroundCopy;
      state.firstPageCopy = resultData.firstPageCopy;
      state.ruleCopy = resultData.ruleCopy;
      state.maintainSwitch = resultData.maintainSwitch;
      if (showBackground) {
        if (!uni.getStorageSync('popUpGameBackground')) {
          if (state.backgroundCopy) {
            openNotice();
          }
          uni.setStorageSync('popUpGameBackground', 'yes', 24 * 60 * 60);
        }
      } else {
        if (!state.qiqiImage) {
          state.zIndex = -1;
        } else {
          state.zIndex = -99;
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const useWares = async (detailsId) => {
    try {
      const { resultData } = await JigsawService.startGame();
      if (detailsId === 0) {
        state.zIndex = -1;
        player.play();
      } else {
        state.zIndex = -99;
        player.pause();
      }
      state.firstPlay = resultData.firstPlay;
      state.qiqiImage = resultData.qiqiImage;
      state.regionId = resultData.firstRegionId;
    } catch (e) {
      console.log(e, 'error');
    }
  };
  function loginRefreshData() {
    getStartGameInfo();
    loginPopup.value.close();
  }
  const getStartGameInfo = async () => {
    try {
      const { resultData } = await JigsawService.startGame();
      if (resultData === 94) {
        uni.switchTab({
          url: '/pages/home/index',
        });
        return;
      }
      state.firstPlay = resultData.firstPlay;
      state.qiqiImage = resultData.qiqiImage;
      if (state.regionId !== 0) {
        state.regionId = resultData.firstRegionId;
      }
      queryInitialContent();
      contentStore.getPropsInfo();
      if (!state.qiqiImage) {
        state.zIndex = -1;
      } else {
        state.zIndex = -99;
      }
    } catch (e) {
      if (e.resultCode === -1) {
        // userStore.resetToken().then(() => {
        uni.redirectTo({
          url: '/subPackagesA/personal/chooseLoginType?redirect=/subPackagesC/jigsawActivity/index',
        });
        // });
      } else {
        uni.showToast({
          title: e.resultMessage,
          icon: 'none',
          duration: 3000,
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .container {
    position: relative;
    .bg {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .canvas-wrap {
      display: flex;
      justify-content: center;
      position: fixed;
      top: 58%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 388rpx;
      height: 602rpx;
      background-color: transparant;
      .canvas {
        width: 448rpx;
        height: 448rpx;
      }
    }
    .element-doll {
      position: fixed;
      top: 58%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      text-align: center;
      .frame {
        width: 448rpx;
        height: 448rpx;
      }
      .button-wrapper {
        display: inline-block;
        position: relative;
        margin-top: 50rpx;
        width: 405rpx;
        height: 104rpx;
        .button-yellow {
          width: 405rpx;
          height: 104rpx;
        }
        .text {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          padding-top: 12rpx;
          font-size: 44rpx;
          color: #ffffff;
          font-weight: bold;
          font-family: Resource Han Rounded CN;
          text-shadow: 0 3rpx #333333;
        }
      }
    }
    .content {
      position: fixed;
      top: 40rpx;
      width: 100%;
      .move-wrap {
        position: absolute;
        top: 20rpx;
        left: 50%;
        transform: translateX(-50%);
      }
      .button {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 40rpx;
        .item {
          width: 50%;
          margin-bottom: 35rpx;
          .img {
            width: 100rpx;
            height: 110rpx;
          }
          .set {
            width: 101rpx;
            height: 122rpx;
          }
          .rank {
            width: 100rpx;
            height: 115rpx;
          }
          .log {
            width: 101rpx;
            height: 111rpx;
          }
          &:nth-child(even) {
            text-align: right;
          }
        }
      }
    }
    .content-bottom {
      position: fixed;
      bottom: 105rpx;
      width: 100%;
      .button {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 40 rpx;
        .item {
          width: 50%;
          margin-bottom: 35rpx;
          .img {
            width: 100rpx;
            height: 110rpx;
          }
          &:nth-child(even) {
            text-align: right;
          }
        }
      }
    }
    .game-rules {
      padding: 30rpx;
      min-height: 300rpx;
      max-height: 900rpx;
      overflow-y: scroll;
      font-size: 30rpx;
      font-family: Resource Han Rounded CN;
      font-weight: 400;
      color: #666666;
      line-height: 44rpx;
      white-space: pre-wrap;
    }
  }
</style>
