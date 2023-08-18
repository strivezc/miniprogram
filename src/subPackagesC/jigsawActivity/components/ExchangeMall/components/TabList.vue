<template>
  <view class="tabList" :style="{ width: props.tabType === 0 ? '100%' : '50%' }">
    <view
      class="item"
      :class="activeIndex === index ? 'active' : ''"
      v-for="(item, index) in itemList"
      :key="index"
      @click="handleTabItem(index)"
      >{{ item.name }}</view
    >
    <view
      class="tab-line"
      :style="[`transform: translateX(${translateX}px) translateX(-50%);`]"
    ></view>
  </view>
</template>

<script setup>
  const emit = defineEmits(['handleTabItem']);
  const props = defineProps({
    tabType: {
      type: Number,
      default: 0,
    },
  });

  const itemList = computed(() => {
    if (props.tabType === 0) {
      return [
        { name: '皮肤道具' },
        { name: '课时套餐' },
        { name: '黄金会员' },
        { name: '拼图道具' },
      ];
    } else {
      return [{ name: '皮肤道具' }, { name: '兑换记录' }];
    }
  });
  watch(
    () => props.tabType,
    (newValue) => {
      console.log(`newValue is: ${newValue}`);
      translateX.value = itemWidth.value / 2;
      activeIndex.value = 0;
      // emit('handleTabItem', activeIndex.value);
    }
  );
  let activeIndex = ref(0);
  let itemWidth = ref(0);
  let translateX = ref(0);
  function handleTabItem(index) {
    translateX.value = itemWidth.value / 2 + index * itemWidth.value;
    activeIndex.value = index;
    console.log(index, 'index');
    emit('handleTabItem', index);
  }
  onMounted(() => {
    let element = uni.createSelectorQuery().in(getCurrentInstance()).select('.tabList');
    element
      .boundingClientRect(function (data) {
        itemWidth.value = (data.width / itemList.value.length).toFixed(2);
        translateX.value = itemWidth.value / 2;
      })
      .exec(function (res) {});
  });
</script>

<style scoped lang="scss">
  .tabList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10rpx;
    margin-bottom: 30rpx;
    position: relative;
    .item {
      position: relative;
      font-size: 28rpx;
      font-family: Resource Han Rounded CN;
      font-weight: 500;
      color: #ffcc9a;
      line-height: 36rpx;
      flex: 1;
      text-align: center;
    }
    .active {
      color: #d97626;
    }
    .tab-line {
      position: absolute;
      bottom: -11rpx;
      width: 42rpx;
      height: 4rpx;
      background: #d97626;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      transition-duration: 0.3s;
    }
  }
</style>
