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
    <view class="text-[28px] pt-[60px] pb-[38px] text-black-3 font-bold">{{
      pageTitle
    }}</view>

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

    <view @click="type === 0 ? (type = 1) : (type = 0)">{{
      changeTypeBtnName
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
const pageTitle = computed(() => {
  return type.value === 0 ? '手机快捷登录' : '账号密码登录'
})
const changeTypeBtnName = computed(() => {
  return type.value === 0 ? '账号密码登录' : '手机快捷登录'
})
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
