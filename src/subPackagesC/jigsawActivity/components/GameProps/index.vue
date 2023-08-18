<template>
  <view>
    <view class="prop-wrapper">
      <view class="item" @click="openProps('time')">
        <canvas v-if="props.timeProp > 0" id="timeCanvas" type="2d" class="icon"></canvas>
        <image
          v-else
          class="icon"
          src="@/subPackagesC/static/jigsaw/button/button-time.png"
        ></image>
        <view class="num-wrap">
          <view class="nub-wrap">
            <template v-if="props.timeProp > 0">
              <image class="nub" src="@/subPackagesC/static/jigsaw/element/element-nub.png"></image>
              <text class="text">{{ props.timeProp }}</text>
            </template>
            <image
              class="nub"
              src="@/subPackagesC/static/jigsaw/element/element-lock.png"
              v-else
            ></image>
          </view>
        </view>
      </view>
      <view class="item" @click="openProps('xrayed')">
        <canvas v-if="props.seeProp > 0" id="xgrayCanvas" type="2d" class="icon"></canvas>
        <image
          v-else
          class="icon"
          src="@/subPackagesC/static/jigsaw/button/button-xrayed.png"
        ></image>
        <view class="num-wrap">
          <view class="nub-wrap">
            <template v-if="props.seeProp > 0">
              <image class="nub" src="@/subPackagesC/static/jigsaw/element/element-nub.png"></image>
              <text class="text">{{ props.seeProp }}</text>
            </template>
            <image
              class="nub"
              src="@/subPackagesC/static/jigsaw/element/element-lock.png"
              v-else
            ></image>
          </view>
        </view>
      </view>
      <view class="item" @click="openProps('reset')">
        <canvas v-if="props.resetProp > 0" id="resetCanvas" type="2d" class="icon"></canvas>
        <image
          v-else
          class="icon"
          src="@/subPackagesC/static/jigsaw/button/button-reset.png"
        ></image>
        <view class="num-wrap">
          <view class="nub-wrap">
            <template v-if="props.resetProp > 0">
              <image class="nub" src="@/subPackagesC/static/jigsaw/element/element-nub.png"></image>
              <text class="text">{{ props.resetProp }}</text>
            </template>
            <image
              class="nub"
              src="@/subPackagesC/static/jigsaw/element/element-lock.png"
              v-else
            ></image>
          </view>
        </view>
      </view>
      <view class="item" @click="openPause">
        <image class="icon" src="@/subPackagesC/static/jigsaw/button/button-pause.png"></image>
      </view>
    </view>
    <JigsawPopup
      ref="propsPopup"
      title="道具"
      @closeAction="emit('continueGame')"
      :isConfirm="false"
    >
      <template #main>
        <PropsAlert
          @handleAction="handleAction"
          @shareAction="shareAction"
          :type="state.type"
          :tip="state.tip"
          :twinTextTwo="state.twinTextTwo"
        ></PropsAlert>
      </template>
    </JigsawPopup>
    <JigsawPopup
      ref="pausePopup"
      title="暂停"
      @closeAction="emit('continueGame')"
      :isConfirm="false"
    >
      <template #main>
        <view class="pause-wrapper">
          <text class="text">游戏暂停中</text>
          <JsgsawButton
            :isSingleText="false"
            :isShare="true"
            v-if="state.pauseHaveShare"
            type="green"
            twinTextOne="邀请1位新用户注册"
            :twinTextTwo="`可获得${contentStore.jigsawData.timeGetSeconds}秒x${contentStore.propsInfo.getTimeProp}份时长`"
            @handleAction="shareAction('time')"
          ></JsgsawButton>
          <JsgsawButton
            class="mt-30"
            singleText="继续游戏"
            type="yellow"
            @handleAction="continueGame"
          ></JsgsawButton>
        </view>
      </template>
    </JigsawPopup>
  </view>
</template>

