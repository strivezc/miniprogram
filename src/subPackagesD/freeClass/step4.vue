<template>
  <view class="step4">
    <view class="title-wrap flex-s-c">
      <view class="title">共
        <text class="yellow">{{state.num}}</text>
        节课，选择课程教材
      </view>
      <view class="flex-c" @click="clear">
        <image mode="widthFix" class="clear" src="@/subPackagesD/images/clear.png"></image>
        <view class="text">清空</view>
      </view>
    </view>
    <view class="course-list">
      <view class="li" v-for="(item,index) in state.courseList" :key="item.dateTime"
            @click="selectLesson(item.dateTime,index)">
        <view class="left-wrap" :class="{'center':!item.bookName}">
          <view class="top">{{formatDateTime(item.dateTime)}}</view>
          <view class="bottom-wrap" v-if="item.bookName">
            <view class="left">{{item.bookName}}</view>
            <view class="right">{{item.lessonName}}</view>
          </view>
        </view>
        <image mode="widthFix" class="arrow" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
      </view>
    </view>

    <view class="button-group flex-s-c">
<!--      <view class="left" v-if="state.showReplace">-->
      <view class="left">
        <view class="flex-l-c" @click="changeAllowSubstituteTeacher">
          <view class="radio" v-show="state.allowSubstituteTeacher===0"></view>
          <image mode="widthFix" class="icon-radio" src="@/subPackagesD/images/radio_select.png"
                 v-show="state.allowSubstituteTeacher===1"></image>
          <view class="text">同意自动代课</view>
        </view>
        <image mode="widthFix" class="icon-question" @click="openTooltip"
               src="@/subPackagesD/images/iv_question.png"></image>
      </view>
      <view class="right flex-c" @click="submit">确认预约</view>
    </view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import { formatDateTime } from '../timeTool'
import DatebookService from '@/api/DatebookService'

onShow(() => {
  if (!datebookStore.isFilledIn && datebookStore.lessonId) {
    // 选择教材后,如果没填充则赋值并且询问是否填充剩下的
    const index = datebookStore.index
    if (index === state.courseList.length-1) return
    state.courseList[index].bookGroupId = datebookStore.bookGroupId
    state.courseList[index].bookId = datebookStore.bookId
    state.courseList[index].bookName = datebookStore.bookName
    state.courseList[index].lessonId = datebookStore.lessonId
    state.courseList[index].lessonName = datebookStore.lessonName
    uni.showModal({
      title: '提示',
      content: `是否自动往后填充？\n \n您的课表会按您选择的教材自动排序`,
      cancelText: '不填充',
      confirmText: '填充',
      success: async (res) => {
        if (res.confirm) {
          datebookStore.isFilledIn = true
          await autoFillCourse(datebookStore.lessonId, index)
        } else {
          datebookStore.isFilledIn = true
        }
      }
    })
  }
})
onLoad((query) => {
  console.log('onLoad')
  state.num = query.num // 预约多少节课
  state.teacherId = query.teacherId // 选择的老师Id
  state.teacherType = query.teacherType // 每节课消耗的课时
  resetCourseList()
  checkLastBookInfo()
})
const datebookStore = useDatebookStore()
const state = reactive({
  num: 0,
  timeArr: datebookStore.freeClass.timeArr,
  // timeArr: ['2024-03-23 14:00-14:25', '2024-03-23 14:30-14:55', '2024-03-23 15:00-15:25', '2024-03-23 15:30-15:55', '2024-03-23 16:00-16:25', '2024-03-23 16:30-16:55', '2024-03-23 17:00-17:25', '2024-03-23 17:30-17:55'],
  showReplace: datebookStore.freeClass.params.languageType === 0,
  teacherId: '',
  allowSubstituteTeacher: 0,// 是否同意自动代课
  courseList: [],
  times: 0
})

function selectLesson(dateTime, index) {
  datebookStore.index = null
  datebookStore.lessonId = null
  datebookStore.isVipClass=false
  uni.navigateTo({
    url: `/subPackagesD/components/selectBookGroup?dateTime=${dateTime}&index=${index}`
  })
}

