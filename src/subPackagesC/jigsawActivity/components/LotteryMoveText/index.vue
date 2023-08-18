<template>
  <view class="move-wrapper">
    <view
      class="move-wrap"
      :style="{ 'animation-duration': duration + 's', visibility: visibility }"
      >{{ props.moveText }}</view
    >
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

  const { visibility, duration } = useMoveText('.move-wrap', 560, getCurrentInstance());
</script>

<style scoped lang="scss">
  @keyframes move-data {
    0% {
      transform: translateX(560rpx);
    }
    to {
      transform: translateX(-100%);
    }
  }

  .move-wrapper {
    position: relative;
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    width: 560rpx;
    height: 64rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    .move-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: move-data 10s 0.5s linear infinite;
      white-space: nowrap;
      width: max-content;
      font-size: 36rpx;
      font-family: Resource Han Rounded CN;
      font-weight: bold;
      color: #fdff98;
      line-height: 64rpx;
    }
  }
</style>
