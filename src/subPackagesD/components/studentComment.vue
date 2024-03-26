<template>
  <scroll-view
      class="stu-comment"
      scroll-y="true"
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
    <view class="content">
      <image src="@/subPackagesD/images/bg.png" mode="widthFix" class="bg"></image>
      <view class="bg-wrap">
        <view class="item-wrap">
          <view class="label">综合评分</view>
          <template v-if="state.teacherFeedback.feedback">
            <view class="rate-wrap">
              <text class="rate">{{state.teacherFeedback.feedback}}</text>
              <text class="unit">分</text>
            </view>
            <view class="tip">{{state.teacherFeedback.rateFeedbackSign ===
              1?`高于同行${state.teacherFeedback.rateFeedback}%`:`低于同行${state.teacherFeedback.rateFeedback}%`}}
            </view>
          </template>
          <template v-else>
            <image src="@/subPackagesD/images/star.png" mode="widthFix" class="icon"></image>
            <view class="tip">暂无评分</view>
          </template>
        </view>
        <view class="item-wrap">
          <view class="label">准时率</view>
          <template v-if="state.teacherFeedback.feedback">
            <view class="rate-wrap">
              <text class="rate">{{state.teacherFeedback.feedback}}</text>
              <text class="unit">%</text>
            </view>
          </template>
          <template v-else>
            <image src="@/subPackagesD/images/time.png" mode="widthFix" class="icon"></image>
            <view class="tip">暂无评分</view>
          </template>
        </view>
        <view class="item-wrap">
          <view class="label none-border">收到的鲜花</view>
          <template v-if="state.teacherFeedback.feedback">
            <view class="rate-wrap">
              <text class="rate">{{state.teacherFeedback.flowers}}</text>
              <text class="unit">朵</text>
            </view>
          </template>
          <template v-else>
            <image src="@/subPackagesD/images/flower.png" mode="widthFix" class="icon"></image>
            <view class="tip">暂无鲜花</view>
          </template>
        </view>
      </view>
      <view class="teach-target">
        <view class="title">教学指标</view>
        <view class="teach-info">
          <view class="teach-item">
            <view class="name">通话效果</view>
            <view class="info-wrap" v-if="state.teacherFeedback.communication">
              <uni-rate v-model="state.teacherFeedback.communication" :readonly="true" :size="16"/>
              <view class="data">{{state.teacherFeedback.rateCommunicationSign ===
                1?`高于同行${state.teacherFeedback.rateCommunication}%`:`低于同行${state.teacherFeedback.rateCommunication}%`}}
              </view>
            </view>
            <view v-else class="none-data">暂无评分</view>
          </view>
          <view class="teach-item">
            <view class="name">教学态度</view>
            <view class="info-wrap" v-if="state.teacherFeedback.teachManner">
              <uni-rate v-model="state.teacherFeedback.teachManner" :readonly="true" :size="16"/>
              <view class="data">{{state.teacherFeedback.rateTeachMannerSign ===
                1?`高于同行${state.teacherFeedback.rateTeachManner}%`:`低于同行${state.teacherFeedback.rateTeachManner}%`}}
              </view>
            </view>
            <view v-else class="none-data">暂无评分</view>
          </view>
          <view class="teach-item">
            <view class="name">老师发音</view>
            <view class="info-wrap" v-if="state.teacherFeedback.pronounce">
              <uni-rate v-model="state.teacherFeedback.pronounce" :readonly="true" :size="16"/>
              <view class="data">{{state.teacherFeedback.ratePronounceSign ===
                1?`高于同行${state.teacherFeedback.ratePronounce}%`:`低于同行${state.teacherFeedback.ratePronounce}%`}}
              </view>
            </view>
            <view v-else class="none-data">暂无评分</view>
          </view>
          <view class="teach-item">
            <view class="name">教学环境</view>
            <view class="info-wrap" v-if="state.teacherFeedback.teachEnviroment">
              <uni-rate v-model="state.teacherFeedback.teachEnviroment" :readonly="true" :size="16"/>
              <view class="data">{{state.teacherFeedback.rateTeachEnviromentSign ===
                1?`高于同行${state.teacherFeedback.rateTeachEnviroment}%`:`低于同行${state.teacherFeedback.rateTeachEnviroment}%`}}
              </view>
            </view>
            <view v-else class="none-data">暂无评分</view>
          </view>
          <view class="teach-item">
            <view class="name">教学方法</view>
            <view class="info-wrap" v-if="state.teacherFeedback.teachMethod">
              <uni-rate v-model="state.teacherFeedback.teachMethod" :readonly="true" :size="16"/>
              <view class="data">{{state.teacherFeedback.rateTeachMethodSign ===
                1?`高于同行${state.teacherFeedback.rateTeachMethod}%`:`低于同行${state.teacherFeedback.rateTeachMethod}%`}}
              </view>
            </view>
            <view v-else class="none-data">暂无评分</view>
          </view>
        </view>
      </view>
    </view>

    <view class="comment-tab">
      <view class="title">评价</view>
      <view class="tab-wrap">
        <view class="tab" :class="{'active-tab':state.params.type===null}" @click="getComment(null)">
          全部({{(state.teacherFeedback.goodFeedback ||
          state.teacherFeedback.badFeedback)?state.teacherFeedback.goodFeedback+state.teacherFeedback.badFeedback:'0'}})
        </view>
        <view class="tab" :class="{'active-tab':state.params.type===1}" @click="getComment(1)">
          好评({{state.teacherFeedback.goodFeedback?state.teacherFeedback.goodFeedback:'0'}})
        </view>
        <view class="tab" :class="{'active-tab':state.params.type===0}" @click="getComment(0)">
          差评({{state.teacherFeedback.badFeedback?state.teacherFeedback.badFeedback:'0'}})
        </view>
      </view>
    </view>
    <view class="li" v-for="(item,index) in state.list" :key="index">
      <image :src="item.userImg" @error="handleError(item)" mode="aspectFill" class="comment-avatar"></image>
      <view class="comment-wrap">
        <view class="top">
          <view class="tea-name">{{item.userName}}</view>
          <uni-rate v-model="item.feedback" :readonly="true" :size="16"/>
        </view>
        <view class="date">{{item.endTime}}</view>
        <view class="tip">{{item.commentTotea}}</view>
      </view>
    </view>
    <uni-load-more :status="state.status" color="#999999"></uni-load-more>
  </scroll-view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import UserService from '@/api/UserService'
