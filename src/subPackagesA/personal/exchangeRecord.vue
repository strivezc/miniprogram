<template>
  <scroll-view
    class="voteRecord"
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
      <view class="left">
        <view class="title">积分兑换优币活动</view>
        <view class="text">兑换时间：{{ item.exchangeTime }}</view>
        <view class="text">消耗积分：{{ item.consumeScore }}</view>
        <view class="text">剩余积分：{{ item.residueScore }}</view>
      </view>
      <view class="right">
        <view class="title">+{{ item.exchangeUCoin }}优币</view>
        <view class="text">{{ item.targetPhone }}</view>
      </view>
    </view>
    <uni-load-more :status="status" color="#999999"></uni-load-more>
  </scroll-view>
</template>

<script>
  import UserService from '@/api/UserService';

  export default {
    name: 'voteRecord',
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
    onLoad() {
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
          const { resultData, totalCount } = await UserService.queryUserScoreExchangeRecord(params);
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
  .voteRecord {
    height: 95vh;
    box-sizing: border-box;
    .li {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 30rpx 32rpx 30rpx 40rpx;
      border-bottom: 1rpx solid #eeeeee;
      .left {
        display: flex;
        flex-direction: column;
        .title {
          font-size: 28rpx;
          font-weight: 500;
          color: #333333;
          line-height: 39rpx;
        }
        .text {
          margin-top: 10rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #999999;
          line-height: 32rpx;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        .title {
          font-size: 36rpx;
          font-weight: 500;
          color: #ffb414;
          line-height: 42rpx;
        }
        .text {
          font-size: 24rpx;
          font-weight: 400;
          color: #999999;
          line-height: 32rpx;
        }
      }
    }
  }
</style>
