<template>
  <view class="container">
    <view class="title" :style="'padding-top:' + titleHeight + 'px'">说客英语</view>
    <MySwiper :titleHeight="titleHeight" :bannerList="bannerList" @clickBanner="clickBanner"></MySwiper>
    <ActivityCollection
        :status="status"
        :voteTopImg="voteTopImg"
        :haveLottery="haveLottery"
        :haveStepTask="haveStepTask"
        :getTrialClass="getTrialClass"
        :entranceStatus="entranceStatus"
        :attendClass="attendClass"
        :lotteryCode="lotteryCode"
        :isLogin="isLogin">
    </ActivityCollection>
    <KnowTalk915></KnowTalk915>
    <uni-popup ref="popup" type="center" @maskClick="close" :animation="false">
      <view class="popup-wrap">
        <image
            mode="widthFix"
            :src="popUpInfo.imgUrl"
            class="popup-img"
            @click="clickBanner(popUpInfo.linkUrl, popUpInfo.id, popUpInfo.title, popUpInfo.position)"
        ></image>
        <image
            mode="widthFix"
          src="@img/common/close.png"
          class="popup-close"
          @click="close"
        ></image>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import MySwiper from './components/MySwiper'
import KnowTalk915 from './components/KnowTalk915'
import ActivityCollection from './components/ActivityCollection'
import { preLoadPag } from '@/utils/preLoadPag'
// import { preLoadSvga } from '@/utils/preLoadSvga';
import { getToken, getRecommendCode, setRecommendCode } from '@/utils/auth'
import VoteService from '@/api/VoteService'
import CommonService from '@/api/CommonService'
import JigsawService from '@/api/JigsawService'
import LotteryService from '@/api/LotteryService'
import StepTaskService from '@/api/StepTaskService'
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/store'

