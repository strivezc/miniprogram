<template>
  <view class="step2">
    <appointCondition @search="search"></appointCondition>
    <teacherList ref="teacherListRef"></teacherList>
  </view>
</template>

<script setup>
import appointCondition from '../components/appointCondition'
import teacherList from '../components/teacherList'

const teacherListRef=ref()

function search() {
  teacherListRef.value.initScrollData()
}

</script>
