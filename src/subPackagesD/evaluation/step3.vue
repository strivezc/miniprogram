<template>
  <view class="step3">
    <view class="package">
      <template v-if="filterPackageMergeList.length === 0 && inactivatedList.length === 0">
        <view class="none-item flex-s-c" @click="callMobileArea">
          <view class="left">
            <text class="tip">暂无可用套餐，无法约课</text>
            <text class="blue">去联系专属学习顾问</text>
          </view>
          <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
        </view>
      </template>
      <template v-else>
        <view class="none-item flex-s-c" @click="choosePackage" v-if="!state.choosePackageItem.name">
          <view class="left yellow">
            存在未激活套餐，点击前往激活
          </view>
          <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
        </view>
        <view class="package-item flex-s-c" @click="choosePackage" v-else>
          <view class="left flex-c">
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon2.png"
                   v-if="state.choosePackageItem.productType === 0"></image>
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon1.png"
                   v-else-if="state.choosePackageItem.productType === 1"></image>
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/card-other.png"
                   v-else-if="state.choosePackageItem.productType === 4"></image>
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon3.png" v-else></image>
            <view class="text-wrap">
              <text class="name">{{ state.choosePackageItem.name }}</text>
              <view class="bottom">
                <text class="num mr-30">{{ state.choosePackageItem.balance }}课时</text>
                <text class="date">有效期：{{ state.choosePackageItem.validityTime }}</text>
              </view>
            </view>
          </view>
          <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
        </view>
      </template>
    </view>
    <text class="title">预约口语测评时间</text>
    <view class="date-wrap">
      <view class="item" @click="changeDateTime(item)" v-for="item in state.evaluationMap" :key="item.date">
        <text class="week">{{formatWeek(item.week)}}</text>
        <text class="date" :class="item.date===state.date?'active-item':''">
          {{item.date?item.date.slice(-2):''}}
        </text>
      </view>
    </view>
    <view class="sub-title flex-s-c">
      <text class="left">{{state.date}} {{state.selectWeek}}</text>
      <text class="right">请提前一小时预约课程</text>
    </view>
    <view class="timetable flex-s-c">
      <view v-for="item in state.selectList"
            :key="item.time"
            class="item flex-c"
            @click="selectDateTime(item)"
            :class="{'item-disabled':item.status=== 2,'item-selected':item.time===state.dateTime}">
        {{item.time?item.time.slice(0,5):''}}
      </view>
    </view>
    <view class="button-group flex-s-c">
      <view class="left">每节口语测评课消耗{{state.tip}}课时</view>
      <view class="right flex-c" :class="{'disabled':disabled}" @click="checkDateBookDateTime">确认预约</view>
    </view>
    <myConfirm ref="confirm"
               title="温馨提示"
               :text="state.text"
               @confirm="submit"
               textAlign="left"
    >
    </myConfirm>
  </view>
</template>

<script setup>
import { useDatebookStore, useUserStore } from '@/store'
import { parseTime } from '@/utils/index'
import myConfirm from '@/components/MyConfirm'
import { getMobileArea } from '@/utils/auth'
import UserService from '@/api/UserService'
import DatebookService from '@/api/DatebookService'

const datebookStore = useDatebookStore()
const userStore = useUserStore()
const state = reactive({
  evaluationMap: datebookStore.evaluation.evaluationMap,
  tip: datebookStore.evaluation.tip,
  date: '',
  selectWeek: '',
  selectList: '',
  dateTime: '',
  text: '',
  choosePackageItem: {
    productType: '',
    name: '',
    balance: '',
    validityTime: ''
  },
  mobileArea: getMobileArea(),
  isSubmitAlert:true,
  isSubmitNext:false,
})

