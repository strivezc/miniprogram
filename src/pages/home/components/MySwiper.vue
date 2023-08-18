<template>
  <view class="swiper-wrap" :style="{ paddingTop: titleHeight + 'px', marginTop: '104rpx' }">
    <swiper
        class="swiper"
        circular
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
    >
      <swiper-item v-for="item in bannerList" :key="item.id">
        <image
            mode="scaleToFill"
            :src="item.imgUrl"
            class="swiper-item"
            @click="clickBanner(item.linkUrl, item.id, item.title)"
        ></image>
      </swiper-item>
      <swiper-item v-if="bannerList.length === 0">
        <image
            mode="scaleToFill"
            src="https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/image/ea080d18210a4da09dc8a515afddf3fb.png"
            class="swiper-item"
        ></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'MySwiper',
  props:{
    bannerList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    titleHeight:{
      type:Number,
    }
  },
  data() {
    return {
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 500,
    }
  },
  onLoad(query) {
    console.log('getHeight')
  },
  methods: {
    clickBanner(imgUrl, id, title){
      this.$emit('clickBanner',imgUrl, id, title)
    },
  }
}
</script>

<style scoped lang="scss">
  .swiper-wrap {
    margin-bottom: 48rpx;
    width: 100%;
    height: 304rpx;

    .swiper-item {
      width: 100%;
      height: 304rpx;
      width: 686rpx;
      border-radius: 16rpx;
    }
  }
</style>
