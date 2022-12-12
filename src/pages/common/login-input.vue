<!--
  功能：功能描述
  作者：Michael
  时间：2022年10月19日 15:10:48
  版本：v0.0.1
-->
<template>
  <page-meta>
    <navigation-bar title="" />
  </page-meta>
  <view class="page-wrap">
    <view class="flex-row-center">
      <text
        class="text-[48rpx] text-black-9"
        :class="{ active: type === 0 }"
        @click="type = 0"
        >{{ $t('passwordLogin') }}</text
      >
      <text
        class="w-[1px] inline-block h-[38rpx] mx-[40rpx] bg-[#CECECE]"
      ></text>
      <text
        class="text-[48rpx] text-black-9"
        :class="{ active: type === 1 }"
        @click="type = 1"
        >{{ $t('verificationCodeLogin') }}</text
      >
    </view>
    <view class="mt-[72rpx] mb-[40rpx]">
      <input
        v-model="formData.phone"
        placeholder-class="placeholder-class"
        class="input"
        type="number"
        maxlength="11"
        :placeholder="$t('phoneInputPlaceholder')"
      />

      <view v-if="type === 1" class="flex-row-between code-input-wrap">
        <input
          v-model="formData.code"
          placeholder-class="placeholder-class"
          class="code-input flex-1"
          :placeholder="$t('codeInputPlaceholder')"
        />
        <text class="text-main min-w-[140rpx] text-center" @click="getCode">{{
          countdownNum > 0 ? countdownNum + 's' : $t('sendCode')
        }}</text>
      </view>
      <input
        v-else
        v-model="formData.password"
        placeholder-class="placeholder-class"
        class="input"
        :placeholder="$t('passwordInputPlaceholder')"
      />
    </view>
    <view class="flex items-center justify-center flex-wrap">
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
    <view class="login-btn" :class="{ active: activeBtn }" @click="login">{{
      $t('login')
    }}</view>
  </view>
</template>

<script setup lang="ts">
import SystemService from '@/api/system'
import router from '@/router'
import { useUserStore } from '@/stores/user'

import { $toast, isPhone } from '@/utils'

const activeBtn = computed(() => {
  if (type.value === 0) {
    return isPhone(formData.phone) && formData.password.length > 3
  }
  return isPhone(formData.phone) && formData.code.length > 3
})

const userStore = useUserStore()

const type = ref(0)
const countdownNum = ref(0)
const checked = ref(false)

const formData = reactive({
  phone: '',
  password: '',
  code: '',
})

function login() {
  if (!checked.value) {
    return $toast('请先同意协议')
  }
  if (type.value === 0) {
    return loginByPwd()
  }
  loginByCode()
}

async function loginByCode() {
  const params = {
    phone: formData.phone,
    captchaCode: formData.code,
    openId: userStore.openId,
    unboundOrNot: 2,
    appType: '1',
    isApp: '2',
    loginType: '2',
  }
  const res = await SystemService.loginByCode(params)
  if (res.data.resultCode === 0) {
    userStore.loginInfo = res.data.resultData
    userStore.token = res.data.resultData.token
    router.reLaunch('index')
  }
}

async function loginByPwd(unbind = false) {
  const loginByPwdParams = {
    loginId: formData.phone,
    password: formData.password,
    openId: userStore.openId,
    unboundOrNot: 2,
    appType: '1',
    isApp: '2',
    loginType: '2',
  }
  if (unbind) {
    loginByPwdParams.unboundOrNot = 1
  }
  const res = await SystemService.loginByPwd(loginByPwdParams)
  if (res.data.resultCode === 0) {
    userStore.loginInfo = res.data.resultData
    userStore.token = res.data.resultData.token
    router.reLaunch('index')
  } else if (res.data.resultCode === 8) {
    uni.showModal({
      title: res.data.resultMessage,
      showCancel: true,
      success(res) {
        if (res.confirm) {
          // loginByPwdParams.unboundOrNot = 1
          // 解绑手机号重新登录
          loginByPwd(true)
        }
      },
    })
  } else if (res.data.resultCode === 3) {
    uni.showModal({
      showCancel: false,
      title: res.data.resultMessage,
      success(res) {
        if (res.confirm) {
        }
      },
    })
  }
}

function toRegister(type: string) {
  router.navigate('register', { type })
}

async function checkIsRegister() {
  return new Promise(async (resolve) => {
    const params = {
      phone: formData.phone,
    }
    const res = await SystemService.checkIsRegister(params)
    if (res.data.resultCode === 0) {
      if (res.data.resultData.registered === 1) {
        resolve(true)
      } else {
        resolve(false)
      }
    }
  })
}
async function getCode() {
  const isRegister = await checkIsRegister()
  if (isRegister && countdownNum.value === 0) {
    const params = {
      phone: formData.phone,
    }
    const res = await SystemService.getLoginCode(params)
    if (res.data.resultCode === 0) {
      countdownNum.value = 60
      countdown()
      $toast('验证码已发送，请注意查收')
    }
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
.active {
  color: #333;
}

.page-wrap {
  padding: 0 46rpx;
}

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
</style>
