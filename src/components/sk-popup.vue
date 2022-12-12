<!--
  创建人：Michael
  创建时间：2022/1/28
  页面描述：弹窗组件
-->
<template>
  <view
    class="popup-mask"
    :class="[{ active: show }, maskBackground]"
    @click="popupClose"
  >
    <view class="popup-content" :class="[{ active: show }, props.direction]">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";

const props = defineProps({
  /** 是否弹窗 */
  show: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  /** 是否点击背景关闭 */
  maskClose: {
    type: Boolean as PropType<boolean>,
    default: false,
    required: false,
  },
  popupClose: {
    type: Function as PropType<Function>,
    required: false,
  },
  /** 方向 */
  direction: {
    type: String as PropType<"bottom" | "center">,
    default: "bottom",
  },
  /** 背景色 */
  maskBackground: {
    type: String as PropType<"black" | "white" | "transparent">,
  },
});

const emits = defineEmits<{
  popupClose: () => void;
}>();

function popupClose() {
  if (props.maskClose) {
    props.popupClose();
  }
  // emits("popupClose");
}
</script>

<style lang="scss">
.popup-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 888;
  transition: all 0.2s ease-in-out;
  opacity: 0;
  visibility: hidden;
  &.white {
    background: rgba(255, 255, 255, 0.6);
  }
  &.transparent {
    background: transparent;
  }
}

.popup-mask.active {
  opacity: 1;
  visibility: visible;
}

.popup-content {
  width: 100%;
  height: auto;
  position: fixed;
  left: 0;
  z-index: 999;
  overflow: hidden;
  transform: translate3d(0, 100%, 0);
  transition: all 0.2s ease-in-out;
  visibility: hidden;
  &.center {
    width: auto;
    left: 20px;
    right: 20px;
    top: 50%;
    border-radius: 20px;
    transform: translate3d(100%, 0, 0);
  }
  &.bottom {
    bottom: 0;
  }
}

.popup-content.active {
  transform: translate3d(0, 0, 0);
  visibility: visible;
  &.center {
    transform: translate3d(0, -50%, 0);
  }
}
</style>
