<template>
  <view class="container">
    <view class="title-bg">
      <image src="@/subPackagesC/static/jigsaw/element/bg-title-red.png" class="bg"></image>
      <view class="avtar centerSPCZ my-select">
        <uni-data-select
          v-model="state.regionId"
          :localdata="state.regionList"
          @change="changeSelect"
          :clear="false"
        ></uni-data-select>
      </view>
    </view>
    <scroll-view
      class="rewardRecord"
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
        <image v-if="state.regionId === 0" :src="getImg(item.prizeDate)" class="left"></image>
        <image v-else :src="item.prizeImg" class="left"></image>
        <view class="right">
          <template v-if="state.regionId === 0">
            <view v-if="item.prizeType === 0">奖品类型：拼图道具</view>
            <view v-else-if="item.prizeType === 1">奖品类型：奇奇币</view>
            <view
              >奖品名称：<text class="active" v-if="item.prizeDate === 1"
                >透视道具x{{ item.numOfPrize }}</text
              >
              <text class="active" v-else-if="item.prizeDate === 2"
                >重置道具x{{ item.numOfPrize }}</text
              >
              <text class="active" v-else-if="item.prizeDate === 3"
                >时间道具x{{ item.numOfPrize }}</text
              >
              <text class="active" v-else>奇奇币x{{ item.numOfPrize }}</text>
            </view>
            <view>发放时间：{{ item.provideTime }}</view>
          </template>
          <template v-else>
            <view>内容分类：{{ item.contentName }}</view>
            <view>奖品类型：{{ formatPrizeType(item.prizeType) }}</view>
            <view
              >奖品名称：<text class="active">{{ item.prizeName }}</text></view
            >
            <view>抽奖时间：{{ item.prizeTime }}</view>
          </template>
        </view>
        <image class="order-bg" src="@/subPackagesC/static/jigsaw/element/bg-list.png"></image>
        <text class="order-text" v-if="state.regionId === 0">系统发放</text>
        <text class="order-text" v-else>第{{ item.contentBarrierSort }}关</text>
      </view>
      <uni-load-more :status="state.status" color="#999999"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script setup>
  import JigsawService from '@/api/JigsawService';
  import iconImg from '@/subPackagesC/static/jigsaw/element/icon.png';
  import resetImg from '@/subPackagesC/static/jigsaw/element/element-reset.png';
  import timeImg from '@/subPackagesC/static/jigsaw/element/element-timepic.png';
  import xrayedImg from '@/subPackagesC/static/jigsaw/element/element-xrayed.png';

  function getImg(type) {
    if (type === 1) {
      return xrayedImg;
    } else if (type === 2) {
      return resetImg;
    } else if (type === 3) {
      return timeImg;
    } else {
      return iconImg;
    }
  }

  const props = defineProps({
    regionId: {
      type: Number,
    },
  });
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
    regionId: '',
    regionList: [],
  });

  const initScrollData = () => {
    state.regionId = props.regionId;
    state._freshing = false;
    setTimeout(() => {
      state.triggered = true;
    });
    getRegionList();
  };
  const onRefresh = () => {
    if (state._freshing) return;
    state._freshing = true;

    state.listQuery.currPage = 1;
    getData(true);
    console.log('刷新数据');
  };
  const onRestore = () => {
    state.triggered = 'restore';
    console.log('onRestore');
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
  const getRegionList = async () => {
    try {
      const { resultData } = await JigsawService.prizeRecordDown();
      state.regionList = resultData.map((item) => {
        return {
          value: item.regionId,
          text: item.regionName,
        };
      });
      state.regionList.push({
        value: 0,
        text: '系统发放奖励',
      });
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const getData = async (refresh) => {
    try {
      console.log(state.regionId, 'state.regionId');
      const params = {
        regionId: state.regionId,
        ...state.listQuery,
      };
      console.log(params, 'params');
      const { resultData, totalCount } = await JigsawService.jigsawPrize(params);
      if (state.listQuery.currPage === 1) {
        state.list = resultData;
        if (refresh) {
          //刷新完重置状态
          state.triggered = false;
          state._freshing = false;
          // state.triggered = 'restore';
        }
      } else {
        state.list = state.list.concat(resultData);
      }
      state.allPage = Math.ceil(totalCount / state.listQuery.pageSize);
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
  const changeSelect = (e) => {
    console.log(e, 'e -select');
    state.regionId = e;
    state._freshing = false;
    setTimeout(() => {
      state.triggered = true;
    });
  };
  function formatPrizeType(type) {
    const obj = {
      1: '课时',
      2: '黄金会员',
      3: '奇奇币',
      4: '谢谢参与',
    };
    return obj[type];
  }

  defineExpose({ initScrollData });
</script>

<style scoped lang="scss">
  .container {
    .title-bg {
      position: relative;
      width: 100%;
      height: 145rpx;
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 145rpx;
      }
      .avtar {
        width: 400rpx;
        height: 61rpx;
        background: #cd572f;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        z-index: 9;
      }
    }

    .rewardRecord {
      padding: 22rpx;
      padding-top: 50rpx;
      box-sizing: border-box;
      height: 68vh;

      .li {
        position: relative;
        display: flex;
        align-items: center;
        padding-top: 42rpx;
        padding-right: 28rpx;
        padding-left: 24rpx;
        padding-bottom: 24rpx;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        border: 1rpx solid #efdf9e;
        margin-bottom: 54rpx;
        background: #faeeb2;
        margin-left: 7rpx;
        &:first-child {
          margin-top: 22rpx;
        }
        .left {
          width: 100rpx;
          height: 100rpx;
          background: #d9d9d9;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
        }

        .right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 26rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 400;
          color: #333333;
          line-height: 36rpx;
          text-align: left;
          margin-left: 25rpx;
          .active {
            color: #ff5e01;
          }
        }
        .order-bg {
          position: absolute;
          left: -7rpx;
          top: -24rpx;
          width: 146rpx;
          height: 56rpx;
        }
        .order-text {
          position: absolute;
          left: -7rpx;
          top: -24rpx;
          width: 146rpx;
          height: 56rpx;
          font-size: 26rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 44rpx;
          text-align: center;
        }
      }
    }
  }
</style>
