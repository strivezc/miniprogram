export default function useCreateGame(divisionType, imgUrl, instance) {
  const state = reactive({
    divisionType,
    picList: [],
    uploadFlag: false,
    canvasIn: true,
    imgUrl,
    // imgW: 0,
    // imgH: 0,
    canvasWH: '',
  });
  let loops = 0;
  const maxLoops = 3; // 最大重新切图次数
  const startTime = new Date().getTime();

  const initCanvas = () => {
    uni.showLoading({
      title: '图片加载中',
    });
    state.canvasIn = true;
    const ctx = uni.createCanvasContext('canvasIn', instance);
    /* 获取图片信息 */
    console.log(state.imgUrl, 'state.imgUrl');
    uni.getImageInfo({
      src: state.imgUrl,
      success(imgInfo) {
        console.log({ imgInfo }, 'imgInfo');
        const imgW = 600;
        const imgH = 600;
        // state.imgW = imgW;
        // state.imgH = imgH;
        /* 获取图片的大小 */
        ctx.drawImage(imgInfo.path, 0, 0, imgW, imgH);
        ctx.draw();
        const query = uni.createSelectorQuery().in(instance);
        query.select('#canvasOut').boundingClientRect(function (resOut) {
          /* 清除上一次绘图 */
          console.log(resOut, 'resOut');
          const ctxOut = uni.createCanvasContext('canvasOut', instance);
          ctxOut.rect(10, 10, resOut.width, resOut.width);
          ctxOut.fillStyle = '#fff';
          ctxOut.fill();
          ctxOut.draw();
          /* 开始图片裁剪 */
          cutImgHandle(imgW, imgH);
        });
        query.exec();
      },
      fail(err) {
        console.log(loops, 'loops');
        if (loops < maxLoops) {
          console.log('重新切图');
          loops++;
          initCanvas();
        }
        if (loops === maxLoops) {
          uni.hideLoading();
          uni.showToast({
            title: '获取图片失败，请稍后重试',
            icon: 'none',
            duration: 3000,
          });
        }
        console.log(err, 'err-cut');
      },
      complete(complete) {
        console.log(complete, 'complete');
      },
    });
  };

  /* 点击裁剪动作 */
  const cutImgHandle = (imgW, imgH) => {
    let x = 0,
      y = 0,
      picList = [],
      timer;
    const cutW = imgW / state.divisionType;
    const cutH = imgH / state.divisionType;
    /* 循环裁剪 */
    cutLoop();

    function cutLoop() {
      timer = setTimeout(function () {
        const cfg = {
          x: x * cutW,
          y: y * cutH,
          width: cutW,
          height: cutH,
        };
        uni.canvasToTempFilePath(
          {
            canvasId: 'canvasIn',
            ...cfg,
            success(res) {
              picList.push(res.tempFilePath);
              if (y < state.divisionType) {
                cutLoop();
              }
            },
            fail(err) {
              console.log('切割失败', err);
              if (loops < maxLoops) {
                console.log('重新切图');
                loops++;
                initCanvas();
              }
              if (loops === maxLoops) {
                uni.hideLoading();
                uni.showToast({
                  title: '切图失败，请稍后重试',
                  icon: 'none',
                  duration: 3000,
                });
              }
            },
            complete() {
              x++;
              if (x === state.divisionType) {
                y++;
                x = 0;
                if (y === state.divisionType) {
                  state.uploadFlag = true;
                  state.canvasIn = false;
                  state.picList = picList;
                  clearTimeout(timer);
                  console.log(new Date().getTime() - startTime + 'ms', '切图耗时');
                  console.log('切图成功');
                  uni.hideLoading();
                  uni.$emit('showGameGuide');
                }
              }
            },
          },
          instance
        );
      });
    }
  };
  return {
    initCanvas,
    ...toRefs(state),
  };
}
