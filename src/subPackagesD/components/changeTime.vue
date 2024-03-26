<template>
  <view class="changTime" :style="{'height':datebookStore.teacherBaseRespDTO.signatureContent?'calc( 100vh - 330rpx)':'calc( 100vh - 270rpx)'}">
    <view class="scroll-view">
      <scroll-view class="content" scroll-y>
        <view class="date-wrap">
          <view class="item" @click="changeDateTime(item)" v-for="item in state.dateList" :key="item">
            <text class="week">{{item===state.currDate?'今天':getWeek(item)}}</text>
            <text class="date" :class="item===state.date?'active-item':''">
              {{item?item.slice(-2):''}}
            </text>
          </view>
        </view>
        <view class="sub-title flex-s-c">
          <text class="left">{{state.date}} {{state.selectWeek}}</text>
          <text class="right">请提前一小时预约课程</text>
        </view>
        <view class="timetable flex-s-c">
          <view v-for="item in timeStatus"
                :key="item.time"
                class="item flex-c"
                @click="selectDateTime(item)"
                :class="{'item-disabled':item.status !=1,'item-selected':item.checked && item.status===1}">
            {{item.time?item.time.slice(0,5):''}}
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="button-wrap">
      <view class="left">
        <view class="top">已选择
          <text class="num"> {{state.params.checkedDateTimeList.length}}</text>
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
import { getWeek, parseTime } from '@/utils'
import DatebookService from '@/api/DatebookService'

const datebookStore = useDatebookStore()
const state = reactive({
  params: {
    teacherId: '',
    datebookType: datebookStore.freeClass.params.datebookType,
    checkedDateTimeList: [] // 选中的日期 时间 2024-03-21 06:30-06:25
  },
  dateList: [],
  dateTimeScheduleList: [],
  date: '', // 选中的日期
  selectWeek: '', // 选中的星期
  teacherType: '', // 每节课消耗课时
  timeArr: [], // 后端返回的排好序的时间列表
  currDate: parseTime(new Date(), '{y}-{m}-{d}')
})

function next() {
  if (state.params.checkedDateTimeList.length === 0) {
    uni.showToast({
      title: '请选择上课时段!',
      icon: 'none'
    })
    return
  }
  checkTimeList()
}
const disabled = computed(() => {
  return state.params.checkedDateTimeList.length===0;
})
// 约课时间检测
const checkTimeList=async ()=> {
  try {
    uni.showLoading({})
    const params = {
      userId: datebookStore.freeClass.params.userId,
      packageId: datebookStore.freeClass.params.packageId,
      packageType: datebookStore.freeClass.params.packageType,
      dateTimeList: state.params.checkedDateTimeList
    }
    const {resultData} = await DatebookService.checkBatchTime(params)
    state.timeArr = resultData;
    checkBookTime()
  } catch (e) {
   if (e.resultCode===3) {
     uni.hideLoading()
     uni.showModal({
       title: '提示',
       content: e.resultMessage,
       confirmColor: '#0087FF',
       success: function(res) {
         if (res.confirm) {
           //
         }
       }
     })
   }
  }
}
// 检测约课课时数是否足够
const checkBookTime=async ()=>{
  try {
    const params={
      teacherId: state.params.teacherId,
      packageId: datebookStore.freeClass.params.packageId,
      packageType: datebookStore.freeClass.params.packageType,
      num: state.timeArr.length,
      price:state.teacherType
    }
    datebookStore.freeClass.timeArr=state.timeArr
    await DatebookService.checkDatebookNum(params)
    uni.hideLoading()
    uni.navigateTo({
      url: `/subPackagesD/freeClass/step4?num=${state.params.checkedDateTimeList.length}&teacherId=${state.params.teacherId}&teacherType=${state.teacherType}`
    })
  } catch (e) {
    uni.hideLoading()
    console.log(e, 'error')
  }
}

function changeDateTime(item) {
  state.date = item
  state.selectWeek = `星期${getWeek(item)}`
  getScheduleList()
}

function selectDateTime(item) {
  if (item.status === 1) {
    const currSelectTime = `${state.date} ${item.value}`
    if (!state.params.checkedDateTimeList.includes(currSelectTime)) {
      state.params.checkedDateTimeList.push(currSelectTime)
      item.checked = true
    } else {
      let index = state.params.checkedDateTimeList.indexOf(currSelectTime)
      if (index !== -1) {
        state.params.checkedDateTimeList.splice(index, 1)
        item.checked = false
      }
    }
  }

}

const timeStatus = computed(() => {
  let arr = []
  const index = state.dateTimeScheduleList.findIndex(item => {
    return item.classDate === state.date
  })
  if (index > -1) {
    arr = state.dateTimeScheduleList[index].timeStatus
  }
  return arr
})
const pay = computed(() => {
  let str = '0'
  if (state.teacherType && state.params.checkedDateTimeList.length > 0) {
    str = parseFloat(state.teacherType * state.params.checkedDateTimeList.length).toFixed(2)
  }
  return str
})
onLoad((query) => {
  state.params.teacherId = query.userId
  state.date = query.date
  state.teacherType = query.teacherType
  changeDateTime(state.date)
})
const getScheduleList = async () => {
  uni.showLoading({})
  const { resultData } = await DatebookService.queryTeacherScheduleForApp(state.params)
  state.dateList = resultData.dateList
  state.dateTimeScheduleList = resultData.dateTimeScheduleList
  uni.hideLoading()
}
</script>

<style scoped lang="scss">
  .changTime {
    width: 100%;
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
        padding-top: 46rpx;
        padding-bottom: 30rpx;
        border-bottom: 20rpx solid #F2F6FC;
        overflow-x: auto;
        padding-left: 10rpx;
        padding-right: 10rpx;

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
    }

    .button-wrap {
      /*flex-shrink: 0;*/
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
