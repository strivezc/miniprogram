<template>
  <myPopup ref="popup" type="center">
    <view class="wrapper">
      <template v-if="status">
        <view class="success-wrap centerSP">
          <image mode="widthFix" src="https://cos.talk915.com/data/image/3f5e6e9af8f5436b9683a80a86c9615f.png" class="frame"/>
          <image mode="widthFix" src="https://cos.talk915.com/data/image/a624ede35fc8432eab4de1c1c4fb8603.png" class="prize centerSP"/>
          <image mode="widthFix" :src="productIcon" class="prizeIcon centerSP"/>
          <view class="prizeName centerSP">{{productName}}</view>
          <view class="btn-group">
            <view class="left" @click="close">返回抽奖首页</view>
<!--            <view class="right" @click="openRecord">查看奖品</view>-->
          </view>
          <view class="text centerSP">课时、黄金会员奖品系统将在7个工作日内自动发放 实物奖品平台将在7个工作日通过快递发放 可联系客服或学习顾问沟通信息</view>
        </view>
      </template>
      <template v-else>
        <image mode="widthFix" src="https://cos.talk915.com/data/image/86f619376ef944448e2f677f74b8d5e5.png" class="noPrize centerSP"/>
        <view class="goBack centerSP" @click="close">返回抽奖首页</view>
      </template>
    </view>
  </myPopup>
</template>

<script>
import myPopup from '@/components/MyPopup';
export default {
  name: 'result',
  components:{myPopup},
  props: {
    status: {
      type: Boolean,
      default: false
    },
    productName: {
      type: String,
      default: ''
    },
    productIcon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    open(){
      this.$refs.popup.open()
    },
    close(){
      this.$refs.popup.close()
    },
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  .noPrize {
    position: absolute;
    top: 430rpx;
    width: 410rpx;
    height: 377rpx;
  }

  .goBack {
    position: absolute;
    top: 848rpx;
    width: 377rpx;
    height: 60rpx;
    background: #FFFFFF;
    border-radius: 30rpx 30rpx 30rpx 30rpx;
    border: 1rpx solid #FFFFFF;
    text-align: center;
    font-size: 28rpx;
    color: #0087FF;
    line-height: 60rpx;
  }

  .success-wrap {
    position: absolute;
    top: 260rpx;

    .frame {
      width: 730rpx;
      height: 740rpx;
      animation: changeright 8s linear infinite;
    }

    .prize {
      position: absolute;
      top: 82rpx;
      width: 500rpx;
      height: 500rpx;
    }

    .prizeIcon {
      position: absolute;
      top: 241rpx;
      width: 192rpx;
      height: 192rpx;
    }

    .prizeName {
      position: absolute;
      top: 450rpx;
      font-size: 36rpx;
      line-height: 51rpx;
      font-weight: 500;
      color: #FFFFFF;
      word-wrap: break-word;
      text-align: center;
    }

    .btn-group {
      position: absolute;
      top: 612rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;

      .left {
        padding: 0 26rpx;
        height: 60rpx;
        background: #FFFFFF;
        border-radius: 30rpx 30rpx 30rpx 30rpx;
        border: 1rpx solid #FFFFFF;
        font-size: 28rpx;
        color: #0087FF;
        line-height: 60rpx;
      }

      .right {
        padding: 0 38rpx;
        margin-left: 24rpx;
        height: 60rpx;
        background: #0087FF;
        border-radius: 30rpx 30rpx 30rpx 30rpx;
        font-size: 28rpx;
        color: #FFFFFF;
        line-height: 60rpx;
      }
    }

    .text {
      position: absolute;
      top: 712rpx;
      text-align: center;
      width: 450rpx;
      font-size: 24rpx;
      color: #FFFFFF;
      line-height: 40rpx;
    }
  }

  @keyframes changeright {

    0% {
      -webkit-transform: rotate(0deg);
    }

    50% {
      -webkit-transform: rotate(180deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
    }
  }


}
</style>
