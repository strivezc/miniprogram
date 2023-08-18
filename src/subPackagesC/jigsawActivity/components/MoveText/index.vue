<template>
  <view class="flex">
    <view class="icon-wrap">
      <image
        src="@/subPackagesC/static/jigsaw/element/element-notice.png"
        class="icon"
      ></image></view
    ><view class="move-wrapper">
      <view
        class="move-wrap"
        :style="{ 'animation-duration': duration + 's', visibility: visibility }"
        >{{ props.moveText }}</view
      >
    </view>
  </view>
</template>

<script setup>
  import useMoveText from '../../extends/useMoveText';

  const props = defineProps({
    moveText: {
      type: String,
      default: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    },
  });
  const { visibility, duration } = useMoveText('.move-wrap', 341, getCurrentInstance());
</script>

<style scoped lang="scss">
  @keyframes move-data {
    0% {
      transform: translateX(341rpx);
    }
    to {
      transform: translateX(-100%);
    }
  }
  .flex {
    display: flex;
    flex-grow: 1;
    font-size: 0px;
  }

  .icon-wrap {
    width: 80rpx;
    height: 80rpx;
    position: relative;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 16rpx 0 0 16rpx;
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      z-index: 3;
      width: 80rpx;
      height: 80rpx;
    }
  }
  .move-wrapper {
    position: relative;
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    width: 341rpx;
    height: 80rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 0 16rpx 16rpx 0;
    .move-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: move-data 10s 0.5s linear infinite;
      white-space: nowrap;
      width: max-content;
      font-size: 28rpx;
      font-family: Resource Han Rounded CN;
      font-weight: 400;
      color: #ffffff;
      line-height: 36rpx;
      margin-left: 90rpx;
    }
  }
</style>
