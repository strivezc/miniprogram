<template>
  <view class="container" :style="props.position">
    <view
      class="area-item"
      :style="props.regionStatus === 0 || props.regionStatus === 2 ? 'height: 152rpx;' : ''"
      @click="clickItem"
    >
      <image
        class="icon"
        :class="props.regionStatus === 1 ? 'active' : ''"
        :src="props.regionStatus === 2 ? buttonLock : elementRank"
      ></image>
      <view class="area-name">
        <image class="name-icon" src="@/subPackagesC/static/jigsaw/element/bg-areaname.png"></image>
        <view class="text centerSPCZ">{{ props.regionName }}</view>
      </view>
    </view>
    <div class="circleBox" v-if="props.regionStatus === 1">
      <div class="circle"></div>
      <div class="circle1"></div>
      <!--      <div class="circle2"></div>-->
    </div>
  </view>
</template>

<script setup>
  import elementRank from '@/subPackagesC/static/jigsaw/element/element-rank.png';
  import buttonLock from '@/subPackagesC/static/jigsaw/element/button-pass1.png';

  const props = defineProps({
    position: {
      type: String,
    },
    regionId: {
      type: String,
    },
    regionName: {
      type: String,
    },
    regionStatus: {
      // 0.已通过 1.进行中 2.未进入
      type: Number,
    },
  });
  const emit = defineEmits('clickItem');

  const clickItem = () => {
    if (props.regionStatus === 0 || props.regionStatus === 1) {
      emit('clickItem', { regionId: props.regionId, regionStatus: props.regionStatus });
    } else{
      emit('clickItem');
    }
  };
</script>

<style scoped lang="scss">
  .container {
    position: relative;
  }
  .area-item {
    position: relative;
    z-index: 9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 210rpx;
    width: 205rpx;
    .icon {
      width: 92rpx;
      height: 92rpx;
    }
    .area-name {
      position: relative;
      width: 205rpx;
      height: 60rpx;
      .name-icon {
        position: absolute;
        left: 0;
        top: 0;
        width: 205rpx;
        height: 60rpx;
      }
      .text {
        width: 205rpx;
        text-align: center;
        font-size: 28rpx;
        font-family: Resource Han Rounded CN;
        font-weight: 500;
        color: #333333;
        line-height: 36rpx;
      }
    }
    .active {
      margin-bottom: 30rpx;
    }
  }
  .circleBox {
    position: absolute;
    top: 6rpx;
    left: 44rpx;
    width: 146rpx;
    height: 146rpx;
  }
  /* 扩散动画 */
  .circle,
  .circle1,
  .circle2 {
    width: 114rpx;
    height: 114rpx;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .circle1,
  .circle2 {
    /* animation: circleChange 2s 1s ease-out infinite; */
    animation-name: circleChange;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  .circle1 {
    animation-delay: 1s;
  }
  .circle2 {
    animation-delay: 2s;
  }

  @keyframes circleChange {
    0% {
      transform: scale(1);
      opacity: 0.95;
    }
    30% {
      transform: scale(1.093);
      opacity: 0.75;
    }
    70% {
      transform: scale(1.186);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.2807);
      opacity: 0.25;
    }
  }
</style>
