<template>
  <div class="Home3" ref="home3">
    <a @click="toGame" href="javascript:void(0)"><img src="../../assets/home3-toGame.png" alt=""></a>
    <div @click="openMask(0)" class="rule"><img src="../../assets/home3-rule.png" alt=""></div>
    <div class="share" @click="share">分享</div>
    <div class="logo"><img src="../../assets/logo.png" alt=""></div>
    <div class="pop-ups">
      <!-- 规则 -->
      <transition name="fade">
        <div v-if="mask.rule" class="supernatant rule">
          <div class="container">
            <div @click="closeMask(0)" class="close">
              <img src="../../assets/center-icon_close.png" alt="">
            </div>
            <div class="content">
              <p>
                <span>1.</span><strong>活动时间：</strong>2018/2/28-2018/3/8</p>
              <p>
                <span>2.</span><strong>活动玩法：</strong>活动期间，每日每位用户有5次参与开市来套牛游戏机会，每次游戏分数超过38分，可以参与1次抽奖。</p>
              <p>
                <span>3.</span><strong>活动礼包：</strong><br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>Level2礼包</i>，参与抽奖的客户可以随机抽到使用期限为1、3、6、12个月的沪深十档行情礼包；<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Level2礼包将在客户确认领取后，即时为该客户参与游戏用的手机号开通。
              </p>
              <p>
                <span>4.</span>同一兴证通号、手机号均视为同一用户，若存在任何作弊行为的用户，兴业证券将取消其参与资格，已经发放奖品的有权收回奖品；</p>
              <p>
                <span>5.</span>请确保网络和系统通畅，若因网络原因或系统原因，造成游戏中断、奖励未到账的情况，兴业证券将不再补发奖励；</p>
              <p>
                <span>6.</span>客户参与活动，即视为同意以上活动规则和免责声明；</p>
              <p>
                <span>7.</span>本次活动最终解释权归兴业证券股份有限公司所有，如有任何疑问，请致电兴业证券官方热线95562</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home3',
  data () {
    return {
      // isLogin: false, // 是否登录
      // phone: '', // 电话号码
      // token: '', // token值
      // client: '', // client值
      isEnd: false, // 活动是否已结束
      mask: {
        rule: false, // 规则弹窗是否显示
        noNew: false // 是否是兴证通帐号登录
      }
    }
  },
  props: ['childData', 'commonMask', 'againLogin'], // 接收父组件的值
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['rule']
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.home3.style.top = -this.scrollTop + 'px'
      this.$refs.home3.style.position = 'fixed'
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['rule']
      this.$refs.home3.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
    },
    /**
     * 点击前往游戏
     */
    toGame: function () {
      if (this.isEnd) {
        this.commonMask(0, '抱歉，活动已结束！')
      } else if (!this.childData.userinfo.isLogin) { // 如果未登录则跳登录框
        this.againLogin()
      } else {
        // alert('phone:' + this.phone + '---Token:' + this.token + '---Client:' + this.client)
        var isApp = ''
        if (this.childData.inUlb) isApp = 1
        this.$ajax({
          url: '/forward',
          params: {
            phone: this.childData.userinfo.phone,
            Token: this.childData.userinfo.token,
            Client: this.childData.userinfo.client,
            isApp: isApp
          }
        })
        .then((res) => {
          const data = res.data
          // alert(JSON.stringify(data))
          if (data.resphead.respcode === '0000') {
            window.location.href = data.respbody
            // window.location.href = 'https://wx.9ria.com/open/authorize.php?appid=MeuRSOPd&appurl=http%3A%2F%2Fwww.beetobees.com%2Fplay%2Ftpl_taoniu%2FMeuRSOPd%2F&timestamp=1517284126&uid=320723198809083618&name=wyqiang&avatar=&sign=408a4318814dc9e8c9e28f08608d93ec'
            // window.location.href = 'https://wx.9ria.com/open/authorize.php?appid=MeuRSOPd&appurl=http%3A%2F%2Fwww.beetobees.com%2Fplay%2Ftpl_taoniu%2FMeuRSOPd%2F&timestamp=1517304773&uid=15995029602&name=15995029602&avatar=&sign=005b4523c64233bacab0606e0fd238bb'
            // window.location.href = 'https://wx.9ria.com/open/authorize.php?appid=MeuRSOPd&appurl=http%3A%2F%2Fwww.beetobees.com%2Fplay%2Ftpl_taoniu%2FMeuRSOPd%2F&timestamp=1517302967&uid=34&name=zhangsan&avatar=&sign=24f71388c2a2d60177bf07828885620b'
          } else {
            alert('登录超时！')
          }
        })
        .catch((err) => {
          console.log(err)
          alert('服务器响应失败！')
        })
      }
    },
    /**
     * 获取活动是否结束状态
     */
    getStatu: function () {
      var timer = setInterval(() => {
        if (this.childData.status.length > 0) {
          clearInterval(timer)
          if (this.childData.status[2] === 2) this.isEnd = true
        } else {
          console.log('1')
        }
      }, 300)
    },
    /**
     * 点击 分享
     */
    share: function () {
      if (this.GLOBAL.isWeixin()) {
        this.commonMask(1)
      } else if (this.childData.inUlb) {
        navigator.uniaccount.ulbShare('~开市来套牛~', 'https://static.xyzq.cn/activity/dog-year/static/images/drawable-icon.png', '狗年开市节节高升！疯狂套牛不仅好玩还能领取Level2~', 'http://www.beetobees.com/play/tpl_taoniu/EeVSPmvt/')
      }
    }
  },
  beforeMount: function () {
    document.getElementsByTagName('title')[0].innerHTML = '开市来套牛'
    if (this.childData.inUlb) {
      var ulbTimer = setInterval(() => {
        if (navigator.uniaccount.ulbAccLogin) {
          navigator.uniaccount.setTitleBar({title: '开市来套牛'})
          clearInterval(ulbTimer)
        } else {
          console.log('1')
        }
      }, 300)
    }
  },
  mounted: function () {
    // 活动三主页 埋点
    if (this.childData.inUlb) { // 优理宝APP_狗年春节_套牛首页
      setTimeout(() => {
        TDAPP.onEvent("ylbapp_dogyear_taoniu_firstpage","",{tel: this.childData.userinfo.phone})
      }, 500)
    } else if (this.GLOBAL.isWeixin()){ // 微信_狗年春节_套牛首页
      TDAPP.onEvent("xyzqwx_dogyear_taoniu_firstpage","",{tel: ''})
    }
    this.getStatu()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Home3{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/home3-bg.png");
  background-size: 100% 100%;
  /* background-size: contain; */
  box-sizing: border-box;
  padding: .5rem .333333rem .361111rem .347222rem; /* 72 48 52 50 */
  position: relative;
  > a{
    display: block;
    width: 3.715278rem; /* 535 */
    height: 3.715278rem; /* 535 */
    padding-top: 4.513889rem; /* 650 */
    margin: 0 auto;
  }
  > .rule{
    position: absolute;
    top: 0;
    left: .347222rem; /* 50 */
    width: 2.006944rem; /* 289 */
    height: 1.3125rem; /* 189 */
  }
  > .share{
    position: absolute;
    right: 0;
    top: .243056rem; /* 35 */
    height: .527778rem; /* 76 */
    line-height: .527778rem; /* 76 */
    font-size: .3125rem; /* 45 */
    font-family: "AdobeHeitiStd-Regular";
    color: #fff;
    border: 1px solid #fff;
    border-radius: .263889rem 0 0 .263889rem; /* 38 */
    padding: 0 .138889rem 0 .333333rem; /* 20 48 */
    background-color: rgba(255, 255, 255, .3);
    border-right: none;
  }
  > .logo{
    width: 2.5rem; /* 360 */
    height: .694444rem; /* 100 */
    position: absolute;
    top: .347222rem; /* 50 */
    right: 50%;
    margin-right: -1.25rem; /* 180 */
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
    .rule{
      .container{
        background-image: url('../../assets/home3-rule-bg.png');
        background-size: 100% 100%;
        width: 6.152778rem; /* 886 */
        height: 6.673611rem; /* 961 */
        box-sizing: border-box;
        padding: 1.736111rem .520833rem .694444rem; /* 385 75 */
        position: relative;
        .close{
          position: absolute;
          top: 0;
          right: -.381944rem; /* 55 */
          width: .576389rem; /* 83 */
          height: .576389rem; /* 83 */
        }
        .content{
          height: 100%;
          overflow: scroll;
          p{
            line-height: .3125rem; /* 45 */
            color: #fff;
            margin-bottom: .104167rem; /* 15 */
            font-size: .229167rem;
            font-family: "PingFang-SC-Medium";
            span{
              color: #FFE32D;
            }
            strong{
              font-weight: bold;
              color: #FFE32D;
            }
            i{
              color: #FFE32D;
            }
          }
        }
      }
    }
  }
}
</style>
