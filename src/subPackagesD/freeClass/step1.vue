<template>
  <view class="step1">
    <text class="title">选择套餐</text>
    <view class="package">
      <template v-if="datebookStore.freeClass.isFirstClass">
        <view class="none-item flex-s-c" @click="callMobileArea">
          <view class="left">
            <text class="tip">欢迎使用体验卡</text>
            <text class="blue">请联系专属学习顾问，为您约课。</text>
          </view>
          <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
        </view>
      </template>
      <template v-if="mealPackage.length === 0 && unUsedPackageList.length === 0">
        <view class="none-item flex-s-c" @click="callMobileArea">
          <view class="left">
            <text class="tip">暂无可用套餐，无法约课</text>
            <text class="blue">去联系专属学习顾问</text>
          </view>
          <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
        </view>
      </template>
      <template v-else>
        <view class="none-item flex-s-c" @click="choosePackage" v-if="!state.choosePackageItem.productName">
          <view class="left yellow">
            存在未激活套餐，点击前往激活
          </view>
          <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
        </view>
        <view class="package-item flex-s-c" @click="choosePackage" v-else>
          <view class="left flex-c">
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon2.png"
                   v-if="state.choosePackageItem.productType === 0"></image>
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon1.png"
                   v-else-if="state.choosePackageItem.productType === 1"></image>
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/card-other.png"
                   v-else-if="state.choosePackageItem.productType === 4"></image>
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/card-open.png"
                   v-else-if="state.choosePackageItem.productType === 2"></image>
            <image mode="widthFix" class="icon" src="@/subPackagesD/images/package-icon3.png" v-else></image>
            <view class="text-wrap">
              <text class="name">{{ state.choosePackageItem.productName }}</text>
              <view class="bottom">
                <text class="num mr-30">{{ state.choosePackageItem.balance }}课时</text>
                <text class="date">有效期：{{ state.choosePackageItem.validityTime }}</text>
              </view>
            </view>
          </view>
          <image mode="widthFix" class="right" src="@/subPackagesD/images/iv_group_right_arrow.png"></image>
        </view>
      </template>
    </view>
    <text class="title">选择学习语言</text>
    <view class="language">
      <view class="item flex-s-c" :class="{'active-item':item.type===state.params.languageType}" v-for="item in languageList" :key="item.type" @click="selectType(item.type)">
        <view class="left flex-c">
          <image mode="widthFix" class="icon" :src="item.img"></image>
          <view class="text-wrap">
            <text class="name">{{item.title}}</text>
            <text class="translate">{{item.description}}</text>
          </view>
        </view>
        <image mode="widthFix"
               class="radio_select"
               src="@/subPackagesD/images/radio_select.png"
               v-if="item.type===state.params.languageType"></image>
        <view class="right" v-else></view>
      </view>
    </view>
    <view class="bottom-wrap flex-c">
    <view class="button flex-c"
          @click="next"
          :class="{'disabled':disabled}">下一步
    </view>
    </view>
  </view>
</template>

<script setup>
import en from '@/subPackagesD/images/en_flag.png'
import es from '@/subPackagesD/images/es_flag.png'
import jp from '@/subPackagesD/images/jp_flag.png'
import ge from '@/subPackagesD/images/ge.png'
import fr from '@/subPackagesD/images/fr.png'
import russian from '@/subPackagesD/images/russian.png'
import { useDatebookStore,useUserStore } from '@/store'
import { getMobileArea } from '@/utils/auth'

