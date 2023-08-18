<template>
  <view class="container" v-if="state.showPopup">
    <view
      v-show="state.showTrans"
      @animationend="animationend"
      :class="state.ani"
      class="maskClass animate__animated"
    ></view>
    <view v-show="state.showTrans" :class="state.ani" class="transClass animate__animated">
      <view class="jigsaw-notice">
        <image src="@/subPackagesC/static/jigsaw/element/bg-tips.png" class="notice-bg"></image>
        <view class="text">{{ props.text }}</view>
        <JsgsawButton
          class="button"
          singleText="开始游戏"
          type="green"
          @handleAction="startGame"
        ></JsgsawButton>
      </view>
    </view>
  </view>
</template>

<script setup>
  import JsgsawButton from '../JsgsawButton/index.vue';

  const props = defineProps({
    text: {
      type: String,
      default: '',
    },
  });
  let timer = null;
  const emit = defineEmits(['startGame']);
  const state = reactive({
    showPopup: false,
    showTrans: false,
    ani: [],
  });
  const open = () => {
    state.ani = ['animate__fadeIn'];
    state.showPopup = true;
    state.showTrans = true;
  };
  function animationend(e) {
    // console.log(e, 'animationend');
    if (e.detail.animationName === 'fadeOut') {
      state.showPopup = false;
    }
  }
  const close = () => {
    state.ani = ['animate__fadeOut'];
    // emit('closeAction');
    clearTimeout(timer);
    // // 自定义关闭事件
    // this.customOpen && this.customClose()
    // timer = setTimeout(() => {
    //   state.showPopup = false;
    //   // state.showTrans = false;
    // }, 300);
  };
  const startGame = () => {
    close();
    emit('startGame');
  };
  const clickOverlay = () => {
    close();
  };

  defineExpose({ open, close });
</script>

<style scoped lang="scss">
  .animate__fadeIn {
    --animate-duration: 0.3s;
  }
  .animate__fadeOut {
    --animate-duration: 0.3s;
  }
  .container {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    background: transparent;
    .maskClass {
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
    }
    .jigsaw-notice {
      position: relative;
      width: 660rpx;
      height: 785rpx;
      background: transparent;
      .notice-bg {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 660rpx;
        height: 785rpx;
      }
      .text {
        white-space: pre-wrap;
        position: absolute;
        top: 190rpx;
        left: 110rpx;
        z-index: 2;
        width: 442rpx;
        height: 400rpx;
        overflow-y: scroll;
        font-size: 32rpx;
        font-family: Resource Han Rounded CN;
        font-weight: 500;
        color: #333333;
        line-height: 56rpx;
      }
      .button {
        position: absolute;
        bottom: 50rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
      }
    }
    .transClass {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
