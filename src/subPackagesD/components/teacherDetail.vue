<template>
  <view class="teacher-detail">
    <view class="video-wrap" v-if="datebookStore.teacherBaseRespDTO.videoUrl">
      <video id="myVideo" :show-center-play-btn="false"
             poster="https://cos.talk915.com/data/image/fdf2a4b90dad40fab18ac94f91cbe431.png"
             class="video" :src="datebookStore.teacherBaseRespDTO.videoUrl"
             controls></video>
    </view>
    <view class="info-wrap">
      <view class="title">老师档案</view>
      <view class="text1">毕业院校：{{datebookStore.teacherBaseRespDTO.educationBackground}}</view>
      <view class="text1">适合级别：{{formatTeachGrade(datebookStore.teacherBaseRespDTO.teachGrade)}}</view>
      <view class="text1">擅长课程：{{formatTeachTeachCourse(datebookStore.teacherBaseRespDTO.teachGrade)}}</view>
      <view class="text1">教学经验：{{ datebookStore.teacherBaseRespDTO.teachExprience }}</view>
      <view class="text1" v-if="datebookStore.teacherBaseRespDTO.sign == 2">可VIP预约时间：待定，目前不可约。</view>
      <view class="text1" v-else-if="datebookStore.teacherBaseRespDTO.sign == 3">可VIP预约时间：{{
        datebookStore.teacherBaseRespDTO.probation }}
      </view>
      <view class="tag-list">
        <view class="tag" v-for="(item, index) in datebookStore.teacherBaseRespDTO.tagName" :key="index">{{item}}</view>
        <view class="item-empty"></view>
        <view class="item-empty"></view>
        <view class="item-empty"></view>
      </view>
    </view>
    <view class="info-wrap mt-60">
      <view class="title-wrap">
        <view class="title mt-0">老师介绍</view>
        <view class="translate-wrap"
              v-if="datebookStore.teacherBaseRespDTO.selfIntroduceZh && datebookStore.teacherBaseRespDTO.selfIntroduceEn">
          <view class="zh flex-c" :class="{'active':!state.isEn}" @click="state.isEn=!state.isEn">中</view>
          <view class="en flex-c" :class="{'active':state.isEn}" @click="state.isEn=!state.isEn">英</view>
        </view>
      </view>
      <view class="introduce"
            v-if="datebookStore.teacherBaseRespDTO.selfIntroduceZh && datebookStore.teacherBaseRespDTO.selfIntroduceEn">
        {{state.isEn?datebookStore.teacherBaseRespDTO.selfIntroduceEn:datebookStore.teacherBaseRespDTO.selfIntroduceZh}}
      </view>
      <view v-else-if="datebookStore.teacherBaseRespDTO.selfIntroduceZh">
        {{datebookStore.teacherBaseRespDTO.selfIntroduceZh}}
      </view>
      <view v-else-if="datebookStore.teacherBaseRespDTO.selfIntroduceEn">
        {{datebookStore.teacherBaseRespDTO.selfIntroduceEn}}
      </view>
    </view>
    <view class="title-wrap mt-60">
      <view class="title mt-0">学生评价
        <text class="yellow" v-if="datebookStore.teacherFeedback">{{datebookStore.teacherFeedback.feedback}}分</text>
      </view>
      <view class="arrow-wrap" @click="toStudentComment">
        <view class="text">更多评价</view>
        <image src="@/subPackagesD/images/iv_group_right_arrow.png" class="arrow"></image>
      </view>
    </view>
    <view class="student-comment">
      <view class="li" v-for="(item,index) in datebookStore.studentComment" :key="index">
        <image :src="item.userImg" @error="handleError(item)" mode="aspectFill" class="comment-avatar"></image>
        <view class="comment-wrap">
          <view class="top">
            <view class="tea-name">{{item.userName}}</view>
            <uni-rate v-model="item.feedback" :readonly="true" :size="18"/>
          </view>
          <view class="date">{{item.endTime}}</view>
          <view class="tip">{{item.commentTotea}}</view>
        </view>
      </view>
    </view>
    <view class="none-text">我是有底线的～</view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import UserService from '@/api/UserService'
import defaultImg from '@/subPackagesD/images/student_default_img.png'

const datebookStore = useDatebookStore()
const state = reactive({
  type: null,
  isPlay: false,
  isEn: false,
  teacherId:''
})

onLoad((query) => {
  state.teacherId=query.userId
  getTeacherDetail()
})


function handleError(item) {
  item.userImg = defaultImg
}
function toStudentComment() {
  uni.navigateTo({
    url: `/subPackagesD/components/studentComment?teacherId=${state.teacherId}`
  })
}

