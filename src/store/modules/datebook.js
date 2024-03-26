import { defineStore } from 'pinia';
import DatebookService from '@/api/DatebookService';

export const useDatebookStore = defineStore('datebook', {
  state: () => {
    return {
      evaluation:{ // 口语测评数据
        packageName: '',
        balance: '',
        defaultPackageId: 0,
        theLastAssessClass: null,
        defaultTool: '',
        tip: '', // 课时
        message: '',
        times: '',
        list: [],
        packageMergeList: [],
        form: {
          commend: '',
          packageId: '',
          movieNameId: 0,
          evaluationTypes: '',
          teacherType: '',
          tool: '',
          userProblem: '',
          useCount: '',
          packageType: ''
        },
        //
        evaluationMap: [],
        activeDay: 0
      },
      freeClass: { // 自由预约数据
        params: {
          date: null, //选中的日期
          datebookType: 2, // 1为学生，2为成人
          currPage: 1,
          pageSize: 10,
          packageType: null,
          packageId: null,
          userId: null,
          languageType: 0,
          teacherId: null,
          //以下子组件传递的参数
          name: null, //老师名字
          timePeriods: null,
          teacherArea: null,
          sex: null,
          time: null,
          teachGrade: null,
          teacherSpecial: null,
          goodAt: null,
          showAll: 0
        },
        // teachTime: [],
        selectItem: {},
        activeIndex: 0, //选中日期的索引
        mealPackage: [], //套餐包
        unUsedPackageList: [], //未激活套餐列表
        mealRadio: 0, //套餐包选择按钮
        dateList: [],
        timeArr: [],
        // totalCount: null,
        isFirstClass: null,
        showAllArea: 1, //0只显示中国，1显示所有
        showTeacherArea: 1,
      },
      vipClass:{
        params: {
          date: null, //选中的日期
          datebookType: 2, // 1为学生，2为成人
          currPage: 1,
          pageSize: 10,
          packageType: null,
          packageId: null,
          userId: null,
          teacherId: null,
          //以下子组件传递的参数
          name: null, //老师名字
          timePeriods: null,
          teacherArea: null,
          sex: null,
          time: null,
          teachGrade: null,
          weekList: [],
          teacherSpecial: null,
          goodAt: null,
          showAll: 0,
        },
        mealPackage: [],
        showBlock: false, //是否有套餐
        chooseDateTimeList: [],
        canAppointed: 0, //0能 1不能
        showAllArea: 1, //0只显示中国，1显示所有
        showTeacherArea: 1,
        nextStepInfo:{}, // 下一步自动续课周数页面数据
        lastStepInfo:{}, // 自动填充页面数据
      },
      // 选择教材反显用
      lessonId:null, // 自动填充用的课文id
      index:null, // 自动填充用的index
      bookGroupId:null,
      bookId:null,
      bookName:null,
      lessonName:null,
      isFilledIn:false, // onShow()判断弹窗后是否已处理填充
      isVipClass:false, // 判断当前是VIP填充还是自由预约填充
      // 自动填充的教材信息
      bookList:[], // 教材分组数据
      lessonGroupObj:{}, //将接口返回的分册存起来，减少接口调用次数
      textGroupObj:{}, //将接口返回的课文存起来，减少接口调用次数
      studentComment:[],// 学生评论
      teacherBaseRespDTO:{},// 老师详情
      teacherFeedback:{},// 老师评分
    };
  },
  // persist: {
  //   enabled: true,
  //   detached: true, // 设置订阅与组件分离
  // },
  actions: {
    getVipClassData(){
      return new Promise(async (resolve) => {
        try {
          const {resultData} =await  DatebookService.vipUserPackageInfo()
          this.vipClass.canAppointed = resultData.vipStatus
          if (this.vipClass.canAppointed ===1) {
            uni.showModal({
              title: '提示',
              content: `[08:00-23:50]时间段才开放预约，其他时间段不能进行VIP约课！`,
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //
                }
              }
            })
          }
          this.vipClass.mealPackage = resultData.packageMergeList || []
          this.vipClass.params.packageId = resultData.packageId
          this.vipClass.params.packageType = resultData.packageType
          this.vipClass.params.userId = resultData.userId
          this.vipClass.params.datebookType = resultData.datebookType
          this.vipClass.showTeacherArea = resultData.showTeacherArea
          if (this.vipClass.showTeacherArea === 0 && this.vipClass.params.datebookType === 1) {
            //只显示中国并且是学生约课的情况下
            this.vipClass.showAllArea = 0
            this.vipClass.params.teacherArea = 3
          } else if (this.vipClass.showTeacherArea === 0 && this.vipClass.params.datebookType === 2) {
            this.vipClass.showAllArea = 1
            this.vipClass.params.teacherArea = null
          } else {
            this.vipClass.showAllArea = 1
          }
          this.vipClass.showBlock = true
          resolve(resultData)
        } catch (e) {
          this.vipClass.showBlock = false
          if (e.resultCode === 3) {
            uni.showModal({
              title: '提示',
              content: e.resultMessage,
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //
                }
              }
            })
          }
        }
      })
    },
    getFreeClassData() {
      return new Promise((resolve) => {
        DatebookService.getFreeAppointPackageInfo(-1)
          .then(({ resultData }) => {
            this.freeClass.mealPackage = resultData.packageMergeList.concat(resultData.packageList) || []
            this.freeClass.mealRadio = resultData.packageId
            this.freeClass.unUsedPackageList = resultData.unUsedPackageList || []
            this.freeClass.params.packageId = this.freeClass.selectItem.packageId = resultData.packageId
            this.freeClass.params.datebookType = resultData.datebookType
            this.freeClass.params.languageType = resultData.languageType
            this.freeClass.params.packageType = resultData.packageType
            if (resultData.isFirstClass === 1) {
              // this.$alert('欢迎使用体验卡<br/>请查看左侧栏学习顾问联系方式，为您约课。', '提示', {
              //   confirmButtonText: '我知道了',
              //   customClass: 'notice-message',
              //   dangerouslyUseHTMLString: true,
              // });
              this.freeClass.isFirstClass = true;
            } else {
              this.freeClass.isFirstClass = false;
              this.freeClass.showTeacherArea = resultData.showTeacherArea;
              this.freeClass.dateList = resultData.dateList || [];
              this.freeClass.dateList.forEach(item=>{
                const week=item.week.replace('周','星期')
                const dayFormat=item.dayFormat.split('-')
                const date=`${dayFormat[0]}月${dayFormat[1]}日`
                item.text=`${date} ${week}`
              })
              this.freeClass.params.date = this.freeClass.dateList[0].day;
              // this.freeClass.teachTime = resultData.teacherInfoList || [];
              // this.freeClass.totalCount = resultData.totalCount;
              this.freeClass.params.userId = resultData.userId;
              if (this.freeClass.showTeacherArea === 0 && this.freeClass.params.datebookType === 1) {
                //只显示中国并且是学生约课的情况下
                this.freeClass.showAllArea = 0;
                this.freeClass.params.teacherArea = 3;
              } else if (this.freeClass.showTeacherArea === 0 && this.freeClass.params.datebookType === 2) {
                //只显示中国并且类型是成人课程
                this.freeClass.showAllArea = 1;
                this.freeClass.params.teacherArea = null;
              } else {
                this.freeClass.showAllArea = 1;
              }
            }
            resolve(resultData)
          })
      })
    },
    getEvaluationData() {
      return new Promise((resolve) => {
        DatebookService.toChildEvaluationDatebook()
          .then(({ resultData }) => {
            this.evaluation.defaultPackageId = resultData.defaultPackageId
            this.evaluation.defaultTool = resultData.defaultTool
            this.evaluation.message = resultData.message
            this.evaluation.times = resultData.times
            this.evaluation.tip = resultData.tip
            this.evaluation.form.tool = '说客英语' // 工具改成默认eClass3.0
            this.evaluation.theLastAssessClass = resultData.theLastAssessClass
            if (this.evaluation.theLastAssessClass) {
              this.evaluation.form.evaluationTypes = 2
            }
            this.evaluation.packageMergeList = resultData.packageMergeList
            this.evaluation.list = resultData.list
            this.evaluation.evaluationMap = resultData.evaluationMap
            this.evaluation.form.teacherType = resultData.teacherType
            this.evaluation.form.useCount = resultData.resultMap.selfIntroduceEnglish
            this.evaluation.form.userProblem = resultData.resultMap.selfIntroduce
            if (this.evaluation.form.useCount) {
              this.evaluation.form.commend = 0
            } else {
              this.evaluation.form.commend = 1
            }
            resolve(resultData)
          })
      });
    },
  },
});
