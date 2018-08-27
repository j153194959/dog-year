<template>
  <div class="Center" ref="center">
    <div class="page-container">
      <header>
        <div @click="openMask(1)">活动规则与说明</div>
      </header>
      <main>
        <ul>
          <li v-for="(value, index) in list" :key="index">
            <a @click="link(index, value.statu)" v-bind:class="['link' + (value.statu + 1)]" href="javascript:void(0)"></a>
            <div class="left">
              <div>{{value.time}}</div>
              <div>{{value.title}}</div>
            </div>
          </li>
        </ul>
      </main>
      <footer>
        <div class="QR_code">
          <img src="../../assets/center-QR code.png" alt="">
        </div>
        <p>微信搜索xyzq601377</p>
        <p>关注“兴业证券”官方公众号</p>
        <div @click="share" class="share">
          <img src="../../assets/center-btn_forward.png" alt="">
        </div>
      </footer>
    </div>
    <div class="pop-ups">
      <!-- 飞机 -->
      <transition name="fade">
        <div v-if="mask.aircraft" class="supernatant aircraft">
          <div class="container">
            <p>
              Hey，你有一份“狗粮”待领取
              <br> 立即前往“兴业证券”(xyzq601377)微信公众号
              <br> 参与飞机大战
            </p>
            <a @click="closeMask(0)" href="javascript:void(0)">
              <img src="../../assets/center-btn_know.png" alt="">
            </a>
          </div>
        </div>
      </transition>
      <!-- 规则 -->
      <transition name="fade">
        <div v-if="mask.rule" class="supernatant rule">
          <div class="container">
            <div @click="closeMask(1)" class="close">
              <img src="../../assets/center-icon_close.png" alt="">
            </div>
            <p>
              <span>1.</span>活动内容及观点仅供投资者参考，不构成任何投资建议，也不作为投资者作出投资决策的唯一参考因素，投资者应自主决定投资决策，本公司不对投资者的投资决策承担任何责任。</p>
            <p>
              <span>2.</span>“狙击飞机领‘狗粮’”活动仅限在微信参与，活动具体规则请参照其活动主页。前往兴业证券微信号（xyzq601377）的菜单栏“发现-狗年春节活动”立即参与。</p>
            <p>
              <span>3.</span>“2018兴‘汪’发达，携爱犬测财运”活动具体规则请参照其活动主页。</p>
            <p>
              <span>4.</span>“开市来套牛，十档行情，快人一步”活动具体规则请参照其活动主页。</p>
            <p>
              <span>5.</span>客户参与活动，即视为同意以上活动规则和免责声明。</p>
            <p>
              <span>6.</span>本次活动最终解释权归兴业证券股份有限公司所有，如有任何疑问，请致电兴业证券官方服务热线95562。</p>
          </div>
        </div>
      </transition>
      <!-- 活动结束 微信页套牛弹窗 -->
      <transition name="fade">
        <div v-if="mask.end" class="supernatant end">
          <div class="container">
            <p>{{endDes}}</p>
            <a @click="closeMask(3)" href="javascript:void(0)"><img src="../../assets/btn_confirm_pop.png" alt=""></a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Center',
  data () {
    return {
      isWechat: false, // 是否在微信端
      mask: {
        aircraft: false, // 飞机弹窗是否显示
        rule: false, // 规则弹窗是否显示
        end: false // 活动结束弹窗是否显示 微信页套牛弹窗
      },
      endDes: '抱歉，活动已结束！', // 微信页套牛弹窗 || 活动结束弹窗 展示文字
      isDraw: false, // 是否是点击第三个活动出现已结束
      shareData: { // 分享
        title: '狗年春节，三重好礼', // 标题
        desc: '兴业证券恭祝大家狗年兴“汪”发达，大吉大利接好礼', // 描述
        url: 'https://static.xyzq.cn/activity/dog-year/index.html#/Center', // 地址
        imgUrl: 'https://static.xyzq.cn/activity/dog-year/static/images/center-share.jpg', // 图标地址
      },
      list: [
        // {
        //   time: '', // 时间
        //   title: '', // 标题
        //   statu: 0 // 按钮状态 0--已结束 1--进行中 2--未开始
        // }
      ]
    }
  },
  props: ['childData', 'commonMask'], // 接收父组件的值
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index, type) {
      var arr = ['aircraft', 'rule', 'share', 'end']
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.center.style.top = -this.scrollTop + 'px'
      this.$refs.center.style.position = 'fixed'
      if (index === 3) {
        if (type) {
          this.endDes = '该活动领取礼包环节仅支持在优理宝APP参与'
        } else {
          this.endDes = '抱歉，活动已结束！'
        }
      }
      this.mask[arr[index]] = true
    },
    /**
     * 打开弹窗
     */
    closeMask: function (index) {
      var arr = ['aircraft', 'rule', 'share', 'end']
      this.$refs.center.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
      if (index === 3) {
        if (this.isWechat && this.isDraw) {
          window.location.href = 'http://www.beetobees.com/play/tpl_taoniu/EeVSPmvt/'
        }
      }
    },
    /**
     * 点击分享
     */
    share: function () {
      if (this.isWechat) {
        this.commonMask(1)
      } else {
        navigator.uniaccount.ulbShare(this.shareData.title, this.shareData.imgUrl, this.shareData.desc, this.shareData.url)
      }
    },
    /**
     * 设置微信分享
     */
    setWeixinShare: function () {
      var SHARE_TITLE = this.shareData.title
      var SHARE_DESC = this.shareData.desc
      var SHARE_URL = this.shareData.url // 必须是对的地址
      var SHARE_IMG = this.shareData.imgUrl

      var appid = ''
      var timestamp = ''
      var noncestr = ''
      var signature = ''
      var currentDomain = window.location.href.split(/\?|\#/)
      history.replaceState('', document.title, (currentDomain[0] + '#' + currentDomain[2]))

      this.$ajax({
        url: 'https://wechat.xyzq.cn/wechatbiz/accountApi?act=getJsapiInfo',
        params: {'url': SHARE_URL}, // 微信直接分享地址会变
        responseType: 'json'
      })
      .then((res) => {
        var data = res.data
        // alert(JSON.stringify(data))
        if (data.code == 0) {
          appid = 'wx513461a9e5de5010'
          timestamp = data.timestamp
          noncestr = data.noncestr
          signature = data.signature
          console.log('appid: %s', appid)
          console.log('timestamp: %s', timestamp)
          console.log('noncestr: %s', noncestr)
          console.log('signature: %s', signature)

          wx.config({
            debug: false,
            appId: appid,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: signature,
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              'onMenuShareTimeline',
              'onMenuShareAppMessage'
            ]
          })
        }
      })

      wx.ready(function () {
        wx.onMenuShareAppMessage({
          title: SHARE_TITLE, // 分享标题
          desc: SHARE_DESC, // 分享描述
          link: SHARE_URL, // 分享链接
          imgUrl: SHARE_IMG, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        //分享到朋友圈
        wx.onMenuShareTimeline({
          title: SHARE_TITLE,
          desc: SHARE_DESC, // 分享描述
          link: SHARE_URL,
          imgUrl: SHARE_IMG, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        wx.error(function (res) {
          // alert('wx.error'+res.errMsg)
        })
      })
    },
    /**
     * 获取按钮状态
     */
    getStatus: function () {
      var arr = [
        {
          time: '1.一重旺礼:(2/7-2/14)',
          title: '狙击飞机领“狗粮”'
        },
        {
          time: '2.二重旺礼:(2/12-2/27)',
          title: '2018兴“汪”发达，携爱犬测财运'
        },
        {
          time: '3.三重旺礼:(2/28-3/8)',
          title: '开市来套牛，十档行情，快人一步'
        }
      ]
      var timer = setInterval(() => {
        if (this.childData.status.length > 0) {
          clearInterval(timer)
          for (let i = 0; i < this.childData.status.length; i++) {
            const el = Math.abs(this.childData.status[i] - 2)
            arr[i].statu = el
            this.list.push(arr[i])
          }
        } else {
          console.log('1')
        }
      }, 300)

    },
    /**
     * 列表按钮点击
     */
    link: function (index, statu) {
      if (index === 0) {
        if (statu === 1 ) {
          if (this.isWechat) {
            window.location.href = 'http://www.beetobees.com/play/tpl_airfight/UWQAsxzI/'
          } else if (this.childData.inUlb) {
            this.openMask(0)
          }
        } else if (index === 0) {
          this.isDraw = false
          this.openMask(3)
        }
      } else if (index === 1) {
        if (statu === 1) {
          if (this.childData.inUlb) {
            window.location.href = 'https://static.xyzq.cn/activity/dog-year/index.html?inUlb=1#/'
          } else {
            window.location.href = 'https://static.xyzq.cn/activity/dog-year/index.html'+'?time='+((new Date()).getTime())+'#/';
          }
        } else if (statu === 0) {
          this.isDraw = false
          this.openMask(3)
        }
      } else if (index === 2) {
        if (statu === 1) {
          if (this.isWechat) {
            this.isDraw = true
            this.openMask(3, 1)
          } else if (this.childData.inUlb) {
            window.location.href = 'https://static.xyzq.cn/activity/dog-year/index.html?inUlb=1#/Home3'
          }
        } else if (statu === 0) {
          this.isDraw = false
          this.openMask(3)
        }
      }
    }
  },
  beforeMount: function () {
    document.getElementsByTagName('title')[0].innerHTML = '狗年春节，三重好礼'
    if (this.childData.inUlb) {
      var ulbTimer = setInterval(function () {
        if (navigator.uniaccount.setTitleBar) {
          navigator.uniaccount.setTitleBar({title: '狗年春节，三重好礼'})
          clearInterval(ulbTimer)
        } else {
          console.log('1')
        }
      }, 300)
    }
    if (this.GLOBAL.isWeixin()) {
      this.isWechat = true
      window.onload = this.setWeixinShare
    }
  },
  mounted: function () {
    // 大主页 埋点
    if (this.childData.inUlb) { // 优理宝APP_狗年春节_大主页
      TDAPP.onEvent("ylbapp_dogyear_main","",{tel: ''})
    } else if (this.GLOBAL.isWeixin()){ // 微信_狗年春节_大主页
      TDAPP.onEvent("xyzqwx_dogyear_main","",{tel: ''})
    }
    this.getStatus()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Center{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/center-background.png");
  background-size: 100% 100%;
  /* background-size: contain; */
  box-sizing: border-box;
  padding: .5rem .333333rem .361111rem .347222rem; /* 72 48 52 50 */
  > .page-container{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    > header{
      height: 5.5625rem; /* 801 */
      background-image: url('../../assets/center-Slogan.png');
      background-size: 100% 100%;
      text-align: right;
      div{
        display: inline-block;
        background-color: #EC5751;
        border: .013889rem solid #fff;
        color: #fff;
        height: .354167rem; /* 51 */
        line-height: .354167rem; /* 51 */
        border-radius: .194444rem 0 0 .194444rem; /* 28 */
        border-right: none;
        margin-top: .680556rem; /* 98 */
        padding: 0 .055556rem 0 .111111rem; /* 8 16 */
        font-size: .222222rem; /* 32 */
        font-family: "AdobeHeitiStd-Regular";
      }
    }
    > main{
      li{
        height: 1.736111rem; /* 250 */
        background-image: url('../../assets/center-list_Activity.png');
        background-size: 100% 100%;
        box-sizing: border-box;
        position: relative;
        margin-top: -.347222rem; /* 40 */
        a{
          width: 1.736111rem; /* 250 */
          height: .805556rem; /* 116 */
          background-size: 100% 100%;
          position: absolute;
          top: 50%;
          right: .277778rem; /* 40 */
          transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
          -o-transform: translateY(-50%);
        }
        .link1{
            background-image: url('../../assets/center-btn_end.png');
        }
        .link2{
            background-image: url('../../assets/center-btn_join.png');
        }
        .link3{
            background-image: url('../../assets/center-btn_about to begin.png');
        }
        .left{
          position: absolute;
          top: 50%;
          left: .694444rem; /* 100 */
          transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
          -o-transform: translateY(-50%);
          div{
            font-size: .263889rem; /* 38 */
            font-family: "PingFang-SC-Medium";
            height: .416667rem; /* 60 */
            line-height: .416667rem; /* 60 */
            color: #fff;
          }
        }
      }
    }
    > footer{
      div{
        margin: 0 auto;
      }
      .QR_code{
        width: 1.229167rem; /* 177 */
        height: 1.229167rem; /* 177 */
        margin-bottom: .069444rem; /* 10 */
      }
      p{
        height: .25rem; /* 36 */
        line-height: .25rem; /* 36 */
        text-align: center;
        color: #fff;
        font-size: .208333rem; /* 30 */
        font-family: "PingFang-SC-Medium";
      }
      .share{
        width: 1.680556rem; /* 242 */
        height: .784722rem; /* 113 */
        margin-top: .069444rem; /* 10 */
      }
    }
  }
  > .pop-ups{
    .supernatant{
      position: fixed;
      z-index: 10;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.7);
      top: 0;
      left: 0;
      display:-webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .aircraft{
      .container{
        background-image: url('../../assets/center-Pop - up window_Activity.png');
        background-size: 100% 100%;
        width: 6.152778rem; /* 886 */
        height: 5.875rem; /* 846 */
        p{
          line-height: .402778rem; /* 58 */
          padding-top: 2.638889rem; /* 380 */
          padding-bottom: .569444rem; /* 82 */
          text-align: center;
          color: #fff;
          font-family: "PingFang-SC-Medium";
          font-size: .270833rem; /* 39 */
        }
        a{
          display: block;
          width: 2.423611rem; /* 349 */
          height: .930556rem; /* 134 */
          margin: 0 auto;
        }
      }
    }
    .rule{
      .container{
        background-image: url('../../assets/center-Pop - up window_rule.png');
        background-size: 100% 100%;
        width: 6.152778rem; /* 886 */
        height: 9.444444rem; /* 1360 */
        box-sizing: border-box;
        padding: 2.673611rem .520833rem 0; /* 385 75 */
        position: relative;
        .close{
          position: absolute;
          top: 1.305556rem; /* 188 */
          right: -.381944rem; /* 55 */
          width: .576389rem; /* 83 */
          height: .576389rem; /* 83 */
        }
        p{
          line-height: .3125rem; /* 45 */
          color: #fff;
          margin-bottom: .104167rem; /* 15 */
          font-size: .229167rem;
          font-family: "PingFang-SC-Medium";
          span{
            color: #FFE32D;
          }
        }
      }
    }
    .end{
      .container{
        width: 6.152778rem; /* 886 */
        height: 5.388889rem; /* 776 */
        background-image: url("../../assets/Pop - up window_Activity (2).png");
        background-size: 100% 100%;
        p{
          padding: 2.229167rem 0 .479167rem 0; /* 321 69 */
          line-height: .555556rem; /* 80 */
          color: #fff;
          font-size: .347222rem; /* 50 */
          font-family: "PingFang-SC-Regular";
          text-align: center;
        }
        a{
          display: block;
          width: 2.777778rem; /* 400 */
          height: 1.0625rem; /* 153 */
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
