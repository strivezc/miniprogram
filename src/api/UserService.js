import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  login(data) {
    return request({
      url: `${requestPort.users}/user/login`,
      method: 'post',
      data,
    });
  },
  appletLogin(data) {
    return request({
      url: `${requestPort.users}/user/appletLogin`,
      method: 'post',
      data,
    });
  },
  beforeAppletLogin(loginCode) {
    return request({
      url: `${requestPort.users}/user/beforeAppletLogin/${loginCode}`,
      method: 'get',
    });
  },
  courseAdviserQrCode() {
    return request({
      url: `${requestPort.users}/user/courseAdviserQrCode`,
      method: 'get',
    });
  },
  getInfo(userId) {
    return request({
      url: `${requestPort.users}/user/getUserMessageForFront/${userId}`,
      method: 'get',
    });
  },

  logout() {
    return request({
      url: `${requestPort.users}/user/logout/3`,
      method: 'post',
    });
  },

  getComplianceContent(data) {
    return request({
      url: `${requestPort.users}/user/queryComplianceContent`,
      method: 'post',
      data,
    });
  },
  checkLoginOffNum() {
    return request({
      url: `${requestPort.users}/user/checkLoginOffNum`,
      method: 'get',
    });
  },
  checkUserPassword(password) {
    return request({
      url: `${requestPort.users}/user/checkUserPassword/${password}`,
      method: 'get',
    });
  },
  logoff(data) {
    return request({
      url: `${requestPort.users}/user/logoff`,
      method: 'post',
      data,
    });
  },
  getPictureCode() {
    return request({
      url: `${requestPort.users}/user/getPictureCode`,
      method: 'post',
    });
  },
  sendSmsCodeByCaptcha(data) {
    return request({
      url: `${requestPort.users}/user/sendSmsCodeByCaptcha`,
      method: 'post',
      data,
    });
  },
  activityShareImageUrl() {
    return request({
      url: `${requestPort.users}/user/activityShareImageUrl`,
      method: 'get',
      hideMessage: true,
    });
  },
  queryActivityAppRules() {
    return request({
      url: `${requestPort.users}/user/queryActivityAppRules`,
      method: 'get',
    });
  },
  userInviteRecord(data) {
    return request({
      url: `${requestPort.users}/personCenter/userInviteRecord`,
      method: 'post',
      data,
    });
  },
  queryUserScoreExchangeRecord(data) {
    return request({
      url: `${requestPort.config}/score/queryUserScoreExchangeRecord`,
      method: 'post',
      data,
    });
  },
  queryUserScore() {
    return request({
      url: `${requestPort.config}/score/queryUserScore`,
      method: 'get',
      hideMessage: true,
    });
  },
  exchangeScore(data) {
    return request({
      url: `${requestPort.config}/score/exchangeScore`,
      method: 'post',
      data,
    });
  },
  mobileArea() {
    return request({
      url: `${requestPort.users}/user/mobileArea`,
      method: 'get',
    });
  },
  teacherDetails(data) {
    return request({
      url: `${requestPort.users}/personCenter/teacherDetails`,
      method: 'post',
      data,
    });
  },
};
