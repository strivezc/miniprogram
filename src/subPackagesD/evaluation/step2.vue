<template>
  <view class="step2">
<!--    <template v-if="datebookStore.evaluation.theLastAssessClass === false">-->
      <text class="title">测评资料填写</text>
      <text class="tip">为了测评结果的准确性，请您根据实际情况填</text>
      <view class="label">
        <text class="red">*</text>
        1、是否有其他在线英语学习经历
      </view>
      <view class="flex-l-c">
        <view class="tab flex-c" :class="{'tab-active':state.form.commend===0}" @click="handleCommend(0)">是</view>
        <view class="tab flex-c" :class="{'tab-active':state.form.commend===1}" @click="handleCommend(1)">否</view>
      </view>
      <textarea class="textarea" :disabled="state.form.commend===1" :maxlength="1000" v-model="state.form.useCount"
                placeholder="请简写您想学习相关经历（可以让测评更准确哦）"/>
<!--      <view class="label">-->
<!--        2、希望通过测评解决您的什么问题？-->
<!--      </view>-->
<!--      <textarea class="textarea" :maxlength="1000" v-model="state.form.userProblem"-->
<!--                placeholder="具体情况描述"/>-->
<!--    </template>-->
    <view class="label">
      <text class="red">*</text>
      2、您的上课工具为：
    </view>
    <view class="tab tab2 flex-c tab-active">官网或APP上课</view>
    <view class="label">
      <text class="red">*</text>
      3、老师类型：
    </view>
    <view class="tab flex-c tab-active">中教</view>
    <view class="button flex-c" :class="{'disabled':disabled}" @click="next">下一步</view>
  </view>
</template>

<script setup>
import { useDatebookStore } from '@/store'

const datebookStore = useDatebookStore()
const state = reactive({
  form: datebookStore.evaluation.form
})

function handleCommend(val) {
  state.form.commend = val
  if (val === 1) {
    state.form.useCount = ''
  }
}

function next() {
  if (disabled.value) return
  uni.redirectTo({
    url: '/subPackagesD/evaluation/step3'
  })
}

const disabled = computed(() => {
  return state.form.commend === 0 && !state.form.useCount;
})
</script>

<style scoped lang="scss">
  .step2 {
    margin: 0 32rpx;

    .title {
      display: block;
      font-weight: 500;
      font-size: 40rpx;
      color: #333333;
      line-height: 56rpx;
      margin-top: 24rpx;
    }

    .tip {
      display: block;
      margin-top: 30rpx;
      font-size: 24rpx;
      color: #FFAA00;
      line-height: 33rpx;
    }

    .label {
      margin-top: 50rpx;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
    }

    .red {
      color: #FF5E01;
    }

    .tab {
      width: 201rpx;
      height: 58rpx;
      border-radius: 29rpx;
      border: 1PX solid #D5D5D5;
      font-size: 28rpx;
      color: #666666;
      margin-right: 40rpx;
      margin-top: 20rpx;
    }
    .tab2{
      width: 241rpx;
    }

    .tab-active {
      background: rgba(0, 132, 255, 0.05);
      border: 1PX solid #0087FF;
      color: #0087FF;
    }

    .textarea {
      box-sizing: border-box;
      height: 200rpx;
      border-radius: 16rpx;
      border: 1PX solid #DDDDDD;
      font-size: 28rpx;
      padding: 20rpx;
      width: 100%;
      margin-top: 30rpx;
    }
    .button{
      margin-top: 80rpx;
      width: 686rpx;
      height: 88rpx;
      background: #0087FF;
      border-radius: 40rpx;
      font-size: 32rpx;
      color: #FFFFFF;
    }
    .disabled{
      background: #CCCCCC;
    }
  }
</style>
