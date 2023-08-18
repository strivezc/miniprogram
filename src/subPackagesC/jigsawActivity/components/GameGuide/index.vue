<template>
  <van-popup
    :close-on-click-overlay="false"
    :show="state.show"
    custom-style="background: transparent"
  >
    <view class="gameGuide">
      <view class="bg-wrap">
        <image :src="img" class="bg" :class="props.type === 'move' ? 'guideMove' : ''"></image>
      </view>
      <view class="button" @click="close">我知道了</view>
    </view>
  </van-popup>
</template>

<script setup>
  import guideMove from '@/subPackagesC/static/jigsaw/element/guideMove.png';
  import guideChange from '@/subPackagesC/static/jigsaw/element/guideChange.png';

  const emit = defineEmits(['closeAction']);
  const props = defineProps({
    type: {
      type: String,
      default: 'move',
    },
  });
  const img = computed(() => {
    if (props.type === 'move') {
      return guideMove;
    } else {
      return guideChange;
    }
  });
  const state = reactive({
    show: false,
  });
  const close = () => {
    state.show = false;
    emit('closeAction');
  };
  const open = () => {
    state.show = true;
  };

  defineExpose({ open, close });
</script>

<style scoped lang="scss">
  .gameGuide {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: auto;
    margin-top: 465rpx;
    .bg-wrap {
      width: 100vw;
      height: 600rpx;
      text-align: center;
      .bg {
        width: 600rpx;
        height: 466rpx;
      }
      .guideMove {
        height: 418rpx;
      }
    }
    .button {
      margin: auto;
      margin-top: 60rpx;
      width: 240rpx;
      height: 88rpx;
      background: #ffffff;
      border-radius: 64rpx 64rpx 64rpx 64rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #0087ff;
      line-height: 88rpx;
      text-align: center;
    }
  }
</style>
