<template>
  <div ref="app" id="app">
    <router-view :childData="toChild" :commonMask="openMask" :againLogin="againLogin" :cordovaLoad="cordovaLoad" @transferUser="getChild"></router-view>
    <div class="pop-ups">
      <!-- 活动结束 -->
      <transition name="fade">
        <div v-if="mask.end" class="supernatant end">
          <div class="container">
            <p>{{endDes}}</p>
            <a @click="closeMask(0)" href="javascript:void(0)"><img src="./assets/btn_confirm_pop.png" alt=""></a>
          </div>
        </div>
      </transition>
      <!-- 微信分享 -->
      <transition name="fade">
        <div v-if="mask.share" @click="closeMask(1)" class="supernatant share">
          <div class="container">
            <div class="img">
              <img src="./assets/center-point.png" alt="">
            </div>
          </div>
        </div>
      </transition>
      <!-- 非资金帐号浮层 -->
      <transition name="fade">
        <div v-if="mask.noNew" class="supernatant noNew">
          <div class="container">
            <div class="top">亲，请登录手机号或升级至最新版本参加本活动哦^.^~</div>
            <div class="bottom">
              <a @click="upDate" href="javascript:void(0);">立即更新</a>
              <a @click="againLogin" href="javascript:void(0);">登录</a>
            </div>
            <a class="close" @click="closeMask(2)" href="javascript:void(0)">X</a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      mask: {
        end: false, // 活动结束弹窗 是否显示
        share: false, // 微信分享弹窗 是否显示
        noNew: false // 是否是兴证通帐号登录
      },
      endDes: '', // 结束弹窗 文字提示
      toChild: {
        inUlb: false, // 是否在优理宝中
        nickname: '', // 昵称
        declaration: '', // 宣言
        files: '', // 图片
        status: [], // 活动状态（是否结束）
        userinfo: { // 用户信息
          isLogin: false, // 是否登录
          phone: '', // 登录手机号
          token: '', // token值
          client: '' // client值
          // isLogin: true, // 是否登录
          // phone: '17621750993', // 登录手机号
          // token: 'COINbbb4883e5d8b34cc', // token值
          // client: 'ceshi' // client值
        }
      }
    }
  },
  methods: {
    /**
     * 接收子组件的值
     */
    getChild: function (msg) {
      // console.log(msg)
      // if (msg.nickname) this.toChild.nickname = msg.nickname
      // console.log(msg.isLogin)
      if (msg.isLogin || msg.isLogin === false) this.toChild.userinfo.isLogin = msg.isLogin
      if (msg.phone || msg.phone === '') this.toChild.userinfo.phone = msg.phone
      if (msg.token || msg.token === '') this.toChild.userinfo.token = msg.token
      if (msg.nickname || msg.nickname === '') this.toChild.nickname = msg.nickname
      if (msg.declaration || msg.declaration === '') this.toChild.declaration = msg.declaration
      if (msg.files || msg.files === '') this.toChild.files = msg.files
    },
    /**
     * 获取活动是否结束状态
     */
    getStatu: function () {
      this.$ajax({
        url: '/index'
      })
      .then((res) => {
        var data = res.data.respbody
        for (let i = 0; i < data.length; i++) {
          const el = data[i]
          this.toChild.status.push(el.status)
        }
      })
      .catch((res) => {
        console.log(res)
        alert('服务器响应失败!')
      })
    },
    /**
     * 打开弹窗
     */
    openMask: function (index, des) {
      var arr = ['end', 'share', 'noNew']
      // this.scrollTop = this.$parent.$refs.app.scrollTop
      // this.$refs.home3.style.top = -this.scrollTop + 'px'
      // this.$refs.home3.style.position = 'fixed'
      if (index === 0) this.endDes = des
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['end', 'share', 'noNew']
      // this.$refs.home3.style.position = 'static'
      // this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
    },
    /**
     * cordova加载
     */
    cordovaLoad: function (callback) {
      // console.log(this.mask)
      // 获取登录信息
      var that = this
      navigator.uniaccount.ulbAccLogin(function (data) {
        var response = data
        if (typeof data === 'string') {
          response = JSON.parse(response)
        }
        // alert(JSON.stringify(response))
        // 如果登录方式为兴证通方式则返回
        // alert(response.respBody.userinfo.accountType)
        if (response.respBody.userinfo.accountType !== '1') {
          // that.openMask(2)
          return
        }
        var phone = response.respBody.userinfo.mobile
        var client = response.respBody.clientservice_uni_acct_id
        var token = response.respBody.logintoken
        that.toChild.userinfo.phone = phone
        that.toChild.userinfo.client = client
        that.toChild.userinfo.token = token
        that.toChild.userinfo.isLogin = true
        if (callback) callback()
        // alert('phone: ' + phone + '--xuid: ' + xuid)
      }, function (data) {
        alert('未登录')
      }, {reloginflag: '2', accounttype: '1'})
    },
    /**
     * 重新登录方法
     */
    againLogin: function (success) {
      var that = this
      navigator.uniaccount.ulbAccLogin(function (data) {
        var response = data
        if (typeof data === 'string') {
          response = JSON.parse(response)
        }
        // 如果登录方式为兴证通方式则返回
        if (response.respBody.userinfo.accountType !== '1') {
          that.openMask(2)
          return
        }
        that.closeMask(2)
        var phone = response.respBody.userinfo.mobile
        var client = response.respBody.clientservice_uni_acct_id
        var token = response.respBody.logintoken
        that.toChild.userinfo.phone = phone
        that.toChild.userinfo.client = client
        that.toChild.userinfo.token = token
        that.toChild.userinfo.isLogin = true
        if (success) success()
      }, function (data) {
        alert('登录失败')
      }, {reloginflag: '1', accounttype: '1'})
    },
    /**
     * 点击立即更新
     */
    upDate: function () {
      this.closeMask(1)
      navigator.uniaccount.jumpActivity({'linkType': '3', 'link': 'http://wap.xyzq.com.cn', 'linkParam': ''})
    },
  },
  beforeMount: function () {
    this.toChild.inUlb = Boolean(this.GLOBAL.getQueryString('inUlb'))
    if (this.toChild.inUlb) { // 如果在优理宝中使用优理宝接口
      var ulbTimer = setInterval(() => {
        if (navigator.uniaccount.ulbAccLogin) {
          this.cordovaLoad()
          clearInterval(ulbTimer)
        } else {
          console.log('1')
        }
      }, 300)
    } else { // 不在优理宝中使用本地存储
      // window.localStorage.setItem('dogYear-phone', '17621750993')
      // window.localStorage.setItem('dogYear-token', 'COIN0aa2848b99384d93')
      // 充本地存储中获取登录信息
      this.toChild.userinfo.phone = window.localStorage.getItem('dogYear-phone') || ''
      this.toChild.userinfo.token = window.localStorage.getItem('dogYear-token') || ''
      if (this.toChild.userinfo.phone) this.toChild.userinfo.isLogin = true
    }
  },
  mounted: function () {
    this.getStatu()
  }
}
</script>

