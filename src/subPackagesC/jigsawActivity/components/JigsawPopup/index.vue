<template>
  <view class="jigsawPopup" v-if="state.showPopup">
    <!--    <uni-transition-->
    <!--      key="1"-->
    <!--      v-if="props.overlay"-->
    <!--      name="mask"-->
    <!--      mode-class="fade"-->
    <!--      :styles="state.maskClass"-->
    <!--      :duration="300"-->
    <!--      :show="state.showTrans"-->
    <!--    />-->
    <template v-if="props.overlay">
      <view
        v-show="state.showTrans"
        :class="state.maskAni"
        class="maskClass animate__animated"
        @animationend="animationend"
        @touchmove.stop.prevent="moveHandle"
      ></view>
    </template>
    <!--    <uni-transition-->
    <!--      key="2"-->
    <!--      :mode-class="state.ani"-->
    <!--      name="content"-->
    <!--      :styles="state.transClass"-->
    <!--      :duration="300"-->
    <!--      :show="state.showTrans"-->
    <!--    >-->
    <view
      v-show="state.showTrans"
      :style="[state.transClass, props.type === 'bottom' ? state.bottomStyle : '']"
      class="popup-content animate__animated"
      :class="state.ani"
    >
      <view
        class="pop-title"
        :class="props.isFullScreen ? 'fullScreen-w' : 'normal-w'"
        :style="props.isFullScreen ? 'height:115rpx' : ''"
      >
        <image
          src="@/subPackagesC/static/jigsaw/popup/pop-title.png"
          class="title-bg"
          :class="props.isFullScreen ? 'fullScreen-w' : 'normal-w'"
          :style="props.isFullScreen ? 'height:115rpx' : ''"
        ></image>
        <image
          v-if="showClose"
          src="@/subPackagesC/static/jigsaw/popup/button-close.png"
          class="button-close"
          @click.stop="close"
        ></image>
        <text class="title" :style="props.isFullScreen ? 'line-height:110rpx' : ''">
          {{ props.title }}</text
        >
      </view>
      <image
        src="@/subPackagesC/static/jigsaw/popup/pop-up.png"
        class="pop-up"
        :class="props.isFullScreen ? 'fullScreen-w' : 'normal-w'"
      ></image>
      <view class="pop-mid" :class="props.isFullScreen ? 'fullScreen-w' : 'normal-w'">
        <view class="content">
          <template v-if="props.isConfirm">
            <view class="confirm-text">{{ props.content }}</view>
            <view class="button-group">
              <view class="left" @click.stop="close('left')">
                <image :src="getButtonType('cancelColor')" class="img"></image>
                <text class="text">取消</text>
              </view>
              <view class="right" @click.stop="submitAction">
                <image :src="getButtonType('confirmColor')" class="img"></image>
                <text class="text">{{ confirmText }}</text>
              </view>
            </view>
          </template>
          <template v-else>
            <slot name="main"></slot>
          </template>
        </view>
      </view>
      <image
        src="@/subPackagesC/static/jigsaw/popup/pop-down.png"
        class="pop-down"
        :class="props.isFullScreen ? 'fullScreen-w' : 'normal-w'"
      ></image>
    </view>
    <!--    </uni-transition>-->
  </view>
</template>