onLoad((query) => {
  uni.$on('getPackageName', getPackageName);
  getPackageName(datebookStore.evaluation.defaultPackageId)
})
onUnload(() => {
  uni.$off('getPackageName');
});
const confirm = ref()
const checkDateBookDateTime = async () => {
  if (disabled.value) return
  let submitText = `每1节口语测评课将会使用 <span style="color: #FF5E01">${state.tip}</span> 课时，<span style="color: #FF5E01">测评课一旦预约成功无法取消，无法退课</span>。确认测评课程时间： <br><p style="color: #FF5E01;text-align: center">预约：${state.date} ${state.dateTime}</p>`
  const dateTime=`${state.date} ${state.dateTime}`
  const {resultData} = await DatebookService.checkDateBookDateTime({ dateTime })
  if (resultData.flag == 1) {
    state.text=resultData.messageTip
    state.isSubmitAlert=false
    confirm.value.open()
  } else if (resultData.flag == 2) {
    state.text=resultData.messageTip
    state.isSubmitAlert=true
    state.isSubmitNext=true
    confirm.value.open()
  } else {
    state.text=submitText
    confirm.value.open()
  }
}
const submit = async () => {
  if (!state.isSubmitAlert) {
    state.isSubmitAlert=true
    return
  }
  if (state.isSubmitAlert && state.isSubmitNext) {
    state.text=`每1节口语测评课将会使用 <span style="color: #FF5E01">${state.tip}</span> 课时，<span style="color: #FF5E01">测评课一旦预约成功无法取消，无法退课</span>。确认测评课程时间： <br><p style="color: #FF5E01;text-align: center">预约：${state.date} ${state.dateTime}</p>`
    confirm.value.open()
    state.isSubmitNext=false
    return
  }
  try {
    const dateTime=`${state.date} ${state.dateTime}`
    const params = {
      ...datebookStore.evaluation.form,
      dateTime,
      lastAssessClass: datebookStore.evaluation.theLastAssessClass,
      comeFrom: 0,
    }
    console.log(params,'params')
    await DatebookService.submitEvaluation(params)
    uni.redirectTo({
      url: `/subPackagesD/components/result?fromPage=evaluation`
    })
  } catch (e) {
    console.log(e, 'error')
  }
}
const callMobileArea = async () => {
  if (state.mobileArea) {
    uni.makePhoneCall({
      phoneNumber: state.mobileArea
    })
  } else {
    const { resultData } = await UserService.mobileArea()
    userStore.setMobileArea(resultData)
    uni.makePhoneCall({
      phoneNumber: resultData
    })
  }
}

function choosePackage() {
  let packageMergeId=datebookStore.evaluation.form.packageId
  uni.navigateTo({
    url: `/subPackagesD/components/choosePackage?packageMergeId=${packageMergeId}`
  })
}

function formatWeek(val) {
  let str = ''
  if (val) {
    str = val.replace('星期', '')
  }
  return str
}

function changeDateTime(item) {
  if (state.date === item.date) return
  state.date = item.date
  state.selectWeek = item.week
  state.selectList = item.list
  state.dateTime = ''
}

function selectDateTime(item) {
  if (item.status === 2) return
  state.dateTime = item.time
}

onMounted(() => {
  console.log('onMounted')
  let curTime = parseTime(new Date(), '{y}-{m}-{d}')
  const curItem = state.evaluationMap.find(item => {
    return item.date === curTime
  })
  changeDateTime(curItem)
})
const disabled = computed(() => {
  return !(state.dateTime && datebookStore.evaluation.form.packageId)
})
const filterPackageMergeList = computed(() => {
  const activatedList = datebookStore.evaluation.list.filter((item) => item.activateTime && item.status === 0)
  const packageMergeList = [...datebookStore.evaluation.packageMergeList]
  activatedList.forEach((item) => {
    item.name = item.productName
  })
  packageMergeList.forEach((item) => {
    switch (item.productType) {
      case 0:
        item.name = '次卡套餐包'
        break
      case 1:
        item.name = '月卡套餐包'
        break
      case 4:
        item.name = '口语测评套餐包'
        break
      default:
        item.name = '周卡套餐包'
    }
  })
  return [...packageMergeList, ...activatedList]
})
const inactivatedList = computed(() => {
  return datebookStore.evaluation.list.filter((item) => !item.activateTime)
})

function getPackageName(packageMergeId) {
  const index = filterPackageMergeList.value.findIndex((item) => item.packageMergeId == packageMergeId)
  if (index > -1) {
    setData(index)
  } else if (index === -1 && filterPackageMergeList.value.length > 0) { // 没有指定默认套餐，选第一个套餐包
    setData(0)
  }

  function setData(index) {
    const item = filterPackageMergeList.value[index]
    state.choosePackageItem.name = item.name
    state.choosePackageItem.balance = item.balance
    state.choosePackageItem.productType = item.productType
    state.choosePackageItem.validityTime = item.validityTime

    datebookStore.evaluation.form.packageId = item.packageMergeId ? item.packageMergeId : item.packageId
    datebookStore.evaluation.form.packageType = item.packageMergeId ? 1 : 2
  }
}
</script>

