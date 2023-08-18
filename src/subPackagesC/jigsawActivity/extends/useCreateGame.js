import { useContentStore } from '@/store';

export default function useCreateGame(level, diffec, gameEndCallback, isInteractive = false) {
  const useStore = useContentStore();
  const state = reactive({
    arr: [],
    arrCopy: [],
    diffec: diffec,
    resultJson: '',
    clickIndex: null,
    animateClass: '',
    // 交互式
    activeFirst: false,
    first: {
      x: null,
      y: null,
    },
    // translate
    translateObj: {
      sort: '',
      x: '',
      y: '',
    },
  });
  let startX = level - 1;
  let startY = level - 1;
  state.arr = creatArr(level);
  state.resultJson = state.arr.toString();

  // 创建数组
  function creatArr(level) {
    let arr = [];
    let lin = [];
    const levels = level * level + 1;

    for (let i = 1; i < levels; i++) {
      lin.push(i);
      if (lin.length === level) {
        arr.push(lin);
        lin = [];
      }
    }
    if (!isInteractive) {
      arr[level - 1][level - 1] = 0;
    }
    return arr;
  }

  // 上移动
  function moveUp(x, y) {
    if (x <= 0) return -1;
    //   开始交换位置
    const okx = x - 1;
    move(x, y, okx, y);
    // if (state.needNote) state.operationRecord.push({ x: okx, y: y, clickIndex: state.clickIndex });
    return {
      x: okx,
      y,
    };
  }

  //下移动
  function moveDown(x, y) {
    if (x >= level - 1) return -1;
    const okx = x + 1;
    move(x, y, okx, y);
    // if (state.needNote) state.operationRecord.push({ x: okx, y: y, clickIndex: state.clickIndex });
    return {
      x: okx,
      y,
    };
  }

  // 左移动
  function moveLeft(x, y) {
    if (y <= 0) return -1;
    const oky = y - 1;
    move(x, y, x, oky);
    // if (state.needNote) state.operationRecord.push({ x, y: oky, clickIndex: state.clickIndex });
    return {
      x,
      y: oky,
    };
  }

  // 右移动
  function moveRight(x, y) {
    if (y >= level - 1) return -1;
    const oky = y + 1;
    move(x, y, x, oky);
    // if (state.needNote) state.operationRecord.push({ x, y: oky, clickIndex: state.clickIndex });
    return {
      x,
      y: oky,
    };
  }

  // 移动函数
  function move(x, y, moveX, moveY, handleMove = false) {
    const num = state.arr[x][y];
    state.arr[x][y] = state.arr[moveX][moveY];
    state.arr[moveX][moveY] = num;

    if (isInteractive) {
      state.activeFirst = false;
      state.first.x = null;
      state.first.y = null;
      if (handleMove) {
        gameEnd();
      }
    }
  }

  //寻找空白块的位置
  function seekEmpty() {
    // 默认空白位置是0,交互式默认是level * level
    const index = isInteractive ? level * level : 0;
    const arr = state.arr;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (Number(arr[i][j]) === index) {
          return {
            emptyX: i,
            emptyY: j,
          };
        }
      }
    }
  }

  //   检查是否完成
  function gameEnd() {
    if (state.arr.toString() === state.resultJson) {
      state.clickIndex = null;
      state.animateClass = '';
      //重置x,y起始点
      startX = level - 1;
      startY = level - 1;
      setTimeout(() => {
        gameEndCallback(true);
      }, 100);
    }
  }

  function addClass(direction) {
    state.animateClass = '';
    // this.$nextTick(() => {
    state.animateClass = `animate__slideIn${direction}`;
    // })
  }

  function setTranslateObj(index, x, y) {
    state.translateObj = {
      sort: index,
      x: x,
      y: y,
    };
  }

  function shouldMove(x, y, clickIndex) {
    const time = new Date().getTime();
    // state.arr
    useStore.jigsawData.jigsawSort = JSON.stringify(state.arr); // 保存顺序
    if (isInteractive) {
      if (state.activeFirst && state.first.x === x && state.first.y === y) {
        // 点击的是同一个方块
        state.activeFirst = false;
        state.first.x = null;
        state.first.y = null;
        return;
      }
      if (state.activeFirst) {
        // 点击第二个方块替换
        move(state.first.x, state.first.y, x, y, true);
      } else {
        // 点击第一个方块
        state.activeFirst = true;
        state.first.x = x;
        state.first.y = y;
      }
    } else {
      //   判断向哪移动
      const { emptyX, emptyY } = seekEmpty();
      if (x === emptyX && y !== emptyY && Math.abs(y - emptyY) === 1) {
        state.clickIndex = clickIndex;
        // 说明在一个水平线上 可能是左右移动
        if (y > emptyY) {
          setTranslateObj(state.arr[x][y], -100, 0);
          // addClass('Right');
          moveLeft(x, y);
        } else {
          setTranslateObj(state.arr[x][y], +100, 0);
          // addClass('Left');
          moveRight(x, y);
        }
      }
      if (y === emptyY && x !== emptyX && Math.abs(x - emptyX) === 1) {
        state.clickIndex = clickIndex;
        // 说明需要上下移动
        if (x > emptyX) {
          setTranslateObj(state.arr[x][y], 0, -100);
          // addClass('Up');
          moveUp(x, y);
        } else {
          setTranslateObj(state.arr[x][y], 0, 100);
          // addClass('Down');
          moveDown(x, y);
        }
      }
      gameEnd();
    }
    // console.log(new Date().getTime() - time, '点击耗时');
  }

  // 撤回
  // function withdraw() {
  //   if (!state.operationRecord.length) return;
  //   const recordItem = state.operationRecord.pop();
  //   console.log(recordItem, 'recordItem');
  //   const { x, y, clickIndex } = recordItem;
  //   shouldMove(x, y, clickIndex, false);
  // }

  // 获取当前空格可移动方法
  function getFns() {
    // 根据空格位置，判断当前空格可移动的范围
    const { emptyX, emptyY } = seekEmpty();
    const length = level - 1; // 九宫格长度-1
    let arr1 = [],
      arr2 = [],
      arr3 = [moveUp, moveDown, moveLeft, moveRight],
      fns = [];
    if (emptyX === 0) {
      arr1 = [moveDown, moveLeft, moveRight];
    } else if (emptyY === 0) {
      arr1 = [moveUp, moveDown, moveRight];
    } else if (emptyX === length) {
      arr1 = [moveUp, moveLeft, moveRight];
    } else if (emptyY === length) {
      arr1 = [moveUp, moveDown, moveLeft];
    }
    if (emptyX === 0 && emptyY === 0) {
      arr2 = [moveDown, moveRight];
    } else if (emptyX === 0 && emptyY === length) {
      arr2 = [moveDown, moveLeft];
    } else if (emptyX === length && 0) {
      arr2 = [moveUp, moveRight];
    } else if (emptyX === length && emptyY === length) {
      arr2 = [moveUp, moveLeft];
    }
    // 取交集
    if (!arr1.length && !arr2.length) {
      fns = arr3;
    } else if (arr2.length > 0) {
      // 取交集
      fns = arr1.filter((item) => new Set(arr2).has(item));
    } else {
      fns = arr1;
    }
    return fns;
  }

  //判断是否使用缓存的数据，如果更改了level和游戏mode则重新随机游戏
  function checkNeedRestart() {
    let flag = false;
    let arr = [];
    if (useStore.jigsawData.jigsawSort) {
      arr = JSON.parse(useStore.jigsawData.jigsawSort);
      if (arr[0].length !== level) {
        flag = true;
      }
      if (useStore.jigsawData.jigsawSort.indexOf('0') > -1 && useStore.jigsawData.playType === 0) {
        flag = true;
      }
      if (
        useStore.jigsawData.jigsawSort.indexOf('0') === -1 &&
        useStore.jigsawData.playType === 1
      ) {
        flag = true;
      }
    }

    return flag;
  }
  // 随机打乱
  function moveInit(diffic) {
    return new Promise((resolve, reject) => {
      if (!checkNeedRestart()) {
        if (useStore.jigsawData.jigsawSort) {
          state.arr = JSON.parse(useStore.jigsawData.jigsawSort);
          state.arrCopy = state.arr;
          resolve();
          return;
        }
      }
      let startTime = new Date().getTime();
      // state初始化
      state.animateClass = '';
      startX = level - 1;
      startY = level - 1;
      state.arr = creatArr(level);
      state.resultJson = state.arr.toString();
      // state.operationRecord = [];
      // state.needNote = false;
      const num = diffic ? diffic : state.diffec;
      let Index = null;
      let fn;
      for (let i = 0; i < num; i++) {
        const fns = getFns();
        Index = Math.floor(Math.random() * fns.length);
        //   moveConsole(Index);
        fn = fns[Index](startX, startY);
        if (fn != -1) {
          const { x, y } = fn;
          startX = x;
          startY = y;
        }
      }
      // 如果随机结果和初始排序一样，则重新打乱
      if (state.arr.toString() === state.resultJson) {
        console.log('重新打乱');
        moveInit(state.diffec);
      }
      useStore.jigsawData.jigsawSort = JSON.stringify(state.arr); // 保存顺序
      state.arrCopy = state.arr;
      resolve();
      console.log(new Date().getTime() - startTime, '打乱耗时');
    });
  }

  return {
    shouldMove,
    seekEmpty,
    moveInit,
    ...toRefs(state),
  };
}
