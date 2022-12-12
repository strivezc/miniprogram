<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
const commonStore = useCommonStore()
onLaunch(() => {
  commonStore.getSystemInfo()



})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})

// 获取系统信息
</script>
<style>
@import './wxcomponents/vant/common/index.wxss';
@import 'static/iconfont/iconfont.css';
/*
     * 引入iconfont字体图标
    */
@font-face {
  font-family: 'iconfont';
  src: url('/static/iconfont/iconfont.ttf') format('truetype');
}

.common-empty .common-empty-img {
  display: block;
  width: 500rpx;
  height: 500rpx;
  margin: 100rpx auto 20rpx;
}
.common-empty .common-empty-text {
  color: #666;
  text-align: center;
}
</style>

<style lang="scss">
@import './styles/common.scss';
</style>
