<!--
  创建人：Michael
  创建时间：2022/2/7
  页面描述：弹窗分享
-->
<template>
  <sk-popup
    :show="props.show"
    :mask-close="false"
    :popup-close="popupClose"
    direction="bottom"
  >
    <!--生成分享图组件-->
    <painter
      style="position: fixed; top: -9999px"
      :palette="json"
      @imgErr="imgErr"
      @imgOK="imgOk"
    />
  </sk-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SkPopup from "./sk-popup.vue";

const props = defineProps<{
  show: Boolean; // 是否弹窗
  json: Object;
}>();

console.log(props.json);

function popupClose() {
  //
}

function imgErr() {
  console.log("渲染错误");
}

function imgOk(e) {
  console.log("okfdfsfdfd");
  console.log(e.detail.path);
}
</script>

<style lang="scss"></style>
