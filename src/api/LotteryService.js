import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  getPrizeActivityInfo(code, hideMessage = false) {
    return request({
      url: `${requestPort.market}/userPrizeActivity/getPrizeActivityInfo/${code}`,
      method: 'get',
      hideMessage
    });
  },
  queryNowRaffleInfo(code) {
    return request({
      url: `${requestPort.market}/userPrizeActivity/queryNowRaffleInfo/${code}`,
      method: 'get'
    });
  },
  checkLogin() {
    return request({
      url: `${requestPort.users}/user/startClass`,
      method: 'get',
      hideMessage: true,
    });
  },
  runActivityPrize(code) {
    return request({
      url: `${requestPort.market}/userPrizeActivity/runActivityPrize/${code}`,
      method: "get",
      hideMessage: true,
    });
  },
  appletQueryNowRaffleInfo() {
    return request({
      url: `${requestPort.market}/userPrizeActivity/appletQueryNowRaffleInfo`,
      method: "get",
      hideMessage: true,
    });
  },
  appletRaffleInviteNewInfo(data) {
    return request({
      url: `${requestPort.market}/userPrizeActivity/appletRaffleInviteNewInfo`,
      method: "post",
      data
    });
  },
  appletQueryRaffleDetailsRecords(data) {
    return request({
      url: `${requestPort.market}/userPrizeActivity/appletQueryRaffleDetailsRecords`,
      method: "post",
      data
    });
  },
};
