<template>
  <view class="alert-wrapper">
    <image :src="getIcon" class="icon mt-30"></image>
    <text class="text mt-30">{{ props.tip }}</text>
    <JsgsawButton
      class="mt-30"
      singleText="使用"
      type="yellow"
      @handleAction="handleAction"
      v-if="showUseProps"
    ></JsgsawButton>
    <JsgsawButton
      class="mt-30"
      :isSingleText="false"
      :isShare="true"
      type="green"
      twinTextOne="邀请1位新用户注册"
      :twinTextTwo="props.twinTextTwo"
      @handleAction="shareAction"
    ></JsgsawButton>
    <image
      class="shareflow"
      src="@/subPackagesC/static/jigsaw/element/element-shareflow.png"
    ></image>
  </view>
</template>

<script setup>
  import iconTime from '@/subPackagesC/static/jigsaw/element/element-timepic.png';
  import iconXrayed from '@/subPackagesC/static/jigsaw/element/element-xrayed.png';
  import iconReset from '@/subPackagesC/static/jigsaw/element/element-reset.png';
  import JsgsawButton from '../JsgsawButton/index.vue';
  import { useContentStore } from '@/store';

  const contentStore = useContentStore();
  const props = defineProps({
    type: {
      type: String,
      default: 'time',
    },
    tip: {
      type: String,
      default: '可获得更长的时间',
    },
    twinTextTwo: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['handleAction', 'shareAction']);
  const getIcon = computed(() => {
    const obj = {
      time: iconTime,
      xrayed: iconXrayed,
      reset: iconReset,
    };
    return obj[props.type];
  });
  const showUseProps = computed(() => {
    if (props.type === 'time') {
      return contentStore.jigsawData.timeProp > 0;
    } else if (props.type === 'reset') {
      return contentStore.jigsawData.resetProp > 0;
    } else if (props.type === 'xrayed') {
      return contentStore.jigsawData.seeProp > 0;
    }
  });
  const handleAction = () => {
    emit('handleAction', props.type);
  };
  const shareAction = () => {
    emit('shareAction', props.type);
  };
</script>

<style scoped lang="scss">
  .alert-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
      width: 268rpx;
      height: 268rpx;
    }
    .text {
      font-size: 36rpx;
      font-family: Resource Han Rounded CN;
      font-weight: 400;
      color: #333333;
      line-height: 36rpx;
    }
    .shareflow {
      margin-top: 50rpx;
      width: 524rpx;
      height: 167rpx;
    }
  }
  .mt-30 {
    margin-top: 30rpx;
  }
</style>
