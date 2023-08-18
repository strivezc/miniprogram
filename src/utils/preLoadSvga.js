import { Parser } from 'svgaplayer-weapp';

let svgaCollection = {};
/**
 * 预下载Svga图片
 * @param {*} svgaName
 */
export async function preLoadSvga(svgaName = '', callback = undefined) {
  let parser = new Parser();
  let localSvga = svgaCollection[svgaName];

  if (!localSvga) {
    localSvga = await parser.load(
      `https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/tool/${svgaName}.svga`
    );
    svgaCollection[svgaName] = localSvga;
  }

  if (callback) callback(localSvga);
}
