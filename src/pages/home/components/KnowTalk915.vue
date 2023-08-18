<template>
  <view class="know">
    <text class="title2">了解说客英语</text>
    <view class="content-wrap">
      <view class="img-wrap" @click="navigateTo('selfTextbook')">
        <img
            src="https://cos.talk915.com/data/image/d23909ec9b104881a967914ee840d604.png"
            class="item-img"
            alt=""
        />
        <text class="text">自研教材</text>
      </view>
      <view class="img-wrap" @click="navigateTo('fixedTeacher')">
        <img
            src="https://cos.talk915.com/data/image/ff957a0faf1e4764a7ed6d8f975c7802.png"
            class="item-img"
            alt=""
        />
        <text class="text">固定老师</text>
      </view>
    </view>
    <text class="title2">优秀外教</text>
    <view class="content-wrap">
      <view class="img-wrap" @click="navigateTo('globalTeacher')">
        <img
            src="https://cos.talk915.com/data/image/93dd45142a7e4d318334e34ed8ac0142.png"
            class="item-img"
            alt=""
        />
        <text class="text">全球师资</text>
      </view>
      <view class="img-wrap">
        <img
            src="https://cos.talk915.com/data/image/bfe6d494c51f43c3be3613af95eb0a33.png"
            class="item-img"
            alt=""
        />
        <text class="text">持证外教</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'KnowTalk915',
  methods: {
    navigateTo(name) {
      uni.navigateTo({
        url: `/subPackagesA/home/${name}`,
      });
    },
  }
}
</script>

<style scoped lang="scss">
.know{
  .title2 {
    display: block;
    margin-bottom: 20rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
    line-height: 42rpx;
  }

  .content-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 48rpx;
    .img-wrap {
      display: flex;
      flex-direction: column;

      .item-img {
        width: 330rpx;
        height: 200rpx;
      }

      .text {
        margin-top: 20rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #333333;
        line-height: 32rpx;
      }
    }
  }
}
</style>
