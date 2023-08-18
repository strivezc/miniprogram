<template>
  <view class="game-content">
    <NumGame
      :gameData="state.gameData"
      :showNum="props.showNum"
      :isInteractive="props.isInteractive"
      ref="game"
      @endCallback="endCallback"
    ></NumGame>
    <!--    <view class="canvas-box">-->
    <!--      <canvas canvas-id="canvasIn" id="canvasIn" class="canvas canvas-in"></canvas>-->
    <!--      <canvas canvas-id="canvasOut" id="canvasOut" class="canvas canvas-out"></canvas>-->
    <!--    </view>-->
  </view>
</template>

<script setup>
  import NumGame from './NumGame';
  // import useImageClipper from '../../extends/useImageClipper';

  const props = defineProps({
    imageUrl: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      default: 3,
    },
    showNum: {
      type: Boolean,
      default: false,
    },
    isInteractive: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['endCallback']);

  const game = ref();
  const state = reactive({
    gameData: {
      level: props.level, // 分割数 level * level
      emptyNum: 8, // 空格的index
      imageUrl: '',
      difficulty: 30 * props.level, // 难度
    },
  });

  let imageUrl = props.imageUrl;
  if (imageUrl) {
    imageUrl = imageUrl.replace(
      'cos.talk915.com',
      'talk915-1302759139.cos.ap-beijing.myqcloud.com'
    );
  }
  // const { initCanvas, picList } = useImageClipper(props.level, imageUrl, getCurrentInstance());
  // initCanvas();
  state.gameData.imageUrl = imageUrl;
  const start = async (flag = true) => {
    // 开始游戏
    game.value.gameStart(flag);
  };
  const gameEnd = async () => {
    // 结束游戏
    game.value.gameEnd();
  };
  const gameContinue = async () => {
    // 继续游戏
    game.value.gameContinue();
  };
  onMounted(() => {
    // start();
  });

  const endCallback = () => {
    // 通关了
    emit('endCallback');
    console.log('我通关了');
  };
  defineExpose({ start, gameEnd, gameContinue });
</script>

<style scoped lang="scss">
  .game-content {
    margin-top: 35rpx;
    .canvas-box {
      position: relative;
    }

    .canvas {
      width: 600px;
      height: 600px;
      position: absolute;
      top: 0;
    }

    .canvas-in {
      left: -9999px;
      top: -9999px;
    }
    .canvas-out {
      left: -9999px;
      top: -9999px;
      background-color: #fff;
    }
  }
</style>
