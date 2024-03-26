<template>
  <view class="details">
    <view class="record" v-if="isLogin">
      <view>本次活动您还有
        <text>{{detailData.surplusNum}}次</text>
        抽奖机会
      </view>
      <text class="btn" @click="inviteRecord">邀请明细</text>
    </view>
    <view class="contact" @click="openContact" v-if="detailData.createrPhone || detailData.createrWxCode">
      <view class="left">
        <image mode="widthFix" src="@/subPackagesB/static/lottery/kf.png" alt="" class="icon"/>
        <text>活动、奖品请联系: {{detailData.createrName}}</text>
      </view>
      <image mode="widthFix" src="@/subPackagesB/static/lottery/arrow.png" alt="" class="right"/>
    </view>
    <view class="card title2" v-if="myPrizeList.length>0">
      <view class="prize-wrap" v-for="(item,index) in myPrizeList" :key="index">
        <image mode="widthFix" :src="item.prizeImg" class="left" alt=""/>
        <view class="right">
          <text>{{item.prizeName}}</text>
          <text class="num">1份</text>
        </view>
      </view>
    </view>
    <view class="card title1">
      <view class="prize-wrap" style="align-items: center;" v-for="(item,index) in prizeInfoList" :key="index">
        <image mode="widthFix" :src="item.prizeImg" class="left" alt=""/>
        <view class="right">
          <text>{{item.prizeName}}</text>
          <!--                  <span class="num">{{item.prizeTotalNum;}}份</span>-->
        </view>
      </view>
    </view>
    <view class="card title3">
      <view class="time-wrap">
        <view class="title">活动时间</view>
        <text class="text">活动时间：<br>{{detailData.activityTime}}</text>
        <text class="text">抽奖时间：<br>{{detailData.raffleTime}}</text>
      </view>
      <view class="time-wrap">
        <view class="title">活动说明</view>
        <rich-text :nodes="detailData.activityExplain" class="content text mb-5 line-height"></rich-text>
      </view>
    </view>
    <view class="explain">*本活动最终解释权归深圳青豆教育科技有限公司所有</view>
  </view>
</template>

<script>
export default {
  name: 'activityDetail',
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      }
    },
    prizeInfoList: {
      type: Array,
      default() {
        return [];
      }
    },
    myPrizeList: {
      type: Array,
      default() {
        return [];
      }
    },
    isLogin:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {};
  },
  methods: {
    inviteRecord(){
      uni.navigateTo({
        url: '/subPackagesA/personal/invitationDetail?pageType=1'
      })
    },
    openContact(){
      this.$emit('openContact')
    },
  }
};
</script>

<style scoped lang="scss">
  .details {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #FB5253;
    padding-bottom: 130rpx;

    .record {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 626rpx;
      height: 96rpx;
      background: #FFF2DA;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      font-size: 30rpx;
      font-weight: 400;
      color: #333333;
      padding: 0 30rpx;
      margin-bottom: 30rpx;

      text {
        font-size: 30rpx;
        color: #FB5253;
      }

      .btn {
        width: 145rpx;
        height: 56rpx;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        border: 1rpx solid #FB5253;
        font-size: 28rpx;
        color: #FB5253;
        line-height: 56rpx;
        text-align: center;
      }
    }

    .contact {
      background: #FFF2DA;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      width: 626rpx;
      height: 96rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30rpx;
      margin-bottom: 54rpx;

      .left {
        display: flex;
        align-items: center;

        .icon {
          width: 48rpx;
          height: 48rpx;
          margin-right: 16rpx;
        }

        text {
          font-size: 28rpx;
          color: #333333;
        }
      }

      .right {
        width: 10rpx;
        height: 16rpx;
      }
    }

    .card {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      position: relative;
      width: 626rpx;
      min-height: 145rpx;
      background: #FFF2DA;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      border: 1rpx solid #FFFFFF;
      padding: 100rpx 30rpx 10rpx;
      margin-bottom: 54rpx;

      .prize-wrap {
        display: flex;
        align-content: center;
        padding-bottom: 44rpx;

        .left {
          width: 100rpx;
          height: 100rpx;
          margin-right: 20rpx;
          border-radius: 8rpx;
        }

        .right {
          display: flex;
          flex-direction: column;
          width: 170rpx;
          font-size: 30rpx;
          color: #333333;
          line-height: 34rpx;

          .num {
            align-self: baseline;
            padding: 0 10rpx;
            height: 28rpx;
            background: rgba(255, 87, 55, 0.1);
            border-radius: 60rpx 60rpx 60rpx 60rpx;
            font-size: 22rpx;
            color: #FF5737;
            line-height: 28rpx;
            text-align: center;
            margin-top: 8rpx;
          }
        }
      }

      .time-wrap {
        margin-top: 40rpx;

        .title {
          width: 168rpx;
          height: 54rpx;
          background: #FB5843;
          border-radius: 0 60rpx 60rpx 0;
          font-size: 30rpx;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 54rpx;
          text-align: center;
        }

        .text {
          display: inline-block;
          font-size: 30rpx;
          font-weight: 400;
          color: #333333;
          line-height: 38rpx;
          margin-top: 24rpx;
          margin-bottom: 20rpx;
          img {
            width: 100%;
          }
        }

        .line-height {
          line-height: 1.4em;
        }

        .mb-50 {
          margin-bottom: 50rpx;
        }
      }
    }

    .title1 {
      &:before {
        position: absolute;
        top: -5rpx;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        width: 308rpx;
        height: 55rpx;
        background: url(@/subPackagesB/static/lottery/title.png) center no-repeat;
        background-size: cover;
      }
    }

    .title2 {
      &:before {
        position: absolute;
        top: -5rpx;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        width: 308rpx;
        height: 55rpx;
        background: url(@/subPackagesB/static/lottery/title2.png) center no-repeat;
        background-size: cover;
      }
    }

    .title3 {
      &:before {
        position: absolute;
        top: -5rpx;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        width: 308rpx;
        height: 55rpx;
        background: url(@/subPackagesB/static/lottery/title3.png) center no-repeat;
        background-size: cover;
      }
    }

    .explain {
      text-align: center;
      font-size: 20rpx;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.4);
      margin-top: -24rpx;
      margin-bottom: 60rpx;
    }
  }
</style>
