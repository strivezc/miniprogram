<template>
  <view class="popup" v-if="state.showPopup">
    <template v-if="props.overlay">
      <view
        v-show="state.showTrans"
        :class="state.maskAni"
        class="maskClass animate__animated"
        @animationend="animationend"
        @touchmove.stop.prevent="moveHandle"
        @click="handleMask"
      ></view>
    </template>

    <template v-if="props.type === 'bottom'">
      <view
          class="content animate__animated"
          v-show="state.showTrans"
          :style="[state.transClass, props.type === 'bottom' ? state.bottomStyle : '']"
          :class="state.ani"
      >
        <image src="@img/common/icon_close.png" class="close-icon" @click="close"></image>
        <view class="head-wrap">
          <text class="title">{{ title }}</text>
        </view>
        <slot name="main"></slot>
        <view class="submit" @click="submit">{{ submitText }}</view>
      </view>
    </template>

    <template v-else-if="props.type === 'center'">
      <view
          class="animate__animated"
          v-show="state.showTrans"
          :style="[state.transClass]"
          :class="state.ani"
      >
        <slot></slot>
      </view>
    </template>
  </view>
</template>

<script setup>
  const props = defineProps({
    type: {
      type: String,
      default: 'bottom',
    },
    title: {
      type: String,
      default: '标题',
    },
    submitText: {
      type: String,
      default: '确定',
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    closeOnOverlay: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(['closeAction', 'submitAction']);
  const state = reactive({
    transClass: {
      position: 'fixed',
      left: 0,
      right: 0,
    },
    bottomStyle: {
      transform: 'translateY(100%)',
    },
    maskAni: [],
    ani: [],
    showPopup: false,
    showTrans: false,
  });

  const open = () => {
    state.maskAni = ['animate__fadeIn'];
    if (props.type === 'bottom') {
      bottom();
    } else {
      center();
    }
  };

  const handleMask = () => {
    if (props.closeOnOverlay) {
      close();
    }
  };
  const close = () => {
    state.maskAni = ['animate__fadeOut'];
    if (props.type === 'bottom') {
      state.bottomStyle.transform = 'translateY(100%)';
    } else {
      state.ani = ['animate__fadeOut'];
    }
    emit('closeAction');
  };
  const submit = () => {
    emit('submitAction');
  };
  function animationend(e) {
    if (e.detail.animationName === 'fadeOut') {
      state.showPopup = false;
    }
  }

  /**
   * 底部弹出样式处理
   */
  function bottom(type) {
    state.transClass = {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      transition: 'transform 0.3s',
    };
    state.showPopup = true;
    state.showTrans = true;
    setTimeout(() => {
      state.bottomStyle.transform = 'translateY(0)';
    });
  }
  /**
   * 中间弹出样式处理
   */
  function center() {
    state.ani = ['animate__fadeIn'];
    state.transClass = {
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
    };
    state.showPopup = true;
    state.showTrans = true;
  }
  const moveHandle = () => {};
  defineExpose({ open, close });
</script>

<style scoped lang="scss">
  .popup {
    position: fixed;
    z-index: 999;
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
    .animate__fadeIn {
      --animate-duration: 0.3s;
    }
    .animate__fadeOut {
      --animate-duration: 0.3s;
    }
    .content {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      background: #ffffff;
      border-radius: 20rpx 20rpx 0rpx 0rpx;
      position: relative;
      .close-icon {
        position: absolute;
        top: 32rpx;
        right: 48rpx;
        width: 48rpx;
        height: 48rpx;
        padding: 20rpx;
      }
      .head-wrap {
        position: relative;
        margin-top: 48rpx;
        margin-bottom: 35rpx;
        text-align: center;
        .title {
          font-size: 40rpx;
          font-weight: bold;
          color: #0087ff;
          line-height: 56rpx;
        }
      }
      .submit {
        margin-bottom: 50rpx;
        width: 654rpx;
        height: 96rpx;
        text-align: center;
        background: #0087ff;
        border-radius: 48rpx 48rpx 48rpx 48rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #ffffff;
        line-height: 96rpx;
      }
    }
  }
</style>