<script setup>
  import greenButton from '@/subPackagesC/static/jigsaw/button/button-green-s.png';
  import redButton from '@/subPackagesC/static/jigsaw/button/button-red-s.png';
  import grayButton from '@/subPackagesC/static/jigsaw/button/button-gray-s.png';
  import yellowButton from '@/subPackagesC/static/jigsaw/button/button-yellow-s.png';

  const props = defineProps({
    type: {
      type: String,
      default: 'center',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
    },
    isConfirm: {
      type: Boolean,
      default: true,
    },
    safeArea: {
      type: Boolean,
      default: true,
    },
    content: {
      type: String,
    },
    cancelColor: {
      type: String,
      default: 'green',
    },
    confirmColor: {
      type: String,
      default: 'red',
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: '退出',
    },
  });
  let timer = null;
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
    safeAreaInsets: 0,
  });

  // const popup = ref();
  const open = () => {
    state.maskAni = ['animate__fadeIn'];
    console.log('开启弹窗');
    if (props.type === 'bottom') {
      bottom();
    } else {
      center();
    }
  };
  function animationend(e) {
    // console.log(e, 'animationend');
    if (e.detail.animationName === 'fadeOut') {
      state.showPopup = false;
      // state.showTrans = false;
    }
  }
  const close = () => {
    // if (animate === 'left') {
    //   state.animateClass[animate].push('my_animate__pulse');
    // }
    state.maskAni = ['animate__fadeOut'];
    if (props.type === 'bottom') {
      state.bottomStyle = {
        transform: 'translateY(100%)',
      };
    } else {
      state.ani = ['animate__fadeOut'];
    }
    // show.value = false;
    console.log('关闭弹窗');
    // clearTimeout(timer);
    // // 自定义关闭事件
    // this.customOpen && this.customClose()
    // timer = setTimeout(() => {
    //   // state.showPopup = false;
    //   state.showTrans = false;
    // }, 300);
    emit('closeAction');
  };
  /**
   * 底部弹出样式处理
   */
  function bottom(type) {
    // this.popupstyle = 'bottom'
    state.transClass = {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      transition: 'transform 0.3s',
    };
    setTimeout(() => {
      state.bottomStyle = {
        transform: 'translateY(0)',
      };
    });
    state.showPopup = true;
    state.showTrans = true;
  }
  /**
   * 中间弹出样式处理
   */
  function center() {
    // this.popupstyle = 'center'
    state.ani = ['animate__fadeIn'];
    state.transClass = {
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
    };
    // TODO 兼容 type 属性 ，后续会废弃
    // if (type) return
    state.showPopup = true;
    state.showTrans = true;
  }
  const submitAction = () => {
    // state.animateClass.right.push('my_animate__pulse');
    // show.value = false;
    emit('submitAction');
  };
  const getButtonType = (type) => {
    const obj = {
      green: greenButton,
      red: redButton,
      gray: grayButton,
      yellow: yellowButton,
    };
    if (type === 'cancelColor') {
      return obj[props.cancelColor];
    } else if (type === 'confirmColor') {
      return obj[props.confirmColor];
    }
  };

  // onMounted(() => {
  //   const fixSize = () => {
  //     const { windowWidth, windowHeight, windowTop, safeArea, screenHeight, safeAreaInsets } =
  //       uni.getSystemInfoSync();
  //     // this.popupWidth = windowWidth
  //     // this.popupHeight = windowHeight + (windowTop || 0)
  //     // TODO fix by mehaotian 是否适配底部安全区 ,目前微信ios 、和 app ios 计算有差异，需要框架修复
  //     if (safeArea && props.safeArea) {
  //       // #ifdef MP-WEIXIN
  //       state.safeAreaInsets = screenHeight - safeArea.bottom;
  //       // #endif
  //       // #ifndef MP-WEIXIN
  //       state.safeAreaInsets = safeAreaInsets.bottom;
  //       // #endif
  //     } else {
  //       state.safeAreaInsets = 0;
  //     }
  //   };
  //   fixSize();
  // });
  const moveHandle = () => {};
  defineExpose({ open, close });
</script>

<style scoped lang="scss">
  .jigsawPopup {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: transparent;
    /*margin-top: 200px;*/
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
    .popup-content {
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
        .content {
          padding-left: 24rpx;
          padding-right: 24rpx;
          padding-top: 6rpx;
          .confirm-text {
            padding: 100rpx 35rpx;
            font-family: Resource Han Rounded CN;
            font-size: 40rpx;
            font-weight: 500;
            color: #333333;
            line-height: 36px;
            text-align: center;
          }
          .button-group {
            display: flex;
            padding: 0 25rpx;
            justify-content: space-between;
            align-items: center;
            .left,
            .right {
              position: relative;
              width: 260rpx;
              height: 100rpx;
              .img {
                position: absolute;
                top: 0;
                left: 0;
                width: 260rpx;
                height: 100rpx;
              }
              .text {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-size: 44rpx;
                font-family: Resource Han Rounded CN;
                font-weight: bold;
                color: #ffffff;
                line-height: 85rpx;
                text-shadow: 0px 3rpx 0px #333333;
                /*-webkit-text-stroke: 2rpx #333333;*/
                /*text-stroke: 2rpx #333333;*/
              }
            }
          }
        }
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

    .fullScreen-w {
      width: 100%;
    }
    .normal-w {
      width: 637rpx;
    }
  }
</style>