<style lang="less">
html, body{
  height: 100%;
  ::-webkit-scrollbar {/*隐藏滚轮*/
    display: none;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
#app {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: #FFD5B1;
  background: -webkit-linear-gradient(#D42726, #F24233, #D42726); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#D42726, #F24233, #D42726); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#D42726, #F24233, #D42726); /* Firefox 3.6 - 15 */
  background: linear-gradient(#D42726, #F24233, #D42726); /* 标准的语法 */
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
    .noNew{
      .container{
        width: 5.513889rem; /* 794px */
        /* height: 2.222222rem; */ /* 320px */
        background-color: #fff;
        border-radius: 0.173611rem; /* 25px */
        background-color: #fff;
        position: relative;
        .top{
          padding: 0.451389rem 0; /* 65px */
          line-height: 0.395833rem; /* 57px */
          color: #666;
          font-size: 0.319444rem; /* 46px */
          text-align: center;
          border-bottom: 1px solid #efefef;
        }
        .bottom{
          a{
            float: left;
            display: block;
            text-align: center;
            font-size: 0.319444rem; /* 46px */
            height: 0.902778rem; /* 130px */
            line-height: 0.902778rem; /* 130px */
            width: 50%;
            color: #666;
            &:first-child{
              border-right: 1px solid #efefef;
              box-sizing: border-box;
            }
          }
        }
        .close{
          width: .486111rem; /* 70 */
          height: .486111rem; /* 70 */
          line-height: .486111rem; /* 70 */
          position: absolute;
          font-size: .347222rem; /* 100 */
          top: 0;
          right: 0;
          text-align: cneter;
        }
      }
    }
    .end{
      .container{
        width: 6.152778rem; /* 886 */
        height: 5.388889rem; /* 776 */
        background-image: url("./assets/Pop - up window_Activity (2).png");
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
    .share{
      .container{
        width: 100%;
        height: 100%;
        position: relative;
        .img{
          width: 3.222222rem; /* 464 */
          height: 3.368056rem; /* 485 */
          position: absolute;
          right: .347222rem; /* 50 */
          top: .347222rem; /* 50 */
        }
      }
    }
  }
}
</style>
