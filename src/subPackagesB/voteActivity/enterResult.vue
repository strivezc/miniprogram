<template>
  <view class="enterResult" :class="mask ? 'tl-show' : ''">
    <view class="background">
      <image mode="scaleToFill" src="@/subPackagesB/static/vote/enterBg.png" class="bg"></image>
    </view>
    <image mode="widthFix" src="@/subPackagesB/static/vote/enterReel.png" class="img"></image>
    <view class="content">
      <image mode="widthFix" src="@/subPackagesB/static/vote/vector.png" class="vector"></image>
      <view class="title">恭喜您，报名成功</view>
      <view class="name">参赛名：{{ userName }}</view>
      <view class="name voteId">参赛编号：{{ voteId }}</view>
      <button class="btn-submit btn" @click="toShare">去拉票</button>
      <button class="btn-submit btn btn2" @click="toDetails">个人投票详情</button>
    </view>

    <my-painter :template="template" @getImageUrl="getImageUrl"></my-painter>
    <image mode="widthFix" v-show="showPoster" :src="imageUrl" class="poster"></image>
    <uni-popup ref="share" type="share" @maskClick="close" safeArea backgroundColor="#fff">
      <popupShare @close="close" @select="selectType" :shareType="[0, 2]"></popupShare>
    </uni-popup>
  </view>
</template>

<script>
  import popupShare from '@/components/popupShare/index';
  import { palette } from './components/image';
  import myPainter from '@/components/painter';
  import VoteService from '@/api/VoteService';
  import shareBg from '@/subPackagesB/static/vote/shareBg.png';
  import element1 from '@/subPackagesB/static/vote/element1.png';
  import element2 from '@/subPackagesB/static/vote/element2.png';
  import tagType1 from '@/subPackagesB/static/vote/01.png';
  import tagType2 from '@/subPackagesB/static/vote/02.png';
  import tagType3 from '@/subPackagesB/static/vote/03.png';
  import tagType4 from '@/subPackagesB/static/vote/04.png';
  import tagType5 from '@/subPackagesB/static/vote/05.png';

  export default {
    name: 'enterResult',
    components: {
      popupShare,
      myPainter,
    },
    data() {
      return {
        userName: '',
        voteId: '',
        imageUrl: '',
        template: {},
        showPoster: false,
        shareInfo: {},
        activeTab: 1,
      };
    },
    onLoad(query) {
      this.userName = query.userName;
      this.voteId = query.voteId;
      this.getInfoCanvass();
    },
    onUnload() {
      console.log(this.activeTab, 'this.activeTab');
      uni.reLaunch({
        url: `/subPackagesB/voteActivity/activityDetail?activeTab=${this.activeTab}`,
      });
    },
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内分享按钮
        console.log(res.target);
      }
      return {
        title: `帮我投一票，${this.shareInfo.userName}正在参加${this.shareInfo.voteName}`,
        path: `/subPackagesB/voteActivity/individualDetail?voteId=${this.voteId}&recommendCode=${this.shareInfo.userDistributorCode}`,
        imageUrl: this.shareInfo.contestImg,
      };
    },
    methods: {
      getImageUrl(url) {
        this.imageUrl = url;
      },
      async getInfoCanvass() {
        try {
          const { resultData } = await VoteService.getInfoCanvass(this.voteId);
          this.shareInfo = resultData;
          let tagType = resultData.tagType;
          let url =
            import.meta.env.MODE === 'production'
              ? 'https://www.talk915.com'
              : 'https://test.talk915.com';
          this.template = palette({
            url: shareBg,
            code: `${url}/h5/static/?voteId=${this.shareInfo.voteId}&recommendCode=${this.shareInfo.userDistributorCode}`,
            avtar: this.getAvtar(tagType),
            icon1: element1,
            icon2: element2,
            text1: `我是 ${this.shareInfo.voteId}号 选手`,
            text2: this.shareInfo.userName,
          });
        } catch (e) {
          console.log(e, 'error');
        }
      },
      getAvtar(type) {
        let img = null;
        switch (type) {
          case 0:
            img = tagType1;
            break;
          case 1:
            img = tagType2;
            break;
          case 2:
            img = tagType3;
            break;
          case 3:
            img = tagType4;
            break;
          case 4:
            img = tagType5;
            break;
          default:
        }
        return img;
      },
      close() {
        this.$refs.share.close();
        this.mask = false;
        this.showPoster = false;
      },
      toShare() {
        this.$refs.share.open();
        this.mask = true;
        this.showPoster = true;
      },
      toDetails() {
        this.activeTab = 2;
        uni.navigateTo({
          url: `/subPackagesB/voteActivity/individualDetail?voteId=${this.shareInfo.voteId}`,
        });
      },
      selectType(item) {
        if (item.name === 'download') {
          if (this.imageUrl) {
            this.downImage();
          }
        }
      },
      downImage() {
        uni.saveImageToPhotosAlbum({
          filePath: this.imageUrl,
          success: function () {
            uni.showToast({
              title: '下载成功！',
              icon: 'none',
              duration: 3000,
            });
          },
          fail: function () {
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
                        showCancel: false,
                      });
                    } else {
                      uni.showModal({
                        title: '提示',
                        content: '获取权限失败，无法保存到相册',
                        showCancel: false,
                      });
                    }
                  },
                });
              },
            });
          },
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .enterResult {
    height: 100%;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      z-index: -999;

      .bg {
        display: block;
        width: 100%;
        height: 100vh;
        vertical-align: top;
        font-size: 0rpx;
      }
    }

    .img {
      width: 100%;
      margin-top: -3rpx;
    }

    .poster {
      position: fixed;
      top: 50rpx;
      left: 50%;
      z-index: 999;
      transform: translateX(-50%);
      width: 500rpx;
    }

    .content {
      padding: 0 70rpx;

      .vector {
        display: block;
        margin: auto;
        width: 134rpx;
        margin-top: 70rpx;
      }

      .title {
        text-align: center;
        margin-top: 37rpx;
        font-size: 40rpx;
        font-weight: 500;
        color: #fff0cc;
        line-height: 47rpx;
      }

      .name {
        text-align: center;
        margin-top: 57rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #fff0cc;
        line-height: 32rpx;
      }

      .voteId {
        margin-top: 30rpx;
        height: 97rpx;
        line-height: 97rpx;
        border-top: 1px solid #e7606c;
        border-bottom: 1px solid #e7606c;
      }

      .btn {
        margin-top: 40rpx;
        width: 610rpx;
        background: #fff0cc !important;
        border-radius: 50rpx 50rpx 50rpx 50rpx;
        color: #9f1a25;
      }

      .btn2 {
        margin-top: 21rpx;
        border: 1px solid #fff0cc;
        color: #fff0cc;
        background: transparent !important;
      }
    }
  }
</style>
