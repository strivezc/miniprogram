<template>
  <view class="step3">
    <view class="tea-info">
      <view class="tea-left-wrap">
        <image :src="datebookStore.teacherBaseRespDTO.userImg" @error="handleError(datebookStore.teacherBaseRespDTO)" mode="aspectFill" class="tea-avatar"></image>
        <view class="tea-text-wrap">
          <view class="tea-name">{{ datebookStore.teacherBaseRespDTO.userName }}</view>
          <view class="tea-title">{{formatTitle(datebookStore.teacherBaseRespDTO.teacherTitle)}}</view>
          <view class="tea-num"><text class="yellow" v-if="datebookStore.teacherFeedback">{{datebookStore.teacherFeedback.feedback}}分</text>{{datebookStore.teacherBaseRespDTO.teacherType}}课时/节</view>
        </view>
      </view>
      <image src="@/subPackagesD/images/iv_main_speak.png" class="tea-right"></image>
    </view>
    <view class="tea-sign" v-if="datebookStore.teacherBaseRespDTO.signatureContent">签名：{{datebookStore.teacherBaseRespDTO.signatureContent}}</view>
    <van-config-provider :theme-vars="state.themeVars">
      <van-tabs swipeable animated :active="state.active" line-width="16" title-active-color="#0087FF" title-inactive-color="#333333">
        <van-tab title="老师档案">
          <teacherDetail></teacherDetail>
        </van-tab>
        <van-tab title="立即约课">
          <changeTime></changeTime>
        </van-tab>
      </van-tabs>
    </van-config-provider>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import changeTime from '../components/changeTime'
import teacherDetail from '../components/teacherDetail'
import defaultImg from '@/subPackagesD/images/student_default_img.png'

const datebookStore = useDatebookStore()
const state = reactive({
  themeVars: {
    tabFontSize: '32rpx',
    tabsBottomBarColor: '#0087FF',
    tabsLineHeight:'88rpx',
    tabsBottomBarHeight: '5rpx'
  },
  active: 0,
})
onLoad((query) => {
  state.active = Number(query.active)
})
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
function handleError(item) {
  item.userImg = defaultImg
}
</script>

<style scoped lang="scss">
  .step3 {
    height:100%;
    position: relative;

    ::v-deep .van-tabs__wrap {
      border-bottom: 1PX solid #eeeeee;
    }
    .tea-info{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 40rpx 20rpx 30rpx;
      box-sizing: border-box;
      .tea-left-wrap{
        display: flex;
        align-items: center;
        .tea-avatar{
          width: 140rpx;
          height: 140rpx;
          border-radius: 50%;
          margin-right: 30rpx;
        }
        .tea-text-wrap{
          .tea-name{
            font-size: 32rpx;
            color: #333333;
            line-height: 32rpx;
            margin-top: 18rpx;
          }
          .tea-title{
            margin-top: 10rpx;
            font-size: 24rpx;
            color: #FF5E01;
            line-height: 24rpx;
          }
          .tea-num{
            margin-top: 16rpx;
            font-size: 24rpx;
            color: #999999;
            line-height: 24rpx;
            .yellow{
              color: #FF5E01;
              margin-right: 20rpx;
            }
          }
        }
      }
      .tea-right{
        width: 60rpx;
        height: 60rpx;
      }
    }
    .tea-sign{
      height: 60rpx;
      box-sizing: border-box;
      padding: 16rpx 32rpx;
      font-size: 20rpx;
      color: #FFAA00;
      line-height: 23rpx;
      background: #FFF8EB;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>
