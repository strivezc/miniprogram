/*
 * 创建人：Michael
 * 创建时间：2022/02/7
 * 页面描述：打卡分享页数据
 * */

interface FuncParams {
  /**头像 */
  avatar: string
  /**昵称 */
  nickname: string
  /**打卡次数 */
  times: string
  /**二维码 */
  code: string
  /**课程名称 */
  courseName: string
  /**课程封面图 */
  courseImage: string
  /**公司logo */
  logo: string
}

function _image(url: string, css: Record<string, string>) {
  return {
    type: 'image',
    url,
    css,
  }
}

function renderCheckInShare(params: FuncParams) {
  const { avatar, nickname, courseImage, courseName, times, code, logo } =
    params
  return {
    background: '/static/images/share/share-bg.png',
    width: '750rpx',
    height: '1334rpx',
    borderRadius: '20rpx',
    views: [
      _image(avatar, {
        top: '80rpx',
        left: '312rpx',
        width: '128rpx',
        height: '128rpx',
        borderRadius: '50%',
      }),
      {
        type: 'text',
        text: nickname,
        css: [
          {
            width: '100%',
            fontSize: '32rpx',
            fontWeight: 'bold',
            color: '#333',
            top: '236rpx',
            textAlign: 'center',
          },
        ],
      },
      _image(courseImage, {
        top: '318rpx',
        left: '64rpx',
        width: '622rpx',
        height: '420rpx',
        borderRadius: '16rpx',
      }),
      {
        type: 'text',
        text: courseName,
        css: [
          {
            fontSize: '40rpx',
            fontWeight: 'bold',
            color: '#000',
            top: '792rpx',
            left: '64rpx',
          },
        ],
      },
      {
        type: 'inlineText',
        textList: [
          {
            text: '我刚完成了',
            css: {
              fontSize: '32rpx',
              lineHeight: '48rpx',
              color: '#666',
            },
          },
          {
            text: times,
            css: {
              fontSize: '48rpx',
              lineHeight: '32rpx',
              color: '#409eff',
            },
          },
          {
            text: '次打卡，你也来一起学习吧！',
            css: {
              fontSize: '32rpx',
              lineHeight: '48rpx',
              color: '#666',
            },
          },
        ],
        css: {
          width: '100%',
          left: '64rpx',
          top: '856rpx',
        },
      },
      {
        type: 'text',
        text: '长按识别小程序码',
        css: [
          {
            fontSize: '28rpx',
            color: '#666',
            bottom: '312rpx',
            left: '70rpx',
          },
        ],
      },
      _image(code, {
        bottom: '230rpx',
        right: '72rpx',
        width: '118rpx',
        height: '118rpx',
      }),
      {
        type: 'text',
        text: '查看课程',
        css: [
          {
            fontSize: '36rpx',
            color: '#409eff',
            bottom: '230rpx',
            left: '70rpx',
          },
        ],
      },
      _image(logo, {
        bottom: '62rpx',
        left: '260rpx',
        width: '238rpx',
        height: '62rpx',
      }),
    ],
  }
}

export default renderCheckInShare
