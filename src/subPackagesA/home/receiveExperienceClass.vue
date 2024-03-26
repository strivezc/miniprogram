<template>
  <view class="container">
    <view class="content">
      <view class="top-wrap mb-67">
      <view class="title">选择适合您的英语基础</view>
      <scroll-view scroll-x class="scroll" :scroll-left="state.scrollLeft" @scroll="scroll">
        <view class="block-wrap">
          <view v-for="item in state.levelList"
                :key="item.thinkLevel"
                @click="clickLevel(item)"
                :class="item.thinkLevel===state.activeIndex?'active':''"
                :style="{'height':`${100+item.thinkLevel*20}rpx`}"
                class="item">
            <view class="my-level" v-if="item.thinkLevel===state.activeIndex">我的水平</view>
            <view class="num" :class="item.thinkLevel===state.activeIndex?'num-active':''">{{item.thinkLevel}}
            </view>
          </view>
        </view>
      </scroll-view>
      <movable-area class="slider__bar">
        <movable-view :animation="true" class="button__bar" :x="state.sliderX" direction="horizontal"
                      @change="sliderMove">
          <view class="slider__button"></view>
        </movable-view>
      </movable-area>
      <view class="level-text">{{state.text}}</view>
      </view>
      <view class="top-wrap">
      <view class="title">选择上课时间</view>
      <view class="date-wrap">
        <view class="item" @click="changeDateTime(item)" v-for="item in state.classDateAndWeeks" :key="item.week">
          <text class="week">{{week[item.week-1]}}</text>
          <text class="date" :class="item.classDate===state.dateTime?'active-item':''">
            {{item.classDate?item.classDate.slice(-2):''}}
          </text>
        </view>
      </view>
      <view class="sub-title">{{state.dateTime}} {{state.selectWeek}}</view>
      <view class="time-wrap">
        <view class="item"
              :class="{'active':state.selectTime===item.time,'disabled':isDisabledTime(item.time)}"
              v-for="item in state.timeData"
              @click="changeTime(item)"
              :key="`${state.dateTime} ${item.time}`">
          {{item.time}}
        </view>
      </view>
      </view>
      <view class="tip">预约成功则会消耗1节体验课时</view>
    </view>
    <view class="button-wrap">
      <view class="button" :class="disabled?'disabled-btn':''" @click="submit">立即领取</view>
    </view>
  </view>
</template>

<script setup>
import DatebookService from '@/api/DatebookService'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const week = ['一', '二', '三', '四', '五', '六', '日']
const state = reactive({
  levelList: [
    { thinkLevel: 0, text: 'T0：完全没有英语基础，认识简单的字母，零星单词，无法沟通' },
    { thinkLevel: 1, text: 'T1：没有接受过系统的英语学习，尤其在听说方面存在障碍' },
    { thinkLevel: 2, text: 'T2：可以使用单个单词或词组回答提问，并用手势或动作完成教师所给的指令' },
    { thinkLevel: 3, text: 'T3：可以使用单一的完整句子就个人基本情况进行简单表述' },
    { thinkLevel: 4, text: 'T4：可以连贯的使用多个简单句就日常生活和活动进行交谈' },
    { thinkLevel: 5, text: 'T5：可以陈述基本事物，表达简单的好恶，能就主题进行适度的交流和讨论' },
    { thinkLevel: 6, text: 'T6：可以使用英语开展日常旅游，商务洽谈等，具备较好的口语流利度和逻辑思维' },
    { thinkLevel: 7, text: 'T7：可以轻松随意就主题内容进行讨论或辩论，举证充分得当' },
    { thinkLevel: 8, text: 'T8：可以主导谈话方向、把握谈话内容，懂得交谈的艺术，会使用英语进行跨文化交际' },
    { thinkLevel: 9, text: 'T9：可以对社会主流现象及问题发表独到的评论或见解，拥有国际化视野' }
  ],
  text: 'T0：完全没有英语基础，认识简单的字母，零星单词，无法沟通',
  activeIndex: 0,
  timeData: [
    { time: '06:00~08:00' },
    { time: '08:00~10:00' },
    { time: '10:00~12:00' },
    { time: '12:00~14:00' },
    { time: '14:00~16:00' },
    { time: '16:00~18:00' },
    { time: '18:00~20:00' },
    { time: '20:00~22:00' }
  ],
  classDateAndWeeks: [],
  nowTime: '',
  dateTime: '',
  selectWeek: '',
  selectTime: '',

  scrollLeft: 1,
  scrollWidth: 0,
  sliderX: 0,
  blockWrapWidth: 0,

  maxSliderX: 0,
  maxScrollLeft: 0
})

