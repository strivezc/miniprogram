<template>
  <view class="activityCollection">
    <image
        mode="scaleToFill"
        v-if="voteTopImg"
        :src="voteTopImg"
        class="voteTopImg"
        @click="toVoteActivity"
    ></image>
    <text class="title2">活动合集</text>
    <view class="activity-wrap mb-28">
      <!--未领体验课 或 领了体验课未上课-->
      <template v-if="status==='3'">
        <template v-if="haveLottery">
          <template v-if="getTrialClass===0 || !isLogin">
            <image
                mode="widthFix"
                src="https://cos.talk915.com/data/image/2ac93cfea5214e1c9c918f39a5c1efa6.png"
                class="item"
                @click="toGiftPack"
            ></image>
            <image
                mode="widthFix"
                src="https://cos.talk915.com/data/image/9411e51f6a174e72b61add064baee063.png"
                class="item"
                @click="toLottery"
            ></image>
          </template>
          <template v-else-if="getTrialClass===1 && attendClass === 2">
            <image
                mode="widthFix"
                src="https://cos.talk915.com/data/image/5e3c34d15d1e49cd8c5cdf73a30015e8.png"
                class="item"
                @click="toConsultant"
            ></image>
            <image
                mode="widthFix"
                src="https://cos.talk915.com/data/image/9411e51f6a174e72b61add064baee063.png"
                class="item"
                @click="toLottery"
            ></image>
          </template>
        </template>
        <template v-else>
          <template v-if="getTrialClass===0 || !isLogin">
            <image
                mode="widthFix"
                src="https://cos.talk915.com/data/image/410e35e8eb5a4a5c97832fed99330e14.png"
                class="voteTopImg mb-0"
                @click="toGiftPack"
            ></image>
          </template>
          <template v-else-if="getTrialClass===1 && attendClass === 2">
            <image
                mode="widthFix"
                src="https://cos.talk915.com/data/image/cc2a4e60695e4c7788557bbaabfca950.png"
                @click="toConsultant"
                class="voteTopImg mb-0"
            ></image>
          </template>
        </template>
      </template>
      <!--已上过课-->
      <template v-else-if="status!=='3'">
        <template v-if="haveStepTask && haveLottery">
          <image
              mode="widthFix"
              src="https://cos.talk915.com/data/image/4a8c7d63008b4bbd89e2478bbea15b32.png"
              class="item"
              @click="toStepTask"
          ></image>
          <image
              mode="widthFix"
              src="https://cos.talk915.com/data/image/9411e51f6a174e72b61add064baee063.png"
              class="item"
              @click="toLottery"
          ></image>
        </template>
        <template v-else-if="haveStepTask && !haveLottery">
          <image
              mode="widthFix"
              src="https://cos.talk915.com/data/image/aa8586e734b74b50bd71c21a30d4eb8e.png"
              @click="toStepTask"
              class="voteTopImg mb-0"></image>
        </template>
        <template v-else-if="!haveStepTask && haveLottery">
          <image
              mode="widthFix"
              src="https://cos.talk915.com/data/image/bc78862c3ab44688a815da301dab8cd7.png"
              @click="toLottery"
              class="voteTopImg mb-0"></image>
        </template>
        <template v-else-if="!haveStepTask && !haveLottery">
          <image
              mode="widthFix"
              src="https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/image/5ffe4b3efc904b51b24a897b5888d038.png"
              @click="toJigsaw"
              class="voteTopImg mb-0"></image>
        </template>
      </template>
    </view>
    <view class="activity-wrap">
      <template v-if="entranceStatus === 0 && (haveStepTask || haveLottery || status==='3')">
        <image
            mode="widthFix"
            src="https://cos.talk915.com/data/image/c175c7ebd0864e7488a891f0f378f815.png"
            class="item"
            @click="toJigsaw"
        ></image>
        <image
            mode="widthFix"
            src="https://cos.talk915.com/data/image/ac867ed0f5a341f8850178bbbc2d20fa.png"
            class="item"
            @click="toUxssExchange"
        ></image>
      </template>
      <image
          v-else
          mode="widthFix"
          src="https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/image/1c85769b908f40bcaa4ce2220adc9341.png"
          class="voteTopImg"
          @click="toUxssExchange"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ActivityCollection',
  props:{
    status:{
      type:String,
    },
    voteTopImg:{
      type:String,
    },
    isLogin:{
      type:Boolean,
      detail:false,
    },
    haveLottery:{
      type:Boolean,
      detail:false,
    },
    haveStepTask:{
      type:Boolean,
      detail:false,
    },
    getTrialClass:{
      type:Number,
      detail:0,
    },
    entranceStatus:{
      type:Number,
      detail:0,
    },
    attendClass:{
      type:Number,
      detail:2,
    },
    lotteryCode:{
      type:String,
      detail:'',
    },
  },
  data() {
    return {}
  },
  methods: {
    toStepTask() {
      uni.navigateTo({
        url: '/subPackagesA/home/stepTask'
      })
    },
    toGiftPack() {
      uni.navigateTo({
        url: '/subPackagesA/home/giftPack'
      })
    },
    toLottery() {
      uni.navigateTo({
        url: `/subPackagesB/lottery/index?lotteryCode=${this.lotteryCode}`
      })
    },
    toVoteActivity() {
      uni.navigateTo({
        url: '/subPackagesB/voteActivity/activityDetail'
      })
    },
    toConsultant() {
      uni.navigateTo({
        url: '/subPackagesA/home/consultant'
      })
    },
    toUxssExchange() {
      uni.navigateTo({
        url: '/subPackagesA/personal/uxssExchange'
      })
    },
    async toJigsaw() {
      uni.navigateTo({
        url: '/subPackagesC/jigsawActivity/index'
      })
    },
  }
}
</script>

<style scoped lang="scss">
  .activityCollection{
    .title2 {
      display: block;
      margin-bottom: 20rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
      line-height: 42rpx;
    }
    .activity-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item {
        width: 331rpx;
      }
    }
    .voteTopImg {
      height: 304rpx;
      width: 686rpx;
      border-radius: 16rpx;
      margin-bottom: 48rpx;
    }
    .mb-28 {
      margin-bottom: 28rpx;
    }

    .mb-0 {
      margin-bottom: 0;
    }
  }
</style>
