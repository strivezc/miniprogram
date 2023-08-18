<template>
  <view class="gameRank">
    <image src="@/subPackagesC/static/jigsaw/element/bg-2.png" class="background"></image>
    <image src="@/subPackagesC/static/jigsaw/element/bg-ranklist.png" class="rank-list-bg"></image>
    <view class="select-wrapper">
      <image src="@/subPackagesC/static/jigsaw/element/select-bg.png" class="select-bg"></image>
      <view class="select centerSPCZ rank-select">
        <uni-data-select
          v-model="state.barrierList"
          :localdata="state.selectData"
          @change="changeSelect"
          :clear="false"
        ></uni-data-select>
      </view>
    </view>
    <view class="content">
      <swiper
        class="swiper"
        indicator-color="#C08000"
        indicator-active-color="#55291B"
        :indicator-dots="true"
        :duration="500"
      >
        <swiper-item v-for="(item, index) in swipeList" :key="index" class="swiper-item">
          <view
            class="item"
            v-for="item2 in item"
            :key="item2.barrierId"
            @click.stop="handleItem(item2)"
          >
            <image
              src="@/subPackagesC/static/jigsaw/button/button-rankmask.png"
              class="icon"
              v-if="item2.shieldStatus === 1"
            ></image>
            <template v-else>
              <image
                src="@/subPackagesC/static/jigsaw/button/button-ranknub.png"
                class="icon"
                v-if="item2.barrierStatus === 0 || item2.barrierStatus === 1"
              ></image>
              <image
                src="@/subPackagesC/static/jigsaw/button/button-ranklock.png"
                class="icon"
                v-else
              ></image>
            </template>
            <image
              src="@/subPackagesC/static/jigsaw/element/bg-ticket.png"
              class="check-icon"
              v-if="item2.barrierStatus === 0 && item2.shieldStatus !== 1"
            ></image>
            <text
              class="text centerSPCZ"
              v-if="
                (item2.barrierStatus === 0 || item2.barrierStatus === 1) && item2.shieldStatus !== 1
              "
              >{{ item2.contentBarrierSort }}</text
            >
          </view>
        </swiper-item>
      </swiper>
    </view>
    <JigsawPopup
      ref="popup"
      :title="state.normalTitle"
      :content="state.normalContent"
      @submitAction="submitAction"
    ></JigsawPopup>
  </view>
</template>

<script setup>
  import { useContentStore } from '@/store';
  import JigsawService from '@/api/JigsawService';
  import { splitArr } from '@/utils';
  import JigsawPopup from './components/JigsawPopup/index.vue';

  const useStore = useContentStore();
  const popup = ref();
  const state = reactive({
    regionId: '',
    selectData: [],
    barrierList: [],
    normalTitle: '设置',
    normalContent: '退出拼图将退至小程序首页',
  });

  onLoad((option) => {
    state.regionId = option.regionId;
    getBarrier();
  });

  const swipeList = computed(() => {
    return splitArr(state.barrierList, 9);
  });
  const submitAction = () => {
    uni.switchTab({
      url: '/pages/home/index',
    });
  };
  const handleItem = (item) => {
    if (item.shieldStatus === 0 && item.barrierStatus !== 2) {
      useStore.getJigsawDataFromRank(item.barrierId).then((resultData) => {
        if (resultData === 94) {
          state.normalTitle = '提示';
          state.normalContent = '游戏维护中...';
          popup.value.open();
        } else {
          uni.redirectTo({
            url: '/subPackagesC/jigsawActivity/gamePage',
          });
        }
      });
    }
    console.log(item, 'item');
  };
  const changeSelect = (item) => {};
  async function getBarrier() {
    try {
      const { resultData } = await JigsawService.barrierShow(state.regionId);
      state.selectData = resultData.map((item, index) => {
        return {
          value: item.barrierList,
          contentIntro: item.contentIntro,
          text: item.contentName,
          isHere: item.isHere,
        };
      });
      const index = state.selectData.findIndex((item) => {
        return item.isHere === 0;
      });
      console.log(index, 'index');
      console.log(index ?? '', "(index ?? '')");
      if ((index ?? '') !== '') {
        state.barrierList = state.selectData[index].value;
      }
    } catch (e) {
      console.log(e, 'error');
    }
  }
</script>

<style scoped lang="scss">
  .gameRank {
    position: relative;

    .select-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      .select-bg {
        width: 750rpx;
        height: 123rpx;
      }
      .select {
        width: 400rpx;
        height: 61rpx;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        z-index: 9;
        top: 50rpx;
      }
    }
    .background {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .rank-list-bg {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      width: 657rpx;
      height: 919rpx;
    }
    .content {
      position: fixed;
      top: 53%;
      left: 50%;
      transform: translate(-50%, -50%);
      .swiper {
        width: 496rpx;
        height: 602rpx;
        .swiper-item {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-content: flex-start;
          .item {
            position: relative;
            width: 150rpx;
            height: 150rpx;
            margin-bottom: 37rpx;
            &:nth-child(3n + 2) {
              margin: 0 23rpx;
            }
            .icon {
              width: 150rpx;
              height: 150rpx;
            }
            .text {
              color: #ffffff;
              font-size: 50rpx;
              font-family: Resource Han Rounded CN;
            }
            .check-icon {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 64rpx;
              height: 64rpx;
            }
          }
        }
      }
    }
  }
</style>
