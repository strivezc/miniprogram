<template>
  <view class="appointCondition">
    <!-- 星期选择-->
    <view class="week-wrap flex-s-c">
      <view class="text" :class="{'disabled':activeIndex===0}" @click="preDay">前一天</view>
      <picker
          :value="activeIndex"
          range-key="text"
          :range="state.dateList"
          @change="pickerChange">
        <view class="date">
          {{activeItem.text}}
        </view>
      </picker>
      <view class="text" :class="{'disabled':activeIndex===state.dateList.length-1}" @click="nextDay">后一天</view>
    </view>
    <!--下拉选择-->
    <view class="tab-wrap">
      <view class="item" @click="handleTab(0)">
        <text class="text" :class="{'active-tab':state.activeTab===0}">{{state.tab1}}</text>
        <image src="@/subPackagesD/images/up.png" class="icon up" v-if="state.activeTab===0"></image>
        <image src="@/subPackagesD/images/down.png" v-else class="icon"></image>
      </view>
      <view class="item" @click="handleTab(1)">
        <text class="text" :class="{'active-tab':state.activeTab===1}">{{state.tab2}}</text>
        <image src="@/subPackagesD/images/up.png" class="icon up" v-if="state.activeTab===1"></image>
        <image src="@/subPackagesD/images/down.png" v-else class="icon"></image>
      </view>
      <view class="item" @click="handleTab(2)">
        <text class="text" :class="{'active-tab':state.activeTab===2}">高级筛选</text>
        <image src="@/subPackagesD/images/up.png" class="icon up" v-if="state.activeTab===2"></image>
        <image src="@/subPackagesD/images/down.png" v-else class="icon"></image>
      </view>
    </view>
    <!--下拉框筛选项-->
    <view class="search-wrap" v-show="state.activeTab!==null">

      <view v-show="state.activeTab===0">
        <conditionItem :array="area" title="外教所在地" ref="areaRef"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'teacherArea')"></conditionItem>
        <conditionItem :array="showAllList" title="老师筛选" ref="showAllRef"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'showAll')"></conditionItem>
      </view>
      <view v-show="state.activeTab===1">
        <conditionItem :array="period" title="预约时段" ref="timePeriodsRef"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'timePeriods')"></conditionItem>
        <conditionItem :array="state.timeOptions" title="预约时间" type="multiple" ref="timeRef" label="label" value="value"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'time')"></conditionItem>
      </view>
      <view v-show="state.activeTab===2">
        <conditionItem :array="goodAtList" title="擅长课程" ref="goodAtRef" type="multiple"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'goodAt')"></conditionItem>
        <conditionItem :array="features" title="教学特点" type="multiple" ref="teacherSpecialRef"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'teacherSpecial')"></conditionItem>
        <conditionItem :array="level" title="适合级别" :width="210" type="multiple" ref="teachGradeRef"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'teachGrade')"></conditionItem>
        <conditionItem :array="sex" title="性别" ref="sexRef"
                       @paramsToSearch="(val,name)=>paramsToSearch(val,name,'sex')"></conditionItem>
      </view>
      <view class="bottom-wrap" v-show="state.activeTab!==null">
        <view class="btn1 flex-c" @click="reset">重置</view>
        <view class="btn2 flex-c" @click="search">确定</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { createTimeList } from '../timeTool'
import { useDatebookStore } from '@/store'
import conditionItem from './conditionItem'

