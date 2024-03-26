<template>
  <view class="condition-item">
    <view class="title">{{props.title}}</view>
    <view class="condition-wrap flex-s-c">
      <view class="item flex-c"
            :style="{width:props.width+'rpx'}"
            :class="{'item-selected':state.activeId===item[props.value] || state.activeId===(item[props.value]===0?null:item[props.value]),'item-selected':state.activeIdArr.includes(item[props.value])}"
            v-for="item in props.array"
            @click="handleItem(item[props.value],item[props.label])"
            :key="item[props.value]">{{item[props.label]}}</view>
      <view class="item-empty" :style="{width:props.width+'rpx'}"></view>
      <view class="item-empty" :style="{width:props.width+'rpx'}"></view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'radio', // radio、 multiple 单选和多选
  },
  title: {
    type: String,
  },
  label: {
    type: String,
    default:'name'
  },
  value: {
    type: String,
    default: 'id',
  },
  width: {
    type: Number,
    default: 150,
  },
  array: {
    type: Array,
    default:()=>{
      return []
    },
  },
})
const emit = defineEmits(['paramsToSearch']);

const state=reactive({
  activeId:null,
  activeIdArr:[],
})

function reset() {
  state.activeId=null
  state.activeIdArr=[]
}
function handleItem(id,name) {
  if (props.type==='multiple') {
    if (!state.activeIdArr.includes(id)) {
      state.activeIdArr.push(id)
    } else {
      let index = state.activeIdArr.indexOf(id);
      if (index !== -1) {
        state.activeIdArr.splice(index, 1);
      }
    }
  } else {
    state.activeId=id
  }
  const params=props.type==='multiple'?state.activeIdArr:state.activeId
  emit('paramsToSearch',params,name);
}

defineExpose({ reset });
</script>

<style scoped lang="scss">
  .condition-item{
    width: 100%;
    margin-top: 10rpx;
    height: 100%;
    .title{
      font-size: 32rpx;
      color: #000000;
      line-height: 45rpx;
    }
    .condition-wrap {
      flex-wrap: wrap;
      margin-top: 20rpx;

      .item {
        width: 150rpx;
        height: 58rpx;
        background: #FDFDFD;
        border-radius: 29rpx;
        border: 1PX solid #D5D5D5;
        font-size: 26rpx;
        color: #666666;
        margin-bottom: 30rpx;
      }

      .item-selected {
        color: #0087FF;
        background: rgba(0,132,255,0.05);
        border: 1PX solid #0084FF;
      }

      .item-empty {
        width: 150rpx;
        height: 0;
      }
    }
  }
</style>
