<template>
  <view class="container" @click="viewImage">
    <view class="icon-wrapper">
      <image :src="props.imageUrl" class="icon"></image>
    </view>
    <text class="text">查看原图</text>
    <image src="@/subPackagesC/static/jigsaw/button/element-arrow.png" class="arrow"></image>
    <JigsawPopup ref="popup" :isConfirm="false" title="原图" @closeAction.stop="continueGame">
      <template #main>
        <view class="image-wrapper">
          <image :src="props.imageUrl" class="img"></image>
          <JsgsawButton
            @handleAction.stop="closePopup"
            singleText="继续游戏"
            type="yellow"
          ></JsgsawButton>
        </view>
      </template>
    </JigsawPopup>
  </view>
</template>

<script setup>
  import JigsawPopup from '../JigsawPopup/index.vue';
  import JsgsawButton from '../JsgsawButton/index.vue';
  const props = defineProps({
    imageUrl: {
      type: String,
    },
  });
  const emit = defineEmits(['viewImage', 'continueGame']);
  const popup = ref();

  const viewImage = () => {
    popup.value.open();
    emit('viewImage');
  };
  const continueGame = () => {
    console.log('continueGame');
    emit('continueGame');
  };
  const closePopup = () => {
    popup.value.close();
  };
</script>

<style scoped lang="scss">
  .container {
    position: relative;
    width: 238rpx;
    height: 52rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 24rpx 24rpx 24rpx 24rpx;
    .icon-wrapper {
      position: absolute;
      left: -20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 70rpx;
      height: 70rpx;
      background: #d9d9d9;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      .icon {
        width: 60rpx;
        height: 60rpx;
        margin-top: 5rpx;
        margin-left: 5rpx;
      }
    }
    .text {
      display: inline-block;
      font-size: 32rpx;
      font-family: Resource Han Rounded CN;
      color: #fff;
      text-align: center;
      margin-left: 20rpx;
      width: 220rpx;
    }
    .arrow {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 16rpx;
      height: 23rpx;
    }

    .image-wrapper {
      padding: 20rpx;
      .img {
        width: 550rpx;
        height: 550rpx;
        margin-bottom: 40rpx;
      }
    }
  }
</style>