const checkLastBookInfo = async () => {
  try {
    const { resultData } = await DatebookService.modifyMaterial(state.teacherId)
    if (resultData.hasClass === 0) {
      datebookStore.bookList = resultData.studentBookGroupInfo
      //需要判断返回的历史教材中的id是否存在于现有教材列表，存在则将历史教材的数据填充到第一个列表中
      if (checkJudgeBook(resultData.lastLessonInfo.bookGroupId)) {
        state.courseList[0].bookGroupId = resultData.lastLessonInfo.bookGroupId
        state.courseList[0].bookId = resultData.lastLessonInfo.bookId
        state.courseList[0].bookName = resultData.lastLessonInfo.bookName
        state.courseList[0].lessonId = resultData.lastLessonInfo.lessonId
        state.courseList[0].lessonName = `${resultData.lastLessonInfo.bookLesson + 1} : ${resultData.lastLessonInfo.lesson}`
        await autoFillCourse(resultData.lastLessonInfo.lessonId, 0)
      }
    } else {
      if (resultData.languageType === 0) {
        //没有上一本教材的信息并且是小语种教材
        datebookStore.bookList = resultData.studentBookGroupInfo
      } else {
        await getBookList()
      }
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
// 自动填充教材
const autoFillCourse = async (lessonId, curIndex) => {
  try {
    const nextNum = state.timeArr.length - curIndex - 1
    const { resultData } = await DatebookService.autoFillCourse({ lessonId, nextNum })
    if (resultData && resultData.length > 0) {
      const startIndex = curIndex + 1 // 从当前位置的下一位开始填充
      for (let i = 0; i < resultData.length; i++) {
        state.courseList[startIndex + i].bookGroupId = resultData[i].bookGroupId
        state.courseList[startIndex + i].bookId = resultData[i].bookId
        state.courseList[startIndex + i].bookName = resultData[i].bookName
        state.courseList[startIndex + i].lessonId = resultData[i].lessonId
        state.courseList[startIndex + i].lessonName = resultData[i].lessonName
      }
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
const getBookList = async () => {
  const { resultData } = await DatebookService.getBookGroup()
  datebookStore.bookList = resultData
}
const checkJudgeBook = (id) => {
  //用来对比返回的教材id是否有对应的教材名字
  let hasBgId = false
  let bookList = datebookStore.bookList
  for (let i = 0; i < bookList.length; i++) {
    for (let j = 0; j < bookList[i].list.length; j++) {
      if (id == bookList[i].list[j].bgId) {
        hasBgId = true
      }
    }
  }
  return hasBgId
}
const submit = async () => {
  const nullObj = state.courseList.find(item => !item.lessonId)
  if (nullObj) {
    uni.showModal({
      title: '提示',
      content: `请选择 ${nullObj.dateTime} 时间段的教材！`,
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          //
        }
      }
    })
  } else {
    try {
      uni.showLoading({})
      const params = {
        allowSubstituteTeacher: state.allowSubstituteTeacher,
        datebookInfoList: state.courseList,
        packageId: datebookStore.freeClass.params.packageId,
        packageType: datebookStore.freeClass.params.packageType,
        price: state.teacherType,
        teacherId: state.teacherId
      }
      console.log(params, 'params')
      const { resultData } = await DatebookService.checkBookInfoSubmit(params)
      state.times = state.courseList.length
      await submitInfo(resultData)
    } catch (e) {
      if (e.resultCode === 3) {
        uni.hideLoading()
        if (e.resultData) {
          if (e.resultData.notBookedList.length === state.courseList.length) {
            uni.showModal({
              title: '提示',
              content: '您所预约的所有课程已被预约，请重新预约时间！',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //
                }
              }
            })
          } else {
            const item = e.resultData.notBookedList.toString()
            const params = e.resultData.checkDatebookInfoSubmitReqDTO
            const text = `${item}时间段已被预约，是否取消预约以上时间段的课程，继续预约其余时间课程`
            uni.showModal({
              title: '提示',
              content: text,
              showCancel: false,
              success: async (res)=> {
                if (res.confirm) {
                  const { resultData } = await DatebookService.checkBookInfoSubmit(params)
                  state.times = params.datebookInfoList.length
                  await submitInfo(resultData)
                }
              }
            })
          }
        } else {
          uni.showToast({
            title: e.resultMessage,
            icon: 'none'
          })
        }
      }
    }

  }
}
const submitInfo = async (hash) => {
  try {
    const { resultData } = await DatebookService.dateBookSubmit(hash)
    uni.hideLoading()
    uni.redirectTo({
      url: `/subPackagesD/components/result?times=${state.times}&fromPage=freeClass`
    })
  } catch (e) {
    uni.hideLoading()
    console.log(e, 'error')
  }
}

function clear() {
  uni.showModal({
    title: '提示',
    content: '是否要清空教材',
    cancelText: '暂不清空',
    success: function(res) {
      if (res.confirm) {
        resetCourseList()
      }
    }
  })
}

function resetCourseList() {
  // 数据初始化
  let list = []
  for (let i = 0; i < state.timeArr.length; i++) {
    list.push({
      bookGroupId: '',
      bookId: '', // 分册id
      bookName: '', //分册名
      lessonId: '',// 课文id
      lessonName: '', // 课文名
      dateTime: state.timeArr[i]
    })
  }
  state.courseList = list
}

function openTooltip() {
  uni.showModal({
    title: '同意自动代课',
    content: '若您同意自动代课，当授课老师在距离课程开始上课2小时前请假，系统将为您优先挑选收藏的老师或系统中其他老师（与当前授课老师同地域且空闲）为您上课；\n若您选择的上课时段没有空闲老师，系统将返还课时到您约课使用的套餐。',
    showCancel: false
  })
}

function changeAllowSubstituteTeacher() {
  if (state.allowSubstituteTeacher === 0) {
    state.allowSubstituteTeacher = 1
  } else {
    state.allowSubstituteTeacher = 0
  }
}

</script>

<style scoped lang="scss">
  .step4 {
    .title-wrap {
      margin: 40rpx 30rpx;

      .title {
        font-weight: 500;
        font-size: 40rpx;
        color: #333333;
        line-height: 56rpx;
      }

      .clear {
        width: 24rpx;
        height: 28rpx;
      }

      .text {
        margin-left: 12rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        line-height: 40rpx;
      }

      .yellow {
        color: #ff5e01;
      }
    }

    .course-list {
      padding-bottom: 200rpx;

      .li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        height: 164rpx;
        margin-left: 32rpx;
        padding: 35rpx 30rpx 35rpx 0;
        border-bottom: 1PX solid #eeeeee;

        .left-wrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;

          .top {
            font-weight: 400;
            font-size: 32rpx;
            color: #333333;
          }

          .bottom-wrap {
            display: flex;
            font-weight: 400;
            font-size: 28rpx;
            color: #999999;
            line-height: 32rpx;

            .left {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 150rpx;
              margin-right: 30rpx;
            }

            .right {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 430rpx;
            }
          }
        }

        .center {
          justify-content: center;
        }

        .arrow {
          width: 16rpx;
          height: 25rpx;
        }
      }
    }

    .button-group {
      position: fixed;
      bottom: 0;
      padding-bottom: env(safe-area-inset-bottom);
      margin-bottom: 0;
      width: 100%;
      height: 100rpx;
      background: #ffffff;

      .left {
        display: flex;
        align-items: center;
        padding-left: 25rpx;
        flex: 1;
        height: 100rpx;
        border-top: 1PX solid #eeeeee;
        border-bottom: 1PX solid #eeeeee;
        box-sizing: border-box;

        .radio {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50rpx;
          border: 1PX solid #D4D4D4;
          box-sizing: border-box;
        }

        .icon-radio {
          width: 30rpx;
          height: 30rpx;
        }

        .radio-selected {
          width: 30rpx;
          height: 30rpx;
        }

        .text {
          margin-left: 24rpx;
          font-weight: 400;
          font-size: 28rpx;
          color: #666666;
          line-height: 40rpx;
        }

        .icon-question {
          width: 24rpx;
          height: 24rpx;
          padding: 12rpx;
        }
      }

      .right {
        width: 300rpx;
        height: 100rpx;
        background: #0084FF;
        font-size: 32rpx;
        color: #FFFFFF;
      }
    }

  }
</style>