export default {
  components: { MySwiper, KnowTalk915, ActivityCollection },
  data() {
    return {
      titleHeight: '',
      voteTopImg: '', //投票活动顶部图片
      bannerList: [],
      popUpInfo: {},
      entranceStatus: null, //  0显示 1不显示
      providePrizeList: [],

      isLogin: false,
      haveLottery: false,
      lotteryCode: '',
      haveStepTask: false
    }
  },
  onLoad(query) {
    console.log(query, 'query')
    let recommendCode = query.recommendCode || getRecommendCode()
    console.log(recommendCode, 'recommendCode')
    if (recommendCode) {
      setRecommendCode(recommendCode)
      this.setRecommendCode(recommendCode)
    }
    this.getHeight()
    this.checkLogin()
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
    preLoadPag('qiqimonkey')
  },
  onShow() {
    this.getActivityStatistics()
    this.getEntranceStatus()
    this.getBanner()
    this.queryNowRaffleInfo()
    this.queryStepStatus()
    if (getToken()) {
      this.popUpPage()
      this.getExperienceCourseDetail()
    }
    this.isLogin = Boolean(getToken())
  },
  computed: {
    // 是否领取体验课 和 是否上过课判断
    ...mapState(useUserStore, ['token', 'status', 'getTrialClass', 'attendClass'])
  },
  methods: {
    ...mapActions(useUserStore, ['setRecommendCode', 'resetToken', 'getExperienceCourseDetail']),
    async checkLogin() {
      try {
        if (getToken()) {
          await CommonService.checkLogin()
          this.isLogin = true
        }
      } catch (e) {
        if (e.resultCode === -1) {
          this.resetToken()
          this.isLogin = false
        }
      }
    },
    async queryStepStatus() {
      try {
        const { resultData } = await StepTaskService.queryStepStatus()
        this.haveStepTask = resultData === 0
      } catch (e) {
        console.log(e, 'error')
      }
    },
    async queryNowRaffleInfo() {
      try {
        const { resultData } = await LotteryService.appletQueryNowRaffleInfo()
        this.lotteryCode = resultData.activityCode
        this.haveLottery = true
      } catch (e) {
        console.log(e, 'error')
      }
    },
    async getEntranceStatus() {
      try {
        const { resultData } = await JigsawService.queryEntranceStatus()
        this.entranceStatus = resultData.entranceStatus
      } catch (e) {
        console.log(e, 'error')
      }

    },
    async queryProvidePrize() {
      try {
        const { resultData } = await JigsawService.queryProvidePrize()
        const arr = resultData
        if (arr.length > 0) {
          const objProp = {
            1: '透视道具',
            2: '重置道具',
            3: '时间道具'
          }
          const text1 = arr.length > 1 ? '获得以下道具' : arr[0].provideTitle
          let text2 = ''
          if (arr && arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].prizeType === 0) {
                text2 += `${objProp[arr[i].prizeDate]}x${arr[i].numOfPrize}份、`
              } else {
                text2 += `奇奇币x${arr[i].numOfPrize}、`
              }
            }
          }
          text2 = text2.slice(0, -1)
          uni.showModal({
            title: '恭喜获得',
            content: `${text1}\n${text2}`,
            confirmColor: '#0087FF',
            cancelColor: '#999999',
            success: function(res) {
              if (res.confirm) {
                JigsawService.providePrizeReply()
                uni.navigateTo({
                  url: '/subPackagesC/jigsawActivity/index?openRecord=true'
                })
              } else if (res.cancel) {
                JigsawService.providePrizeReply()
              }
            }
          })
        }
      } catch (e) {
        if (e.resultCode === -1) {
          this.resetToken()
        }
      }

    },
    close() {
      this.$refs.popup.close()
      this.queryProvidePrize()
    },
    clickBanner(imgUrl, id, title, position = 13) {
      if (imgUrl) {
        this.clickBannerRecord(id, title, position)
        let url = encodeURIComponent(imgUrl)
        uni.navigateTo({
          url: `/components/webview/index?url=${url}`
        })
        if (position === 14) {
          this.close()
        }
      }
    },
    async clickBannerRecord(id, title, position) {
      try {
        await CommonService.clickBanner({ id, title, position })
      } catch (e) {
        console.log(e, 'error')
      }
    },
    async getActivityStatistics() {
      try {
        const { resultData } = await VoteService.queryActivityStatistics()
          this.voteTopImg = resultData.voteTopImg;
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async getBanner() {
        try {
          const { resultData } = await CommonService.banner();
          this.bannerList = resultData;
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async popUpPage() {
        try {
          if (!uni.getStorageSync('popUp')) {
            const { resultData } = await CommonService.popUpPage();
            if (resultData.imgUrl) {
              this.popUpInfo = resultData;
              this.$refs.popup.open();
              uni.setStorageSync('popUp', 'yes', 24 * 60 * 60);
            } else {
              this.queryProvidePrize();
            }
          } else {
            this.queryProvidePrize()
          }
        } catch (e) {
          console.log(e, 'error')
        }
      },
      getHeight() {
        let res = wx.getMenuButtonBoundingClientRect();
        this.titleHeight = res.top;
      },
    },
  };
</script>

<style scode lang="scss">
  .container {
    margin: 0 31rpx;
    padding-bottom: 100rpx;
    .title {
      position: fixed;
      top: 0;
      z-index: 99;
      width: 100%;
      background: #ffffff;
      font-size: 48rpx;
      font-weight: 500;
      color: #333333;
      line-height: 64rpx;
      margin-left: -31rpx;
      padding-left: 31rpx;
    }

    .voteTopImg {
      height: 304rpx;
      width: 686rpx;
      border-radius: 16rpx;
      margin-bottom: 48rpx;
    }

    .title2 {
      display: block;
      margin-bottom: 20rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
      line-height: 42rpx;
    }

    .popup-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .popup-img {
        width: 750rpx;
      }

      .popup-close {
        margin-top: 56rpx;
        width: 44rpx;
      }
    }
  }
</style>
