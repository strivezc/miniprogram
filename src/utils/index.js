let getPhoneNumberVersion = '2.21.2';

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

export function isEmpty(obj) {
  return typeof obj === 'undefined' || obj == null || obj === '';
}

/**
 *@desc 判断是否在微信平台
 *@author zzc
 *@date 2021/03/04
 */
export function isWeixin() {
  let ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1;
}

/**
 *@desc 判断是否在IOS
 *@author zzc
 *@date 2021/03/04
 */

export function isIOS() {
  let u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

/**
 *@desc 判断是否在Android
 *@author zzc
 *@date 2021/03/04
 */

export function isAndroid() {
  let u = navigator.userAgent;
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
}

/**
 *@desc 判断是PC还是移动端
 *@author zzc
 *@date 2021/03/04
 */
export function isPC() {
  let u = navigator.userAgent;
  let Agents = [
    'Android',
    'iPhone',
    'webOS',
    'BlackBerry',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod',
  ];
  let flag = true;
  for (let i = 0; i < Agents.length; i++) {
    if (u.indexOf(Agents[i]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach((v) => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function formatSeconds(value) {
  if ((value ?? '') === '') {
    return '';
  }
  let secondTime = parseInt(value); // 秒
  let minuteTime = 0; // 分
  let hourTime = 0; // 小时
  let day = 0; // 天
  if (secondTime > 60) {
    minuteTime = parseInt(secondTime / 60);
    secondTime = parseInt(secondTime % 60);
    if (minuteTime > 60) {
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime % 60);
    }
    if (hourTime > 24) {
      day = parseInt(hourTime / 24);
      hourTime = parseInt(hourTime % 24);
    }
  }
  let result = {
    dayTime: '0',
    hourTime: '0',
    minuteTime: '0',
    secondTime: parseInt(secondTime),
  };
  if (minuteTime > 0) {
    result.minuteTime = parseInt(minuteTime);
  }
  if (hourTime > 0) {
    result.hourTime = parseInt(hourTime);
  }
  if (day > 0) {
    result.dayTime = parseInt(day);
  }
  return result;
}

// 版本号对比
export const compareVersion = (v1, v2) => {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};
// 微信基础库
const version = () => {
  return uni.getSystemInfoSync().SDKVersion;
};

export const checkGetPhoneVersion = () => {
  if (compareVersion(version(), getPhoneNumberVersion) >= 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * getSystemInfo 获取状态栏，导航栏高度
 * @statusBarHeight 状态栏高度
 * @navigationBarHeight 导航栏高度(标题栏高度)
 * @navHeight 总体高度
 */
export function getSystemInfo() {
  let info = {
    statusBarHeight: 0,
    navigationBarHeight: 0,
    navHeight: 0,
  };
  // 状态栏高度
  info.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;

  // #ifdef MP-WEIXIN
  // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
  const custom = wx.getMenuButtonBoundingClientRect();
  // console.log(custom)

  // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
  info.navigationBarHeight = custom.height + (custom.top - info.statusBarHeight) * 2;
  // console.log("导航栏高度："+info.navigationBarHeight)

  // 总体高度 = 状态栏高度 + 导航栏高度
  info.navHeight = info.navigationBarHeight + info.statusBarHeight;

  return info;
}

// 数组分隔 [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7 ] ]
export function splitArr(ar, size = 1) {
  let index = 0;
  let res = [];
  while (index < ar.length) {
    res.push(ar.slice(index, index + size));
    index += size;
  }
  return res;
}

export function urlEncode(param, key, encode) {
  if (param == null) return '';
  let paramStr = '';
  let t = typeof param;
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + (encode == null || encode ? encodeURIComponent(param) : param);
  } else {
    for (let i in param) {
      let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}

export function saveNetWorkImage(imageUrl) {
  uni.getImageInfo({
    src: imageUrl,
    success: function(res) {
      uni.saveImageToPhotosAlbum({
        filePath: res.path,
        success: function() {
          uni.showToast({
            title: '保存成功！',
            icon: 'none',
            duration: 3000
          });
        },
        fail: function() {
          uni.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success() {
              uni.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    //是否授权保存到相册
                    uni.showModal({
                      title: '提示',
                      content: '获取权限成功,再次保存图片即可成功',
                      showCancel: false
                    });
                  } else {
                    uni.showModal({
                      title: '提示',
                      content: '获取权限失败，无法保存到相册',
                      showCancel: false
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  });

}
