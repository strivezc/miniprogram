<template>
  <view class="my-countDown">
    <image src="@/subPackagesC/static/jigsaw/element/element-time.png" class="time-icon"></image>
    <van-count-down
      :auto-start="false"
      use-slot
      ref="countDown"
      :time="time"
      @change="onChange"
      @finish="timeUp"
    >
      <text class="text"
        >{{ timeData.hours < 10 ? '0' + timeData.hours : timeData.hours }}:{{
          timeData.minutes < 10 ? '0' + timeData.minutes : timeData.minutes
        }}:{{ timeData.seconds < 10 ? '0' + timeData.seconds : timeData.seconds }}</text
      >
    </van-count-down>
    <JigsawPopup ref="popup" title="温馨提示" :isConfirm="false">
      <template #main>
        <view class="alert-wrapper">
          <image
            src="@/subPackagesC/static/jigsaw/element/element-end.png"
            class="icon mt-30"
          ></image>
          <text class="text mt-30">时间到了...</text>
          <JsgsawButton
            class="mt-30"
            :isSingleText="false"
            :isShare="true"
            type="green"
            twinTextOne="邀请1位新用户注册"
            :twinTextTwo="`可获得${contentStore.jigsawData.timeGetSeconds}秒x${contentStore.propsInfo.getTimeProp}份时长`"
          ></JsgsawButton>
          <JsgsawButton
            class="mt-30"
            singleText="使用时间道具"
            v-if="contentStore.jigsawData.timeProp > 0"
            type="yellow"
            @handleAction.stop="restart"
          ></JsgsawButton>
          <JsgsawButton
            class="mt-30"
            singleText="返回首页"
            type="gray"
            @handleAction.stop="backHome"
          ></JsgsawButton>
        </view>
      </template>
    </JigsawPopup>
  </view>
</template>

<script setup>
  import JigsawPopup from '../JigsawPopup/index.vue';
  import JsgsawButton from '../JsgsawButton/index.vue';
  import { useContentStore, useUserStore } from '@/store';

  const contentStore = useContentStore();
  const userStore = useUserStore();
  const emit = defineEmits(['timeUp', 'restart']);

  let time = ref(contentStore.jigsawData.barrierSurplusTime * 1000);
  let timeAll = contentStore.jigsawData.barrierSurplusTime;
  let timeData = ref({});
  if (time.value === 0) {
    timeData.value = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
  let popup = ref();
  let countDown = ref();
  let flag = ref(null);
  // const timesObj = computed(() => {
  //   return countDown(contentStore.jigsawData.barrierSurplusTime);
  // });

  const onChange = (e) => {
    timeData.value = e.detail;
  };
  const timeUp = (e) => {
    console.log(timeData.value, 'timeData.value');
    pause();
    emit('timeUp');
  };
  const pause = (val = false) => {
    console.log(val, 'val');
    countDown.value.pause();
    const timeSurplus =
      timeData.value.hours * 60 * 60 + timeData.value.minutes * 60 + timeData.value.seconds;
    contentStore.jigsawData.barrierSurplusTime = timeSurplus;
    const timeUse = timeAll - timeSurplus;
    console.log(timeSurplus, 'timeSurplus');
    console.log(timeUse, 'timeUse');
    contentStore.jigsawData.barrierUseTime = contentStore.jigsawData.barrierUseTime + timeUse;
    timeAll = timeSurplus;
    flag.value = val;
  };
  const start = () => {
    countDown.value.start();
    flag.value = true;
    // clearInterval(timer);
    // if (contentStore.jigsawData.barrierSurplusTime === 0) return;
    // timer = setInterval(() => {
    //   if (contentStore.jigsawData.barrierSurplusTime === 0) {
    //     pause();
    //     emit('timeUp');
    //   } else {
    //     contentStore.jigsawData.barrierSurplusTime = contentStore.jigsawData.barrierSurplusTime - 1;
    //     contentStore.jigsawData.barrierUseTime = contentStore.jigsawData.barrierUseTime + 1;
    //   }
    // }, 1000);
  };
  const reset = () => {
    time.value = contentStore.jigsawData.barrierSurplusTime * 1000;
    timeAll = contentStore.jigsawData.barrierSurplusTime;
    setTimeout(() => {
      countDown.value.reset();
      start();
    }, 1000);
  };
  const open = () => {
    userStore.getJigsawCode('time');
    popup.value.open();
  };
  const restart = () => {
    popup.value.close();
    emit('restart');
  };
  const backHome = () => {
    uni.reLaunch({
      url: '/subPackagesC/jigsawActivity/index',
    });
  };
  // function countDown(second) {
  //   let obj = {
  //     hour: null,
  //     minute: null,
  //     second: null,
  //   };
  //   const h = parseInt((second / 60 / 60) % 24);
  //   obj.hour = h < 10 ? '0' + h : h;
  //   const m = parseInt((second / 60) % 60);
  //   obj.minute = m < 10 ? '0' + m : m;
  //   const s = parseInt(second % 60);
  //   obj.second = s < 10 ? '0' + s : s;
  //   return obj;
  // }
  onMounted(() => {
    // start();
  });
  onUnload(() => {
    console.log('vonUnload');
    pause();
  });
  defineExpose({ pause, start, open, reset, flag });
</script>

<style scoped lang="scss">
  .my-countDown {
    position: relative;
    width: 225rpx;
    height: 52rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 24rpx 24rpx 24rpx 24rpx;
    .time-icon {
      position: absolute;
      left: -20rpx;
      top: 44%;
      transform: translateY(-50%);
      width: 81rpx;
      height: 81rpx;
    }
    .text {
      display: inline-block;
      font-size: 32rpx;
      line-height: 52rpx;
      font-family: Resource Han Rounded CN;
      color: #fff;
      text-align: center;
      margin-left: 20rpx;
      width: 220rpx;
    }
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
    }
    .mt-30 {
      margin-top: 30rpx;
    }
  }
</style>
