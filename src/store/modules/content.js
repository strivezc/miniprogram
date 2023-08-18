import { defineStore } from 'pinia';
import JigsawService from '@/api/JigsawService';
import LotteryService from '@/api/LotteryService';
import thanksForComing from '@/subPackagesB/static/lottery/thanksForComing.png'

export const useContentStore = defineStore('content', {
  state: () => {
    return {
      jigsawData: {
        barrierId: 0, // 拼图关卡id
        barrierImg: '', // 关卡图片
        barrierInform: '', // 关卡公告
        barrierSurplusTime: 0, // 关卡剩余时间
        barrierUseTime: 0, // 关卡使用时间
        contentBarrierSort: 0, //内容关卡顺序
        defaultSeconds: 0, // 关卡默认秒数
        gameType: 0, // 游戏状态 1.游戏暂停 2.时间耗尽
        imgType: 0, // 图片类型   0-2*2，1-3*3，2-4*4，3-5*5，4-6*6
        jigsawSort: '', // 拼图记录顺序
        playType: 0, // 玩法   0-随意互换图片玩法，1-移动图片玩法
        resetProp: 0, // 重置道具数
        seeProp: 0, //透视道具数
        timeGetSeconds: 0, // 时间道具可获得秒数
        timeProp: 0, //时间道具数
        useSeeProp: 0, // 是否使用透视道具 0使用 1未使用
        englishSound: '', // 英文发音
        chineseSound: '', // 中文发音
      },
      barrierUseTime: '', // 后端返回的使用时间 用来判断是否暂停
      barrierSurplusTime: '', // 后端返回的剩余时间 用来判断是否已倒计时完
      jigsawCode: '', // 道具获取邀请码
      userDistributorCode: '', // 当前可见代理商、分销商talk_id 或 当前可见业务员talk_id
      propsInfo: {
        // 邀请不同道具类型获得道具数
        getSeeProp: '',
        getResetProp: '',
        getTimeProp: '',
      },
      completeInfo: {
        prizeTypes: [], // 盲盒中奖品名称集合
        haveNext: '', // 是否有下一关 0.有 1.没有
        nextBarrierId: '', // 下一关关卡id
        passPrize: '', // 本次通关是否有奖励 0.有 1.没有
        regionLastOne: '', // 是否是本地域最后一关 0、是 1、不是
        prizeType: '',
        prizeImg: '',
        prizeName: '',
        passPrizeType: '',
      },
      isComplete: false,

      // 抽奖数据
      detailData:{},
      prizeInfoList:[],
      prizeSortList:[],
      prizeRecordList:[],
      showShare:false,
      code:'vumUfeUv'
    };
  },
  // persist: {
  //   enabled: true,
  //   detached: true, // 设置订阅与组件分离
  // },
  actions: {
    getJigsawDataFromHome() {
      return new Promise((resolve, reject) => {
        JigsawService.startOrContinue()
          .then(({ resultData }) => {
            if (resultData === 94) {
              this.jigsawData = {};
              resolve(resultData);
            } else {
              this.jigsawData = resultData;
              this.barrierUseTime = resultData.barrierUseTime;
              this.barrierSurplusTime = resultData.barrierSurplusTime;
              resolve(resultData);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getJigsawDataFromRank(barrierId) {
      return new Promise((resolve, reject) => {
        JigsawService.barrierShowInto(barrierId)
          .then(({ resultData }) => {
            if (resultData === 94) {
              this.jigsawData = {};
              resolve(resultData);
            } else {
              this.jigsawData = resultData;
              this.barrierUseTime = resultData.barrierUseTime;
              this.barrierSurplusTime = resultData.barrierSurplusTime;
              resolve(resultData);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    nextBarrierInto() {
      return new Promise((resolve, reject) => {
        JigsawService.nextBarrierInto(this.completeInfo.nextBarrierId)
          .then(({ resultData }) => {
            if (resultData === 94) {
              this.jigsawData = {};
              resolve(resultData);
            } else {
              this.jigsawData = resultData;
              this.barrierUseTime = resultData.barrierUseTime;
              this.barrierSurplusTime = resultData.barrierSurplusTime;
              resolve(resultData);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // gameType 游戏状态 1.游戏暂停 2.时间耗尽
    pauseOrTimeOut(gameType) {
      return new Promise((resolve, reject) => {
        const params = {
          barrierId: this.jigsawData.barrierId,
          barrierUseTime: this.jigsawData.barrierUseTime ? this.jigsawData.barrierUseTime : 0,
          barrierSurplusTime: this.jigsawData.barrierSurplusTime,
          jigsawSort: this.jigsawData.jigsawSort,
          useSeeProp: this.jigsawData.useSeeProp,
          gameType,
        };
        JigsawService.pauseOrTimeOut(params)
          .then(({ resultData }) => {
            resolve(resultData);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    useGameProps(propType) {
      return new Promise((resolve, reject) => {
        const typeObj = {
          time: 3,
          xrayed: 1,
          reset: 2,
        };
        const params = {
          usePropType: typeObj[propType],
          barrierId: this.jigsawData.barrierId,
        };
        JigsawService.barrierUseProp(params)
          .then(({ resultData }) => {
            if (resultData && resultData === 94) {
              resolve(resultData);
              return;
            }
            if (propType === 'reset') {
              // 游戏重置
              this.jigsawData.resetProp--;
              this.jigsawData = resultData;
            } else if (propType === 'xrayed') {
              this.jigsawData.seeProp--;
              this.jigsawData.useSeeProp = 0;
            } else if (propType === 'time') {
              this.jigsawData.timeProp--;
              this.jigsawData.barrierSurplusTime =
                this.jigsawData.barrierSurplusTime + this.jigsawData.timeGetSeconds;
            }
            resolve(resultData);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    gameComplete() {
      return new Promise((resolve, reject) => {
        const params = {
          barrierId: this.jigsawData.barrierId,
          passTime: this.jigsawData.barrierUseTime,
        };
        uni.showLoading({
          title: '加载中...',
        });
        JigsawService.gameComplete(params)
          .then(({ resultData }) => {
            this.completeInfo.haveNext = resultData.haveNext;
            this.completeInfo.nextBarrierId = resultData.nextBarrierId;
            this.completeInfo.passPrize = resultData.passPrize;
            this.completeInfo.prizeTypes = resultData.prizeTypes;
            this.completeInfo.regionLastOne = resultData.regionLastOne;
            this.completeInfo.prizeType = resultData.prizeType;
            this.completeInfo.prizeImg = resultData.prizeImg;
            this.completeInfo.prizeName = resultData.prizeName;
            this.completeInfo.regionLastOne = resultData.passPrizeType;
            this.isComplete = true;
            uni.hideLoading();
            resolve(resultData);
          })
          .catch((error) => {
            uni.hideLoading();
            reject(error);
          });
      });
    },
    getPropsInfo() {
      return new Promise((resolve, reject) => {
        JigsawService.getPropsInfo()
          .then(({ resultData }) => {
            this.propsInfo.getSeeProp = resultData.getSeeProp;
            this.propsInfo.getResetProp = resultData.getResetProp;
            this.propsInfo.getTimeProp = resultData.getTimeProp;
            resolve(resultData);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getJigsawCode(propType) {
      return new Promise((resolve, reject) => {
        const typeObj = {
          time: 3,
          xrayed: 1,
          reset: 2,
        };
        JigsawService.inviteGetCode(typeObj[propType])
          .then(({ resultData }) => {
            this.jigsawCode = resultData.jigsawCode;
            resolve(resultData);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getPrizeInfoByNoLogin() {
      return new Promise(async (resolve, reject) => {
      try {
        const {resultData} = await LotteryService.queryNowRaffleInfo(this.code);
        this.detailData = resultData || {};
        this.prizeInfoList = resultData.prizeInfoList;
        this.prizeSortList = resultData.prizeSortList;
        // this.prizeRecordList = resultData.prizeRecordList;
        //转盘数据插入图片和活动名称
        this.prizeSortList.forEach(i => {
          const item = this.prizeInfoList.find(j => {
            return j.prizeGrade === i.prizeNo
          })
          if (item) {
            i.prizeImg = item.prizeImg;
            i.prizeName = item.prizeName;
          } else {
            i.prizeImg = thanksForComing;
            i.prizeName = '谢谢参与';
          }
        })
        // this.formatWheelPrizes(); // 数据组装
        // 启动转盘
        // setTimeout(() => {
        //   this.$nextTick(() => {
        //     this.showPage = true
        //   })
        //   this.$refs.myLucky.play();
        //   this.isStart = true;
        // },500)
        resolve()
      } catch (e) {
        if (e.resultMessage.indexOf('下架')>-1 || e.resultMessage.indexOf('结束')>-1) {
          this.showShare=false;
        }
        reject()
      }
      })
    },
    getPrizeInfoByLogin() {
      return new Promise(async (resolve, reject) => {
        try {
          const { resultData } = await LotteryService.getPrizeActivityInfo(this.code);
          this.detailData = resultData || {};
          this.prizeInfoList = resultData.prizeInfoList;
          this.prizeSortList = resultData.prizeSortList;
          this.prizeRecordList = resultData.prizeRecordList;
          //转盘数据插入图片和活动名称
          this.prizeSortList.forEach(i => {
            const item = this.prizeInfoList.find(j => {
              return j.prizeGrade === i.prizeNo
            })
            if (item) {
              i.prizeImg = item.prizeImg;
              i.prizeName = item.prizeName;
            } else {
              i.prizeImg = thanksForComing;
              i.prizeName = '谢谢参与';
            }
          })
          // this.formatWheelPrizes(); // 数据组装
          // 启动转盘
          // setTimeout(() => {
          //   this.$nextTick(() => {
          //     this.showPage = true
          //   })
          //   this.$refs.myLucky.play();
          //   this.isStart = true;
          // },500)
          resolve()
        } catch (e) {
          if (e.resultMessage.indexOf('下架') > -1 || e.resultMessage.indexOf('结束') > -1) {
            this.showShare = false;
          }
          reject()
        }
      })
    },
  },
});
