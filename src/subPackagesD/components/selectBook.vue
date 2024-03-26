<template>
  <view class="selectBook">
    <view class="title">请选择分册</view>
    <view v-for="item in state.lessonGroupList" class="li" :key="item.bookId" @click="selectBook(item.bookId,item.bookName)">
      <view class="text">{{item.bookName}}</view>
      <image mode="widthFix" class="arrow" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
    </view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import DatebookService from '@/api/DatebookService'

onLoad((query) => {
  state.bgId = query.bgId
  getLessonList()
})
const datebookStore = useDatebookStore()
const state = reactive({
  lessonGroupList:[],
  bgId:'',
})
const getLessonList=async ()=>{
  if (datebookStore.lessonGroupObj[state.bgId]) {
    state.lessonGroupList=datebookStore.lessonGroupObj[state.bgId]
  } else {
    const {resultData}=await DatebookService.getLessonGroup(state.bgId)
    state.lessonGroupList=resultData
   datebookStore.lessonGroupObj[state.bgId]=resultData
  }
}
function selectBook(bookId,bookName) {
  datebookStore.bookId=bookId
  datebookStore.bookName=bookName
  uni.navigateTo({
    url: `/subPackagesD/components/selectLesson?bookId=${bookId}`
  })
}
</script>

<style scoped lang="scss">
  .selectBook {
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
