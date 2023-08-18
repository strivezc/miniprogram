<template>
  <uni-transition ref="ani" custom-class="transition" mode-class="fade" :show="show">
    <view>
      <view class="content" :style="showShare?'margin-bottom:140rpx':'margin-bottom:0'">
        <image mode="widthFix" :src="detailData.raffleTopImg" class="banner"></image>
        <view class="kf_area" @click="openContact" v-if="detailData.createrPhone || detailData.createrWxCode">
          <image mode="widthFix" src="@/subPackagesB/static/lottery/kf_logo.png" class="kf_logo centerSPCZ"/>
        </view>
        <lucky-draw class="lucky_wheel_wrap"
                    :lotteryCode="lotteryCode"
                    :isLogin="isLogin"
                    :prizeSortList="prizeSortList"
                    :detailData="detailData"
                    @showShareConfirm="showShareConfirm"
                    @end="endCallback">
        </lucky-draw>
        <activityDetail :detailData="detailData"
                        :prizeInfoList="prizeInfoList"
                        :myPrizeList="myPrizeList"
                        :isLogin="isLogin"
                        @openContact="openContact">
        </activityDetail>
        <shareButton v-if="showShare" class="share-button"></shareButton>
      </view>
      <result ref="result"
              :status="resultStatus"
              :productName="productName"
              :productIcon="productIcon">
      </result>
      <teacherContact ref="teacherContact"
                      :detailData="detailData"
                      v-if="detailData.createrPhone || detailData.createrWxCode">
      </teacherContact>
      <myConfirm ref="myConfirm"
                 :text="text"
                 :isShareButton="detailData.surplusNum===0"
                 confirmText="去邀请">
      </myConfirm>
    </view>
  </uni-transition>
</template>

<script>
import JigsawService from '@/api/JigsawService'
import { getRecommendCode } from '@/utils/auth'
import { getToken } from '@/utils/auth'
import { mapActions } from 'pinia'
import { useUserStore } from '@/store'
import LotteryService from '@/api/LotteryService'
import thanksForComing from '@/subPackagesB/static/lottery/thanksForComing.png'
import luckyDraw from './components/luckyDraw'
import result from './components/result'
import teacherContact from './components/teacherContact'
import activityDetail from './components/activityDetail'
import shareButton from './components/shareButton'
import myConfirm from '@/components/MyConfirm'