const languageList = [
  { title: '英语', description: 'English', img: en, type: 0 },
  { title: '日语', description: '魔法の日本語', img: jp, type: 1 },
  { title: '西班牙语', description: 'Español mágico', img: es, type: 2 },
  { title: '德语', description: 'Magic Deutsch', img: ge, type: 3 },
  { title: '法语', description: 'Magie Français', img: fr, type: 6 },
  { title: '俄语', description: 'Волшебный русский язык', img: russian, type: 5 }
]
const datebookStore = useDatebookStore()
const userStore = useUserStore()
const state = reactive({
  params: datebookStore.freeClass.params,
  mobileArea: getMobileArea(),
  choosePackageItem:{
    productType: '',
    productName: '',
    balance: '',
    validityTime: ''
  }
})
const unUsedPackageList = computed(() => {
  return datebookStore.freeClass.unUsedPackageList
})
const mealPackage = computed(() => {
  return datebookStore.freeClass.mealPackage
})
onLoad((query) => {
  uni.showLoading({})
  datebookStore.getFreeClassData().then(()=>{
    getPackageName(datebookStore.freeClass.params.packageId)
    uni.hideLoading()
  })
  uni.$on('getPackageName', getPackageName);
})
onUnload(() => {
  uni.$off('getPackageName');
});
function getPackageName(packageMergeId) {
  const index = mealPackage.value.findIndex((item) => item.packageMergeId == packageMergeId)
  console.log(index,'index')
  if (index > -1) {
    setData(index)
  } else if (index === -1 && mealPackage.value.length > 0) { // 没有指定默认套餐，选第一个套餐包
    setData(0)
  }

  function setData(index) {
    const item = mealPackage.value[index]
    state.choosePackageItem.productName = getMealName(item.productType)
    state.choosePackageItem.balance = item.balance
    state.choosePackageItem.productType = item.productType
    state.choosePackageItem.validityTime = item.validityTime

    datebookStore.freeClass.params.packageId = item.packageId
    datebookStore.freeClass.params.packageType = item.packageType
  }
}
const callMobileArea = async () => {
  if (state.mobileArea) {
    uni.makePhoneCall({
      phoneNumber: state.mobileArea
    })
  } else {
    const { resultData } = await UserService.mobileArea()
    userStore.setMobileArea(resultData)
    uni.makePhoneCall({
      phoneNumber: resultData
    })
  }
}
function selectType(type) {
  state.params.languageType=type
}
function next() {
  uni.navigateTo({
    url: '/subPackagesD/freeClass/step2'
  })
}
function getMealName(type){//套餐名称
  if(type===0){//次卡
    return '次卡套餐包';
  }else if(type===1){//月卡
    return '月卡套餐包';
  }else if(type===2){//公开课套餐
    return '公开课套餐包';
  }else if(type===3){//周卡套餐
    return '周卡套餐包';
  }else if(type===4){//口语测评套餐包
    return '口语测评套餐包';
  }
}
function choosePackage() {
  let packageMergeId=datebookStore.freeClass.params.packageId
  uni.navigateTo({
    url: `/subPackagesD/components/freeClassPackage?packageMergeId=${packageMergeId}`
  })
}
const disabled = computed(() => {
 return !state.params.packageId;
})
</script>

<style scoped lang="scss">
  .step1 {
    margin: 0 32rpx;

    .title {
      display: block;
      font-weight: 500;
      font-size: 40rpx;
      color: #333333;
      line-height: 56rpx;
      margin-bottom: 28rpx;
      margin-top: 40rpx;
    }
    .package {
      margin: 50rpx 0;
    }

    .package-item {
      padding: 20rpx;
      box-sizing: border-box;
      width: 100%;
      height: 138rpx;
      background: #ffffff;
      border-radius: 16rpx;
      background: rgba(0,135,255,0.05);
      border: 2rpx solid #0087FF;

      .left {
        .icon {
          width: 84rpx;
          height: 96rpx;
          margin-right: 20rpx;
        }

        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 96rpx;
          .name {
            font-size: 32rpx;
            color: #333333;
            line-height: 32rpx;
          }

          .bottom {
            font-size: 24rpx;
            color: #666666;
            line-height: 36rpx;

            .num {
              color: #666666;
            }

            .date {
              color: #999999;
            }
          }


          .mr-30 {
            margin-right: 30rpx;
          }
        }
      }

      .right {
        width: 14rpx;
        height: 24rpx;
      }
    }

    .none-item {
      padding: 26rpx 30rpx;
      box-sizing: border-box;
      width: 100%;
      height: 124rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(219, 219, 219, 0.5);

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

      .yellow {
        font-size: 32rpx;
        color: #FF5E01;
        justify-content: center;
      }

      .right {
        width: 14rpx;
        height: 24rpx;
      }
    }

    .language {
      display: flex;
      flex-direction: column;
      margin-top: 30rpx;
      padding-bottom: 250rpx;

      .item {
        box-sizing: border-box;
        width: 686rpx;
        height: 150rpx;
        background: #FFFFFF;
        border-radius: 16rpx;
        border: 2rpx solid #E4E4E4;
        padding: 35rpx 30rpx;
        margin-bottom: 20rpx;

        .left {
          height: 100%;

          .icon {
            width: 112rpx;
            height: 80rpx;
            margin-right: 36rpx;
          }

          .text-wrap {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;

            .name {
              font-size: 28rpx;
              color: #333333;
              line-height: 32rpx;
            }

            .translate {
              font-size: 26rpx;
              color: #999999;
              line-height: 28rpx;
            }
          }
        }

        .right {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          border: 2rpx solid #E8E8E8;
        }

        .radio_select {
          width: 40rpx;
          height: 40rpx;
        }

      }
      .active-item{
        background: rgba(0,135,255,0.05);
        border: 2rpx solid #0087FF;
      }
    }

    .bottom-wrap{
      position: fixed;
      height: 140rpx;
      bottom: 0;
      background: #ffffff;
      padding-bottom: env(safe-area-inset-bottom);
      .button {
        left: 50%;
        width: 686rpx;
        height: 100rpx;
        background: #0087FF;
        border-radius: 50rpx;
        font-size: 32rpx;
        color: #FFFFFF;
      }

      .disabled {
        background: #CCCCCC;
      }
    }

  }
</style>
