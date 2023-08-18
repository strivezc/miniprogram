import { compareVersion } from '@/utils';
var plugin = requirePlugin('WechatSI');

let audioFlag = false;
canIUseWxAudio();
export let audioContext = uni.createInnerAudioContext();

let voiceObj = {
  en: '',
  zh: '',
};
export function preLoadVoice(lang = 'zh', content) {
  let time = new Date().getTime();
  plugin.textToSpeech({
    lang: lang === 'zh' ? 'zh_CN' : 'en_US',
    tts: true,
    content,
    success: function (res) {
      console.log('succ tts', res.filename);
      voiceObj[lang] = res.filename;
      console.log('语音耗时', new Date().getTime() - time, 'ms');
    },
    fail: function (res) {
      console.log('fail tts', res);
    },
  });
}
export function textToSpeech(lang = 'zh') {
  if (audioFlag) {
    audioContext.destroy();
  }
  return new Promise((resolve, reject) => {
    audioFlag = true;
    // 得到合成语音让它自动播放出来
    audioContext = uni.createInnerAudioContext();
    audioContext.src = voiceObj[lang];
    // if (lang === 'zh') {
    //   audioContext.playbackRate = 0.8;
    // } else {
    //   audioContext.playbackRate = 0.8;
    // }
    audioContext.playbackRate = 0.8;
    audioContext.onEnded(() => {
      console.log('play success');
      audioFlag = false;
      audioContext.destroy();
      resolve();
    });
    audioContext.onError(() => {
      console.log('play fail');
      audioFlag = false;
      audioContext.destroy();
      reject('play fail');
    });
    audioContext.play();
  });
}

function canIUseWxAudio() {
  const version = wx.getSystemInfoSync().SDKVersion;
  console.log(version, 'version');
  if (compareVersion(version, '2.3.0') >= 0) {
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
    });
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，手机开启静音模式下可能会导致播放音频失败。',
    });
  }
}
