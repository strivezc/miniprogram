<template>
  <view class="_game">
    <view class="gameMain" v-if="!props.isInteractive">
      <view
        class="x-axis transition"
        :style="[
          xAxisW,
          yAxisH,
          item.sort === 0 ? '' : backGround,
          positionObj[item.sort],
          `transform:translate( ${item.x},${item.y} )`,
        ]"
        :class="[item.sort === 0 ? 'empty' : '']"
        v-for="(item, index) in list"
        :key="index"
      >
        <template v-if="props.showNum">
          <view class="num fl-c-c" v-if="showAxis(item.sort)">
            {{ item.sort }}
          </view>
        </template>
      </view>
    </view>

    <view class="gameMain game_mask" :style="props.isInteractive ? 'opacity:1' : ''">
      <view
        class="y-axis"
        :style="yAxisH"
        :class="props.gameData.emptyNum === index ? 'empty' : ''"
        v-for="(item, index) in arr"
        :key="index"
      >
        <view
          class="x-axis animate__animated"
          :style="xAxisW"
          :class="[item2 === 0 ? 'empty' : '']"
          v-for="(item2, index2) in item"
          :key="index2"
          @tap="boxHandle(index, index2, item2)"
        >
          <view
            class="piece-img"
            v-if="props.isInteractive && showAxis(item2)"
            :style="[xAxisW, yAxisH, item.sort === 0 ? '' : backGround, positionObj[item2]]"
          ></view>
          <image
            src="@/subPackagesC/static/jigsaw/element/active.png"
            v-if="first.x === index && first.y === index2"
            class="active-img"
          ></image>
          <template v-if="props.showNum">
            <view class="num fl-c-c" v-if="showAxis(item2)">
              {{ item2 }}
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import useCreateGame from '../../extends/useCreateGame';

  const AxisH = {
    2: 290, // gap 20rpx
    3: 192, // gap 12rpx
    4: 141, // gap 12rpx
    5: 112, // gap 10rpx
    6: 95, // gap 6rpx
  };
  const AxisW = {
    2: 290,
    3: 192,
    4: 141,
    5: 112,
    6: 95,
  };
  const gap = {
    2: 20,
    3: 12,
    4: 12,
    5: 10,
    6: 6,
  };
  const props = defineProps({
    gameData: {
      type: Object,
      required: true,
    },
    showNum: {
      type: Boolean,
      default: true,
    },
    isInteractive: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(['endCallback']);
  const isStart = ref(false);
  // 通关回调函数
  const gameEndCallback = (val) => {
    isStart.value = false;
    emit('endCallback');
  };
  const { translateObj, arrCopy, arr, shouldMove, moveInit, first } = useCreateGame(
    props.gameData.level,
    props.gameData.difficulty,
    gameEndCallback,
    props.isInteractive
  );
  let list = ref([]);
  function init() {
    console.log('init');
    console.log(arrCopy.value, 'arrCopy.value');
    let str = arrCopy.value.toString().replace('[', '').replace(']', '');
    const strArr = str.split(',');
    list.value = [];
    for (let i = 0; i < strArr.length; i++) {
      list.value.push({
        sort: Number(strArr[i]),
        x: '0',
        y: '0',
      });
    }
    console.log(list, 'list?');
  }
  watch(translateObj, (newValue, oldValue) => {
    setListItem(newValue);
  });
  function setListItem(newValue) {
    const findIndex = list.value.findIndex((item) => {
      return item.sort === newValue.sort;
    });
    let oldX = Number(list.value[findIndex].x.replace('rpx', ''));
    let oldY = Number(list.value[findIndex].y.replace('rpx', ''));
    if (newValue.x === 0) {
      if (newValue.y > 0) {
        // AxisH[props.gameData.level]
        list.value[findIndex].y = `${
          AxisH[props.gameData.level] + oldY + gap[props.gameData.level]
        }rpx`;
      } else {
        list.value[findIndex].y = `${
          oldY - AxisH[props.gameData.level] - gap[props.gameData.level]
        }rpx`;
      }
    } else {
      if (newValue.x > 0) {
        list.value[findIndex].x = `${
          AxisW[props.gameData.level] + oldX + gap[props.gameData.level]
        }rpx`;
      } else {
        list.value[findIndex].x = `${
          oldX - AxisW[props.gameData.level] - gap[props.gameData.level]
        }rpx`;
      }
    }
  }
  const yAxisH = computed(() => {
    return `height:${AxisH[props.gameData.level]}rpx`;
  });
  const xAxisW = computed(() => {
    return `width:${AxisW[props.gameData.level]}rpx`;
  });
  const backGround = computed(() => {
    return `background: url(${props.gameData.imageUrl}) no-repeat;background-size: ${
      AxisW[props.gameData.level] * props.gameData.level
    }rpx  ${AxisH[props.gameData.level] * props.gameData.level}rpx;`;
  });
  const positionObj = computed(() => {
    const obj = {};
    const loops = props.gameData.level * props.gameData.level;
    for (let i = 1; i <= loops; i++) {
      const row = Math.ceil(i / props.gameData.level);
      const remainder = i % props.gameData.level;
      let column = remainder === 0 ? props.gameData.level : remainder;
      obj[i] = `background-position: ${(column - 1) * -AxisW[props.gameData.level]}rpx ${
        (row - 1) * -AxisH[props.gameData.level]
      }rpx;`;
    }
    // console.log(obj, 'positionObj');
    return obj;
  });
  const showAxis = (val) => {
    if (props.isInteractive) {
      return true;
    } else {
      return val != 0;
    }
  };
  // 点击滑块
  const boxHandle = (x, y, clickIndex) => {
    if (!isStart.value) return false;
    shouldMove(x, y, clickIndex);
  };

  // 开始游戏
  const gameStart = (flag) => {
    uni.showLoading({
      title: '图片加载中',
    });
    isStart.value = true;
    moveInit(props.gameData.difficulty).then(() => {
      if (!props.isInteractive) {
        init();
      }
      // setTimeout(() => {
      uni.hideLoading();
      if (flag) {
        uni.$emit('showGameGuide');
      }
      // }, 1000);
    });
  };

  // 游戏结束
  const gameEnd = () => {
    isStart.value = false;
  };
  // 游戏继续
  const gameContinue = () => {
    isStart.value = true;
  };

  defineExpose({ gameStart, gameEnd, gameContinue });
</script>

<style lang="scss" scoped>
  ._game {
    position: relative;
    width: 600rpx;
    height: 600rpx;
    background-color: #c1d06f;
    .gameMain {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      /*background: #5a009b;*/
      color: #fff;
      width: 100%;
      height: 100%;
      display: flex;
      align-content: space-between;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: auto;

      .y-axis {
        display: flex;
        width: 100%;
        height: 32.5%;
        align-items: flex-start;
        justify-content: space-between;
      }

      .x-axis {
        position: relative;
        width: 32.5%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .piece-img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
        .active-img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
        }
        .num {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          font-size: 60rpx;
          font-family: Resource Han Rounded CN;
          font-weight: 500;
          color: #ffffff;
        }
      }
      .transition {
        webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
        transition: transform ease 0.3s;
      }

      .empty {
        background-color: transparent !important;
      }
      .active {
        transform: scale(1.04);
      }
    }
    .game_mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      opacity: 0;
    }
    .animate__animated {
      --animate-duration: 0.3s;
    }
  }
</style>
