<template>
  <view class="changTime" :style="{'height':datebookStore.teacherBaseRespDTO.signatureContent?'calc( 100vh - 328rpx)':'calc( 100vh - 268rpx)'}">
    <view class="scroll-view">
      <scroll-view class="content" scroll-y>
        <view class="date-wrap">
          <view class="item" @click="changeDateTime(item.day)" v-for="item in state.dateList" :key="item.day">
            <text class="week">{{getWeek(item.day)}}</text>
            <text class="date" :class="item.day===state.date?'active-item':''">
              {{item.day?item.day.slice(-2):''}}
            </text>
          </view>
        </view>
        <view class="sub-title flex-s-c">
          <text class="left">{{state.date}} {{state.selectWeek}}</text>
          <text class="right">请提前一小时预约课程</text>
        </view>
        <view class="des-wrap">
          <view class="item can">
            <view class="block"></view>
            <text class="text">可预约</text>
          </view>
          <view class="item no">
            <view class="block"></view>
            <text class="text">不可预约</text>
          </view>
          <view class="item continue">
            <view class="block"></view>
            <text class="text">续课中</text>
          </view>
          <view class="item already">
            <view class="block"></view>
            <text class="text">已被预约</text>
          </view>
          <view class="item select">
            <view class="block"></view>
            <text class="text">选中</text>
          </view>
        </view>
        <view class="timetable flex-s-c">
          <view v-for="(item,index) in timeStatus"
                :key="index"
                class="item flex-c"
                @click="selectDateTime(item)"
                :class="[getStatus(item)]">
            {{getTime(item)}}
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="button-wrap">
      <view class="left">
        <view class="top">已选择
          <text class="num"> {{state.dateTimeList.length}}</text>
          节课
        </view>
        <view class="bottom">消耗{{pay}}课时</view>
      </view>
      <view class="right flex-c" :class="{'disabled':disabled}" @click="next">下一步</view>
    </view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import { getWeek } from '@/utils'
import { getEndMinutes } from '../timeTool'
import DatebookService from '@/api/DatebookService'

const datebookStore = useDatebookStore()
const state = reactive({
  params: {
    teacherId: '',
    datebookType: datebookStore.vipClass.params.datebookType,
    userId: datebookStore.vipClass.params.userId,
    packageId: datebookStore.vipClass.params.packageId,
    packageType: datebookStore.vipClass.params.packageType
  },
  dateTimeList: [], // 选中的日期 时间 老师id 对象形式
  dateList: [],
  timeScheduleMap: {},
  date: '', // 选中的日期
  selectWeek: '', // 选中的星期
  teacherType: '', // 每节课消耗课时
})

const next=async ()=> {
  if (datebookStore.vipClass.canAppointed ===1) {
    uni.showModal({
      title: '提示',
      content: `[08:00-23:50]时间段才开放预约，其他时间段不能进行VIP约课！`,
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          //
        }
      }
    })
    return
  }
  if (state.dateTimeList.length === 0) {
    uni.showToast({
      title: '请选择上课时段!',
      icon: 'none'
    })
    return
  }
  try {
    const params = {
      userId: datebookStore.vipClass.params.userId,
      dateTimeList: state.dateTimeList,
      packageType: datebookStore.vipClass.params.packageType,
      packageMergeId: datebookStore.vipClass.params.packageId,
    }
    const {resultData} = await DatebookService.childDatebookTimeList(params)
    datebookStore.vipClass.nextStepInfo=resultData
    uni.navigateTo({
      url: `/subPackagesD/vipClass/step4`
    })
  } catch (e) {
    if (e.resultCode === 3) {
      uni.showModal({
        title: '提示',
        content: e.resultMessage,
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            //
          }
        }
      })
    }
  }
}
const disabled = computed(() => {
  return state.dateTimeList.length===0 || datebookStore.vipClass.canAppointed===1;
})

function changeDateTime(item) {
  state.date = item
  state.selectWeek = `星期${getWeek(item)}`
}

function getTime(val) {
  let timeStr = Object.keys(val)[0]
  return timeStr.slice(0, 5)
}

function getStatus(obj) {
  let status = null
  for (let i in obj) {
    status = obj[i]
  }
  switch (status) {
    case 1:
      return '' //可选
    case 0:
      return 'appointed' //已被预约
    case 2:
      return 'disable' //没空
    case 3:
      return 'waiting' //待续课
    case 5:
      return 'choose' //选中
  }
}

function getTimeDetail(val) {
  //获取时间段
  let time = val.slice(0, 5)
  let endTime = getEndMinutes(time, 25)
  return `${time}-${endTime}`
}