const emit = defineEmits(['search']);
const datebookStore = useDatebookStore()
const area = [
  { id: null, name: '全部' },
  { id: 1, name: '菲律宾' },
  { id: 2, name: '欧美' },
  { id: 3, name: '中国' }
]
const sex= [
  { id: null, name: '不限' },
  { id: '1', name: '男' },
  { id: '0', name: '女' },
]
const showAllList = [
  { id: 0, name: '全部' },
  { id: 1, name: '空闲' },
  { id: 2, name: '收藏的老师' },
  { id: 3, name: '收藏(空闲)' }
]
const period = [
  { id: null, name: '不限' },
  { id: '06:00-09:00', name: '06:00-09:00' },
  { id: '09:00-12:00', name: '09:00-12:00' },
  { id: '12:00-14:00', name: '12:00-14:00' },
  { id: '14:00-18:00', name: '14:00-18:00' },
  { id: '18:00-22:30', name: '18:00-22:30' }
]
const goodAtList= [
  { id: '1', name: '雅思口语' },
  { id: '2', name: '托福口语' },
  { id: '3', name: '自然拼读' },
  // { id: '4', name: '幼儿及初学者' },
  // { id: '5', name: '加州系列' },
  // { id: '6', name: '商务英语' },
  { id: '7', name: '自由对话' },
  { id: '8', name: '生活口语' },
  { id: '9', name: '职场英语' },
]
const features= [
  { id: 'a', name: '善于拓展' },
  { id: 'b', name: '善于引导' },
  { id: 'c', name: '善于纠错' },
  { id: 'd', name: '认真负责' },
  { id: 'e', name: '条理分明' },
  { id: 'f', name: '知识渊博' },
  { id: 'g', name: '擅长语法' },
  { id: 'h', name: '热情' },
  { id: 'i', name: '严谨' },
  { id: 'j', name: '守时' },
]
const level= [
  { id: '0', name: '入门级别 T0-T1' },
  { id: '2', name: '预备级 T2-T4' },
  { id: '1', name: '基础级 T5-T6' },
  { id: '3', name: '进阶级 T7-T8' },
  { id: '4', name: '中高级 T9' },
]
const areaRef = ref()
const showAllRef = ref()
const timePeriodsRef = ref()
const timeRef = ref()
const goodAtRef = ref()
const teacherSpecialRef = ref()
const teachGradeRef = ref()
const sexRef = ref()
const state = reactive({
  dateList: datebookStore.freeClass.dateList,
  activeTab: null,
  tab1: '全部老师',
  tab2: '预约时间',
  timeOptions: []
})


function paramsToSearch(val, name, key) {
  if (key === 'teacherArea') { // 设置tab1的名称
    state.tab1 = name === '全部' ? '全部老师' : name
  }
  if (key === 'timePeriods') { // 设置tab2的名称
    state.tab2 = name === '不限' ? '预约时间' : name
  }
  if (key === 'timePeriods') {
    datebookStore.freeClass.params.time = null
    timeRef.value.reset()
    if (val) {
      let startTime = val.slice(0, 5)
      let endTime = val.slice(6)
      getOption(startTime, endTime)
    } else {
      getOption('06:00', '22:30')
    }
  }
  if (['goodAt','teacherSpecial','teachGrade'].includes(key)) { // 多选条件的值数组转字符串
    datebookStore.freeClass.params[key]=val.toString()
  } else{ // 其他直接用选中的值
    datebookStore.freeClass.params[key] = val
  }
}

function getOption(start, end) {
  const list = createTimeList(start, end, 30)
  state.timeOptions = list.map((item) => ({ label: item, value: item }))
}

function search() {
  state.activeTab = null
  emit('search')
}
function reset() {
  if (state.activeTab === 0) {
    datebookStore.freeClass.params.showAll = 0 // 筛选条件值重置
    datebookStore.freeClass.params.teacherArea = null // 筛选条件值重置
    areaRef.value.reset()
    showAllRef.value.reset()
  } else if (state.activeTab === 1) {
    timeRef.value.reset()
    timePeriodsRef.value.reset()
    getOption('06:00', '22:30') // 重置后时间筛选项要恢复默认
    datebookStore.freeClass.params.timePeriods = null // 筛选条件值重置
    datebookStore.freeClass.params.time = null // 筛选条件值重置
    state.tab2 = '预约时间' // 重置tab2名称
  } else if (state.activeTab === 2) {
    goodAtRef.value.reset()
    teacherSpecialRef.value.reset()
    teachGradeRef.value.reset()
    sexRef.value.reset()
    datebookStore.freeClass.params.goodAt = null // 筛选条件值重置
    datebookStore.freeClass.params.teacherSpecial = null // 筛选条件值重置
    datebookStore.freeClass.params.teachGrade = null // 筛选条件值重置
    datebookStore.freeClass.params.sex = null // 筛选条件值重置
  }
}

