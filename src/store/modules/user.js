import { defineStore } from 'pinia';
import UserService from '@/api/UserService';
import CommonService from '@/api/CommonService'
import JigsawService from '@/api/JigsawService';
import { getToken,setAppletLoginStatus, setToken,setUserId, clearStorageSync,setRecommendCode,setMobileArea } from '@/utils/auth';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      userName: '',
      userType: '',
      userImg: '',
      phone: '',
      mobileArea: '',// 课程顾问电话
      courseAdviserQrCode: '',// 课程顾问微信二维码
      userId: '',
      recommendCode: '',
      jigsawCode: '', // 拼图道具邀请码
      userDistributorCode: '', // 当前可见代理商、分销商talk_id 或 当前可见业务员talk_id
      jigsawExistPath: '', // 页面是否存在记录

      // 是否领取体验课 和 是否上过课判断
      status: '3',
      getTrialClass: 0,
      attendClass: 2,
    };
  },
  persist: {
    enabled: true,
    detached: true, // 设置订阅与组件分离
  },
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    setRecommendCode(recommendCode) {
      this.recommendCode = recommendCode;
      setRecommendCode(recommendCode);
    },
    setMobileArea(mobileArea) {
      this.mobileArea = mobileArea;
      setMobileArea(mobileArea);
    },
    setJigsawCode(jigsawCode) {
      this.jigsawCode = jigsawCode;
    },
    setUserDistributorCode(userDistributorCode) {
      this.userDistributorCode = userDistributorCode;
    },
    setToken(token) {
      setToken(token);
      this.token = token;
    },
    setUserName(userName) {
      this.userName = userName;
    },
    setUserType(userType) {
      this.userType = userType;
    },
    setUserImg(userImg) {
      this.userImg = userImg;
    },
    setUserId(userId) {
      setUserId(userId)
      this.userId = userId;
    },
    setUserPhone(phone) {
      this.phone = phone;
    },
    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        UserService.logout(this.token)
          .then(() => {
            this.setToken('');
            clearStorageSync();
            this.$reset();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setAppletLoginStatus(loginCode){
      return new Promise((resolve, reject) => {
        UserService.beforeAppletLogin(loginCode)
          .then(({ resultData }) => {
            setAppletLoginStatus(resultData)
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getCourseAdviserQrCode(){
      return new Promise((resolve, reject) => {
        UserService.courseAdviserQrCode()
          .then(({ resultData }) => {
            this.courseAdviserQrCode=resultData.url
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getExperienceCourseDetail() {
      return new Promise(async (resolve, reject) => {
        try {
          const { resultData } = await CommonService.experienceCourseDetails()
          this.status = resultData.status
          this.getTrialClass = resultData.getTrialClass
          this.attendClass = resultData.attendClass
          resolve(resultData)
        } catch (e) {
          reject()
          console.log(e, 'error')
        }
      })

    },
    // remove token
    resetToken() {
      return new Promise((resolve) => {
        this.setToken('');
        this.setUserImg('');
        this.setUserName('');
        this.$reset();
        clearStorageSync();
        resolve();
      });
    },
    getJigsawCode(type) {
      return new Promise((resolve, reject) => {
        const typeObj = {
          time: 3,
          xrayed: 1,
          reset: 2,
        };
        JigsawService.inviteGetCode(typeObj[type])
          .then(({ resultData }) => {
            this.jigsawCode = resultData.jigsawCode;
            this.userDistributorCode = resultData.userDistributorCode;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
