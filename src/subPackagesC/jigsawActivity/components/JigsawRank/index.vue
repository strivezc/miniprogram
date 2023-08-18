<template>
  <view class="container">
    <view class="text" v-if="state.haveSeason === 0"
      >赛季时间：{{ state.seasonStartTime }}--{{ state.seasonEndTime }}</view
    >
    <scroll-view
      class="jsgsawRank"
      scroll-y="true"
      :lower-threshold="50"
      @scrolltolower="scrollLower"
      refresher-enabled="true"
      :refresher-triggered="state.triggered"
      :refresher-threshold="50"
      refresher-background="transparent"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
    >
      <view class="li" v-for="(item, index) in state.list" :key="index">
        <view class="left">
          <view class="rank-wrapper">
            <image
              v-if="item.rank > 3"
              src="@/subPackagesC/static/jigsaw/element/element-rankno4.png"
              class="img"
            ></image>
            <image v-else :src="getIcon(item.rank)" class="img"></image>
            <text class="text">{{ item.rank > 3 ? item.rank : '' }}</text>
          </view>
          <image
            :src="
              item.userImg === 'default.jpg' || !item.userImg ? state.defaultImage : item.userImg
            "
            class="avater"
          ></image>
          <view class="name-wrap" :class="state.rankStatus === 0 ? 'type1' : ''">
            <text class="name" :class="state.rankStatus === 0 ? 'name2' : ''">{{
              item.userName
            }}</text>
            <text class="content" v-if="state.rankStatus === 1"
              >{{ item.contentName }} 第{{ item.barrierSort }}关</text
            >
          </view>
        </view>
        <view class="right">
          <text class="top">{{ state.rankStatusText }}</text>
          <text class="bottom">{{ item.passBarriers }}</text>
        </view>
      </view>
      <uni-load-more :status="state.status" color="#999999"></uni-load-more>
    </scroll-view>
    <view class="last-li" v-if="state.userData.rank">
      <view class="left my-name">
        <view class="rank-wrapper">
          <image
            v-if="state.userData.rank > 3"
            src="@/subPackagesC/static/jigsaw/element/element-rankno4.png"
            class="img"
          ></image>
          <image v-else :src="getIcon(state.userData.rank)" class="img"></image>
          <text class="text">{{ state.userData.rank > 3 ? state.userData.rank : '' }}</text>
        </view>
        <image
          :src="
            state.userData.userImg === 'default.jpg' || !state.userData.userImg
              ? state.defaultImage
              : state.userData.userImg
          "
          class="avater"
        ></image>
        <view class="name-wrap" :class="state.rankStatus === 0 ? 'type1' : ''">
          <text class="name" :class="state.rankStatus === 0 ? 'name2' : ''">{{
            state.userData.userName
          }}</text>
          <text class="content" v-if="state.rankStatus === 1"
            >{{ state.userData.contentName }} 第{{ state.userData.barrierSort }}关</text
          >
        </view>
      </view>
      <view class="right">
        <text class="top">{{ state.rankStatusText }}</text>
        <text class="bottom">{{ state.userData.passBarriers }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  import JigsawService from '@/api/JigsawService';
  import img1 from '@/subPackagesC/static/jigsaw/element/element-rankno1.png';
  import img2 from '@/subPackagesC/static/jigsaw/element/element-rankno2.png';
  import img3 from '@/subPackagesC/static/jigsaw/element/element-rankno3.png';
  import img4 from '@/subPackagesC/static/jigsaw/element/element-rankno4.png';
  import defaultImage from '@img/default.png';
  import {useUserStore} from '@/store';

  const userStore = useUserStore();
  const state = reactive({
    height: '',
    allPage: null,
    status: 'more',
    _freshing: false,
    triggered: false,
    list: [],
    listQuery: {
      currPage: 1,
      pageSize: 10,
    },
    userData: {},
    defaultImage,
    rankStatus: null,
    haveSeason: null,
    seasonStartTime: null,
    seasonEndTime: null,
    rankStatusText: '通关次数',
  });

  const initScrollData = () => {
    state._freshing = false;
    setTimeout(() => {
      state.triggered = true;
    });
    getUserData();
    getRankStatus();
  };
  const onRefresh = () => {
    if (state._freshing) return;
    state._freshing = true;

    state.listQuery.currPage = 1;
    getData(true);
  };
  const onRestore = () => {
    state.triggered = 'restore';
  };
  const scrollLower = () => {
    if (state.listQuery.currPage >= state.allPage) {
      state.status = 'noMore';
      return;
    } else {
      state.status = 'loading';
    }
    state.listQuery.currPage++;
    getData();
    console.log('我滚动到底部了');
  };
  const getUserData = async () => {
    try {
      const { resultData } = await JigsawService.userHomeRank();
      state.userData = resultData;
    } catch (e) {
      if (e.resultCode === -1) {
        userStore.resetToken()
      }
    }
  };
  const getRankStatus = async () => {
    try {
      const { resultData } = await JigsawService.queryRankStatus();
      state.rankStatus = resultData.rankStatus;
      state.haveSeason = resultData.haveSeason;
      state.seasonStartTime = resultData.seasonStartTime;
      state.seasonEndTime = resultData.seasonEndTime;
      if (state.rankStatus === 0) {
        state.rankStatusText = '通关次数';
      } else {
        state.rankStatusText = '通关总数';
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const getData = async (refresh) => {
    try {
      const { resultData, totalCount } = await JigsawService.homeleaderboard(state.listQuery);
      if (state.listQuery.currPage === 1) {
        state.list = resultData;
        if (refresh) {
          //刷新完重置状态
          state.triggered = false;
          state._freshing = false;
        }
      } else {
        state.list = state.list.concat(resultData);
      }
      state.allPage = Math.ceil(totalCount / state.listQuery.pageSize);
      console.log(state.allPage, 'state.allPage');
      if (state.allPage <= 1) {
        state.status = 'noMore';
      }
    } catch (e) {
      if (refresh) {
        //刷新完重置状态
        state.triggered = false;
        state._freshing = false;
      }
    }
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

  defineExpose({ initScrollData });
</script>

<style scoped lang="scss">
  .container {
    position: relative;
  }

  .text {
    padding-top: 24rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: #d05931;
    line-height: 26rpx;
    text-align: center;
  }
  .jsgsawRank {
    padding: 31rpx;
    height: 70vh;
    width: calc(100% - 64rpx);
    padding-bottom: 60rpx;
    padding-top: 24rpx;
  }

  .li,
  .last-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 10rpx 10rpx 20rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    border: 2rpx solid #ffaa00;
    margin-bottom: 20rpx;

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

      .name-wrap {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 60rpx;
        .name {
          font-size: 28rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 500;
          color: #333333;
          line-height: 36rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 164rpx;
        }
        .content {
          font-size: 20rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 500;
          color: #ffaa00;
          line-height: 20rpx;
          max-width: 164rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name2 {
          font-size: 30rpx;
        }
      }
      .type1 {
        justify-content: center;
      }
      .avater {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-left: 20rpx;
        margin-right: 16rpx;
      }
    }
    .my-name {
      position: relative;
      &:before {
        position: absolute;
        top: -36rpx;
        left: -22rpx;
        display: block;
        content: '我当前排名';
        width: 130rpx;
        height: 31rpx;
        background: #ff5e01;
        border-radius: 16rpx 16rpx 16rpx 0rpx;
        font-size: 22rpx;
        font-family: Resource Han Rounded CN;
        font-weight: 500;
        color: #ffffff;
        line-height: 31rpx;
        text-align: center;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 126rpx;
      height: 89rpx;
      background: #ffffff;
      border-radius: 14rpx 14rpx 14rpx 14rpx;

      .top {
        margin-top: 8rpx;
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

  .last-li {
    position: absolute;
    bottom: 0;
    background: #ffea7d;
    width: 496rpx;
    margin-left: 32rpx;
    margin-right: 32rpx;
    margin-bottom: 0;
  }

  .active {
    background: #ffea7d;
  }
</style>
