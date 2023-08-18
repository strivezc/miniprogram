import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  queryInitialContent() {
    return request({
      url: `${requestPort.market}/userJigsaw/queryInitialContent`,
      method: 'get',
    });
  },
  startGame() {
    return request({
      url: `${requestPort.market}/userJigsaw/startGame`,
      method: 'get',
      hideMessage: true,
    });
  },
  homeleaderboard(data) {
    return request({
      url: `${requestPort.market}/userJigsaw/homeleaderboard`,
      method: 'post',
      data,
    });
  },
  userHomeRank() {
    return request({
      url: `${requestPort.market}/userJigsaw/userHomeRank`,
      method: 'get',
      hideMessage: true,
    });
  },
  userCenter() {
    return request({
      url: `${requestPort.market}/userJigsaw/userCenter`,
      method: 'get',
    });
  },
  regionShow() {
    return request({
      url: `${requestPort.market}/userJigsaw/regionShow`,
      method: 'get',
      hideMessage: true,
    });
  },
  regionShowTourist() {
    return request({
      url: `${requestPort.market}/userJigsaw/regionShowTourist`,
      method: 'get',
    });
  },
  barrierShow(regionId) {
    return request({
      url: `${requestPort.market}/userJigsaw/barrierShow/${regionId}`,
      method: 'get',
    });
  },
  startOrContinue(regionId) {
    return request({
      url: `${requestPort.market}/userJigsaw/startOrContinue`,
      method: 'get',
    });
  },
  barrierShowInto(barrierId) {
    return request({
      url: `${requestPort.market}/userJigsaw/barrierShowInto/${barrierId}`,
      method: 'get',
    });
  },
  pauseOrTimeOut(data) {
    return request({
      url: `${requestPort.market}/userJigsaw/pauseOrTimeOut`,
      method: 'post',
      data,
    });
  },
  barrierUseProp(data) {
    return request({
      url: `${requestPort.market}/userJigsaw/barrierUseProp`,
      method: 'post',
      data,
    });
  },
  gameComplete(data) {
    return request({
      url: `${requestPort.market}/userJigsaw/gameComplete`,
      method: 'post',
      data,
    });
  },
  prizeRecordDown() {
    return request({
      url: `${requestPort.market}/userJigsaw/prizeRecordDown`,
      method: 'get',
    });
  },
  jigsawPrize(data) {
    return request({
      url: `${requestPort.market}/userJigsaw/jigsawPrize`,
      method: 'post',
      data,
    });
  },
  inviteGetCode(propType) {
    return request({
      url: `${requestPort.market}/userJigsaw/inviteGetCode/${propType}`,
      method: 'get',
    });
  },
  getPropsInfo() {
    return request({
      url: `${requestPort.market}/userJigsaw/getPropsInfo`,
      method: 'get',
    });
  },
  barrierRank(barrierId) {
    return request({
      url: `${requestPort.market}/userJigsaw/barrierRank/${barrierId}`,
      method: 'get',
    });
  },
  barrierUserRank(barrierId) {
    return request({
      url: `${requestPort.market}/userJigsaw/barrierUserRank/${barrierId}`,
      method: 'get',
    });
  },
  nextBarrierInto(barrierId) {
    return request({
      url: `${requestPort.market}/userJigsaw/nextBarrierInto/${barrierId}`,
      method: 'get',
    });
  },
  blindBox() {
    return request({
      url: `${requestPort.market}/userJigsaw/blindBox`,
      method: 'get',
    });
  },
  queryUserCurrency() {
    return request({
      url: `${requestPort.market}/userQiqiShop/queryUserCurrency`,
      method: 'get',
      hideMessage: true,
    });
  },
  queryQiqiShop(data) {
    return request({
      url: `${requestPort.market}/userQiqiShop/queryQiqiShop`,
      method: 'post',
      data,
    });
  },
  queryHaveWares(data) {
    return request({
      url: `${requestPort.market}/userQiqiShop/queryHaveWares`,
      method: 'post',
      data,
    });
  },
  exchangeWares(waresId) {
    return request({
      url: `${requestPort.market}/userQiqiShop/exchangeWares/${waresId}`,
      method: 'get',
    });
  },
  useWares(detailsId) {
    return request({
      url: `${requestPort.market}/userQiqiShop/useWares/${detailsId}`,
      method: 'get',
    });
  },
  queryEntranceStatus() {
    return request({
      url: `${requestPort.market}/userJigsaw/queryEntranceStatus`,
      method: 'get',
    });
  },
  queryRankStatus() {
    return request({
      url: `${requestPort.market}/userJigsaw/queryRankStatus`,
      method: 'get',
    });
  },
  queryProvidePrize() {
    return request({
      url: `${requestPort.market}/userJigsaw/queryProvidePrize`,
      method: 'get',
      hideMessage: true,
    });
  },
  providePrizeReply() {
    return request({
      url: `${requestPort.market}/userJigsaw/providePrizeReply`,
      method: 'get',
    });
  },
};
