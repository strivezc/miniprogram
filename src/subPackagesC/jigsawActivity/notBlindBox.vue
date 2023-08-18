<template>
  <view class="blindBox" :class="state.mask ? 'tl-show' : ''">
    <image src="@/subPackagesC/static/jigsaw/element/bg-lottery2.png" class="bg-area"></image>
    <view class="container">
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
      @closeAction="state.mask = false"
    ></JigsawPopup>

    <JigsawPopup ref="result" :showClose="false" title="温馨提示" :isConfirm="false">
      <template #main>
        <view class="reward-wrap">
          <image
            mode="widthFix"
            :src="contentStore.completeInfo.prizeImg"
            class="barrier-img"
          ></image>
          <view class="confirm-text"
            >再次通关，恭喜获得：{{ contentStore.completeInfo.prizeName }}</view
          >
          <JsgsawButton
            singleText="确认"
            type="green"
            @handleAction="closePopupResult"
          ></JsgsawButton>
        </view>
      </template>
    </JigsawPopup>
  </view>
</template>

<script setup>
  import JigsawService from '@/api/JigsawService';
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
    normalTitle: '设置',
    normalContent: '退出拼图将退至小程序首页',
    mask: false,
  });
  const getUserRank = async () => {
    try {
      const { resultData } = await JigsawService.barrierUserRank(contentStore.jigsawData.barrierId);
      state.userRank = resultData;
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const getRankList = async () => {
    try {
      const { resultData } = await JigsawService.barrierRank(contentStore.jigsawData.barrierId);
      state.rankList = resultData;
    } catch (e) {
      console.log(e, 'error');
    }
  };

  const popup = ref();
  const continueGame = () => {
    contentStore.nextBarrierInto().then((resultData) => {
      if (resultData === 94) {
        state.normalTitle = '提示';
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
  const submitAction = () => {
    uni.reLaunch({
      url: '/subPackagesC/jigsawActivity/index',
    });
  };
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
  const result = ref();
  const closePopupResult = () => {
    result.value.close();
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
    getUserRank();
    getRankList();
    userStore.getJigsawCode('time');
    if (contentStore.completeInfo.passPrize === 0 && contentStore.completeInfo.prizeType === 1) {
      result.value.open();
    }
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
</script>

<style scoped lang="scss">
  .mt-30 {
    margin-top: 30rpx;
  }
  .blindBox {
    position: relative;
    width: 750rpx;
    height: 1539rpx;
    .bg-area {
      width: 750rpx;
      height: 1539rpx;
      vertical-align: middle;
    }
    .container {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      .move-text {
        margin: auto;
        margin-top: 74rpx;
      }
      .area {
        position: relative;
        height: 70rpx;
        margin-top: 350rpx;
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
  .reward-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .barrier-img {
      max-width: 338rpx;
      height: auto;
      margin-top: 30rpx;
      margin-bottom: 40rpx;
    }
    .confirm-text {
      font-family: Resource Han Rounded CN;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      line-height: 36px;
      text-align: center;
      margin-bottom: 20rpx;
    }
  }
</style>
