import { getWeek } from '@/utils'
// IOS 兼容问题处理
const comDate = date => date.replace(/-/g, '/')

/**
 * @description: 转换时间格式
 * @param {date} 需要转换的时间
 * @param {String} 转换成的时间格式，默认'yyyy-mm-dd'
 * @return {String} 符合转换要求格式的时间
 * @author YMM
 */
export function formatDate(date, fmt = 'yyyy-MM-dd') {
  if (!date) return date
  try {
    let d = date instanceof Object ? date : typeof date === 'number' ? new Date(date) : new Date(comDate(date))
    const q = 3 // 季度
    let o = {
      'M+': d.getMonth() + 1, //月份
      'd+': d.getDate(), //日
      'h+': d.getHours(), //小时
      'm+': d.getMinutes(), //分
      's+': d.getSeconds(), //秒
      'q+': Math.floor((d.getMonth() + q) / q), //季度
      S: d.getMilliseconds() //毫秒
    }
    const yearNum = 4
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(yearNum - RegExp.$1.length))
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return fmt.includes('aN') ? date : fmt
  } catch (error) {
    return date
  }
}

export function dateParseTime(date) {
  if (!date) return date
  if (typeof date === 'number') return date
  if (typeof date === 'string') return Date.parse(new Date(comDate(date)))
  return Date.parse(date)
}

/**
 * @description: 创建时间列表
 * @param {date} strat 开始时间
 * @param {date} end 结束时间
 * @param {date} minute 时间间隔
 * @return {Array} 符合时间间隔的数组
 * @author YMM
 */
export function createTimeList(start, end, minute) {
  let date = formatDate(new Date())
  let seconds = minute * 60,
    startSecond = dateParseTime(date + ' ' + start),
    endSecond = dateParseTime(date + ' ' + end),
    newArr = [],
    pre = 0,
    last = 0
  let len = (endSecond - startSecond) / seconds / 1000
  for (let i = 0; i <= len; i++) {
    pre = i * seconds * 1000 + startSecond
    let res = formatDate(new Date(pre), 'hh:mm')
    newArr.push(res)
  }
  return newArr
}

/**
 * @description: 获取指定日期
 * @param {date} date 开始时间
 * @param {date} day 间隔日期
 * @return {date} 符合间隔日期的日期
 * @author YMM
 */
export function getAssignedDay(date, day) {
  date.setDate(date.getDate() + day)
  return formatDate(date)
}

/**
 * @description: 获取指定时间加多少分钟后的时间
 * @param time 开始时间
 * @return now 符合间隔分钟的时间
 * @author YMM
 */
export function getEndMinutes(time, t) {
  let timeArr = time.split(':')
  let h = parseInt(timeArr[0])
  let m = parseInt(timeArr[1])
  var date = new Date(1900, 1, 1, h, m)
  date.setMinutes(date.getMinutes() + t)
  let hour = date.getHours()
  let minutes = date.getMinutes()
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  var now = hour + ':' + minutes
  return now
}

/**
 * @description: 获取指定日期的星期
 * @param date 字符串 yyyy-MM-dd
 * @return 星期
 * @author YMM
 */
export function getWeekDay(date) {
  let dt = new Date(date.split('-')[0], date.split('-')[1] - 1, (date = date.split('-')[2]))
  let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekDay[dt.getDay()]
}

/**
 * @description: 格式化上课时间
 * @param dateTime 字符串 2024-03-20 16:30-16:55
 * @return 2024-03-20 星期三 16:30-16:55
 */
export function formatDateTime(dateTime) {
  let str = ''
  if (dateTime) {
    const date = dateTime.substring(0, 10);
    const time = dateTime.substring(11);
    const week = `星期${getWeek(date)}`
    str=`${date } ${week} ${time}`
  }
  return str
}
