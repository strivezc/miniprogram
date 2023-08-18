<template>
  <uni-transition
    ref="ani"
    :class="state.mask ? 'tl-show' : ''"
    custom-class="transition"
    mode-class="fade"
    :show="show"
  >
    <view class="gamePage">
      <image src="@/subPackagesC/static/jigsaw/element/bg-2.png" class="background"></image>
      <!--      <view class="content" :style="{ top: navHeight + 'px' }">-->
      <view class="content">
        <view class="header">
          <view class="left">
            <image class="icon" src="@/subPackagesC/static/jigsaw/element/element-rank.png"></image>
            <text class="text">第{{ jigsawData.contentBarrierSort }}关</text>
          </view>
          <view class="right">
            <image
              class="log animate__animated"
              :class="state.animateClass.buttonLog"
              @animationend="animationend($event, 'buttonLog')"
              @click="openRewardRecord('buttonLog')"
              src="@/subPackagesC/static/jigsaw/button/button-log.png"
            ></image>
            <image
              class="set animate__animated"
              :class="state.animateClass.buttonSet"
              @animationend="animationend($event, 'buttonSet')"
              @click="openPopup('buttonSet')"
              src="@/subPackagesC/static/jigsaw/button/button-set.png"
            ></image>
          </view>
        </view>
        <view class="move-tips" v-show="jigsawData.barrierInform">
          <!--          <image src="@/subPackagesC/static/jigsaw/element/element-gift.png" class="icon"></image>-->
          <canvas id="canvas" type="2d" class="icon"></canvas>
          <BarrierMoveText :moveText="jigsawData.barrierInform"></BarrierMoveText>
        </view>

        <view class="game-wrapper">
          <view class="fl-c-s">
            <CountDown ref="countDown" @timeUp="timeUp" @restart="useProps('time')"></CountDown>
            <ViewOriginalImage
              @continueGame="countDownStart"
              @viewImage="pauseGame"
              :imageUrl="jigsawData.barrierImg"
            ></ViewOriginalImage>
          </view>
          <GameContent
            ref="gameContent"
            :imageUrl="jigsawData.barrierImg"
            :showNum="jigsawData.useSeeProp === 0"
            :isInteractive="jigsawData.playType === 0"
            :level="jigsawData.imgType + 2"
            @endCallback="endCallback"
          ></GameContent>
        </view>
        <GameProps
          :seeProp="jigsawData.seeProp"
          :resetProp="jigsawData.resetProp"
          :timeProp="jigsawData.timeProp"
          :timeGetSeconds="jigsawData.timeGetSeconds"
          ref="gameProps"
          @pauseGame="pauseGame"
          @continueGame="countDownStart"
          @useProps="useProps"
          @timeUp="timeUp"
        ></GameProps>
      </view>

      <JigsawPopup
        ref="popup"
        :title="state.normalTitle"
        :content="state.normalContent"
        @submitAction="submitAction"
        @closeAction="countDownStart"
      ></JigsawPopup>
      <JigsawPopup
        ref="record"
        title="关卡奖励记录"
        type="bottom"
        :safeArea="false"
        :isConfirm="false"
        :isFullScreen="true"
        @closeAction="countDownStart"
      >
        <template #main>
          <RewardRecord ref="rewardRecord" :regionId="jigsawData.regionId"></RewardRecord>
        </template>
      </JigsawPopup>

      <!--      <JigsawConfirm title="恭喜通关" :showClose="false" :show="state.show">-->
      <!--        <template #main>-->
      <!--          <view class="reward-wrap">-->
      <!--            <image mode="widthFix" :src="jigsawData.barrierImg" class="barrier-img"></image>-->
      <!--            <view class="confirm-text" v-if="state.completeResult">{{ state.completeResult }}</view>-->
      <!--            <JsgsawButton-->
      <!--              singleText="确认"-->
      <!--              type="green"-->
      <!--              @handleAction="closePopupResult"-->
      <!--            ></JsgsawButton>-->
      <!--          </view>-->
      <!--        </template>-->
      <!--      </JigsawConfirm>-->

      <JigsawPopup ref="result" :showClose="false" title="恭喜通关" :isConfirm="false">
        <template #main>
          <view class="reward-wrap">
            <image mode="widthFix" :src="jigsawData.barrierImg" class="barrier-img"></image>
            <view class="confirm-text" v-if="state.completeResult">{{ state.completeResult }}</view>
            <view class="flex-c">
              <!--              <image-->
              <!--                v-if="contentStore.jigsawData.englishSound || contentStore.jigsawData.chineseSound"-->
              <!--                @click="playSound"-->
              <!--                mode="widthFix"-->
              <!--                src="@/subPackagesC/static/jigsaw/button/playvoice.png"-->
              <!--                class="voice-icon"-->
              <!--              ></image>-->
              <view
                class="voice-wrap"
                v-if="contentStore.jigsawData.englishSound || contentStore.jigsawData.chineseSound"
                @click="playSound"
              >
                <canvas id="soundIcon" type="webgl" class="voice-icon"></canvas>
              </view>
              <JsgsawButton
                singleText="确认"
                type="green"
                @handleAction="closePopupResult"
              ></JsgsawButton>
            </view>
          </view>
        </template>
      </JigsawPopup>
    </view>
  </uni-transition>
  <GameGuide :type="state.guideType" ref="gameGuide" @closeAction="closeGuide"></GameGuide>