<style scoped lang="scss">
  .step3 {
    .title {
      display: block;
      font-weight: 500;
      font-size: 40rpx;
      color: #333333;
      line-height: 56rpx;
      margin: 0 32rpx;
      margin-top: 50rpx;
    }

    .date-wrap {
      display: flex;
      align-items: center;
      margin-top: 66rpx;
      padding-bottom: 30rpx;
      border-bottom: 20rpx solid #F2F6FC;
      overflow-x: auto;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 25rpx;
        padding-left: 25rpx;

        .week {
          font-size: 24rpx;
          font-weight: 400;
          color: #999999;
          line-height: 24rpx;
          margin-bottom: 20rpx;
        }

        .date {
          position: relative;
          width: 56rpx;
          height: 56rpx;
          background: #FFFFFF;
          border-radius: 44rpx 44rpx 44rpx 44rpx;
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          line-height: 56rpx;
          text-align: center;
          display: inline-block;
        }

        .active-item {
          background: #0087FF;
          color: #FFFFFF;
        }
      }
    }

    .sub-title {
      margin: 0 32rpx;
      margin-top: 30rpx;

      .left {
        font-size: 32rpx;
        color: #333333;
        line-height: 45rpx;
      }

      .right {
        font-size: 24rpx;
        color: #999999;
        line-height: 33rpx;
      }
    }

    .timetable {
      flex-wrap: wrap;
      margin-top: 24rpx;
      padding-left: 22rpx;
      padding-right: 22rpx;
      padding-bottom: 250rpx;

      .item {
        box-sizing: border-box;
        width: 128rpx;
        height: 64rpx;
        background: #FDFDFD;
        border-radius: 8rpx;
        border: 1PX solid #E3E3E3;
        font-size: 32rpx;
        color: #333333;
        margin-bottom: 30rpx;
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
        width: 128rpx;
        height: 64rpx;
        border: 1PX solid transparent;
        margin-bottom: 30rpx;
      }
    }

    .button-group {
      position: fixed;
      bottom: env(safe-area-inset-bottom);
      margin-bottom: 0;
      width: 100%;
      height: 100rpx;

      .left {
        padding-left: 25rpx;
        font-size: 28rpx;
        color: #666666;
        flex: 1;
        height: 100rpx;
        line-height: 100rpx;
        border-top: 1PX solid #eeeeee;
        border-bottom: 1PX solid #eeeeee;
        box-sizing: border-box;
      }

      .right {
        width: 300rpx;
        height: 100rpx;
        background: #0084FF;
        font-size: 32rpx;
        color: #FFFFFF;
      }

      .disabled {
        background: #CCCCCC;
      }
    }

    .package {
      margin: 50rpx 32rpx;
    }

    .package-item {
      padding: 20rpx;
      box-sizing: border-box;
      width: 100%;
      height: 138rpx;
      background: #ffffff;
      border-radius: 16rpx;
      box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(219, 219, 219, 0.5);

      .left {
        .icon {
          width: 84rpx;
          height: 96rpx;
          margin-right: 20rpx;
        }

        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 96rpx;
          .name {
            font-size: 32rpx;
            color: #333333;
            line-height: 32rpx;
          }

          .bottom {
            font-size: 24rpx;
            color: #666666;
            line-height: 36rpx;

            .num {
              color: #666666;
            }

            .date {
              color: #999999;
            }
          }


          .mr-30 {
            margin-right: 30rpx;
          }
        }
      }

      .right {
        width: 14rpx;
        height: 24rpx;
      }
    }

    .none-item {
      padding: 26rpx 30rpx;
      box-sizing: border-box;
      width: 100%;
      height: 124rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(219, 219, 219, 0.5);

      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;

        .tip {
          font-size: 28rpx;
          color: #333333;
          line-height: 28rpx;
        }

        .blue {
          font-size: 28rpx;
          color: #0087FF;
          line-height: 28rpx;
        }
      }

      .yellow {
        font-size: 32rpx;
        color: #FF5E01;
        justify-content: center;
      }

      .right {
        width: 14rpx;
        height: 24rpx;
      }
    }
  }
</style>
