<template>
  <view class="step2">
    <vipAppointCondition @search="search"></vipAppointCondition>
    <vipTeacherList ref="teacherListRef"></vipTeacherList>
  </view>
</template>

<script setup>
import vipAppointCondition from '../components/vipAppointCondition'
import vipTeacherList from '../components/vipTeacherList'

const teacherListRef=ref()

function search() {
  teacherListRef.value.initScrollData()
}

</script>