<script setup>
  import { Player } from 'svgaplayer-weapp';
  import { preLoadSvga } from '@/utils/preLoadSvga';
  import PropsAlert from './PropsAlert';
  import JigsawPopup from '../JigsawPopup/index.vue';
  import JsgsawButton from '../JsgsawButton/index.vue';
  import { useContentStore, useUserStore } from '@/store';

  const contentStore = useContentStore();
  const userStore = useUserStore();
  const emit = defineEmits(['pauseGame', 'continueGame', 'useProps', 'timeUp']);
  const props = defineProps({
    seeProp: {
      type: Number,
      default: 0,
    },
    resetProp: {
      type: Number,
      default: 0,
    },
    timeProp: {
      type: Number,
      default: 0,
    },
    timeGetSeconds: {
      type: Number,
      default: 0,
    },
  });
  const state = reactive({
    type: '',
    tip: '',
    twinTextTwo: '',
    pauseHaveShare: true,
  });
  const propsPopup = ref();
  const pausePopup = ref();
  const handleAction = (type) => {
    console.log('道具使用', type);
    propsPopup.value.close();
    emit('useProps', type);
  };
  const shareAction = (type) => {
    console.log('分享', type);
    // propsPopup.value.close();
    // if (type === 'xrayed') {
    //   pausePopup.value.close();
    // }
  };
  const openPause = () => {
    state.pauseHaveShare = true;
    emit('pauseGame');
    pausePopup.value.open();
    contentStore.pauseOrTimeOut(1);
    userStore.getJigsawCode('time');
  };
  const openPauseNotShare = () => {
    state.pauseHaveShare = false;
    emit('pauseGame');
    pausePopup.value.open();
  };

  const openProps = (type) => {
    state.type = type;
    if (type === 'time') {
      state.tip = '可获得更长的时间';
      state.twinTextTwo = `可获得${contentStore.jigsawData.timeGetSeconds}秒x${contentStore.propsInfo.getTimeProp}份时长`;
    } else if (type === 'xrayed') {
      if (contentStore.jigsawData.barrierSurplusTime === 0) {
        emit('timeUp');
        return;
      }
      state.tip = '拼图模块内容以简易数字展示';
      state.twinTextTwo = `可获得${contentStore.propsInfo.getSeeProp}个透视道具`;
    } else if (type === 'reset') {
      state.tip = '重置本关的拼图模块和时间';
      state.twinTextTwo = `可获得${contentStore.propsInfo.getResetProp}个重置道具`;
    }
    userStore.getJigsawCode(type);
    emit('pauseGame');
    propsPopup.value.open();
  };
  const continueGame = () => {
    pausePopup.value.close();
    emit('continueGame');
  };

  let timePlayer = new Player();
  let xgrayPlayer = new Player();
  let resetPlayer = new Player();
  const initTimePlayer = async () => {
    preLoadSvga('time', async (videoItem) => {
      try {
        await timePlayer.setCanvas('#timeCanvas', getCurrentInstance());
        await timePlayer.setVideoItem(videoItem);
        timePlayer.startAnimation();
      } catch (error) {
        console.log(error);
      }
    });
  };
  const initXgrayPlayer = async () => {
    preLoadSvga('xgray', async (videoItem) => {
      try {
        await xgrayPlayer.setCanvas('#xgrayCanvas', getCurrentInstance());
        await xgrayPlayer.setVideoItem(videoItem);
        xgrayPlayer.startAnimation();
      } catch (error) {
        console.log(error);
      }
    });
  };
  const initResetPlayer = async () => {
    preLoadSvga('reset', async (videoItem) => {
      try {
        await resetPlayer.setCanvas('#resetCanvas', getCurrentInstance());
        await resetPlayer.setVideoItem(videoItem);
        resetPlayer.startAnimation();
      } catch (error) {
        console.log(error);
      }
    });
  };

  onMounted(() => {
    initTimePlayer();
    initXgrayPlayer();
    initResetPlayer();
  });
  onUnload(() => {
    timePlayer.stopAnimation(true);
    xgrayPlayer.stopAnimation(true);
    resetPlayer.stopAnimation(true);
  });
  defineExpose({ openPauseNotShare });
</script>

<style scoped lang="scss">
  .prop-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 40rpx;
    margin-top: 90rpx;

    .item {
      position: relative;
      width: 155rpx;
      height: 155rpx;
      .icon {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 155rpx;
        height: 155rpx;
      }
      .num-wrap {
        position: absolute;
        z-index: 99;
        right: -6px;
        top: -6px;
        width: 48rpx;
        height: 48rpx;
        .nub-wrap {
          position: relative;
          width: 48rpx;
          height: 48rpx;
          .nub {
            width: 48rpx;
            height: 48rpx;
          }
          .text {
            position: absolute;
            left: 0;
            top: 0;
            display: inline-block;
            text-align: center;
            width: 48rpx;
            font-size: 24rpx;
            font-family: Resource Han Rounded CN;
            color: #333333;
            line-height: 48rpx;
          }
        }
      }
    }
  }
  .pause-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .text {
      margin-top: 70rpx;
      margin-bottom: 60rpx;
      font-size: 40rpx;
      font-family: Resource Han Rounded CN;
      font-weight: 500;
      color: #333333;
      line-height: 36rpx;
    }
    .mt-30 {
      margin-top: 30rpx;
    }
  }
</style>
