<template>
  <view class="choosePackage">
    <text class="title">请选择使用套餐类型</text>
    <template v-if="datebookStore.freeClass.mealPackage.length === 0 && datebookStore.freeClass.unUsedPackageList.length === 0">
      <view class="none-item flex-s-c" @click="callMobileArea">
        <view class="left">
          <text class="tip">暂无可用套餐，无法约课</text>
          <text class="blue">去联系专属学习顾问</text>
        </view>
        <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
      </view>
    </template>
    <template v-else>
      <view class="item flex-s-c"
            :class="{'item-active':state.packageMergeId==item.packageMergeId}"
            @click="selectPackage(item)"
            v-for="item in datebookStore.freeClass.mealPackage"
            :key="item.packageMergeId">
        <view class="left flex-c">
          <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon2.png"
                 v-if="item.productType === 0"></image>
          <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon1.png"
                 v-else-if="item.productType === 1"></image>
          <image mode="widthFix" class="icon" src="@/subPackagesD/images/card-other.png"
                 v-else-if="item.productType === 4"></image>
          <image mode="widthFix" class="icon" src="@/subPackagesD/images/card-open.png"
                 v-else-if="item.productType === 2"></image>
          <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon3.png" v-else></image>
          <view class="text-wrap">
            <text class="name">{{ state.getMealName[item.productType] }}</text>
            <text class="num">{{ item.balance }}课时</text>
            <text class="date">有效期：{{ item.validityTime }}</text>
          </view>
        </view>
        <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
      </view>
      <template v-if="datebookStore.freeClass.unUsedPackageList.length > 0">
        <text class="title">未激活套餐</text>
        <view class="item flex-s-c" v-for="item in datebookStore.freeClass.unUsedPackageList" :key="item.packageId">
          <view class="left flex-c">
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/unact-card.png"></image>
            <view class="text-wrap">
              <text class="name">{{ item.productName }}</text>
              <text class="id-num">ID：{{ item.packageId }}</text>
              <text class="date">余额（课时）：{{item.balance}}</text>
<!--              <view class="yellow">-->
<!--                <text class="mr-35">未激活</text>-->
<!--                {{ item.autoActivateTime }} 自动激活-->
<!--              </view>-->
            </view>
          </view>
          <view class="right-btn flex-c" @click="activePackage(item.packageId,item.productType)">激活</view>
        </view>
      </template>
    </template>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'
import DatebookService from '@/api/DatebookService'
import { getMobileArea } from '@/utils/auth';

const datebookStore = useDatebookStore()
const state = reactive({
  packageMergeId: '',
  inactivatedList:[], // 未激活套餐
  filterPackageMergeList:[], // 套餐包
  getMealName:{
    0:'次卡套餐包',
    1:'月卡套餐包',
    2:'公开课套餐包',
    3:'周卡套餐包',
    4:'口语测评套餐包',
  },
})

onLoad((query) => {
  if (query.packageMergeId) {
    state.packageMergeId = query.packageMergeId
  }
})
//未激活套餐激活文案
function getMealType(type){
  let text = '';
  switch (type) {
    case 0:
      text = '套餐激活后将放入“次卡激活套餐包”，有效期和课时数累加，确认要激活此套餐吗？';
      break;
    case 1:
      text = '套餐激活后将放入“月卡激活套餐包”，有效期和课时数累加，激活当日不扣课时（老师原因当天取消课程的情况下，学员不约课不扣课时），其他时间请每天至少上一节课，否则系统每天自动扣除1一个课时。激活之后默认遵守月卡使用规则，确认要激活此套餐吗？';
      break;
    case 7:
      text = '套餐激活后将放入“周卡激活套餐包”，有效期和课时数累加，确认要激活此套餐吗？';
      break;
    default :
      text ='确认要激活此套餐吗？';
  }
  return text;
}
const activePackage = async (packageId,productType) => {
  try {
    uni.showModal({
      title: '提示',
      content: getMealType(productType),
      confirmColor: '#0087FF',
      success: function(res) {
        if (res.confirm) {
          DatebookService.activeMeal(packageId).then(async () => {
            uni.showToast({
              title: '激活成功!',
              icon: 'none'
            })
            const { resultData } = await DatebookService.getFreeAppointPackageInfo(datebookStore.freeClass.params.teacherId)
            datebookStore.freeClass.mealPackage = resultData.packageMergeList.concat(resultData.packageList) || []
            datebookStore.freeClass.unUsedPackageList = resultData.unUsedPackageList || []
          })
        }
      }
    })
  } catch (e) {
    console.log(e, 'error')
  }
}
function callMobileArea() {
  uni.makePhoneCall({
    phoneNumber: getMobileArea()
  });
}
function selectPackage(item) {
  state.packageMergeId = item.packageMergeId
  console.log(item.packageMergeId,'item.packageMergeId')
  uni.$emit('getPackageName', state.packageMergeId);
  uni.navigateBack({
    url: `/subPackagesD/freeClass/step1?packageMergeId=${item.packageMergeId}`
  })
}
</script>

<style scoped lang="scss">
  .choosePackage {
    margin: 0 32rpx;

    .title {
      display: block;
      font-weight: 500;
      font-size: 36rpx;
      color: #333333;
      line-height: 50rpx;
      margin-bottom: 20rpx;
      margin-top: 55rpx;
    }

    .none-item {
      padding: 39rpx 30rpx;
      box-sizing: border-box;
      width: 100%;
      height: 150rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      border: 2rpx solid #E4E4E4;
      margin-bottom: 20rpx;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        .tip {
          font-size: 28rpx;
          color: #333333;
          line-height: 28rpx;
        }

        .blue {
          font-size: 28rpx;
          color: #0087FF;
          line-height: 28rpx;
        }
      }

      .right {
        width: 14rpx;
        height: 24rpx;
      }
    }

    .item {
      padding: 30rpx 29rpx 30rpx 24rpx;
      box-sizing: border-box;
      width: 100%;
      height: 200rpx;
      background: #ffffff;
      border-radius: 16rpx;
      border: 1PX solid #CCCCCC;
      margin-bottom: 20rpx;
      .left {
        .icon {
          width: 120rpx;
          height: 140rpx;
          margin-right: 30rpx;
        }

        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 140rpx;
          .name {
            font-size: 28rpx;
            color: #333333;
            line-height: 32rpx;
          }

          .num {
            font-size: 28rpx;
            color: #666666;
            line-height: 28rpx;
          }

          .id-num {
            font-size: 24rpx;
            color: #999999;
            line-height: 24rpx;
          }

          .yellow {
            font-size: 22rpx;
            color: #FF5E01;
            line-height: 30rpx;
          }

          .date {
            font-size: 22rpx;
            color: #999999;
            line-height: 22rpx;
          }
        }
      }

      .right {
        width: 14rpx;
        height: 24rpx;
      }

      .right-btn {
        width: 100rpx;
        height: 44rpx;
        border-radius: 22rpx;
        border: 1PX solid #CCCCCC;
        font-size: 22rpx;
        color: #666666;
      }
    }

    .mr-35 {
      margin-right: 35rpx;
    }

    .item-active {
      background: rgba(0, 135, 255, 0.05);
      border: 2rpx solid #0087FF;
    }
  }
</style>
