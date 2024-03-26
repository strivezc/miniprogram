import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  banner() {
    return request({
      url: `${requestPort.config}/learningHall/banner/2`,
      method: 'get',
    });
  },
  popUpPage() {
    return request({
      url: `${requestPort.users}/personCenter/popUpPage/3`,
      method: 'get',
    });
  },
  clickBanner(data) {
    return request({
      url: `${requestPort.config}/officalHome/click`,
      method: 'post',
      data,
    });
  },
  checkLogin() {
    return request({
      url: `${requestPort.users}/user/startClass`,
      method: 'get',
      hideMessage: true,
    });
  },
  experienceCourseDetails() {
    return request({
      url: `${requestPort.datebook}/studentExperienceCourse/details`,
      method: 'get',
      hideMessage: true,
    });
  },
  changeMobileArea(){ //获取学习顾问信息
    return request({
      url:`${requestPort.users}/user/mobileArea`,
      method:'get',
    });
  },
  getOrderList(data){ //获取我的订单列表
    return request({
      url:`${requestPort.market}/myOrder/order`,
      method:'post',
      data
    });
  },
  cancelOrder(oId){//取消订单
    return request({
      url:`${requestPort.market}/myOrder/order/${oId}`,
      method:'put'
    });
  },
  wxPaymentApplication(data) {
    return request({
      url: `${requestPort.market}/myOrder/wxPaymentApplication`,
      method: "post",
      data,
    });
  }
};