function formatTeachGrade(val) {
  if (!val) return ''
  let str = ''
  const arr = val.split(',')
  const obj = {
    0: '入门级',
    1: '基础级',
    2: '预备级',
    3: '进阶级',
    4: '中高级'
  }
  for (let i = 0; i < arr.length; i++) {
    str += `${obj[arr[i]]}、`
  }
  str = str.substr(0, str.length - 1)
  return str
}

function formatTeachTeachCourse(val) {
  if (!val) return ''
  let str = ''
  const arr = val.split(',')
  const obj = {
    0: '雅思',
    1: '托福',
    2: '托福',
    3: '初学者',
    4: '加州系列',
    5: '商务英语',
    6: '自由对话',
    7: '生活口语',
    8: '职场英语'
  }
  for (let i = 0; i < arr.length; i++) {
    str += `${obj[arr[i]]}、`
  }
  str = str.substr(0, str.length - 1)
  return str
}

const getTeacherDetail = async () => {
  try {
    const params = {
      currPage: 1,
      pageSize: 10,
      teacherId:state.teacherId,
      type: state.type
    }
    const { resultData } = await UserService.teacherDetails(params)
    datebookStore.studentComment = resultData.studentComment
    datebookStore.teacherBaseRespDTO = resultData.teacherBaseRespDTO
    datebookStore.teacherFeedback = resultData.teacherFeedback
  } catch (e) {
    console.log(e, 'error')
  }
}

</script>

<style scoped lang="scss">
  .teacher-detail {
    padding: 30rpx;
    box-sizing: border-box;

    .video-wrap {
      position: relative;
      width: 690rpx;
      height: 389rpx;

      .video {
        width: 690rpx;
        height: 389rpx;
        border-radius: 30rpx;
      }

      .poster {
        position: absolute;
        top: 0;
        left: 0;
        width: 690rpx;
        height: 389rpx;
      }
    }


    .info-wrap {
      border-bottom: 1PX solid #EEEEEF;
      padding-bottom: 10rpx;
    }

    .mt-60 {
      margin-top: 60rpx;
    }

    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .mt-0 {
        margin-top: 0;
      }

      .translate-wrap {
        display: flex;

        .zh {
          box-sizing: border-box;
          width: 60rpx;
          height: 43rpx;
          border-radius: 10rpx 0rpx 0rpx 10rpx;
          border: 1px solid #0087FF;
          font-size: 26rpx;
          color: #0087FF;
        }

        .en {
          box-sizing: border-box;
          width: 60rpx;
          height: 43rpx;
          border-radius: 0rpx 10rpx 10rpx 0rpx;
          border: 1px solid #0087FF;
          font-size: 26rpx;
          color: #0087FF;
        }

        .active {
          color: #FFFFFF;
          border: 1px solid transparent;
          background: #0087FF;
        }
      }

      .arrow-wrap {
        display: flex;
        align-items: center;

        .text {
          font-size: 28rpx;
          color: #999999;
          line-height: 33rpx;
        }

        .arrow {
          margin-left: 10rpx;
          width: 10rpx;
          height: 20rpx;
        }
      }
    }

    .yellow {
      color: #FF5E01;
      margin-left: 5rpx;
    }

    .introduce {
      font-size: 28rpx;
      color: #666666;
      line-height: 40rpx;
      text-align: justify;
      margin-top: 10rpx;
      padding-bottom: 20rpx;
    }

    .title {
      font-size: 36rpx;
      color: #333333;
      line-height: 42px;
      margin-top: 40rpx;
    }

    .text1 {
      padding: 20rpx 0 15rpx 0;
      font-size: 28rpx;
      color: #666666;
      line-height: 28rpx;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tag-list {
      margin-top: 15rpx;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;

      .tag {
        font-size: 20rpx;
        color: #999999;
        line-height: 24rpx;
        padding: 8rpx 28rpx;
        border-radius: 20rpx;
        border: 1rpx solid #CCCCCC;
        margin-bottom: 20rpx;
      }

      .item-empty {
        padding: 8rpx 28rpx;
        height: 0;
      }
    }

    .student-comment {
      margin-right: -30rpx;

      .li {
        display: flex;
        width: 100%;
        border-bottom: 1rpx solid #EEEEEF;
        padding-top: 40rpx;
        padding-bottom: 26rpx;

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

    .none-text {
      font-size: 24rpx;
      color: #CCCCCC;
      line-height: 28rpx;
      text-align: center;
      padding-top: 60rpx;
      padding-bottom: 47rpx;
    }
  }
</style>
