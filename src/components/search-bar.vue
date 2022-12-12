<!--
  功能：功能描述
  作者：Michael
  时间：2022年08月22日 09:45:30
  版本：v0.0.1
-->
<template>
  <view class="wrap flex items-center">
    <view
      class="flex items-center flex-1 bg-white h-[64rpx] pl-[18rpx] rounded-[16rpx]"
    >
      <image src="/static/images/img_search.png" class="search-icon"></image>
      <input
        v-model="content"
        class="input"
        :placeholder="placeholder"
        placeholder-class="placeholder"
        @input="inputChange"
      />
      <view
        class="flex items-center justify-center w-[60rpx] pr-[18rpx]"
        @click="clearValue"
      >
        <image
          v-if="content"
          src="/static/images/see-close.png"
          class="clear-icon"
        ></image>
      </view>
    </view>
    <text class="btn" @click="cancel">{{ cancelText }}</text>
  </view>
</template>

<script setup lang="ts">
interface IProps {
  cancelText: string
  placeholder: string
  value: string
}

const props = defineProps<IProps>()

const content = ref(props.value)

const emits = defineEmits(['cancel', 'input', 'update:value', 'clear'])

function clearValue() {
  content.value = ''
  emits('update:value', '')
  emits('clear')
}

function inputChange() {
  emits('update:value', content.value)
  emits('input', content.value)
}

function cancel() {
  emits('cancel')
}
</script>

<style lang="scss" scoped>
.wrap .input {
  flex: 1;
}

.wrap .placeholder {
  color: #ccc;
}

.wrap .btn {
  color: #596b92;
  font-size: 32rpx;
  margin-left: 16rpx;
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

.clear-icon {
  width: 40rpx;
  height: 40rpx;
}
</style>
