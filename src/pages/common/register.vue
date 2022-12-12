<!--
  功能：功能描述
  作者：Michael
  时间：2022年10月19日 15:10:55
  版本：v0.0.1
-->
<template>
  <page-meta>
    <navigation-bar title="" />
  </page-meta>
  <view class="px-[32rpx] mt-[32rpx]">
    <view class="text-[64rpx] text-black-3">{{
      type === 'register' ? '注册' : '找回密码'
    }}</view>
    <view class="mt-[72rpx] mb-[40rpx]">
      <input
        v-model="formData.phone"
        placeholder-class="placeholder-class"
        class="input"
        placeholder="请输入手机号"
      />
      <view class="flex-row-between code-input-wrap">
        <input
          v-model="formData.code"
          placeholder-class="placeholder-class"
          class="code-input flex-1"
          placeholder="请输入验证码"
        />
        <text class="text-main w-[140rpx] text-center" @click="getCode">{{
          countdownNum > 0 ? countdownNum + 's' : '获取验证码'
        }}</text>
      </view>
      <input
        v-model="formData.password"
        placeholder-class="placeholder-class"
        class="input"
        :placeholder="type === 'register' ? '请输入密码' : '设置新密码'"
      />
    </view>
    <view
      v-if="type === 'register'"
      class="flex items-center justify-center flex-wrap"
    >
      <radio
        color="#55D339"
        class="font-24"
        :checked="checked"
        style="transform: scale(0.7)"
        @click="radioChange"
      />
      <text class="text-[24rpx] text-black-9">{{ $t('CancelAccount.h') }}</text>
      <text class="agreement" @click="checkAgreement('userAgreement')"
        >《{{ $t('userAgreement') }}》</text
      >
      、
      <text class="agreement" @click="checkAgreement('privacy')"
        >《{{ $t('privacy') }}》</text
      >
      、
      <text class="agreement" @click="checkAgreement('childrenPrivacy')"
        >《{{ $t('childrenPrivacy') }}》</text
      >
      、
      <text class="agreement" @click="checkAgreement('disclaimer')"
        >《{{ $t('disclaimer') }}》</text
      >
    </view>
    <view class="login-btn" :class="{ active: btnActive }">{{
      type === 'register' ? '注册' : '重置密码'
    }}</view>

    <view class="go-login">
      <view class="text-center" @click="router.back">已有账号，去登录</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import router, { getRouteParams } from '@/router'

const type = ref<'register' | 'findPassword'>(getRouteParams('register').type)
const btnActive = ref(true)
const checked = ref(false)

const countdownNum = ref(0)

const formData = reactive({
  phone: '',
  password: '',
  code: '',
})

function getCode() {
  if (countdownNum.value === 0) {
    countdownNum.value = 60
    countdown()
  }
}

function countdown() {
  setTimeout(() => {
    if (countdownNum.value > 0) {
      countdownNum.value -= 1
      countdown()
    }
  }, 1000)
}

function radioChange() {
  checked.value = !checked.value
}

function checkAgreement(typ: string) {
  switch (typ) {
    case 'disclaimer':
      router.navigate('settingsHtml', { typ: 'disclaimer' })
      break
    case 'privacy':
      router.navigate('settingsHtml', { typ: 'privacy' })
      break
    case 'userAgreement':
      router.navigate('settingsHtml', { typ: 'userAgreement' })
      break
    case 'childrenPrivacy':
      router.navigate('settingsHtml', { typ: 'childrenPrivacy' })
      break
  }
}
</script>

<style lang="scss">
.input {
  border-bottom: 1px solid #d8d8d8;
  height: 92rpx;
  font-size: 40rpx;
}
.code-input-wrap {
  border-bottom: 1px solid #d8d8d8;
  height: 92rpx;

  .code-input {
    font-size: 40rpx;
  }
}

.placeholder-class {
  color: #c0c0c0;
}
.login-btn {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #fff;
  background: rgba(84, 211, 57, 0.4);
  border-radius: 16rpx;
  margin-top: 30rpx;
  margin-bottom: 36rpx;
  font-size: 32rpx;

  &.active {
    background-color: $main;
  }
}
.agreement {
  color: #0787f8;
  font-size: 24rpx;
}

.go-login {
  color: #999;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
}
</style>