export default {
  components: { luckyDraw, result, teacherContact, activityDetail, shareButton, myConfirm },
  data() {
    return {
      show: false,
      lotteryCode: '',
      showShare: true,
      isLogin: Boolean(getToken()),
      detailData: {},
      prizeInfoList: [],
      prizeSortList: [],
      prizeRecordList: [],
      raffleCondition: '',

      resultStatus: false,
      productName: '',
      productIcon: '',
      userDistributorCode: ''
    }
  },
  onLoad(option) {
    console.log(option, 'option')
    this.lotteryCode = option.lotteryCode
  },
  async created() {
    await this.checkLogin()
    if (this.isLogin) {
      this.getPrizeInfoByLogin()
      this.getDistributorCode()
    } else {
      this.getPrizeInfoByNoLogin()
    }
    setTimeout(() => {
      this.show = !this.show
    }, 250)
  },
  computed: {
    myPrizeList() {
      return this.prizeRecordList.filter(item => {
        return item.prizeStatus === 0
      })
    },
    text() {
      return this.raffleCondition === 1 ? '暂无抽奖机会，邀请好友注册后可获得抽奖机会' : '暂无抽奖机会，邀请好友注册试听后可获得抽奖机会'
    }
  },
  onShareAppMessage(res) {
    // if (res.from === 'button') {
    //   // 来自页面内分享按钮
    //   console.log(res.target)
    // }
    return {
      title: this.detailData.shareTitleWeb,
      path: `/subPackagesA/home/giftPack?inviteSource=1&recommendCode=${getRecommendCode()}&userDistributorCode=${this.userDistributorCode}`,
      imageUrl: 'https://cos.talk915.com/data/image/8e3c3abf6e7c4a869c302198d88491e3.png'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['resetToken']),
    async getDistributorCode() {
      try {
        const { resultData } = await JigsawService.inviteGetCode(1)
        this.userDistributorCode = resultData.userDistributorCode
      } catch (e) {
        console.log(e, 'error')
      }
    },
    showShareConfirm() {
      this.$refs.myConfirm.open()
    },
    async checkLogin() {
      try {
        if (getToken()) {
          await LotteryService.checkLogin()
        }
      } catch (e) {
        if (e.resultCode === -1) {
          this.resetToken()
          this.isLogin = false
        }
      }
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      if (prize) {
        if (prize.text === '谢谢参与') {
          this.resultStatus = false
          this.refreshData()
        } else {
          this.resultStatus = true
          this.productName = prize.text
          this.productIcon = prize.src
          this.refreshData()
        }
        this.$refs.result.open()
      }
    },
    async getPrizeInfoByNoLogin() {
      try {
        const { resultData } = await LotteryService.queryNowRaffleInfo(this.lotteryCode)
        this.detailData = resultData || {}
        this.prizeInfoList = resultData.prizeInfoList
        this.prizeSortList = resultData.prizeSortList
        this.raffleCondition = resultData.raffleCondition
        // this.prizeRecordList = resultData.prizeRecordList;
        //转盘数据插入图片和活动名称
        this.prizeSortList.forEach(i => {
          const item = this.prizeInfoList.find(j => {
            return j.prizeGrade === i.prizeNo
          })
          if (item) {
            i.prizeImg = item.prizeImg
            i.prizeName = item.prizeName
          } else {
            i.prizeImg = thanksForComing
            i.prizeName = '谢谢参与'
          }
        })
      } catch (e) {
        if (e.resultMessage.indexOf('下架') > -1 || e.resultMessage.indexOf('结束') > -1) {
          this.showShare = false
        }
        console.log(e, 'error')
      }
    },
    async getPrizeInfoByLogin() {
      try {
        const { resultData } = await LotteryService.getPrizeActivityInfo(this.lotteryCode)
        this.detailData = resultData || {}
        this.prizeInfoList = resultData.prizeInfoList
        this.prizeSortList = resultData.prizeSortList
        this.prizeRecordList = resultData.prizeRecordList
        this.raffleCondition = resultData.raffleCondition
        //转盘数据插入图片和活动名称
        this.prizeSortList.forEach(i => {
          const item = this.prizeInfoList.find(j => {
            return j.prizeGrade === i.prizeNo
          })
          if (item) {
            i.prizeImg = item.prizeImg
            i.prizeName = item.prizeName
          } else {
            i.prizeImg = thanksForComing
            i.prizeName = '谢谢参与'
          }
        })
      } catch (e) {
        if (e.resultMessage.indexOf('下架') > -1 || e.resultMessage.indexOf('结束') > -1) {
          this.showShare = false
        }
        console.log(e, 'error')
      }
    },
    async refreshData() {
      try {
        const { resultData } = await LotteryService.getPrizeActivityInfo(this.lotteryCode, true)
        this.detailData = resultData || {}
        this.prizeRecordList = resultData.prizeRecordList
      } catch (e) {
        console.log(e, 'error')
      }
    },
    openContact() {
      this.$refs.teacherContact.open()
    }
  }
}
</script>

<style scoped lang="scss">
  .content {
    margin-bottom: 140rpx;
    line-height: 0;

    .banner {
      width: 100%;
    }

    .share-button {
      position: fixed;
      bottom: 0;
      width: 100%;
    }

    .lucky_wheel_wrap {
      display: flex;
      position: relative;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 822rpx;
      background: url(https://cos.talk915.com/data/image/1c58596d4bf440f08e093ad8287b45ca.png) center no-repeat;
      background-size: cover;
      margin-top: -2rpx;
    }

    .kf_area {
      position: fixed;
      z-index: 2;
      width: 96rpx;
      height: 96rpx;
      background: #ffffff;
      box-shadow: 0rpx 8rpx 22rpx 0rpx rgba(39, 72, 100, 0.3);
      right: 20rpx;
      bottom: 167rpx;
      border-radius: 50%;
    }

    .kf_logo {
      width: 48rpx;
    }
  }
</style>