const disabled = computed(() => {
  return (state.activeIndex ?? '') === '' || (state.selectTime ?? '') === ''
})

const submit = async () => {
  if (disabled.value) return
  try {
    uni.showLoading({})
    const params = {
      thinkLevel: state.activeIndex,
      wantDateTime: `${state.dateTime} ${state.selectTime.replace('~', '-')}`
    }
    await DatebookService.receiveTrialClass(params)
    uni.hideLoading()
    uni.redirectTo({
      url: '/subPackagesA/home/consultant'
    })
  } catch (e) {
    console.log(e, 'error')
  }

}
const getClassDateAndWeeks = async () => {
  try {
    const { resultData } = await DatebookService.getTrialClassTime()
    state.classDateAndWeeks = resultData.classDateAndWeeks
    state.nowTime = resultData.nowTime.replace(/-/g, '/')
    if (state.classDateAndWeeks && state.classDateAndWeeks.length > 0) {
      changeDateTime(state.classDateAndWeeks[0])
    }
  } catch (e) {
    console.log(e, 'error')
  }
}

function isDisabledTime(time) {
  const startTime = time ? time.split('~')[0] : '00:00'
  const dateTime=state.dateTime.replace(/-/g, '/')
  return new Date(state.nowTime) >= new Date(`${dateTime} ${startTime}`)
}

function changeTime(item) {
  if (isDisabledTime(item.time)) return
  if (state.selectTime === item.time) return
  state.selectTime = item.time
}

function changeDateTime(item) {
  if (state.dateTime === item.classDate) return
  state.dateTime = item.classDate
  state.selectWeek = `星期${week[item.week - 1]}`
  state.selectTime = ''
}

onMounted(() => {
  let element = uni.createSelectorQuery().in(getCurrentInstance()).select('.block-wrap')
  let sliderButton = uni.createSelectorQuery().in(getCurrentInstance()).select('.slider__button')
  element
    .boundingClientRect(function(data) {
      state.blockWrapWidth = data.width
      console.log(state.scrollWidth, 'state.scrollWidth')
      console.log(state.blockWrapWidth, 'state.blockWrapWidth')
      state.maxScrollLeft = state.scrollWidth - state.blockWrapWidth
      sliderButton
        .boundingClientRect(function(data) {
          console.log(data.width, 'data.width')
          state.maxSliderX = state.blockWrapWidth - data.width
        })
        .exec(function(res) {
        })
    })
    .exec(function(res) {
    })

})

function clickLevel(item) {
  state.activeIndex = item.thinkLevel
  state.text = item.text
}

function scroll(e) {
  if (state.scrollWidth === 0) {
    state.scrollWidth = e.detail.scrollWidth
  }
  // const scrollLeft = e.detail.scrollLeft
  // const rate = scrollLeft / state.maxSliderX
  // console.log(rate, 'rate')
  // if (rate && rate > 0) {
  //   state.sliderX = Math.floor(rate * state.maxSliderX)
  // }
}

function sliderMove(e) {
  const scrollX = e.detail.x
  const rate = scrollX / state.maxSliderX
  if (rate && rate >= 0) {
    state.scrollLeft = Math.floor(rate * state.maxScrollLeft)
  }
}

getClassDateAndWeeks()
</script>

