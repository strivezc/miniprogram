<template>
  <view class="step4">
    <van-config-provider :theme-vars="state.themeVars">
      <van-notice-bar wrapable text="续课将根据所选时段预先扣除课时，如果老师未打开相应时间，则系统将返还相应课时到您预约使用的套餐包。"/>
    </van-config-provider>
    <view class="title">请选择续课周数</view>
    <view class="timetable flex-s-c">
      <view v-for="item in weekList"
            :key="item.val"
            class="item flex-c"
            @click="selectDateTime(item.val)"
            :class="{'item-selected':item.val === state.params.week,'item-disabled':disabled}">
        {{item.name}}
      </view>
    </view>
    <view class="title mb-32">续课课表</view>
    <view class="li" v-for="(item,index) in state.infoObj.checkDateTimeList" :key="index">
      <view class="text"> {{ item.dateTime }} {{ item.weekDay }}</view>
      <image mode="widthFix" class="close" src="@/subPackagesD/images/iv_close_yellow.png"
             @click="deleteItem(item.dateTime,index)"></image>
    </view>
    <view class="button-wrap" @click="next">
      <view class="btn flex-c">下一步</view>
    </view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import DatebookService from '@/api/DatebookService'

const weekList = [
  { val: 0, name: '不续课' },
  { val: 1, name: '一周' },
  { val: 2, name: '二周' },
  { val: 3, name: '三周' },
  { val: 4, name: '四周' },
  { val: 5, name: '五周' },
  { val: 6, name: '六周' },
  { val: 7, name: '七周' },
  { val: 8, name: '八周' },
  { val: 9, name: '九周' },
  { val: 10, name: '十周' },
  { val: 11, name: '十一周' },
  { val: 12, name: '十二周' },
  { val: 13, name: '十三周' },
  { val: -1, name: '无限' }
]

const datebookStore = useDatebookStore()
const state = reactive({
  themeVars: {
    noticeBarHeight: '92rpx',
    noticeBarBackgroundColor: '#FFF8EB',
    noticeBarTextColor: '#FFAA00',
    noticeBarFontSize: '24rpx',
    noticeBarLineHeight: '28rpx'
  },
  params: {
    week: null,
    secretKey: datebookStore.vipClass.nextStepInfo.secretKey
  },
  canSubmit: 0,
  finalWeek: 0,
  infoObj: datebookStore.vipClass.nextStepInfo
})

const disabled = computed(() => {
  return state.canSubmit === 1 || state.infoObj.checkDateTimeList.length === 0
})
const next = async () => {
  if (state.params.week === null) {
    uni.showToast({
      title: '请选择续课周数!',
      icon: 'none'
    })
    return
  }
  try {
    const { resultData } = await DatebookService.childVipSelectLesson(state.params)
    datebookStore.vipClass.lastStepInfo = resultData
    uni.navigateTo({
      url: `/subPackagesD/vipClass/step5`
    })
  } catch (e) {
    if (e.resultCode === 3) {
      uni.showModal({
        title: '提示',
        content: e.resultMessage,
        confirmColor: '#0087FF',
        success: async (res) => {
          if (res.confirm) {
            //
          }
        }
      })
    }
  }
}
const deleteItem = async (dateTime, index) => {
  try {
    const params = {
      packageMergeId: datebookStore.vipClass.nextStepInfo.packageMergeId,
      week: state.params.week === null ? 0 : state.params.week,
      secretKey: state.params.secretKey,
      dateTimeList: [dateTime]
    }
    uni.showModal({
      title: '提示',
      content: '确定删除此项吗？',
      confirmColor: '#0087FF',
      success: async (res) => {
        if (res.confirm) {
          const { resultData } = await DatebookService.removeDateTime(params)
          state.finalWeek = resultData.finalWeek
          state.canSubmit = resultData.canSubmit
          state.infoObj.checkDateTimeList.splice(index, 1)
        }
      }
    })
  } catch (e) {
    console.log(e, 'error')
  }
}
const selectDateTime = async (week) => {
  state.params.week = week
  try {
    const { resultData } = await DatebookService.continuedBooked(state.params)
    if (resultData.failTimeList && resultData.failTimeList.length !== 0) {
      //提示老师请假日期
      // state.failTimeList = resultData.failTimeList;
    }
    if (resultData.holidayTimeList && resultData.holidayTimeList.length !== 0) {
      //提示已被预约日期
      // state.holidayTimeList = resultData.holidayTimeList;
    }
    if (resultData.finalWeek) {
      //提示超过最大续课周数
      resultData.finalWeek = resultData.finalWeek > 13 ? -1 : resultData.finalWeek
      if ((state.params.week > resultData.finalWeek || state.params.week == -1) && resultData.finalWeek != -1) {
        uni.showModal({
          title: '提示',
          content: `您的套餐余额最多续课${resultData.finalWeek}周！`,
          confirmColor: '#0087FF',
          confirmText: '我知道了',
          success: async (res) => {
            if (res.confirm) {
              state.params.week = resultData.finalWeek
            }
          }
        })
      }
    }
    state.canSubmit = resultData.canSubmit
  } catch (e) {
    if (e.resultCode === 3) {
      uni.showModal({
        title: '提示',
        content: e.resultMessage,
        confirmColor: '#0087FF',
        success: async (res) => {
          if (res.confirm) {
            //
          }
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
  .step4 {
    padding-bottom: calc(102rpx + env(safe-area-inset-bottom));

    .title {
      display: block;
      font-weight: 500;
      font-size: 32rpx;
      color: #333333;
      line-height: 45rpx;
      margin: 40rpx 32rpx;
    }

    .li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 40rpx;
      padding-right: 10rpx;
      height: 100rpx;
      box-sizing: border-box;
      border-bottom: 1PX solid #eeeeee;

      .text {
        font-size: 28rpx;
        color: #666666;
      }

      .close {
        width: 22rpx;
        height: 22rpx;
        padding: 30rpx;
      }
    }

    .mb-32 {
      margin-bottom: 32rpx;
    }

    .timetable {
      flex-wrap: wrap;
      margin-top: 24rpx;
      padding-left: 32rpx;
      padding-right: 32rpx;
      padding-bottom: 20rpx;
      border-bottom: 18rpx solid #F2F2F2;;

      .item {
        box-sizing: border-box;
        width: 154rpx;
        height: 70rpx;
        background: #FDFDFD;
        border-radius: 8rpx;
        border: 1PX solid #E3E3E3;
        font-size: 28rpx;
        color: #333333;
        margin-bottom: 23rpx;
      }

      .item-disabled {
        border: 1PX solid #E3E3E3;
        color: #CCCCCC;
      }

      .item-selected {
        border: 1PX solid transparent;
        color: #FFFFFF;
        background: #0087FF;
      }

      &:after {
        content: "";
        width: 154rpx;
        height: 70rpx;
        margin-bottom: 23rpx;
      }
    }

    .button-wrap {
      position: fixed;
      width: 100%;
      height: 100rpx;
      bottom: 0;
      background: #ffffff;
      padding-bottom: env(safe-area-inset-bottom);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .btn {
        width: 100%;
        height: 100rpx;
        font-size: 32rpx;
        color: #FFFFFF;
        background: #0087FF;
      }
    }
  }
</style>
