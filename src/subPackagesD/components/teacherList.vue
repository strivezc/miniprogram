<template>
  <scroll-view
      class="lotteryRecord"
      scroll-y="true"
      :scroll-top="state.scrollTop"
      :show-scrollbar="false"
      :lower-threshold="50"
      @scrolltolower="scrollLower"
      refresher-enabled="true"
      :refresher-triggered="state.triggered"
      :refresher-threshold="50"
      refresher-background="transparent"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
  >
    <view class="li flex-s-c" @click="next(item.userId,item.teacherType,0)" v-for="(item, index) in state.list" :key="index">
     <view class="left-wrap">
       <view class="icon-wrap"> <image class="img" mode="aspectFill" @error="handleError(item)" :src="item.userImg"></image><view class="nation centerSP">{{item.nation}}</view></view>
       <view class="text-wrap">
         <view class="name-wrap"><text class="name">{{ item.userName }}</text><text class="tea-title">{{formatTitle(item.teacherTitle)}}</text></view>
         <view class="num">{{item.teacherType}}课时/节</view>
         <view class="tip" :class="{'active-tip':item.freeCount>0}">{{item.freeCount>0?`今日空余${item.freeCount}节`:'今日已约满'}}</view>
       </view>
     </view>
      <view class="button flex-c" @click.stop="next(item.userId,item.teacherType,1)">预约</view>
    </view>
    <uni-load-more :status="state.status" color="#999999"></uni-load-more>
  </scroll-view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import DatebookService from '@/api/DatebookService';
import defaultImg from '@/subPackagesD/images/student_default_img.png';

const datebookStore = useDatebookStore()
const state=reactive({
  status: 'more',
  _freshing: false,
  triggered: false,
  scrollTop: 0.01,
  list: [],
  params:datebookStore.freeClass.params
})
onLoad(()=>{
  state._freshing = false;
  setTimeout(() => {
    state.triggered = true;
  });
})
function handleError(item) {
  item.userImg=defaultImg
}
function next(userId,teacherType,active) {
  const date=datebookStore.freeClass.params.date
  uni.navigateTo({
    url: `/subPackagesD/freeClass/step3?userId=${userId}&date=${date}&teacherType=${teacherType}&active=${active}`
  })
}
function initScrollData() {
  if (state.scrollTop===0.01) {
    state.scrollTop=0
  } else {
    state.scrollTop=0.01
  }
  state.params.currPage=1
  state._freshing = false
  setTimeout(() => {
    state.triggered = true
  })
}
function onRefresh() {
  if (state._freshing) return
  state._freshing = true

  state.params.currPage = 1
  getData(true)
}
function onRestore() {
  state.triggered = 'restore'
  console.log('onRestore')
}
function scrollLower() {
  if (state.params.currPage >= state.allPage) {
    state.status = 'noMore'
    return
  } else {
    state.status = 'loading'
  }
  state.params.currPage++
  getData()
  console.log('我滚动到底部了')
}
const getData=async(refresh)=> {
  try {
    const { resultData, totalCount } = await DatebookService.searchTeacherTime(state.params)
    if (state.params.currPage === 1) {
      state.list = resultData || []
      if (refresh) {
        //刷新完重置状态
        state.triggered = false
        state._freshing = false
      }
      console.log(state.scrollTop,'state.scrollTop')
    } else {
      state.list = state.list.concat(resultData)
    }
    state.allPage = Math.ceil(totalCount / state.params.pageSize)
    if (state.allPage <= 1) {
      state.status = 'noMore'
    }
  } catch (e) {
    console.log(e, 'error')
    if (refresh) {
      //刷新完重置状态
      state.triggered = false
      state._freshing = false
    }
  }
}
function formatTitle(val) {
  if (val === 1) {
    return '年度优秀教师';
  } else if (val === 2) {
    return '最敬业教师';
  } else if (val === 3) {
    return '最受学员欢迎教师';
  } else if (val === 4) {
    return '年度贡献奖';
  } else {
    return '';
  }
}
defineExpose({ initScrollData });
</script>

<style scoped lang="scss">
  .lotteryRecord {
    height: calc(100vh - 158rpx - env(safe-area-inset-bottom));
    box-sizing: border-box;
    .li {
      background: #FFFFFF;
      text-align: left;
      border-bottom: 1PX solid #EEEEEF;
      padding: 32rpx 30rpx 35rpx;
      .left-wrap {
        display: flex;
        align-items: center;

        .icon-wrap{
          position: relative;
          width: 120rpx;
          height: 120rpx;
          margin-right: 30rpx;
          .img{
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
          }
          .nation{
            position: absolute;
            bottom: 5rpx;
            font-size: 20rpx;
            color: #FFFFFF;
            line-height: 24rpx;
          }
        }
        .text-wrap{
          display: flex;
          flex-direction: column;
          .name-wrap {
            display: flex;
            align-items: center;
            .name{
              font-weight: 500;
              font-size: 32rpx;
              color: #333333;
              line-height: 32rpx;
            }
            .tea-title{
              color: #FF5C01;
              font-size: 24rpx;
              margin-left: 10rpx;
            }
          }

          .num{
            font-weight: 400;
            font-size: 24rpx;
            color: #999999;
            line-height: 24rpx;
            margin-top: 16rpx;
          }
          .tip{
            font-weight: 400;
            font-size: 24rpx;
            color: #999999;
            line-height: 24rpx;
            margin-top: 24rpx;
          }
          .active-tip{
            color: #FFAA00;
          }
        }
      }
      .button{
        width: 120rpx;
        height: 56rpx;
        border-radius: 40rpx;
        border: 1PX solid #0084FF;
        font-size: 28rpx;
        color: #0087FF;
      }
    }
  }
</style>