<style scoped lang="scss">
  .container {
    padding: 24rpx 32rpx 0;
    background: #F9F9F9;

    .content {
      padding: 0rpx 0rpx 300rpx;

      .top-wrap{
        background: #ffffff;
        padding: 30rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
      }
      .mb-67{
        margin-bottom: 67rpx;
      }
      .title {
        font-size: 36rpx;
        font-weight: 500;
        color: #333333;
        line-height: 44rpx;
      }

      .sub-title {
        margin-top: 40rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #333333;
        line-height: 32rpx;
      }

      .scroll {
        box-sizing: border-box;
      }

      .block-wrap {
        white-space: nowrap;
        padding-top: 54rpx;
        padding-left: 2rpx;

        .item {
          display: inline-block;
          position: relative;
          width: 88rpx;
          height: 100rpx;
          background: #F1F1F1;
          border-radius: 4rpx 4rpx 4rpx 4rpx;
          margin-right: 20rpx;

          &:last-child {
            margin-right: 0;
          }

          .num {
            position: absolute;
            bottom: 16rpx;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24rpx;
            font-weight: 500;
            color: #999999;
          }

          .num-active {
            color: #ffffff;
          }

          .my-level {
            position: absolute;
            top: -48rpx;
            left: 0;
            height: 32rpx;
            border-radius: 4rpx 4rpx 4rpx 4rpx;
            width: 88rpx;
            background: #0087FF;
            font-size: 20rpx;
            font-weight: 400;
            text-align: center;
            color: #FFFFFF;
            line-height: 32rpx;

            &:before {
              position: absolute;
              bottom: -16rpx;
              left: 50%;
              transform: translateX(-50%);
              content: '';
              display: block;
              width: 0rpx;
              height: 0rpx;
              border: 8rpx solid transparent;
              border-top-color: #0087FF;
            }
          }
        }

        .active {
          background: #0087FF;
          color: #ffffff;
        }
      }

      .slider__bar {
        position: relative;
        width: 100%;
        height: 4rpx;
        background: #F1F1F1;
        margin-top: 26rpx;

        .button__bar {
          padding: 10px 0;
          width: 66rpx;
          margin-top: -26rpx;
        }

        .slider__button {
          width: 66rpx;
          height: 16rpx;
          background: #0087FF;
          border-radius: 15rpx 15rpx 15rpx 15rpx;
        }
      }

      .level-text {
        margin-top: 46rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        line-height: 48rpx;
      }

      .date-wrap {
        display: flex;
        align-items: center;
        padding-bottom: 30rpx;
        border-bottom: 1rpx solid #D5D5D5;
        margin-top: 30rpx;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 39rpx;

          &:last-child {
            margin-right: 0;
          }

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
            height: 55rpx;
            background: #FFFFFF;
            border-radius: 44rpx 44rpx 44rpx 44rpx;
            font-size: 32rpx;
            font-weight: 500;
            color: #333333;
            line-height: 55rpx;
            text-align: center;
            display: inline-block;
          }

          .active-item {
            background: #0087FF;
            color: #FFFFFF;

            &:after {
              content: '';
              display: block;
              width: 34rpx;
              height: 4rpx;
              background: #0087FF;
              border-radius: 60rpx 60rpx 60rpx 60rpx;
              position: absolute;
              left: 50%;
              bottom: -32rpx;
              transform: translateX(-50%);
            }
          }
        }
      }

      .time-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .item {
          margin-top: 30rpx;
          box-sizing: border-box;
          width: 293rpx;
          height: 58rpx;
          border-radius: 29rpx 29rpx 29rpx 29rpx;
          border: 1rpx solid #D5D5D5;
          font-size: 28rpx;
          font-weight: 500;
          color: #666666;
          line-height: 58rpx;
          text-align: center;

          &:nth-child(odd) {
            margin-right: 39rpx;
          }
        }

        .active {
          background: rgba(0, 132, 255, 0.05);
          border: 1rpx solid #0087FF;
        }

        .disabled {
          background: #F1F1F1;
          border: 1rpx solid #D5D5D5;
        }
      }

      .tip {
        margin-top: 20rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
        line-height: 28rpx;
        text-align: center;
      }
    }

    .button-wrap {
      position: fixed;
      padding-bottom: env(safe-area-inset-bottom);
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 120rpx;
      background: #FFFFFF;

      .button {
        width: 686rpx;
        height: 83rpx;
        background: linear-gradient(90deg, #FE7501 0%, #FF9203 100%);
        border-radius: 200rpx 200rpx 200rpx 200rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 83rpx;
        text-align: center;
      }

      .disabled-btn {
        background: #CCCCCC;
      }
    }
  }
</style>
