<template>
  <div class="button-wrap">
    <div class="btn">分享抽奖</div>
    <button class="shareMask" open-type="share"></button>
  </div>
</template>

<script>
export default {
  name: 'shareButton',
  props:{
    showShare:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="scss">
  .button-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 130rpx;
    background: #ffffff;
    position: relative;
    width: 100%;
    .shareMask {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 686rpx;
      height: 88rpx;
      background: transparent;
      &::after {
        border: none;
      }
    }
    .btn {
      width: 686rpx;
      height: 88rpx;
      background: #0087FF;
      border-radius: 64rpx 64rpx 64rpx 64rpx;
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 88rpx;
    }
  }
</style>
