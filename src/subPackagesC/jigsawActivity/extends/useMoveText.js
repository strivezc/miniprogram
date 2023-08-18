/**
 *@className 类名
 *@boxWidth 滚动盒子宽度
 *@that this
 *@date 2023/03/14
 */
export default function useMoveText(className, boxWidth, that) {
  const speed = 30; // 每秒滚动长度
  const visibility = ref('hidden');
  const duration = ref(10);

  setTimeout(() => {
    visibility.value = 'inherit';
  }, 800);
  onMounted(() => {
    let element = uni.createSelectorQuery().in(that).select(className);
    element
      .boundingClientRect(function (data) {
        const width = data.width > boxWidth ? data.width : boxWidth;
        duration.value = Math.round(width / speed);
      })
      .exec(function (res) {});
  });

  return {
    duration,
    visibility,
  };
}
