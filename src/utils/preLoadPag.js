import { PAGInit } from 'libpag-miniprogram';

let pagCollection = {};
let PAG = null;
/**
 * 预下载pag图片
 * @param {*} pagName
 */
export async function preLoadPag(pagName = '', callback = undefined) {
  if (!PAG) {
    PAG = await PAGInit({
      locateFile: (file) => '/wxcomponents/' + file,
    });
  }
  if (!pagCollection[pagName]) {
    const buffer = await loadFileByRequest(
      `https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/tool/${pagName}.pag`
    );
    const pagFile = await PAG.PAGFile.load(buffer);
    pagCollection[pagName] = pagFile;
  }

  if (callback) callback(pagCollection[pagName], PAG);
}

const loadFileByRequest = async (url) => {
  return new Promise((resolve) => {
    uni.request({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      success(res) {
        if (res.statusCode !== 200) {
          resolve(null);
        }
        resolve(res.data);
      },
      fail() {
        resolve(null);
      },
    });
  });
};
