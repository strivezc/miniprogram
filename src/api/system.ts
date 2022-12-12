import { ApiResp, ApiRespList } from './types'
import * as IndexModels from './model/index.model'
import fly from '@/utils/flyjs'

class SystemService {
  static getOpenId(params: GetOpenIdModel): Promise<HttpResponse> {
    return fly.get('userCommon/queryWXOauthOpenIdByCode', { params })
  }
  static login(params = {}): Promise<HttpResponse> {
    return fly.post('userCommon/userLoginByThirdPlatform', params)
  }
  // 密码登录
  static loginByPwd(params = {}): Promise<HttpResponse> {
    return fly.post('userCommon/userLogin', params)
  }
  // 验证码登录
  static loginByCode(params = {}): Promise<HttpResponse> {
    return fly.post('userCommon/userLoginByCaptchaCodeApplet', params)
  }
  // 检查手机号是否注册过
  static checkIsRegister(params = {}): Promise<HttpResponse> {
    return fly.post('userCommon/checkPhoneIsRegistered', params)
  }
  // 获取登录验证码
  static getLoginCode(params = {}): Promise<HttpResponse> {
    // phone
    return fly.post('userCommon/generateCommonCaptchaCodeNew', params)
  }
  // 检查是否注册
  static isRegister(params = {}): Promise<HttpResponse> {
    // phone:
    return fly.post('userCommon/checkPhoneIsRegistered', params)
  }
  static loginByPhone(params = {}): Promise<HttpResponse> {
    return fly.post('userCommon/getWxDecryptPhone', params)
  }
  static loginByPhoneApplet(params = {}): Promise<HttpResponse> {
    return fly.post('userCommon/userLoginByPhoneApplet', params)
  }
  // 上传文件(录音图片)
  static uploadFile(filePath: string): Promise<HttpResponse> {
    return new Promise((resolve) => {
      uni.uploadFile({
        url: 'adminServer/fileUpload/imgUpload',
        fileType: 'image',
        filePath: [filePath],
        name: 'imgFile',
        success: (res) => {
          resolve(res)
        },
        fail: () => {},
      })
    })
  }
  // 上传文件(视频)
  static uploadVideoFile(filePath: string): Promise<HttpResponse> {
    return new Promise((resolve) => {
      uni.uploadFile({
        url: 'adminServer/fileUpload/videoUpload',
        fileType: 'image',
        filePath: [filePath],
        name: 'videoFile',
        success: (res) => {
          resolve(res)
        },
        fail: () => {},
      })
    })
  }
}

export default SystemService
