<template>
  <view class="checkUserInfo">
    <text class="tip flex-c">请完善以下资料，以便老师有针对性的与您对</text>
    <view class="label">请选择性别</view>
    <view class="sex-wrap">
      <view class="item flex-c" :class="{'active-item':state.sex===1}" @click="handleItem(1)">
        <image mode="widthFix" class="icon" src="@/subPackagesD/images/iv_boy.png"></image>
        <text class="text">男生</text>
      </view>
      <view class="item flex-c" :class="{'active-item':state.sex===0}" @click="handleItem(0)">
        <image mode="widthFix" class="icon" src="@/subPackagesD/images/iv_girl.png"></image>
        <text class="text">女生</text>
      </view>
    </view>
    <view class="label">请选择学员生日</view>
    <view class="date-picker flex-c" @click="openPicker">{{state.date?state.date:'请选择学员生日'}}</view>
    <van-popup :show="state.show" position="bottom">
      <van-datetime-picker
          type="date"
          :value="state.currentDate"
          :min-date="state.minDate"
          :max-date="state.maxDate"
          :formatter="formatter"
          @confirm="confirm"
          @cancel="cancel"
      />
    </van-popup>
    <view class="button flex-c" @click="submit">下一步</view>
  </view>
</template>

<script setup>
import DatebookService from '@/api/DatebookService'
import { parseTime } from '@/utils/index'

onLoad((query) => {
  state.sex = query.sex
  state.age = query.age
  state.qq = query.qq
  state.skype = query.skype
  state.fromPage = query.fromPage
})

const state = reactive({
  show: false,
  sex: 1,
  age: 0,
  qq: '',
  skype: '',
  date: '',
  fromPage: '',
  currentDate: new Date().getTime(),
  minDate: new Date('1900/01/01'),
  maxDate: new Date()
})

const submit = async () => {
  if (state.sex !== 0 && state.sex !== 1) {
    uni.showToast({
      title: '请选择性别！',
      icon: 'none'
    })
    return
  }
  if (state.age == 0 || state.age > 99) {
    uni.showToast({
      title: '年龄格式不正确，必须是1-99的值！',
      icon: 'none'
    })
    return
  }
  const params = {
    sex: state.sex,
    age: state.age,
    qq: state.qq,
    skype: state.skype
  }
  await DatebookService.completeInfomation(params)
  let url=''
  if (state.fromPage==='evaluation') {
    url='/subPackagesD/evaluation/step1'
  } else if (state.fromPage==='freeClass') {
    url='/subPackagesD/freeClass/step1'
  }else if (state.fromPage==='vipClass') {
    url='/subPackagesD/vipClass/step1'
  }
  uni.redirectTo({
    url
  })
}

function cancel() {
  state.show = false
}

function getAge() {
  if (state.date) {
    let birthday = new Date(state.date.replace(/-/g, '/'))
    let d = new Date()
    let age =
      d.getFullYear() -
      birthday.getFullYear() -
      (d.getMonth() < birthday.getMonth() ||
      (d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate())
        ? 1
        : 0)
    state.age = age
  } else {
    state.age = 0
  }
}

function confirm(event) {
  cancel()
  state.date = parseTime(event.detail, '{y}-{m}-{d}')
  getAge()
}

function openPicker() {
  state.show = true
}

function handleItem(type) {
  state.sex = type
}

function formatter(type, value) {
  // 格式化选择器日期
  if (type === 'year') {
    return `${value}年`
  } else if (type === 'month') {
    return `${value}月`
  } else if (type === 'day') {
    return `${value}日`
  }
  return value
}
</script>

<style scoped lang="scss">
  .checkUserInfo {
    margin: 0 50rpx;

    .tip {
      height: 80rpx;
      background: #FFF7E6;
      font-size: 28rpx;
      color: #FFAA00;
      margin: 0 -50rpx;
    }

    .label {
      margin-top: 51rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #333333;
      line-height: 45rpx;

      &:last-child {
        margin-top: 61rpx;
      }
    }

    .sex-wrap {
      display: flex;
      align-content: center;
      justify-content: space-between;
      margin-top: 32rpx;

      .item {
        width: 300rpx;
        height: 86rpx;
        background: #F4F5F7;
        border-radius: 16rpx;
        border: 1PX solid transparent;

        .icon {
          width: 50rpx;
          height: 50rpx;
          margin-right: 25rpx;
        }

        .text {
          font-size: 32rpx;
          color: #333333;
        }
      }

      .active-item {
        background: rgba(0, 135, 255, 0.1);
        border: 1PX solid #0087FF;

        .text {
          color: #0087FF;
        }
      }
    }

    .date-picker {
      width: 100%;
      height: 86rpx;
      background: #F4F5F7;
      border-radius: 16rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #333333;
      margin-top: 32rpx;
    }

    .button {
      position: fixed;
      bottom: env(safe-area-inset-bottom);
      margin-bottom: 40rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 654rpx;
      height: 96rpx;
      background: #0087FF;
      border-radius: 48rpx;
      font-size: 32rpx;
      color: #FFFFFF;
    }
  }

</style>
