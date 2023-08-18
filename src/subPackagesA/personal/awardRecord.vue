<template>
  <view class="awardRecord">
    <view class="tagView">
      <view class="item" :class="activeIndex===1?'active':''" @click="handleActive(1)">阶梯邀新奖励记录</view>
      <view class="item" :class="activeIndex===2?'active':''" @click="handleActive(2)">中奖记录</view>
    </view>
    <stepInviteRecord v-show="activeIndex===1" ref="stepInviteRecord"></stepInviteRecord>
    <lotteryRecord v-show="activeIndex===2" ref="lotteryRecord"></lotteryRecord>
  </view>
</template>

<script>
import stepInviteRecord from './stepInviteRecord'
import lotteryRecord from './lotteryRecord'

export default {
  name: 'awardRecord',
  components:{stepInviteRecord,lotteryRecord},
  data() {
    return {
      activeIndex:1,
    }
  },
  created() {
    this.$nextTick(()=>{
      if (this.activeIndex===1) {
        this.$refs.stepInviteRecord.initScrollData();
      }
    })
  },
  methods: {
    handleActive(index){
      this.activeIndex=index;
      if (index===1) {
        this.$refs.stepInviteRecord.initScrollData();
      } else {
        this.$refs.lotteryRecord.initScrollData();
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .awardRecord {
    background: #F9F9F9;
    padding-top: 2rpx;
    .tagView {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 98rpx;
      width: 100%;
      background: #ffffff;
      .item {
        flex: 1;
        font-size: 32rpx;
        font-weight: bold;
        color: #999999;
        line-height: 98rpx;
        text-align: center;
      }

      .active {
        color: #0087FF;
      }
    }
  }
</style>
