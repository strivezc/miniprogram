<template>
  <view class="lucky-draw">
    <view class="rotate-wrap" :style="[rotateStyle,transform]">
      <image src="https://cos.talk915.com/data/image/b461bd3bedfe463faf955584faca8466.png" class="rotate-bg"></image>
      <view class="item" v-for="(item, index) in dataA" :key="index" :style="{
          transform: `translate(-50%) rotate(${(360 / 8) * index}deg)`,
        }">

        <view class="title">{{ item.name }}</view>
        <image class="icon" :src="item.src"></image>
      </view>
    </view>
    <image mode="widthFix" src="https://cos.talk915.com/data/image/b476335c24bd45c880a7a158bd91286a.png" class="base_bg"></image>
    <view class="people_num">已有{{detailData.totalRaffleNum?detailData.totalRaffleNum:0}}人参与抽奖</view>
    <image class="start" src="https://cos.talk915.com/data/image/4138a11710664d228d679f5cc44c0702.png" @click="start()"></image>

  </view>
</template>

<script>
import LotteryService from '@/api/LotteryService'
import { mapActions } from 'pinia'
import { useUserStore } from '@/store'

export default {
  name: 'lucky-draw',
  props: {
    duration: {
      // 总旋转时间 ms级
      type: Number,
      default: 6000
    },
    circle: {
      // 旋转圈数
      type: Number,
      default: 6
    },
    prizeSortList: {
      type: Array
    },
    detailData: {
      type: Object
    },
    isLogin: {
      type: Boolean,
      default: false
    },
    lotteryCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataA: [
        { name: '', src: '' },
        { name: '', src: '' },
        { name: '', src: '' },
        { name: '', src: '' },
        { name: '', src: '' },
        { name: '', src: '' },
        { name: '', src: '' },
        { name: '', src: '' }
      ],
      isStart: false,//为了不连续点击
      isFinished: false,//
      disabled: false,//
      rotateAngle: 0, // 旋转角度
      transform: '',//
      cycle: 1
    }
  },
  computed: {
    rotateStyle() {
      if (this.isStart) {
        return `
        transition: transform ${this.duration}ms cubic-bezier(0.2, 0, 0, 1);
        transform: rotate(0deg);
        animation:none;
            `
      } else if (this.isFinished) {
        return 'animation:none;'
      }
    }
  },
  watch: {
    prizeSortList: {
      handler() {
        this.formatWheelPrizes()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(useUserStore, ['resetToken']),
    formatWheelPrizes() {
      for (let i = 0; i < this.prizeSortList.length; i++) {
        this.dataA[i].name = this.prizeSortList[i].prizeName
        this.dataA[i].src = this.prizeSortList[i].prizeImg
      }
    },
    async start() {
      if (this.detailData.surplusNum === 0) {
        this.$emit('showShareConfirm')
        return
      }
      if (this.disabled) return
      try {
        this.disabled = true
        const { resultData } = await LotteryService.runActivityPrize(this.lotteryCode)
        this.isStart = true
        if (resultData === 1) {  //联系经销商去充值获取抽奖次数
          this.isStart = false
          this.isFinished = true
          uni.showModal({
            title: '提示',
            content: '请联系所属学习顾问，获取参与抽奖资格',
            confirmColor: '#0087FF',
            showCancel: false,
            success: (res) => {
            }
          })
        } else if (resultData === 2) { // 邀请新用户
          this.isStart = false
          this.isFinished = true
        } else if (resultData === 3) { // 问卷调查
          this.isStart = false
          this.isFinished = true
        } else {
          const index = resultData.index
          setTimeout(() => {
            this.transform = `transform: rotate(${this.rotateAngle}deg)`
          }, 100)
          this.rotateAngle = this.circle * 360 * this.cycle - (360 / 8 + (index - 1) * (360 / 8))
          console.log(this.rotateAngle, 'rotateAngle')
          this.cycle++
          setTimeout(() => {
            // uni.showToast({
            //   title: '恭喜您获得' + this.dataA[index].name,
            //   icon: 'none'
            // });
            this.isStart = false
            this.isFinished = true
            const prize = {
              text: this.dataA[index].name,
              src: this.dataA[index].src
            }
            this.$emit('end', prize)//向父组件发送结束事件
          }, 6300)
        }
        this.disabled = false
      } catch (e) {
        this.isStart = false
        this.isFinished = true
        this.disabled = false
        if (e.resultCode === -1) {
          this.resetToken()
          let code=this.lotteryCode
          // to re-login
          uni.showModal({
            title: '提示',
            content: '登录失效，请重新登录！',
            confirmColor: '#0087FF',
            cancelColor: '#999999',
            success: function (res) {
              if (res.confirm) {
                uni.redirectTo({
                  url: `/subPackagesA/personal/chooseLoginType?redirect=/subPackagesB/lottery/index&lotteryCode=${code}`
                })
              }
            },
          });
        } else {
          uni.showToast({
            title: `操作异常，请联系管理员(${e.resultCode})!`,
            icon: 'none',
            duration: 2000,
          });
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .lucky-draw {
    position: relative;
    width: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @keyframes move-data {
      0% {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);;
      }
    }

    .rotate-wrap {
      position: relative;
      width: 660rpx;
      height: 660rpx;
      animation: move-data 60s linear infinite;

      .rotate-bg {
        position: absolute;
        width: 660rpx;
        height: 660rpx;
      }

      .item {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 0;
        transform-origin: 50% 330rpx;

        .title {
          margin-top: 72rpx;
          color: #FD6D4F;
          font-size: 23rpx;
          line-height: 25rpx;
          text-align: center;
          width: 138rpx;
        }

        .icon {
          width: 86rpx;
          height: 86rpx;
          display: block;
          margin: 8rpx auto 0;
        }
      }
    }

    .base_bg {
      width: 477rpx;
      height: 182rpx;
      margin-top: -66rpx;
    }

    .people_num {
      width: 391rpx;
      height: 69rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 60rpx 60rpx 60rpx 60rpx;
      text-align: center;
      font-size: 28rpx;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 69rpx;
      margin-top: -90rpx;
    }

    .start {
      width: 159rpx;
      height: 217rpx;
      display: block;
      position: absolute;
      left: 330rpx;
      top: 330rpx;
      transform: translate(-50%, -50%);
    }
  }
</style>
