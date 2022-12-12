const urls = {
  test: 'https://uat.keyclass.cn/studentServer',
  build: 'https://www.keyclass.cn/studentServer',
  localYu: 'http://10.204.42.172:9099/studentServer',
  localZhuo: 'http://10.204.42.156:9099/studentServer',
  zhen: 'http://10.204.42.139:9099/studentServer',
}

const webs = {
  test: 'https://uat.keyclass.cn',
  build: 'https://www.keyclass.cn',
}

const env = 'test'

export const webHost = webs[env]
export const baseUrl = urls[env]