</template>

<script setup>
  import { preLoadPag } from '@/utils/preLoadPag';
  import { Player } from 'svgaplayer-weapp';
  import { preLoadSvga } from '@/utils/preLoadSvga';
  import JigsawPopup from './components/JigsawPopup/index.vue';
  // import JigsawConfirm from './components/JigsawConfirm/index.vue';
  import JsgsawButton from './components/JsgsawButton/index.vue';
  import RewardRecord from './components/RewardRecord/index.vue';
  import CountDown from './components/CountDown/index.vue';
  import ViewOriginalImage from './components/ViewOriginalImage/index.vue';
  import GameProps from './components/GameProps/index.vue';
  import GameContent from './components/GameContent/index.vue';
  import BarrierMoveText from './components/BarrierMoveText/index.vue';
  import GameGuide from './components/GameGuide/index.vue';
  import { getSystemInfo, urlEncode } from '@/utils';
  import { useContentStore, useUserStore } from '@/store';
  // import { Player } from 'svgaplayer-weapp';
  // import { preLoadSvga } from '@/utils/preLoadSvga';
  import { preLoadVoice, textToSpeech, audioContext } from '@/utils/textToSpeech';

  let navHeight = ref();
  navHeight.value = getSystemInfo().navHeight;
  const contentStore = useContentStore();
  const userStore = useUserStore();

  const { jigsawData } = toRefs(contentStore);
  const gameContent = ref();
  const popup = ref();
  const record = ref();
  const countDown = ref();
  const rewardRecord = ref();
  const gameProps = ref();
  const gameGuide = ref();
  const result = ref();
  const state = reactive({
    normalTitle: '设置',
    normalContent: '退出拼图将退至小程序首页',
    guideType: 'move',
    completeResult: '',
    animateClass: {
      buttonSet: [],
      buttonLog: [],
    },
    mask: false,
    // show: false,
  });
  function animationend(e, name) {
    state.animateClass[name] = [];
  }
  const openRewardRecord = (name) => {
    state.animateClass[name].push('my_animate__pulse');
    rewardRecord.value.initScrollData();
    record.value.open();
    state.mask = true;
    pauseGame();
  };
  const submitAction = () => {
    userStore.jigsawExistPath = 'gamePage';
    uni.reLaunch({
      url: '/subPackagesC/jigsawActivity/index',
    });
  };
  const timeUp = () => {
    console.log('timeUp');
    gameContent.value.gameEnd();
    contentStore.pauseOrTimeOut(2);
    countDown.value.open();
    state.mask = true;
  };
  const pauseGame = (val) => {
    state.mask = true;
    console.log('pauseGame');
    countDown.value.pause(val);
    console.log('pauseGame-end');
  };
  const countDownStart = () => {
    state.mask = false;
    // gameContent.value.start();
    if (contentStore.jigsawData.barrierSurplusTime !== 0) {
      countDown.value.start();
    }
  };
  const closePopupResult = () => {
    state.mask = false;
    // state.show = false;
    result.value.close();
    // popupResult.value.close();
    if (contentStore.completeInfo.passPrize === 0 && contentStore.completeInfo.prizeType === 0) {
      uni.redirectTo({
        url: `/subPackagesC/jigsawActivity/blindBox`,
      });
    } else {
      uni.redirectTo({
        url: `/subPackagesC/jigsawActivity/notBlindBox`,
      });
    }
  };
  const useProps = (type) => {
    state.mask = false;
    contentStore.pauseOrTimeOut(1).then(() => {
      contentStore.useGameProps(type).then((resultData) => {
        if (resultData === 94) {
          state.normalTitle = '温馨提示';
          state.normalContent = '游戏维护中，不支持使用道具';
          popup.value.open();
          state.mask = true;
          pauseGame();
          return;
        }
        if (type === 'reset') {
          countDown.value.reset();
          gameContent.value.start(false);
          initVoice();
        } else if (type === 'time') {
          countDown.value.reset();
          gameContent.value.gameContinue();
        }
      });
    });
  };

  const endCallback = () => {
    pauseGame();
    contentStore.gameComplete().then((resultData) => {
      // state.show = true;
      playSound();
      result.value.open();
      if (resultData.regionLastOne === 0) {
        state.completeResult = '恭喜通关本地域';
        state.mask = true;
      } else {
        // state.completeResult = '恭喜通关';
        state.mask = true;
      }
    });
  };

  const playSound = () => {
    try {
      const englishSound = contentStore.jigsawData.englishSound;
      const chineseSound = contentStore.jigsawData.chineseSound;
      if (englishSound && chineseSound) {
        radioPlayer.play();
        textToSpeech('en').then(() => {
          textToSpeech('zh').then(() => {
            radioPlayer.pause();
          });
        });
      } else if (englishSound && !chineseSound) {
        radioPlayer.play();
        textToSpeech('en').then(() => {
          radioPlayer.pause();
        });
      } else if (!englishSound && chineseSound) {
        radioPlayer.play();
        textToSpeech('zh').then(() => {
          radioPlayer.pause();
        });
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };

  const show = ref(false);
  nextTick(() => {
    show.value = true;
  });
  const openPopup = (name) => {
    state.animateClass[name].push('my_animate__pulse');
    state.normalTitle = '设置';
    state.normalContent = '退出拼图将退至小程序首页';
    popup.value.open();
    state.mask = true;
    pauseGame();
    contentStore.pauseOrTimeOut(1);
  };
  const checkTimeUp = () => {
    console.log('checkTimeUp');
    if (contentStore.barrierSurplusTime === 0) {
      console.log('时间耗尽...');
      timeUp();
    } else if (contentStore.barrierUseTime > 0) {
      pauseGame();
      gameProps.value.openPauseNotShare();
    }
  };
  const checkShowGuide = () => {
    console.log('checkShowGuide');
    setTimeout(() => {
      console.log(uni.getStorageSync('showGuideChange'), 'showGuideChange');
      console.log(uni.getStorageSync('showGuideMove'), 'showGuideMove');
      if (contentStore.jigsawData.playType === 0) {
        // 互换图片玩法
        if (!uni.getStorageSync('showGuideChange')) {
          uni.setStorageSync('showGuideChange', 'yes');
          state.guideType = 'change';
          console.log('checkShowGuide2');
          gameGuide.value.open();
          state.mask = true;
          console.log('checkShowGuide3');
          pauseGame();
        } else {
          checkTimeUp();
        }
      } else if (contentStore.jigsawData.playType === 1) {
        // 移动图片玩法
        if (!uni.getStorageSync('showGuideMove')) {
          uni.setStorageSync('showGuideMove', 'yes');
          state.guideType = 'move';
          console.log('checkShowGuide2');
          gameGuide.value.open();
          state.mask = true;
          console.log('checkShowGuide3');
          pauseGame();
        } else {
          checkTimeUp();
        }
      }
    });
  };

  const closeGuide = () => {
    countDownStart();
    checkTimeUp();
  };

  let radioPlayer = null;
  let rewardPlayer = new Player();
  const initRewardPlayer = async () => {
    preLoadSvga('reward', async (videoItem) => {
      try {
        await rewardPlayer.setCanvas('#canvas');
        await rewardPlayer.setVideoItem(videoItem);
        rewardPlayer.startAnimation();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const initRadioPlayer = async () => {
    preLoadPag('radioplay', async (pagFile, PAG) => {
      wx.createSelectorQuery()
        .select('#soundIcon')
        .node()
        .exec(async (res) => {
          const canvas = res[0].node;
          radioPlayer = await PAG.PAGView.init(pagFile, canvas);
          radioPlayer.setRepeatCount(0);
        });
    });
  };
  const initVoice = async () => {
    if (contentStore.jigsawData.englishSound) {
      preLoadVoice('en', contentStore.jigsawData.englishSound);
    }
    if (contentStore.jigsawData.chineseSound) {
      preLoadVoice('zh', contentStore.jigsawData.chineseSound);
    }
  };
  onMounted(() => {
    initRewardPlayer();
    initRadioPlayer();
  });
  onLoad(() => {
    nextTick(() => {
      console.log('开始游戏');
      gameContent.value.start();
      countDownStart();
    });
    console.log('onLoad');
    onShareAppMessage((res) => {
      if (res.from === 'button') {
        // 来自页面内分享按钮
      }
      console.log(userStore.userDistributorCode, 'userStore.userDistributorCode');
      console.log(userStore.jigsawCode, 'userStore.jigsawCode');
      return {
        title: `速来领取上课礼包，${userStore.userName}正在参与领取中~`,
        path: `/subPackagesC/jigsawActivity/index?recommendCode=${userStore.recommendCode}&userDistributorCode=${userStore.userDistributorCode}&jigsawCode=${userStore.jigsawCode}`,
        imageUrl:
          'https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/image/4fd7fbce79b14c7babe81bad6ecf7a7f.png',
      };
    });
    uni.$on('showGameGuide', checkShowGuide);
    preLoadSvga('baoxiang');
    preLoadSvga('button');
    initVoice();
  });
  onUnload(() => {
    uni.$off('showGameGuide');
    if (!contentStore.isComplete) {
      //如果游戏完成则不调保存记录
      console.log('onUnload-返回 游戏记录保存');
      pauseGame();
      contentStore.pauseOrTimeOut(1);
    }
    contentStore.isComplete = false;
    console.log(rewardPlayer, 'rewardPlayer');
    rewardPlayer.stopAnimation(true);
    radioPlayer.freeCache();
    radioPlayer.destroy();
    audioContext.destroy();
  });
  onShow(() => {
    console.log('onShow');
    nextTick(() => {
      if (countDown.value.flag) {
        countDownStart();
      }
    });
  });
  onHide(() => {
    console.log('暂停游戏');
    if (countDown.value.flag === false) {
      pauseGame(false);
    } else {
      pauseGame(true);
    }
    contentStore.pauseOrTimeOut(1);
  });
</script>

<style scoped lang="scss">
  .gamePage {
    position: relative;

    .background {
      width: 750rpx;
      height: 1557rpx;
      vertical-align: middle;
    }
    .content {
      position: absolute;
      top: 68rpx;
      width: 100%;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 40rpx;
        padding-right: 30rpx;
        .left {
          position: relative;
          width: 215rpx;
          height: 52rpx;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          .icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: -10rpx;
            width: 81rpx;
            height: 81rpx;
          }
          .text {
            padding-left: 80rpx;
            font-size: 32rpx;
            font-family: Resource Han Rounded CN;
            color: #ffffff;
            line-height: 52rpx;
            /*text-align: center;*/
          }
        }
        .right {
          display: flex;
          align-items: center;
          .log {
            width: 100rpx;
            height: 110rpx;
          }
          .set {
            margin-left: 50rpx;
            width: 100rpx;
            height: 110rpx;
          }
        }
      }
      .move-tips {
        position: relative;
        width: 675rpx;
        height: 52rpx;
        margin: auto;
        margin-top: 30rpx;
        .icon {
          position: absolute;
          top: -22rpx;
          left: -16rpx;
          z-index: 3;
          width: 80rpx;
          height: 80rpx;
        }
      }
      .game-wrapper {
        margin: auto;
        margin-top: 73rpx;
        padding: 35rpx;
        width: 600rpx;
        height: 675rpx;
        background: #afc72e;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
      }
    }
    .reward-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .flex-c {
        display: flex;
        align-items: center;
      }
      .barrier-img {
        max-width: 550rpx;
        height: auto;
        margin-top: 30rpx;
        margin-bottom: 40rpx;
      }
      .voice-wrap {
        width: 208rpx;
        height: 104rpx;
        margin-left: -26rpx;
        margin-right: -26rpx;
        .voice-icon {
          width: 208rpx;
          height: 104rpx;
        }
      }

      .confirm-text {
        font-family: Resource Han Rounded CN;
        font-size: 40rpx;
        font-weight: 500;
        color: #333333;
        line-height: 36px;
        text-align: center;
        margin-bottom: 20rpx;
      }
    }
  }
</style>