const selectDateTime = async (item) => {
  let status = null
  for (let i in item) {
    status = item[i]
  }
  const time = Object.keys(item)[0]
  const timeDetail = getTimeDetail(time)
  const dateTime = `${state.date} ${timeDetail}`
  if (status === 1) { // 状态1可选
    try {
      const params = {
        ...state.params,
        dateTimeList: [dateTime]
      }
      //检验时间是否可选
      await DatebookService.checkVipDatebookTime(params)
      const paramsObj = {
        date: state.date,
        time: time,
        teacherId: state.params.teacherId
      }
      state.dateTimeList.push(paramsObj)
      item[time] = 5 // 标记为选中
      await checkVipStatus()
    } catch (e) {
      if (e.resultCode === 3) {
        uni.showModal({
          title: '提示',
          content: e.resultMessage,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              //
            }
          }
        })
      }
    }
  } else if (status === 5) {
    const params = {
      classDate: state.date,
      time: time,
      teacherId: state.params.teacherId
    }
    await DatebookService.cancelCheckTime(params)
    const index = state.dateTimeList.findIndex(item => {
      return `${item.date} ${item.time}` === `${params.classDate} ${params.time}`
    })
    if (index !== -1) {
      state.dateTimeList.splice(index, 1)
    }
    item[time] = 1 // 标记为取消选中
    await checkVipStatus()
  }
}
const checkVipStatus = async () => {
  try {
    const { resultData } = await DatebookService.checkVipDatebookStatus()
    datebookStore.vipClass.canAppointed = resultData
  } catch (e) {
    console.log(e)
  }
}

const timeStatus = computed(() => {
  let arr = []
  const item = state.timeScheduleMap[state.date]
  if (item) {
    arr = item
  }
  return arr
})
const pay = computed(() => {
  let str = '0'
  if (state.teacherType && state.dateTimeList.length > 0) {
    str = parseFloat(state.teacherType * state.dateTimeList.length).toFixed(2)
  }
  return str
})
onLoad((query) => {
  state.params.teacherId = query.userId
  state.teacherType = query.teacherType
  getScheduleList()
})
const getScheduleList = async () => {
  uni.showLoading({})
  const params = {
    ...state.params,
    currPage: 1,
    pageSize: 5
  }
  const { resultData } = await DatebookService.vipTeacherTime(params)
  if (resultData && resultData.length > 0) {
    state.dateList = resultData[0].dateList
    state.timeScheduleMap = resultData[0].timeScheduleMap
    // state.date // 默认选中的日期
    const item=state.dateList.find(item=>{
      return item.check===0
    })
    state.date=item.day
    changeDateTime(state.date)
  }
  uni.hideLoading()
}
</script>

<style scoped lang="scss">
  .changTime {
    position: relative; /* 设置相对定位 */
    display: flex;
    flex-direction: column;

    .scroll-view {
      flex-grow: 1;
      position: relative;
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .date-wrap {
        display: flex;
        align-items: center;
        padding: 46rpx 10rpx 30rpx;
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
        margin: 0 22rpx;
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

      .des-wrap {
        display: flex;
        align-items: center;
        margin: 18rpx 22rpx 44rpx;

        .item {
          display: flex;
          align-items: center;
          margin-right: 24rpx;

          .block {
            width: 20rpx;
            height: 20rpx;
            margin-right: 7rpx;
          }

          .text {
            font-size: 24rpx;
            color: #333333;
            line-height: 28rpx;
          }
        }

        .can {
          .block {
            background: #FDFDFD;
            border: 1PX solid #D4D4D4;
          }

          .text {
            color: #333333;
          }
        }

        .no {
          .block {
            background: #D4D4D4;
            opacity: 0.628;
            border: 1PX solid #E3E3E3;
          }

          .text {
            color: #CDCDCD;
          }
        }

        .continue {
          .block {
            background: #C8F2EF;
          }

          .text {
            color: #15C9BD;
          }
        }

        .already {
          .block {
            background: #FFEBC3;
          }

          .text {
            color: #FFAA00;
          }
        }

        .select {
          .block {
            background: #0084FF;
          }

          .text {
            color: #0084FF;
          }
        }

      }

      .timetable {
        flex-wrap: wrap;
        margin-top: 24rpx;
        padding-left: 22rpx;
        padding-right: 22rpx;
        padding-bottom: 120rpx;

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

        .disable {
          color: #D4D4D4;
        }

        .appointed {
          background: #FFAA00;
          opacity: 0.4;
          color: #FFFFFF;
        }

        .waiting {
          color: #FFFFFF;
          background: #15C9BD;
          opacity: 0.4;
        }

        .choose {
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
    }


    .button-wrap {
      position: absolute;
      width: 100%;
      height: 100rpx;
      bottom: 0;
      background: #ffffff;
      padding-bottom: env(safe-area-inset-bottom);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 22rpx;
        width: calc( 100% - 300rpx ) ;
        height: 100rpx;
        border-top: 1PX solid #eeeeee;
        border-bottom: 1PX solid #eeeeee;
        padding-top: 18rpx;
        padding-bottom: 12rpx;
        box-sizing: border-box;

        .top {
          font-size: 28rpx;
          color: #000000;
          line-height: 28rpx;
        }

        .num {
          font-size: 32rpx;
          color: #FF5E01;
        }

        .bottom {
          font-size: 20rpx;
          color: #999999;
          line-height: 28rpx;
        }
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
  }
</style>
