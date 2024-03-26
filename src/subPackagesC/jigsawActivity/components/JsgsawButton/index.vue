<template>
  <view
    class="button-wrapper animate__animated"
    :class="animateClass"
    @animationend="animationend"
    @click.stop="handleAction"
  >
    <image :src="getButtonType" class="button"></image>
    <text class="button-text-single" :style="{ 'font-size' : props.fontSize + 'rpx','padding-top': props.paddingTop + 'rpx' }" v-if="props.isSingleText">{{ props.singleText }}</text>
    <view class="button-text-twin" v-else>
      <view class="one">{{ twinTextOne }}</view>
      <view class="two">{{ twinTextTwo }}</view>
    </view>
    <button class="shareMask" open-type="share" v-if="props.isShare"></button>
    <button class="shareMask"
            open-type="getPhoneNumber"
            @getphonenumber="decryptPhoneNumber"
            v-show="props.isLogin && !appletLoginStatus"></button>
    <button
        class="shareMask"
        @click="decryptPhoneNumber('isBaseLogin')"
        v-show="props.isLogin && appletLoginStatus===1"
    >
    </button>
  </view>
</template>

<script setup>
  import { getAppletLoginStatus} from '@/utils/auth'
  import { checkGetPhoneVersion } from '@/utils';
  import { useUserStore } from '@/store';
  import UserService from '@/api/UserService';

  import greenButton from '@/subPackagesC/static/jigsaw/button/button-green-l.png';
  import redButton from '@/subPackagesC/static/jigsaw/button/button-red-l.png';
  import grayButton from '@/subPackagesC/static/jigsaw/button/button-gray-l.png';
  import yellowButton from '@/subPackagesC/static/jigsaw/button/button-yellow-l.png';
  import blueButton from '@/subPackagesC/static/jigsaw/button/button-blue-l.png';

  const userStore=useUserStore();
  const props = defineProps({
    type: {
      type: String,
      default: 'green',
    },
    singleText: {
      type: String,
    },
    isSingleText: {
      type: Boolean,
      default: true,
    },
    isShare: {
      type: Boolean,
      default: false,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    twinTextOne: {
      type: String,
    },
    twinTextTwo: {
      type: String,
    },
    fontSize: {
      type: Number,
      default: 44,
    },
    paddingTop: {
      type: Number,
      default: 12,
    },
  });
  const emit = defineEmits(['handleAction','loginAction']);
  const animateClass = ref([]);
  const appletLoginStatus = ref(getAppletLoginStatus());
  const getButtonType = computed(() => {
    const obj = {
      green: greenButton,
      red: redButton,
      gray: grayButton,
      yellow: yellowButton,
      blue: blueButton,
    };
    return obj[props.type];
  });
  const state=reactive({
    form: {
      loginCode: '',
      getPhoneCode: '',
      status: 0,
      recommendCode: '',
      jigsawCode: '',
    }
  })
  function animationend(e) {
    animateClass.value = [];
  }
  const handleAction = () => {
    animateClass.value.push('my_animate__pulse');
    emit('handleAction');
  };
  function decryptPhoneNumber(val) {
    console.log(val, 'val');
    if (val==='isBaseLogin' || val.detail.errMsg === 'getPhoneNumber:ok') {
      uni.showLoading({
        title: '登录中',
      });
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          state.form.loginCode = loginRes.code;
          if (val!=='isBaseLogin') {
            state.form.getPhoneCode = val.detail.code;
          }
          const params = {
            ...state.form,
          };
          if (userStore.jigsawCode) {
            params.recommendCode = userStore.userDistributorCode;
            params.jigsawCode = userStore.jigsawCode;
            params.code = userStore.recommendCode;
          } else {
            params.recommendCode = userStore.recommendCode;
          }
          console.log(params, 'params-login');
          UserService.appletLogin(params).then(async (res) => {
            uni.hideLoading();
            let resultData = res.resultData;
            const token = resultData.token;
            if (!token) {
              uni.showModal({
                title: '提示',
                content: '登录失效，请重新登录！',
                confirmColor: '#0087FF',
                cancelColor: '#0087FF',
                success: function (res) {
                  if (res.confirm) {
                  }
                },
              });
              return;
            }
            userStore.setToken(token);
            userStore.setUserId(resultData.userId);
            userStore.setUserType(resultData.userType);
            userStore.setUserName(resultData.userName);
            userStore.setUserPhone(resultData.phone);
            userStore.setUserImg(resultData.userImg);
            userStore.setRecommendCode(resultData.recommendCode);
            userStore.setMobileArea(resultData.mobileArea);
            if (val!=='isBaseLogin' && getAppletLoginStatus()!==1) { // 刷新微信账号绑定状态
              uni.login({
                provider: 'weixin',
                success: (res) => {
                  userStore.setAppletLoginStatus(res.code)
                },
              });
            }
            emit('loginAction');
            console.log(res, 'appletLogin-res');
          });
        },
      });
    }
  }
</script>

<style scoped lang="scss">
  .button-wrapper {
    cursor: pointer;
    position: relative;
    margin: auto;
    width: 400rpx;
    height: 100rpx;
    .shareMask {
      position: absolute;
      top: 0;
      left: 0;
      width: 400rpx;
      height: 100rpx;
      background: transparent;
      &::after {
        border: none;
      }
    }
    .button {
      width: 400rpx;
      height: 100rpx;
    }
    .button-text-single {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      padding-top: 12rpx;
      font-size: 44rpx;
      color: #ffffff;
      font-weight: bold;
      font-family: Resource Han Rounded CN;
      text-shadow: 0 3rpx #333333;
      width: 100%;
      text-align: center;
    }
    .button-text-twin {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      font-size: 24rpx;
      font-family: Resource Han Rounded CN;
      font-weight: bold;
      color: #ffffff;
      line-height: 36rpx;
      text-shadow: 0 3rpx 0 #333333;
    }
  }
</style>
