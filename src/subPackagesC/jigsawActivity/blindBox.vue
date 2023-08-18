<template>
  <view class="blindBox">
    <!--    <image src="@/subPackagesC/static/jigsaw/element/bg-1.png" class="bg"></image>-->
    <image src="@/subPackagesC/static/jigsaw/element/bg-lottery.png" class="bg-area"></image>
    <van-popup :close-on-click-overlay="false" :show="state.show"> </van-popup>
    <canvas
      id="boxCanvas"
      :style="{ 'z-index': state.zIndex }"
      type="2d"
      class="boxCanvas"
    ></canvas>
    <view class="container">
      <view class="move-text">
        <LotteryMoveText :moveText="prizeNames"></LotteryMoveText>
      </view>
      <view class="lottery-button" @click="raffle">
        <canvas id="btnCanvas" type="2d" class="img"></canvas>
        <!--        <image src="@/subPackagesC/static/jigsaw/button/button-lottery.png" class="img"></image>-->
      </view>
      <view class="area">
        <image src="@/subPackagesC/static/jigsaw/element/bg-title2.png" class="bg"></image>
        <text class="text">排行榜</text>
      </view>
      <view class="li-wrap">
        <view
          class="li"
          :class="state.userRank.userId === item.userId && isInnerRankList ? 'active' : ''"
          v-for="(item, index) in state.rankList"
          :key="index"
        >
          <view class="left">
            <view class="rank-wrapper">
              <image :src="getIcon(item.rank)" class="img"></image>
            </view>
            <image
              class="avtar"
              :src="item.userImg === 'default.jpg' || !item.userImg ? defaultImage : item.userImg"
            ></image>
            <view class="name">{{ item.userName }}</view>
          </view>
          <view class="right">
            <view class="top">通关时间</view>
            <view class="bottom">{{ formatSecond(item.passTime) }}</view>
          </view>
        </view>
        <view class="li active" v-if="!isInnerRankList" :key="4">
          <view class="left">
            <view class="rank-wrapper">
              <image
                v-if="state.userRank.rank > 3"
                src="@/subPackagesC/static/jigsaw/element/element-rankno4.png"
                class="img"
              ></image>
              <image v-else :src="getIcon(state.userRank.rank)" class="img"></image>
              <text class="text">{{ state.userRank.rank > 3 ? state.userRank.rank : '' }}</text>
            </view>
            <image
              class="avtar"
              :src="
                state.userRank.userImg === 'default.jpg' || !state.userRank.userImg
                  ? defaultImage
                  : state.userRank.userImg
              "
            ></image>
            <view class="name">{{ state.userRank.userName }}</view>
          </view>
          <view class="right">
            <view class="top">通关时间</view>
            <view class="bottom">{{ formatSecond(state.userRank.passTime) }}</view>
          </view>
        </view>
      </view>
      <view class="button-wrap">
        <JsgsawButton
          :isSingleText="false"
          :isShare="true"
          type="green"
          twinTextOne="邀请1位新用户注册"
          :twinTextTwo="`可获得${contentStore.jigsawData.timeGetSeconds}秒x${contentStore.propsInfo.getTimeProp}份时长`"
        ></JsgsawButton>
        <JsgsawButton
          v-if="contentStore.completeInfo.haveNext === 0"
          class="mt-30"
          :singleText="contentStore.completeInfo.regionLastOne === 0 ? '下一地域' : '下一关'"
          type="yellow"
          @handleAction="continueGame"
        ></JsgsawButton>
        <JsgsawButton
          class="mt-30"
          singleText="返回首页"
          type="gray"
          @handleAction="backHome"
        ></JsgsawButton>
      </view>
    </view>

    <JigsawPopup
      ref="popup"
      :title="state.normalTitle"
      :content="state.normalContent"
      @submitAction="submitAction"
      :confirmText="state.confirmText"
      @closeAction="state.mask = false"
    ></JigsawPopup>
    <JigsawPopup ref="popupReward" title="温馨提示" :isConfirm="false">
      <template #main>
        <view class="reward-wrap">
          <image mode="widthFix" :src="state.rewardInfo.prizeImg" class="reward-img"></image>
          <view class="notice" v-if="state.rewardInfo.prizeType === 4"
            >第{{ state.rewardInfo.contentBarrierSort }}关 谢谢参与</view
          >
          <view class="notice" v-else
            >第{{ state.rewardInfo.contentBarrierSort }}关的
            {{ state.rewardInfo.prizeName }} 奖励已到账，
            <template v-if="state.rewardInfo.prizeType === 1"
              >请下载“说客英语”App-我的拼图奖励中查看和使用。</template
            >
            <template v-else-if="state.rewardInfo.prizeType === 2"
              >请下载“说客英语”App-我的黄金会员中查看和使用。</template
            >
            <template v-else-if="state.rewardInfo.prizeType === 3"
              >请在小程序拼图游戏的商城中兑换使用。</template
            >
          </view>
          <JsgsawButton
            singleText="我知道了"
            type="yellow"
            @handleAction="closePopupReward"
          ></JsgsawButton>
        </view>
      </template>
    </JigsawPopup>
  </view>
