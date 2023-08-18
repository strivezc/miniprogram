<script>
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/store'

  export default {
    onLaunch: function () {
      console.log('App Launch');
      uni.loadFontFace({
        global: true,
        family: 'Resource Han Rounded CN',
        source:
          'url("https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/tool/ResourceHanRoundedCNMedium.ttf")',
        success() {
          console.log('loadFontFace success-family');
        },
        complete() {
          console.log('loadFontFace complete');
        },
      });
    },
    onShow: function () {
      console.log('App Show');
      if (this.appletLoginStatus===null) {
        uni.login({
          provider: 'weixin',
          success: (loginRes) => {
            this.getAppletLoginStatus(loginRes.code)
          },
        });
      }
    },
    onHide: function () {
      console.log('App Hide');
    },
    computed: {
      ...mapState(useUserStore, ['appletLoginStatus' ])
    },
    methods:{
      ...mapActions(useUserStore, ['getAppletLoginStatus' ]),
    }
  };
</script>

<style lang="scss">
  @import './wxcomponents/vant/common/index.wxss';
  /*每个页面公共css */
  @import './styles/public.scss';
  @import './styles/animate.min.css';
</style>
