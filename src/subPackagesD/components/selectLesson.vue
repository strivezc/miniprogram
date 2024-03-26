<template>
  <view class="selectLesson">
    <view class="title">请选择课文</view>
    <view v-for="item in state.lessonList" class="li" :key="item.lessonId" @click="selectLesson(item.lessonId,item.lessonName)">
      <view class="text">{{item.lessonName}}</view>
      <image mode="widthFix" class="arrow" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
    </view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import DatebookService from '@/api/DatebookService'
import {goBack} from '@/utils'

onLoad((query) => {
  state.bookId = query.bookId
  state.index = query.index
  getLessonList()
})
const datebookStore = useDatebookStore()
const state = reactive({
  lessonList:[],
  bookId:'',
  index:''
})
const getLessonList=async ()=>{
  if (datebookStore.textGroupObj[state.bookId]) {
    state.lessonList=datebookStore.textGroupObj[state.bookId]
  } else {
    const {resultData}=await DatebookService.getTextGroup(state.bookId)
    state.lessonList=resultData
    datebookStore.textGroupObj[state.bookId]=resultData
  }
}
function selectLesson(lessonId,lessonName) {
  datebookStore.isFilledIn=false
  datebookStore.lessonId=lessonId
  datebookStore.lessonName=lessonName
  if (datebookStore.isVipClass) {
    // VIP填充则返回VIP页面
    goBack('subPackagesD/vipClass/step5')
  } else {
    goBack('subPackagesD/freeClass/step4')
  }
}
</script>

<style scoped lang="scss">
  .selectLesson {
    padding-bottom: env(safe-area-inset-bottom);
    .title {
      margin-left: 32rpx;
      margin-top: 27rpx;
      font-weight: 500;
      font-size: 56rpx;
      color: #333333;
      line-height: 56rpx;
    }
    .li{
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      height: 120rpx;
      border-bottom: 1PX solid #eeeeee;
      margin-left: 32rpx;
      .text{
        font-weight: 400;
        font-size: 32rpx;
        color: #333333;
        width: 550rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .arrow{
        width: 16rpx;
        height: 25rpx;
        padding-right: 32rpx;
      }
    }
  }
</style>