</template>

<script setup>
  import { Player } from 'svgaplayer-weapp';
  import { preLoadSvga } from '@/utils/preLoadSvga';
  import JigsawService from '@/api/JigsawService';
  import LotteryMoveText from './components/LotteryMoveText/index.vue';
  import JsgsawButton from './components/JsgsawButton/index.vue';
  import JigsawPopup from './components/JigsawPopup/index.vue';
  import img1 from '@/subPackagesC/static/jigsaw/element/element-rankno1.png';
  import img2 from '@/subPackagesC/static/jigsaw/element/element-rankno2.png';
  import img3 from '@/subPackagesC/static/jigsaw/element/element-rankno3.png';
  import img4 from '@/subPackagesC/static/jigsaw/element/element-rankno4.png';
  import defaultImage from '@img/default.png';
  import { useContentStore, useUserStore } from '@/store';

  const contentStore = useContentStore();
  const userStore = useUserStore();
  const state = reactive({
    rankList: [],
    userRank: {},
    confirmText: '退出',
    normalTitle: '设置',
    normalContent: '退出拼图将退至小程序首页',
    rewardInfo: {},
    mask: false,
    show: false,
    // overlay: false,
    zIndex: -99,
    loading: false,
    isFinished: false,
  });

  let buttonPlayer = new Player();
  let boxPlayer = new Player();
  let boxFlag = false;
  boxPlayer.loops = 1;
  const initButtonPlayer = async () => {
    preLoadSvga('button', async (videoItem) => {
      try {
        await buttonPlayer.setCanvas('#btnCanvas');
        await buttonPlayer.setVideoItem(videoItem);
        buttonPlayer.startAnimation();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const initBoxPlayer = async () => {
    console.log('initBoxPlayer');
    if (boxFlag) return;
    preLoadSvga('baoxiang', async (videoItem) => {
      try {
        boxFlag = true;
        console.log('动画初始...');
        await boxPlayer.setCanvas('#boxCanvas');
        await boxPlayer.setVideoItem(videoItem);
        console.log(222);
        console.log('动画准备完毕...');
        if (state.show) {
          console.log('show===true');
          boxPlayer.startAnimation();
        }
        boxPlayer.onFinished(() => {
          console.log('动画完成');
          state.show = false;
          // state.overlay = false;
          state.zIndex = 1;
          // 奖励弹窗
          popupReward.value.open();
          state.mask = true;
        });
        boxFlag = false;
        // boxPlayer.startAnimation();
      } catch (error) {
        console.log(error);
      }
    });
  };
  const getUserRank = async () => {
    console.log(3);
    try {
      const { resultData } = await JigsawService.barrierUserRank(contentStore.jigsawData.barrierId);
      console.log(333);
      state.userRank = resultData;
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const getRankList = async () => {
    console.log(4);
    try {
      const { resultData } = await JigsawService.barrierRank(contentStore.jigsawData.barrierId);
      console.log(444);
      state.rankList = resultData;
    } catch (e) {
      console.log(e, 'error');
    }
  };

  const popup = ref();
  const continueGame = () => {
    if (!state.isFinished) {
      state.confirmText = '确认';
      state.normalTitle = '提示';
      state.normalContent = '您还有未抽取的盲盒';
      popup.value.open();
      state.mask = true;
      return;
    }
    contentStore.nextBarrierInto().then((resultData) => {
      if (resultData === 94) {
        state.normalTitle = '提示';
        state.confirmText = '退出';
        state.normalContent = '游戏维护中...';
        popup.value.open();
        state.mask = true;
      } else {
        uni.redirectTo({
          url: '/subPackagesC/jigsawActivity/gamePage',
        });
      }
    });
  };
  const popupReward = ref();
  const raffle = async () => {
    console.log('raffle');
    if (state.loading) return;
    try {
      state.loading = true;
      const { resultData } = await JigsawService.blindBox();
      state.isFinished = true;
      state.rewardInfo = resultData;
      state.show = true;
      // state.overlay = true;
      state.zIndex = 999;
      boxPlayer.startAnimation();
      state.loading = false;
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const closePopupReward = async () => {
    popupReward.value.close();
    state.mask = false;
  };
  const submitAction = () => {
    if (!state.isFinished) {
      popup.value.close();
      raffle();
      return;
    }
    uni.reLaunch({
      url: '/subPackagesC/jigsawActivity/index',
    });
  };
  const prizeNames = ref(
    `盲盒奖品包含如下：【1.课时】、 【2.黄金会员】、 【3.奇奇币】、 【4.谢谢参与】`
  );
  // const prizeNames = computed(() => {
  //   let str = '盲盒奖品包含如下：';
  //   // 1.课时 2.黄金会员 3.奇奇币 4.谢谢参与
  //   const obj = {
  //     1: '课时',
  //     2: '黄金会员',
  //     3: '奇奇币',
  //     4: '谢谢参与',
  //   };
  //   let arr = contentStore.completeInfo.prizeTypes;
  //   if (arr && arr.length > 0) {
  //     for (let i = 0; i < arr.length; i++) {
  //       str += `【${i + 1}.${obj[arr[i]]}】、 `;
  //     }
  //   }
  //   return str.slice(0, -2);
  // });
  const isInnerRankList = computed(() => {
    let flag = false;
    const item = state.rankList.find((i) => {
      return i.userId === state.userRank.userId;
    });
    if (item) {
      flag = true;
    }
    return flag;
  });
  const backHome = () => {
    uni.reLaunch({
      url: '/subPackagesC/jigsawActivity/index',
    });
  };
  const getIcon = (rank) => {
    if (rank === 1) {
      return img1;
    } else if (rank === 2) {
      return img2;
    } else if (rank === 3) {
      return img3;
    } else {
      return img4;
    }
  };

  const formatSecond = (second) => {
    if (!second) return '';
    let obj = {
      hour: null,
      minute: null,
      second: null,
    };
    const h = parseInt((second / 60 / 60) % 24);
    obj.hour = h < 10 ? '0' + h : h;
    const m = parseInt((second / 60) % 60);
    obj.minute = m < 10 ? '0' + m : m;
    const s = parseInt(second % 60);
    obj.second = s < 10 ? '0' + s : s;
    return `${obj.hour}:${obj.minute}:${obj.second}`;
  };

  onMounted(async () => {
    // init();
    initButtonPlayer();
    initBoxPlayer();
    getUserRank();
    getRankList();
    userStore.getJigsawCode('time');
  });

  onLoad(() => {
    onShareAppMessage((res) => {
      if (res.from === 'button') {
        // 来自页面内分享按钮
      }
      return {
        title: `速来领取上课礼包，${userStore.userName}正在参与领取中~`,
        path: `/subPackagesC/jigsawActivity/index?recommendCode=${userStore.recommendCode}&userDistributorCode=${userStore.userDistributorCode}&jigsawCode=${userStore.jigsawCode}`,
        imageUrl:
          'https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/image/4fd7fbce79b14c7babe81bad6ecf7a7f.png',
      };
    });
  });
  onUnload(() => {
    buttonPlayer.stopAnimation(true);
    boxPlayer.stopAnimation(true);
  });
</script>

<style scoped lang="scss">
  .mt-30 {
    margin-top: 30rpx;
  }
  .blindBox {
    position: relative;
    width: 750rpx;
    height: 1880rpx;
    .boxCanvas {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 750rpx;
      height: 750rpx;
    }

    .bg {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
    }

    .bg-area {
      width: 750rpx;
      height: 1880rpx;
      vertical-align: middle;
      padding-top: 50rpx;
    }

    .container {
      position: absolute;
      z-index: 9;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      .move-text {
        margin: auto;
        margin-top: 135rpx;
      }
      .lottery-button {
        display: flex;
        justify-content: center;
        margin-top: 340rpx;
        .img {
          width: 341rpx;
          height: 110rpx;
        }
      }

      .area {
        position: relative;
        height: 70rpx;
        margin-top: 80rpx;
        text-align: center;

        .bg {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 580rpx;
          height: 76rpx;
        }

        .text {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          line-height: 58rpx;
          font-size: 39rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 500;
          color: #ffffff;
          text-shadow: 0px 4rpx 1rpx rgba(0, 0, 0, 0.5);
        }
      }

      .li-wrap {
        margin-top: 28rpx;
        width: 656rpx;

        .li {
          margin-bottom: 20rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14rpx 20rpx;
          background: #ffffff;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          border: 2rpx solid #ffaa00;

          .left {
            display: flex;
            align-items: center;

            .rank-wrapper {
              position: relative;
              width: 80rpx;
              height: 80rpx;

              .img {
                position: absolute;
                left: 0;
                top: 0;
                width: 80rpx;
                height: 80rpx;
              }

              .text {
                position: absolute;
                left: 58%;
                top: 55%;
                transform: translate(-50%, -50%);
                font-size: 28rpx;
                font-family: Resource Han Rounded CN;
                font-weight: bold;
                color: #888888;
                line-height: 36rpx;
              }
            }

            .avtar {
              width: 60rpx;
              height: 60rpx;
              margin-left: 20rpx;
            }

            .name {
              margin-left: 10rpx;
              font-size: 28rpx;
              font-family: Resource Han Rounded CN;
              font-weight: 400;
              color: #333333;
              line-height: 36rpx;
            }
          }

          .right {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 166rpx;
            height: 89rpx;
            background: #ffffff;
            border-radius: 14rpx 14rpx 14rpx 14rpx;
            .top {
              font-size: 24rpx;
              font-family: Resource Han Rounded CN;
              font-weight: 400;
              color: #999999;
              line-height: 36rpx;
            }

            .bottom {
              font-size: 32rpx;
              font-family: Resource Han Rounded CN;
              font-weight: bold;
              color: #ff5c01;
              line-height: 36rpx;
            }
          }
        }
        .active {
          background: #ffea7d;
        }
      }

      .button-wrap {
        margin-top: 50rpx;
        display: flex;
        flex-direction: column;
      }
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
        /*position: relative;*/
        /*margin-top: 50rpx;*/
        /*width: 338rpx;*/
        /*height: 207rpx;*/
        /*.reward-bg {*/
        /*  width: 338rpx;*/
        /*  height: 207rpx;*/
        /*}*/
        /*.text {*/
        /*  font-size: 64rpx;*/
        /*  font-family: Resource Han Rounded CN;*/
        /*  font-weight: bold;*/
        /*  color: #ff5e01;*/
        /*}*/
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
    }
  }
</style>
