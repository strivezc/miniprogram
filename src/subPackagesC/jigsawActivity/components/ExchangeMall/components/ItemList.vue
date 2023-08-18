<template>
  <view class="container">
    <scroll-view
      class="itemList"
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
          <image
            src="@/subPackagesC/static/jigsaw/element/element-timepic.png"
            class="icon"
          ></image>
          <view class="num-wrap">{{ item.shopNum }}份</view>
        </view>
        <view class="right">
          <view class="title">{{ item.waresName }}</view>
          <view class="text">消耗奇奇币: -{{ item.qiqiPrice }}</view>
          <view class="date">兑换日期:{{ item.exchangeTime }}</view>
        </view>
      </view>
      <uni-load-more :status="state.status" color="#999999"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script setup>
  import JigsawService from '@/api/JigsawService';

  const state = reactive({
    allPage: null,
    status: 'more',
    _freshing: false,
    triggered: false,
    list: [],
    listQuery: {
      currPage: 1,
      pageSize: 10,
    },
  });

  const initScrollData = () => {
    state._freshing = false;
    setTimeout(() => {
      state.triggered = true;
    });
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
  const getData = async (refresh) => {
    try {
      const params = {
        ...state.listQuery,
        queryType: 1,
      };
      const { resultData, totalCount } = await JigsawService.queryHaveWares(params);
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

  defineExpose({ initScrollData });
</script>

<style scoped lang="scss">
  .itemList {
    height: 776rpx;
    box-sizing: border-box;

    .li {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: #ffffff;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin-bottom: 20rpx;

      .left {
        position: relative;
        width: 120rpx;
        height: 120rpx;
        margin-right: 18rpx;
        .icon {
          width: 120rpx;
          height: 120rpx;
        }
        .num-wrap {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          background: rgba(255, 92, 1, 0.8);
          width: 45rpx;
          height: 30rpx;
          border-radius: 12rpx 0 12rpx 0;
          text-align: center;
          font-size: 18rpx;
          font-family: Resource Han Rounded CN;
          font-weight: bold;
          color: #ffffff;
          line-height: 30rpx;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        .title {
          font-size: 28rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 500;
          color: #333333;
          line-height: 28rpx;
        }
        .text {
          font-size: 24rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 400;
          color: #ffaa00;
          line-height: 28rpx;
          margin-top: 18rpx;
        }
        .date {
          font-size: 24rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 400;
          color: #999999;
          line-height: 28rpx;
          margin-top: 20rpx;
        }
      }
    }
  }
</style>
