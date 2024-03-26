<template>
  <view class="paymentOrder">
    <text class="title">{{form.subject}}</text>
    <view class="price-wrap">
      <text class="sign">￥</text>
      <text class="price">{{form.payMoney}}</text>
    </view>
    <view class="text-wrap">
      <text>服务提供方</text>
      <text>说客英语</text>
    </view>
    <button class="btn" @click="payment">立即支付</button>
    <view class="cancel" @click="goBack">取消</view>
  </view>
</template>

<script>
import CommonService from '@/api/CommonService'

export default {
  name: 'paymentOrder',
  onLoad(query) {
    this.form.oid = query.oid
    this.form.subject = query.subject
    this.form.productId = query.productId
    this.form.payMoney = query.payMoney
  },
  data() {
    return {
      form: {
        oid: '',
        subject: '',
        productId: '',
        payMoney: '',
        code: '',
        paymentType: 5
      }
    }
  },
  methods: {
    payment() {
      let that = this
      uni.showLoading({
        title: '支付处理中...'
      })
      try {
        uni.login({
          provider: 'weixin',
          success: async (res) => {
            console.log(res,'res-login')
            that.form.code = res.code
            console.log(this.form,'params-wxPaymentApplication')
            const { resultData } = await CommonService.wxPaymentApplication(this.form)
            console.log(resultData,'wxPaymentApplication-resultData')
            wx.requestPayment({
              timeStamp: resultData.timestamp,  //后端返回的时间戳
              nonceStr: resultData.nonceStr,   //后端返回的随机字符串
              package: resultData.prepayId, //后端返回的prepay_id
              signType: resultData.signType, //后端签名算法,根据后端来,后端MD5这里即为MD5
              paySign: resultData.paySign,  //后端返回的签名
              success(res) {
                uni.hideLoading()
                uni.showModal({
                  title: '提示',
                  content: '支付成功！',
                  showCancel: false,
                  confirmColor: '#0087FF',
                  cancelColor: '#0087FF',
                  success: function(res) {
                    if (res.confirm) {
                      uni.redirectTo({
                        url: '/subPackagesA/personal/myOrder'
                      })
                    }
                  }
                })
              },
              fail(res) {
                uni.hideLoading()
                console.log('用户支付扣款失败', res)
                uni.showToast({
                  title: '扣款失败！',
                  icon: 'none'
                })
              }
            })
          }
        })
      } catch (e) {
        uni.hideLoading()
      }
    },
    goBack(){
      uni.navigateBack()
    }
  }
}
</script>

<style scoped lang="scss">
  .paymentOrder {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      margin-top: 93rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #222325;
      line-height: 44rpx;
      text-align: center;
      width: 574rpx;
    }

    .price-wrap {
      display: flex;
      justify-content: center;
      margin-top: 28rpx;
      width: 574rpx;
      padding-bottom: 53rpx;
      border-bottom: 1rpx solid #eeeeee;

      .sign {
        font-size: 40rpx;
        font-weight: 500;
        color: #333333;
        line-height: 44rpx;
      }

      .price {
        font-size: 80rpx;
        font-weight: 500;
        color: #333333;
        line-height: 80rpx;
      }
    }

    .text-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 574rpx;
      padding: 58rpx 0;
      font-size: 32rpx;
      font-weight: 500;
      color: #999999;
      line-height: 44rpx;
      border-bottom: 1rpx solid #eeeeee;
    }

    .btn {
      width: 607rpx;
      height: 100rpx;
      margin-top: 95rpx;
      background: #1AAC1B;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      font-size: 38rpx;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 100rpx;
      text-align: center;
    }

    .cancel {
      margin-top: 50rpx;
      font-size: 38rpx;
      font-weight: 500;
      color: #606F86;
      line-height: 40rpx;
      text-align: center;
    }
  }
</style>
