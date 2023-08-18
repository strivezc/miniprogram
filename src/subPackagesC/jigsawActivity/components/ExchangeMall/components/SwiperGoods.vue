<template>
  <swiper
    class="swiper"
    :style="props.isQiqiShop ? 'height:676rpx' : 'height:596rpx'"
    indicator-color="#C08000"
    indicator-active-color="#55291B"
    :indicator-dots="true"
    :duration="500"
    @change="changeCurrent"
  >
    <swiper-item v-for="(item, index) in swipeList" :key="index" class="swiper-item">
      <view
        class="item"
        :class="[
          state.activeId === item2.waresId || state.activeId === item2.detailsId ? 'active' : '',
          props.isQiqiShop ? '' : 'notQiqiShop',
        ]"
        v-for="item2 in item"
        :key="item2.waresId || item2.detailsId"
        @click.stop="handleItem(item2)"
      >
        <image :src="item2.waresImg" lazy-load class="icon"></image>
        <view class="num-wrap" v-if="state.waresType === 2 || state.waresType === 3"
          >{{ item2.waresNumOrTime }}份</view
        >
        <view class="exchangeNumberOrDate" v-if="state.waresType === 0">
          <text v-if="item2.waresValidityTime == 0">即将过期</text>
          <text v-else>有效期:{{ item2.waresNumOrTime || item2.waresValidityTime }}天</text>
        </view>
        <view class="exchangeNumberOrDate" v-else>限购{{ item2.exchangeNumber }}次</view>
        <image
          src="@/subPackagesC/static/jigsaw/element/bg-ticket.png"
          v-if="state.activeId === item2.waresId || state.activeId === item2.detailsId"
          class="check-icon"
        ></image>
        <text class="text">{{ item2.waresName }}</text>
        <view class="coin-wrap" v-if="props.isQiqiShop">
          <image src="@/subPackagesC/static/jigsaw/element/bg_coin.png" class="left"></image>
          <text class="right">{{ item2.qiqiPrice }}</text>
        </view>
      </view>
    </swiper-item>
  </swiper>
</template>

<script setup>
  import { splitArr } from '@/utils';
  import JigsawService from '@/api/JigsawService';

  const props = defineProps({
    isQiqiShop: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(['clickItem']);

  let pageSize = 6;
  const state = reactive({
    waresType: 0,
    queryType: 0,
    activeId: null,
    list: [],
    listQuery: {
      currPage: 1,
      pageSize: 1,
    },
    totalCount: 0,
    currentArr: [0, 1], // 轮播图角标，默认请求3页
  });

  const swipeList = computed(() => {
    const swiperDotsNum = Math.ceil(state.totalCount / pageSize);
    let list = splitArr(state.list, pageSize);
    const differNum = swiperDotsNum - list.length;
    if (differNum > 0) {
      for (let i = 0; i < differNum; i++) {
        list.push([]);
      }
    }
    return list;
  });

  const handleItem = (item) => {
    state.activeId = item.waresId || item.detailsId;
    emit('clickItem', item);
  };
  const changeCurrent = (e) => {
    console.log(e.detail.current, 'changeCurrent');
    getList({ isInit: false, current: e.detail.current });
  };
  const getList = async ({ isInit, current, waresType }) => {
    const apiName = props.isQiqiShop ? 'queryQiqiShop' : 'queryHaveWares';
    console.log(isInit, 'isInit');
    if (isInit) {
      // 数据初始化
      let params = {};
      state.listQuery.currPage = 1;
      state.listQuery.pageSize = pageSize * 3;
      if (props.isQiqiShop) {
        state.waresType = (waresType ?? '') === '' ? 0 : waresType;
        params = {
          waresType: state.waresType,
          ...state.listQuery,
        };
      } else {
        state.queryType = (waresType ?? '') === '' ? 0 : waresType;
        params = {
          queryType: state.queryType,
          ...state.listQuery,
        };
      }
      const { resultData, totalCount } = await JigsawService[apiName](params);
      state.totalCount = totalCount;
      state.list = resultData;
    } else {
      // 翻页
      if (!state.currentArr.includes(current)) {
        if (current + 1 === Math.ceil(state.totalCount / pageSize)) return; //没有最后一页就return
        state.listQuery.currPage = current + 2;
        state.listQuery.pageSize = pageSize;
        const { resultData, totalCount } = await JigsawService[apiName](state.listQuery);
        state.totalCount = totalCount;
        state.list = state.list.concat(resultData);
        state.currentArr.push(current);
      }
    }
  };
  const resetData = () => {
    state.activeId = null;
    state.list = [];
    state.listQuery = {
      currPage: 1,
      pageSize: 1,
    };
    state.totalCount = 0;
    state.currentArr = [0, 1];
  };

  defineExpose({ getList, resetData });
</script>

<style scoped lang="scss">
  .swiper {
    width: 600rpx;
    /*min-height: 386rpx;*/
    height: 676rpx;
    .swiper-item {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 14rpx 0 14rpx 0;
        align-items: center;
        position: relative;
        width: 178rpx;
        height: 260rpx;
        margin-bottom: 30rpx;
        border: 4rpx solid #ffffff;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        background: #ffffff;
        .num-wrap {
          position: absolute;
          z-index: 1;
          top: 16rpx;
          left: 15rpx;
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
        .exchangeNumberOrDate {
          position: absolute;
          z-index: 1;
          top: 132rpx;
          left: 15rpx;
          width: 150rpx;
          height: 32rpx;
          background: rgba(255, 92, 1, 0.8);
          border-radius: 0 0 8rpx 8rpx;
          font-size: 20rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 500;
          color: #ffffff;
          line-height: 32rpx;
          text-align: center;
        }
        &:nth-child(3n + 2) {
          margin-left: 15rpx;
          margin-right: 15rpx;
        }
        .icon {
          /*margin-top: 16rpx;*/
          width: 150rpx;
          height: 150rpx;
          border-radius: 8rpx;
        }
        .text {
          /*margin-top: 6rpx;*/
          font-size: 26rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 500;
          color: #000000;
          line-height: 28rpx;
          text-align: center;
          display: block;
          width: 150rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .coin-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          /*margin-top: 10rpx;*/
          .left {
            width: 39rpx;
            height: 36rpx;
          }
          .right {
            margin-left: 5rpx;
            font-size: 32rpx;
            font-family: Resource Han Rounded CN;
            font-weight: 500;
            color: #ff5e01;
          }
        }
        .check-icon {
          position: absolute;
          right: 0;
          top: 0;
          width: 64rpx;
          height: 64rpx;
        }
      }
      .notQiqiShop {
        height: 243rpx;
      }
      .active {
        border: 4rpx solid #ffaa00;
      }
    }
  }
</style>
