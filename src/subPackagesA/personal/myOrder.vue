<template>
  <scroll-view
      class="voteRecord"
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
        <view class="title">{{ item.productName }}</view>
        <view class="tip" :class="{'tip-active':item.ostatus===1}">{{getStatus(item.ostatus)}}</view>
      </view>
      <view class="text-wrap mt-24">
        <view class="left">订单编号：</view>
        <view class="right">{{ item.oid }}</view>
      </view>
      <view class="text-wrap">
        <view class="left">下单时间：</view>
        <view class="right">{{ item.createTime }}</view>
      </view>
      <view class="price-wrap" v-if="item.ostatus===0 || item.ostatus===1">
        <view class="price">
          <view class="left" v-if="item.ostatus===0">已付：</view>
          <view class="left" v-else-if="item.ostatus===1">应付金额：</view>
          <view class="right">￥{{item.payMoney}}</view>
        </view>
      </view>
      <view class="btn-wrap" v-if="item.ostatus===1">
        <view class="btn-group">
          <view class="btn" @click="cancelOrder(item.oid)">取消</view>
          <view class="btn active" @click="payment(item)">立即支付</view>
        </view>
      </view>
    </view>
    <uni-load-more :status="status" color="#999999"></uni-load-more>
  </scroll-view>
</template>

<script>
import CommonService from '@/api/CommonService';
export default {
  name: 'myOrder',
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
    };
  },
  onLoad() {
    this._freshing = false;
    setTimeout(() => {
      this.triggered = true;
    });
  },
  methods: {
    payment(item){
      uni.navigateTo({
        url: `/subPackagesA/personal/paymentOrder?oid=${item.oid}&subject=${item.productName}&productId=${item.productId}&payMoney=${item.payMoney}`,
      });
    },
    cancelOrder(oid){
      let that=this
      uni.showModal({
        title: '提示',
        content: '是否确定取消此订单',
        confirmColor: '#0087FF',
        cancelColor: '#0087FF',
        success: function (res) {
          if (res.confirm) {
            CommonService.cancelOrder(oid).then(res=>{
              that._freshing = false;
              setTimeout(() => {
                that.triggered = true;
                uni.showToast({
                  title: '取消成功！',
                  icon: 'none',
                });
              });
            })
          }
        },
      });
    },
    getStatus(val) {
      if (val === 0) {
        return '已成功';
      } else if (val === 1) {
        return '等待付款';
      } else if (val === 2) {
        return '取消订单';
      } else if (val === 3) {
        return '未完成';
      } else if (val === 4) {
        return '被合并';
      }
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
        const { resultData,totalCount } = await CommonService.getOrderList(params);
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
  .voteRecord {
    padding: 0 30rpx;
    box-sizing: border-box;
    height: 95vh;
    background: #F9F9F9;
    .li {
      display: flex;
      flex-direction: column;
      padding: 34rpx 28rpx 16rpx 20rpx;
      background: #FFFFFF;
      box-shadow: 0rpx 6rpx 32rpx 0rpx rgba(69,104,124,0.04);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin-top: 20rpx;

      .title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 23rpx;
        border-bottom: 1rpx solid #eeeeee;
        .title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333333;
          line-height: 40rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 510rpx;
        }
        .tip {
          font-size: 24rpx;
          font-weight: 400;
          color: #333333;
          line-height: 33rpx;
        }
        .tip-active{
          color: #FF5E01;
        }
      }
      .btn-wrap{
        margin-top: 16rpx;
        padding-top: 23rpx;
        border-top: 1rpx solid #eeeeee;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-bottom: 6rpx;
        .btn-group{
          display: flex;
          align-items: center;
          .btn{
            width: 156rpx;
            height: 56rpx;
            border-radius: 8rpx;
            border: 1rpx solid #0087FF;
            font-size: 24rpx;
            font-weight: 400;
            color: #0087FF;
            line-height: 56rpx;
            text-align: center;
          }
          .active{
            background: #0087FF;
            color: #FFFFFF;
            border: 1rpx solid transparent;
            margin-left: 20rpx;
          }
        }
      }
      .price-wrap{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 24rpx;
        line-height: 40rpx;
        font-weight: 400;
        margin-top: 10rpx;
        /*padding-bottom: 16rpx;*/

        .price{
          display: flex;
          align-items: center;
          .left{
            color: #333300;
            line-height: 33rpx;
          }
          .right{
            font-size: 28rpx;
            line-height: 40rpx;
            font-weight: 400;
            color: #FF5E01;
          }
        }
      }
      .text-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 24rpx;
        line-height: 33rpx;
        font-weight: 400;
        margin-top: 10rpx;
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
      .mt-24{
        margin-top: 24rpx;
      }
    }
  }
</style>
