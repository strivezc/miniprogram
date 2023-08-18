<template>
  <view class="jigsawPopup" v-if="props.show">
    <view class="popup-content">
      <view class="pop-title normal-w">
        <image
          src="@/subPackagesC/static/jigsaw/popup/pop-title.png"
          class="title-bg normal-w"
        ></image>
        <image
          v-if="props.showClose"
          src="@/subPackagesC/static/jigsaw/popup/button-close.png"
          class="button-close"
          @click.stop="close"
        ></image>
        <text class="title"> {{ props.title }}</text>
      </view>
      <image src="@/subPackagesC/static/jigsaw/popup/pop-up.png" class="pop-up normal-w"></image>
      <view class="pop-mid normal-w">
        <view class="content">
          <slot name="main"></slot>
        </view>
      </view>
      <image
        src="@/subPackagesC/static/jigsaw/popup/pop-down.png"
        class="pop-down normal-w"
      ></image>
    </view>
  </view>
</template>

<script setup>
  const props = defineProps({
    showClose: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
  });
</script>

<style scoped lang="scss">
  .jigsawPopup {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999;
    /*margin-top: 200px;*/
    .popup-content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .pop-title {
        position: relative;
        /*width: 637rpx;*/
        height: 97rpx;
        .title-bg {
          position: absolute;
          left: 0;
          top: 0;
          /*width: 637rpx;*/
          height: 97rpx;
        }
        .title {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 40rpx;
          font-family: Resource Han Rounded CN;
          font-weight: bold;
          color: #ffffff;
          line-height: 97rpx;
          text-shadow: 0px 4rpx 4rpx rgba(0, 0, 0, 0.6);
          /*-webkit-background-clip: text;*/
          /*-webkit-text-fill-color: transparent;*/
        }
        .button-close {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 25rpx;
          width: 64rpx;
          height: 69rpx;
        }
      }
      .pop-mid {
        /*width: 637rpx;*/
        background-image: url('data:image/png;base64,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');
        background-repeat: repeat-y;
        background-size: 100%;
        margin-top: -10rpx;
      }
      .pop-down {
        /*width: 637rpx;*/
        height: 61rpx;
        margin-top: -1rpx;
      }
      .pop-up {
        display: block;
        /*width: 637rpx;*/
        height: 61rpx;
        margin-top: -60rpx;
      }
    }
    .normal-w {
      width: 637rpx;
    }
  }
</style>
