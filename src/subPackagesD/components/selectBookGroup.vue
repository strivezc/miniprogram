<template>
  <view class="selectBookGroup">
    <van-config-provider :theme-vars="state.themeVars">
      <van-notice-bar mode="closeable" text="如需购买Magic Growth教材，请前往www.usongshu.com"/>
    </van-config-provider>
    <view class="title">请选择教材</view>
    <view class="time">上课时间：{{formatDateTime(state.dateTime)}}</view>
    <view class="group" v-for="(item,index) in state.bookList" :key="index">
      <view class="label">{{item.name}}</view>
      <view v-for="l in item.list" class="li" :key="l.bgId" @click="selectBook(l.bgId)">
        <view class="text-wrap">
          <view class="text">{{l.groupName}}</view>
          <image mode="widthFix" v-if="l.status===1"  class="icon" src="@/subPackagesD/images/iv_new_tag.png"></image>
        </view>
        <image mode="widthFix" class="arrow" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import { formatDateTime } from '../timeTool'

onLoad((query) => {
  state.dateTime = decodeURIComponent(query.dateTime)
  datebookStore.index=Number(query.index)
})
const datebookStore = useDatebookStore()
const state = reactive({
  themeVars: {
    noticeBarHeight: '92rpx',
    noticeBarBackgroundColor: '#FFF8EB',
    noticeBarTextColor: '#FFAA00',
    noticeBarFontSize: '24rpx',
    noticeBarLineHeight: '92rpx'
  },
  dateTime:'',
  bookList:datebookStore.bookList,
  index:''
})
function selectBook(bgId) {
  datebookStore.bookGroupId=bgId
  uni.navigateTo({
    url: `/subPackagesD/components/selectBook?bgId=${bgId}`
  })
}
</script>

<style scoped lang="scss">
  .selectBookGroup {
    padding-bottom: env(safe-area-inset-bottom);
    ::v-deep .van-notice-bar__right-icon {
      top: 50%;
      transform: translateY(-50%);
    }

    .title {
      margin-left: 32rpx;
      margin-top: 27rpx;
      font-weight: 500;
      font-size: 56rpx;
      color: #333333;
      line-height: 56rpx;
    }
    .time{
      font-weight: 400;
      font-size: 28rpx;
      color: #666666;
      line-height: 40rpx;
      margin-top: 32rpx;
      margin-left: 32rpx;
    }
    .group{
      display: flex;
      flex-direction: column;
      margin-left: 32rpx;
      .label{
        padding-top: 60rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #FF5C01;
        line-height: 33rpx;
      }
      .li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        height: 120rpx;
        border-bottom: 1PX solid #eeeeee;
        .text-wrap{
          display: flex;
          align-items: center;
          .text{
            font-weight: 400;
            font-size: 32rpx;
            color: #333333;
            white-space: pre-wrap;
          }
          .icon{
            width: 60rpx;
            height: 26rpx;
            margin-left: 10rpx;
          }
        }
        .arrow{
          width: 16rpx;
          height: 25rpx;
          padding-right: 32rpx;
        }
      }
    }
  }
</style>
