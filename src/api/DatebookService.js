import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  getTrialClassTime() {
    return request({
      url: `${requestPort.datebook}/studentExperienceCourse/getTrialClassTime`,
      method: 'get',
    });
  },
  receiveTrialClass(data) {
    return request({
      url: `${requestPort.datebook}/studentExperienceCourse/receiveTrialClass`,
      method: 'post',
      data
    });
  },
}
