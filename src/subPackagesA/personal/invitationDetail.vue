<template>
  <scroll-view
      class="invitationDetail"
      scroll-y="true"
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
      <view class="title-wrap">
        <view class="title">{{ item.phone }}</view>
        <view class="tip">新用户</view>
      </view>
      <view class="text-wrap">
        <view class="left">注册时间：</view>
        <view class="right">{{ item.createTime }}</view>
      </view>
      <view class="text-wrap">
        <view class="left">是否试听：</view>
        <view class="right" :class="item.attendClass == 1 ? 'blue' : ''">{{
          item.attendClass == 1 ? '已试听' : '未试听'
          }}</view>
      </view>
    </view>
    <uni-load-more :status="status" color="#999999"></uni-load-more>
  </scroll-view>
</template>

<script>
import LotteryService from '@/api/LotteryService'
import StepTaskService from '@/api/StepTaskService'

export default {
  name: 'invitationDetail',
  data() {
    return {
      height: '',
      status: 'more',
      _freshing: false,
      triggered: false,
      list: [],
      listQuery: {
        currPage: 1,
        pageSize: 10,
      },
      pageType:'1'
    };
  },
  onLoad(option) {
    console.log(option,'option')
    this.pageType=option.pageType
    this._freshing = false;
    setTimeout(() => {
      this.triggered = true;
    });
  },
  methods: {
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
        let func=null;
        if (this.pageType==='1') {
          func=LotteryService.appletRaffleInviteNewInfo
        } else {
          func=StepTaskService.queryInviteDetails
        }
        const { resultData,totalCount} = await func(params);
        const list = resultData;
        if (this.listQuery.currPage === 1) {
          this.list = list;
          if (refresh) {
            //刷新完重置状态
            this.triggered = false;
            this._freshing = false;
          }
        } else {
          this.list = this.list.concat(list);
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
  .invitationDetail {
    padding: 0 32rpx;
    box-sizing: border-box;
    height: 95vh;
    background: #F9F9F9;
    .li {
      display: flex;
      flex-direction: column;
      padding: 32rpx;
      background: #FFFFFF;
      box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(219,219,219,0.5);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin-top: 21rpx;

      .title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-size: 36rpx;
          font-weight: bold;
          color: #333333;
          line-height: 36rpx;
        }
        .tip {
          width: 80rpx;
          height: 30rpx;
          background: rgba(0, 135, 255, 0.2);
          border-radius: 8rpx 8rpx 8rpx 8rpx;
          font-size: 20rpx;
          font-weight: 400;
          color: #0087ff;
          line-height: 30rpx;
          text-align: center;
        }
      }

      .text-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 24rpx;
        line-height: 24rpx;
        margin-top: 24rpx;
        font-weight: 400;

        .left {
          /*width: 106rpx;*/
          color: #999999;
        }

        .right {
          /*margin-left: 30rpx;*/
          color: #999999;
        }
        .blue {
          color: #0087ff;
        }
      }
    }
  }
</style>