function handleTab(index) {
  if (state.activeTab === index) {
    state.activeTab = null
  } else {
    state.activeTab = index
  }
}

function pickerChange(e) {
  datebookStore.freeClass.params.date = state.dateList[e.detail.value].day
  emit('search')
}

function preDay() {
  if (activeIndex.value === 0) return
  const preIndex = activeIndex.value - 1
  datebookStore.freeClass.params.date = state.dateList[preIndex].day
  emit('search')
}

function nextDay() {
  if (activeIndex.value === state.dateList.length - 1) return
  const nextIndex = activeIndex.value + 1
  datebookStore.freeClass.params.date = state.dateList[nextIndex].day
  emit('search')
}

const activeIndex = computed(() => {
  return state.dateList.findIndex(item => {
    return item.day === datebookStore.freeClass.params.date
  })
})
const activeItem = computed(() => {
  return state.dateList[activeIndex.value]
})
onMounted(() => {
  getOption('06:00', '22:30')
})
</script>

<style scoped lang="scss">
  .appointCondition {
    margin: 0 30rpx;
    height: 100%;

    .week-wrap {
      box-sizing: border-box;
      width: 100%;
      height: 72rpx;
      background: #0087FF;
      border-radius: 36rpx;
      margin-top: 16rpx;
      padding: 16rpx 0;

      .text {
        font-weight: 400;
        font-size: 20rpx;
        color: #FFFFFF;
        line-height: 28rpx;
        padding: 20rpx 32rpx;
      }

      .disabled {
        color: #52AEFF;
      }

      .date {
        font-weight: 500;
        font-size: 28rpx;
        color: #FFFFFF;
        line-height: 40rpx;
      }
    }

    .tab-wrap {
      display: flex;
      align-items: center;
      padding: 26rpx 0;
      border-bottom: 1PX solid #EEEEEF;
      margin: 0 -30rpx;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;

        .text {
          font-size: 24rpx;
          color: #666666;
          line-height: 33rpx;
        }

        .icon {
          width: 12rpx;
          height: 8rpx;
          margin-left: 10rpx;
        }

        .up {
          transform: rotateX(180deg);
        }

        .active-tab {
          color: #0087FF;
        }
      }
    }

    .bottom-wrap {
      position: fixed;
      height: 120rpx;
      width: 691rpx;
      bottom: 0;
      background: #ffffff;
      padding-bottom: env(safe-area-inset-bottom);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 -30rpx;
      padding-left: 30rpx;
      padding-right: 30rpx;

      .btn1 {
        width: 240rpx;
        height: 80rpx;
        border-radius: 40rpx;
        border: 1PX solid #D0D0D0;
        font-size: 32rpx;
        color: #999999;
      }

      .btn2 {
        width: 421rpx;
        height: 80rpx;
        background: #0087FF;
        border-radius: 40rpx;
        font-size: 32rpx;
        color: #FFFFFF;
      }
    }

    .search-wrap {
      position: fixed;
      z-index: 1;
      top: 173rpx; /* 筛选条件距离顶部的高度，根据标题栏的高度调整 */
      left: 0;
      right: 0;
      bottom: 0; /* 筛选条件部分占据剩余的高度 */
      background-color: #fff;
      padding: 20rpx 30rpx 250rpx 30rpx;
      overflow-y: auto; /* 超出部分竖向滚动 */
    }
  }
</style>
