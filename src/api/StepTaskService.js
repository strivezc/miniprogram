import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  queryStepInvitePrize(data) {
    return request({
      url: `${requestPort.market}/userStep/queryStepInvitePrize`,
      method: 'post',
      data
    });
  },
  queryStepStatus() {
    return request({
      url: `${requestPort.market}/userStep/queryStepStatus`,
      method: 'get',
    });
  },
  queryStepInfo() {
    return request({
      url: `${requestPort.market}/userStep/queryStepInfo`,
      method: 'get',
    });
  },
  getPrize(id) {
    return request({
      url: `${requestPort.market}/userStep/getPrize/${id}`,
      method: 'get',
    });
  },
  queryInviteDetails(data) {
    return request({
      url: `${requestPort.market}/userStep/queryInviteDetails`,
      method: 'post',
      data
    });
  },
};
