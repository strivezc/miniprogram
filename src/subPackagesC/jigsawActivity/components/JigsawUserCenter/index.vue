<template>
  <view class="container">
    <view class="title-bg">
      <image src="@/subPackagesC/static/jigsaw/element/bg-title-red.png" class="bg"></image>
      <image
        :src="userInfo.userImg === 'default.jpg' ? defaultImg : userInfo.userImg"
        class="avtar centerSPCZ"
      ></image>
    </view>
    <view class="name">{{ userInfo.userName }}</view>
    <view class="date">于{{ userInfo.createTime }}诞生</view>
    <view class="record-wrapper">
      <view class="item">
        <image
          src="@/subPackagesC/static/jigsaw/element/element-highrecord.png"
          class="left"
        ></image>
        <view class="right">
          <view class="title">累计通关</view>
          <view class="text">{{ userInfo.passBarriers }}关</view>
        </view>
      </view>
      <view class="item">
        <image src="@/subPackagesC/static/jigsaw/element/element-time.png" class="left"></image>
        <view class="right">
          <view class="title">今日成绩</view>
          <view class="text">{{ formatSecond(userInfo.todayTime) }}</view>
        </view>
      </view>
    </view>
    <view class="area">
      <image src="@/subPackagesC/static/jigsaw/element/bg-title2.png" class="bg"></image>
      <text class="text">所属地域</text>
    </view>
    <view class="area-content">
      <image :src="getAreaBg" class="area-bg"></image>
      <text class="text centerSPCZ">{{ userInfo.regionName }}</text>
    </view>
  </view>
</template>

<script setup>
  import JigsawService from '@/api/JigsawService';
  import areaBg1 from '@/subPackagesC/static/jigsaw/element/bg-pass1.png';
  import areaBg2 from '@/subPackagesC/static/jigsaw/element/bg-pass2.png';
  import areaBg3 from '@/subPackagesC/static/jigsaw/element/bg-pass3.png';
  import areaBg4 from '@/subPackagesC/static/jigsaw/element/bg-pass4.png';
  import areaBg5 from '@/subPackagesC/static/jigsaw/element/bg-pass5.png';
  import defaultImg from '@img/default.png';

  const userInfo = ref({});
  const getUserCenter = async () => {
    try {
      const { resultData } = await JigsawService.userCenter();
      userInfo.value = resultData;
    } catch (e) {
      console.log(e, 'error');
    }
  };
  const getAreaBg = computed(() => {
    const obj = {
      1: areaBg1,
      2: areaBg2,
      3: areaBg3,
      4: areaBg4,
      5: areaBg5,
    };
    if (userInfo.value.regionSort) {
      return obj[userInfo.value.regionSort];
    } else {
      return areaBg1;
    }
  });
  function formatSecond(second) {
    if ((second ?? '') === '') return '';
    let obj = {
      hour: null,
      minute: null,
      second: null,
    };
    const h = parseInt((second / 60 / 60) % 24);
    obj.hour = h < 10 ? '0' + h : h;
    const m = parseInt((second / 60) % 60);
    obj.minute = m < 10 ? '0' + m : m;
    const s = parseInt(second % 60);
    obj.second = s < 10 ? '0' + s : s;
    return `${obj.hour}:${obj.minute}:${obj.second}`;
  }

  defineExpose({ getUserCenter });
</script>

<style scoped lang="scss">
  .container {
    .title-bg {
      position: relative;
      width: 591rpx;
      height: 172rpx;
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 591rpx;
        height: 172rpx;
      }
      .avtar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background: #d3d3d3;
      }
    }
    .name {
      text-align: center;
      font-size: 36rpx;
      font-family: Resource Han Rounded CN;
      font-weight: bold;
      color: #333333;
      line-height: 36rpx;
      margin-top: 8rpx;
    }
    .date {
      text-align: center;
      font-size: 28rpx;
      font-family: Resource Han Rounded CN;
      font-weight: 400;
      color: #666666;
      line-height: 28rpx;
      margin-top: 8rpx;
    }
    .record-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32rpx;
      margin-top: 40rpx;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 215rpx;
        height: 101rpx;
        background: #ffea7d;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        border: 2rpx solid #ffaa00;
        padding: 0 15rpx;
        .left {
          width: 80rpx;
          height: 80rpx;
        }
        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-left: 20rpx;
          width: 120rpx;
          text-align: left;
          .title {
            width: 120rpx;
            font-size: 26rpx;
            font-family: Resource Han Rounded CN;
            font-weight: 500;
            color: #333333;
            line-height: 28rpx;
          }
          .text {
            width: 120rpx;
            margin-top: 7rpx;
            font-size: 30rpx;
            font-family: Resource Han Rounded CN;
            font-weight: 400;
            color: #ff5c01;
            line-height: 28rpx;
          }
        }
      }
    }
    .area {
      position: relative;
      height: 70rpx;
      margin-top: 40rpx;
      text-align: center;
      .bg {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 541rpx;
        height: 70rpx;
      }
      .text {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        line-height: 52rpx;
        font-size: 36rpx;
        font-family: Resource Han Rounded CN;
        font-weight: 500;
        color: #ffffff;
        text-shadow: 0px 4rpx 1rpx rgba(0, 0, 0, 0.5);
      }
    }
    .area-content {
      position: relative;
      width: 500rpx;
      height: 180rpx;
      margin: auto;
      margin-top: 40rpx;
      .area-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 500rpx;
        height: 180rpx;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
      }
      .text {
        font-size: 40rpx;
        font-family: Resource Han Rounded CN;
        font-weight: bold;
        color: #ffffff;
        line-height: 50rpx;
      }
    }
  }
</style>
