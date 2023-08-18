<template>
  <view class="gameArea">
    <image src="@/subPackagesC/static/jigsaw/element/bg-area.png" class="bg-area"></image>
    <AreaItem
      v-for="(item, index) in state.areaInfoArr"
      :key="item.regionId"
      :position="state.position[index]"
      :regionId="item.regionId"
      :regionStatus="item.regionStatus"
      :regionName="item.regionName"
      @clickItem="clickItem(item)"
    ></AreaItem>
    <JigsawPopup ref="loginPopup" title="小游戏说明" :isConfirm="false">
      <template #main>
        <LoginPopup @loginRefreshData="loginRefreshData" redirectUrl="/subPackagesC/jigsawActivity/gameArea"></LoginPopup>
      </template>
    </JigsawPopup>
  </view>
</template>

<script setup>
  import JigsawPopup from './components/JigsawPopup/index.vue';
  import LoginPopup from './components/LoginPopup/index.vue';
  import JigsawService from '@/api/JigsawService';
  import AreaItem from './components/AreaItem/index.vue';
  import { useUserStore } from '@/store';

  const userStore=useUserStore();
  const loginPopup = ref();
  const state = reactive({
    areaInfoArr: [],
    position: {
      0: 'position: absolute;bottom: 170rpx;left: 292rpx',
      1: 'position: absolute;bottom: 545rpx;left: 116rpx',
      2: 'position: absolute;bottom: 685rpx;left: 386rpx',
      3: 'position: absolute;bottom: 958rpx;left: 73rpx',
      4: 'position: absolute;bottom: 1354rpx;left: 391rpx',
    },
  });
  const getRegion = async () => {
    try {
      const {resultData} = await JigsawService.regionShow();
      state.areaInfoArr = resultData;
    } catch (e) {
      if (e.resultCode === -1) {
        userStore.resetToken().then(()=>{
          getTouristRegion();
        })
      }
    }
  }
  const getTouristRegion = async () => {
    try {
      const { resultData } = await JigsawService.regionShowTourist();
      state.areaInfoArr = resultData;
    } catch (e) {
      console.log(e, 'error');
    }
  };
  function loginRefreshData() {
    getRegion();
    uni.$emit('refreshSwitch');
    console.log('$emit');
    loginPopup.value.close();
  }
  onMounted(() => {
    uni
      .createSelectorQuery()
      .select('.gameArea')
      .boundingClientRect((res) => {
        console.log(res, '---res');
        let newbottom = res.bottom + res.height;
        uni.pageScrollTo({
          duration: 100, // 过渡时间
          scrollTop: newbottom, // 滚动的实际距离
        });
      })
      .exec();
  });

  if (userStore.token) {
    getRegion();
  } else {
   getTouristRegion();
  }

  const clickItem = (item) => {
    console.log(2312);
    if (!userStore.token) {
      console.log(123);
      loginPopup.value.open();
    } else {
      console.log(item, 'item');
      uni.navigateTo({
        url: `/subPackagesC/jigsawActivity/gameRank?regionId=${item.regionId}`,
      });
    }
  };
</script>

<style scoped lang="scss">
  .gameArea {
    position: relative;
    width: 750rpx;
    height: 1728rpx;
    .bg-area {
      width: 750rpx;
      height: 1728rpx;
      vertical-align: middle;
    }
  }
</style>
