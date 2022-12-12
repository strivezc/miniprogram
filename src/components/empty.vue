<!--
  功能：功能描述
  作者：Michael
  时间：2022年05月10日 16:17:35
  版本：v0.0.1
-->
<template>
  <view class="empty">
    <image class="empty-img" src="/static/images/zanwuicon.png"></image>
    <view class="empty-text">{{ text }}</view>
  </view>
</template>

<script setup lang="ts">
interface IProps {
  text: string
}

defineProps<IProps>()
</script>

<style lang="scss">
.empty {
  margin-top: 200rpx;
}
.empty-img {
  display: block;
  margin: 0 auto;
  width: 320rpx;
  height: 320rpx;
}
.empty-text {
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
</style>
