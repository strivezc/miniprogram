<template>
  <myPopup ref="popup" type="center">
    <view class="code-wrap">
      <image mode="widthFix" src="https://cos.talk915.com/data/image/68134f38c36d4af2a8fe3efe3c712eea.png" class="bg bg-inApp"/>
      <image mode="widthFix" :src="detailData.createrWxCode" class="qrcode qrcode-inApp"/>
      <view class="phone-wrap phone-wrap-inApp" @click="callPhone">
        <image mode="widthFix" src="@/subPackagesB/static/lottery/phone.png" class="icon icon-inApp"/>
        <span class="text">{{detailData.createrPhone}}</span>
      </view>
      <image mode="widthFix" src="@/subPackagesB/static/lottery/close.png" class="close close-inApp centerSP"
             @click="close"/>
      <view class="saveBtn centerSP" @click="saveQrcode">保存二维码到相册</view>
    </view>
  </myPopup>
</template>

<script>
import myPopup from '@/components/MyPopup';
import { saveNetWorkImage } from '@/utils';

export default {
  name: 'teacherContact',
  components: { myPopup },
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    saveQrcode() {
      saveNetWorkImage(this.detailData.createrWxCode)
    },
    callPhone() {
      uni.makePhoneCall({
        phoneNumber:this.detailData.createrPhone
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .code-wrap {
    position: relative;

    .bg {
      position: absolute;
      left: 50%;
      top: 280rpx;
      transform: translateX(-50%);
      width: 477rpx;
      height: 697rpx;
    }

    .bg-inApp {
      top: 188rpx;
    }

    .qrcode {
      position: absolute;
      top: 462rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 350rpx;
      height: 350rpx;
    }

    .qrcode-inApp {
      top: 385rpx;
    }

    .saveBtn {
      position: absolute;
      top: 914rpx;
      width: 477rpx;
      text-align: center;
      height: 88rpx;
      background: #FFFFFF;
      border-radius: 64rpx 64rpx 64rpx 64rpx;
      font-size: 32rpx;
      color: #0087FF;
      line-height: 88rpx;
    }

    .phone-wrap {
      position: absolute;
      top: 850rpx;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      margin-left: -14rpx;

      .icon {
        padding: 15rpx;
        width: 42rpx;
        height: 42rpx;
      }

      .text {
        font-size: 36rpx;
        color: #FFFFFF;
        line-height: 42rpx;
      }
    }

    .phone-wrap-inApp {
      top: 758rpx;
    }

    .close {
      width: 44rpx;
      height: 44rpx;
      position: absolute;
      top: 1011rpx;
      left: 50%;
    }

    .close-inApp {
      top: 1070rpx;
    }
  }
</style>
