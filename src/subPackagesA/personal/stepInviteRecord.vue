<template>
  <scroll-view
      class="stepInviteRecord"
      scroll-y="true"
      :show-scrollbar="false"
      :lower-threshold="50"
      @scrolltolower="scrollLower"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      :refresher-threshold="50"
      refresher-background="transparent"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
  >
    <view class="li" v-for="(item, index) in list" :key="index">
      <view class="title">{{item.prizeName}}</view>
      <view class="label-wrap">
        <text>领取条件</text>
        <text class="text">邀新达到{{item.inviteLimitsNum}}人</text>
      </view>
      <view class="label-wrap">
        <text>领取时间</text>
        <text class="text">{{item.getPrizeTime}}</text>
      </view>
      <image class="icon" src="@/subPackagesA/images/received.png"></image>
    </view>
    <uni-load-more :status="status" color="#999999"></uni-load-more>
  </scroll-view>
</template>

<script>
import StepTaskService from '@/api/StepTaskService';

export default {
  name: 'stepInviteRecord',
  data() {
    return {
      status: 'more',
      _freshing: false,
      triggered: false,
      list: [],
      listQuery: {
        currPage: 1,
        pageSize: 10,
      },
    };
  },
  // onLoad() {
  //   this._freshing = false;
  //   setTimeout(() => {
  //     this.triggered = true;
  //   });
  // },
  methods: {
    initScrollData () {
      this._freshing = false;
      setTimeout(() => {
        this.triggered = true;
      });
    },
    onRefresh() {
      if (this._freshing) return;
      this._freshing = true;

      this.listQuery.currPage = 1;
      this.getData(true);
    },
    onRestore() {
      this.triggered = 'restore';
      console.log('onRestore');
    },
    scrollLower() {
      if (this.listQuery.currPage >= this.allPage) {
        this.status = 'noMore';
        return;
      } else {
        this.status = 'loading';
      }
      this.listQuery.currPage++;
      this.getData();
      console.log('我滚动到底部了');
    },
    async getData(refresh) {
      try {
        const params = {
          ...this.listQuery,
        };
        const { resultData, totalCount } = await StepTaskService.queryStepInvitePrize(params);
        if (this.listQuery.currPage === 1) {
          this.list = resultData;
          if (refresh) {
            //刷新完重置状态
            this.triggered = false;
            this._freshing = false;
          }
        } else {
          this.list = this.list.concat(resultData);
        }
        this.allPage = Math.ceil(totalCount / this.listQuery.pageSize);
        if (this.allPage <= 1) {
          this.status = 'noMore';
        }
      } catch (e) {
        console.log(e, 'error');
        if (refresh) {
          //刷新完重置状态
          this.triggered = false;
          this._freshing = false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .stepInviteRecord {
    height: calc( 100vh - 98rpx - env(safe-area-inset-bottom) );
    box-sizing: border-box;
    padding:30rpx 32rpx;
    .li {
      position: relative;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
      box-shadow: 0rpx 6rpx 32rpx 0rpx rgba(69,104,124,0.04);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      padding: 32rpx;
      text-align: left;
      margin-bottom: 20rpx;
      .title{
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        line-height: 40rpx;
        padding-bottom: 24rpx;
        border-bottom: 1rpx solid #EEEEEF;
      }
      .label-wrap{
        margin-top: 30rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
        line-height: 28rpx;
        .text{
          color:#666666;
          padding-left: 33rpx;
        }
      }
      .icon{
        position: absolute;
        width: 117rpx;
        height: 118rpx;
        right: 32rpx;
        bottom: 14rpx;
      }
    }
  }
</style>