import defaultImg from '@/subPackagesD/images/student_default_img.png'

const datebookStore = useDatebookStore()
const state = reactive({
  status: 'more',
  _freshing: false,
  triggered: false,
  list: [],
  teacherFeedback: {},
  params: {
    teacherId: '',
    currPage: 1,
    pageSize: 10,
    type: null
  }
})
onLoad((query) => {
  state.params.teacherId = query.teacherId
  state._freshing = false
  setTimeout(() => {
    state.triggered = true
  })
})

function getComment(type) {
  state.params.type = type
  state._freshing = false
  setTimeout(() => {
    state.triggered = true
  })
}

function handleError(item) {
  item.userImg = defaultImg
}

function initScrollData() {
  state.params.currPage = 1
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

const getData = async (refresh) => {
  try {
    const { resultData, totalCount } = await UserService.teacherDetails(state.params)
    if (state.params.currPage === 1) {
      state.list = resultData.studentComment || []
      if (refresh) {
        //刷新完重置状态
        state.triggered = false
        state._freshing = false
      }
    } else {
      state.list = state.list.concat(resultData.studentComment)
    }
    state.teacherFeedback = resultData.teacherFeedback || {}
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
</script>

<style scoped lang="scss">
  .stu-comment {
    height: calc(100vh - env(safe-area-inset-bottom));
    box-sizing: border-box;

    .content {
      position: relative;
      width: 100%;
      border-bottom: 20rpx solid #F2F6FC;

      .bg {
        width: 100%;
        height: auto;
      }

      .bg-wrap {
        position: absolute;
        top: 30rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 686rpx;
        height: 200rpx;
        background: #ffffff;
        padding: 30rpx 54rpx;
        display: flex;
        box-shadow: 0rpx -20rpx 20rpx 0rpx #FFE148;
        border-radius: 16rpx;
        box-sizing: border-box;

        .item-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;

          .label {
            font-size: 24rpx;
            color: #666666;
            line-height: 33rpx;
            border-right: 1rpx solid #DCDFE6;
            width: 100%;
            text-align: center;
          }

          .none-border {
            border-right: none;
          }

          .rate-wrap {
            color: #ff5e01;

            .rate {
              font-size: 48rpx;
              padding-right: 8rpx;
            }

            .unit {
              font-size: 20rpx;
            }
          }

          .icon {
            width: 40rpx;
            height: 40rpx;
            margin-top: 16rpx;
          }

          .tip {
            margin-top: 8rpx;
            font-size: 20rpx;
            color: #999999;
            line-height: 40rpx;
          }
        }
      }

      .teach-target {
        margin-top: 68rpx;
        padding: 0 32rpx;

        .teach-info {
          padding: 40rpx 18rpx 8rpx 40rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;

          .teach-item {
            width: 280rpx;
            height: 88rpx;
            display: flex;

            .name {
              font-size: 24rpx;
              color: #666666;
              line-height: 32rpx;
              margin-right: 20rpx;
              min-width: 96rpx;
            }

            .none-data {
              font-size: 20rpx;
              color: #999999;
              line-height: 32rpx;
            }

            .info-wrap {
              display: flex;
              flex-direction: column;

              .data {
                margin-top: 10rpx;
                font-size: 20rpx;
                color: #999999;
                line-height: 28rpx;
              }
            }
          }
        }
      }
    }

    .title {
      font-weight: 500;
      font-size: 32rpx;
      color: #303133;
      line-height: 32rpx;
    }

    .comment-tab {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;

      .tab-wrap {
        display: flex;

        .tab {
          padding: 10rpx 24rpx;
          font-size: 26rpx;
          color: #666666;
          border-radius: 29rpx;
          border: 1rpx solid #D5D5D5;
          margin-left: 30rpx;
        }

        .active-tab {
          background: rgba(0, 132, 255, 0.05);
          border: 1rpx solid #0084FF;
          color: #0087FF;
        }
      }
    }

    .li {
      display: flex;
      width: 100%;
      border-bottom: 1rpx solid #EEEEEF;
      padding-top: 40rpx;
      padding-bottom: 26rpx;
      margin-left: 32rpx;
      box-sizing: border-box;

      .comment-avatar {
        width: 80rpx;
        height: 80rpx;
        margin-right: 32rpx;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .comment-wrap {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-right: 32rpx;

        .top {
          display: flex;
          align-content: center;
          justify-content: space-between;
          padding-right: 26rpx;

          .tea-name {
            font-size: 28rpx;
            color: #303133;
            line-height: 36rpx;
          }
        }

        .date {
          margin-top: 16rpx;
          font-size: 24rpx;
          color: #999999;
        }

        .tip {
          margin-top: 24rpx;
          font-size: 28rpx;
          color: #666666;
          line-height: 33rpx;
          text-align: justify;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          padding-right: 30rpx;
        }
      }
    }
  }
</style>
