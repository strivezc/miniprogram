<!--
  功能：功能描述
  作者：Michael
  时间：2022年08月19日 13:41:44
  版本：v0.0.1
-->
<template>
  <web-view :src="src" />
</template>

<script setup lang="ts">
import { getRouteParams } from '@/router'

const src = ref(getRouteParams('webview').src)
</script>

<style lang="scss"></style>
