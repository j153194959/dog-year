<template>
  <div class="Drawable" ref="drawable">
    <h2>大吉大利锦囊</h2>
    <ul class="clearfix">
      <li><span>1</span>个月Level2</li>
      <li><span>3</span>个月Level2</li>
      <li><span>6</span>个月Level2</li>
      <li><span>12</span>个月Level2</li>
    </ul>
    <div @click="lottery" class="get"><img src="../../assets/drawable-btn1.png" alt=""></div>
    <!-- <div @click="share" class="share"><img src="../../assets/drawable-share.png" alt=""></div> -->
    <!-- 弹窗 -->
    <div class="pop-ups">
      <!-- 锦囊 -->
      <transition name="fade">
        <div v-if="mask.tip" class="supernatant tip">
          <div class="container">
            <!-- 锦囊 -->
            <div v-if="!tip.isFund" class="jn">
              <h3>{{tip.title}}</h3>
              <div class="code">{{tip.code}}</div>
              <h4>{{tip.content}}</h4>
              <p>基金投资需谨慎，详情请阅读《基金合同》、《招募说明书》等基金法律文件。入市有风险，投资需谨慎。</p>
            </div>
            <!-- 基金 -->
            <div v-if="tip.isFund" class="fund">
              <h3>{{tip.title}}</h3>
              <div class="content">{{tip.content}}</div>
              <p>入市有风险，投资需谨慎</p>
            </div>
            <div class="go">
              更多产品详情请前往<a @click="toUPC" href="javascript:void(0)">优品城精选<i></i></a>
            </div>
            <div @click="closeMask(0)" class="close"><img src="../../assets/drawable-close.png" alt=""></div>
          </div>
        </div>
      </transition>
      <!-- 行情 -->
      <transition name="fade">
        <div v-if="mask.quotes" class="supernatant quotes">
          <div class="container">
            <!-- 获得页 -->
            <div v-if="quotes.isGet" class="get">
              <h3>恭喜您套住{{quotes.num}}个月的沪深Level2的行情!</h3>
              <p><input ref="checkbox" type="checkbox" checked="checked"> 我已阅读并同意<span @click="toProtocol">《沪深Level2行情服务协议》</span></p>
              <a @click="sure" href="javascript:void(0)">确定</a>
            </div>
            <!-- 领取页 -->
            <div v-if="!quotes.isGet" class="receive">
              <h3>{{quotes.num}}个月沪深Level2领取成功!</h3>
              <a @click="receive" href="javascript:void(0)">立即使用</a>
            </div>
            <div @click="closeMask(1)" class="close"><img src="../../assets/drawable-close.png" alt=""></div>
          </div>
        </div>
      </transition>
      <!-- 未登录 -->
      <transition name="fade">
        <div v-if="mask.unLogin" class="supernatant unLogin">
          <div class="container">
            <h3>游戏分数不足38分哦，再玩一次！</h3>
            <a href="https://static.xyzq.cn/activity/dog-year/index.html?inUlb=1#/Home3">确定</a>
            <div @click="closeMask(3)" class="close"><img src="../../assets/drawable-close.png" alt=""></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Drawable',
  data () {
    return {
      // isLogin: false, // 是否登录
      // phone: '', // 手机号
      // client: '', // client值
      // token: '', // token值
      // isLogin: true, // 是否登录
      // phone: '17621750993', // 手机号
      // client: 'ceshi', // client值
      // token: 'ceshi', // token值
      // xuid: '', // xuid值
      mask: {
        tip: false, // 锦囊弹窗是否显示
        quotes: false, // 行情弹窗是否显示
        unLogin: false // 未登录弹窗是否显示
      },
      quotes: { // 行情弹窗内容控制
        isGet: true, // 是否是 获得页
        num: 0, // 抽到的level2月数
        id: '' // 奖品id
      },
      tip: { // 锦囊弹窗内容控制
        isFund: true, // 是否是基金
        title: '', // 标题
        content: '', // 内容
        code: '' // 基金代码
      }
    }
  },
  props: ['childData', 'commonMask', 'againLogin'], // 接收父组件的值
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['tip', 'quotes', 'share', 'unLogin']
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.drawable.style.top = -this.scrollTop + 'px'
      this.$refs.drawable.style.position = 'fixed'
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['tip', 'quotes', 'share', 'unLogin']
      this.$refs.drawable.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
      if (index === 0 || index === 1) {
        // window.location.href = 'https://static.xyzq.cn/activity/dog-year/index.html?inUlb=1#/Home3'
        window.location.replace('https://static.xyzq.cn/activity/dog-year/index.html?inUlb=1#/Home3')
      }
    },
    /**
     * 点击 立即领取
     */
    lottery: function () {
      // alert('phone:' + this.phone + '---Client:' + this.client + '---Token:' + this.token)
      if (!this.childData.userinfo.isLogin) {
        this.openMask(3)
      } else {
        var isApp = ''
        if (this.childData.inUlb) isApp = 1
        this.$ajax({
          url: '/lettory',
          params: {
            phone: this.childData.userinfo.phone,
            Client: this.childData.userinfo.client,
            Token: this.childData.userinfo.token,
            isApp: isApp
          }
        })
        .then((res) => {
          const data = res.data
          console.log(data)
          // alert(JSON.stringify(data))
          if (data.resphead.respcode === '0000') { // 成功
            if (data.respbody.isTips) {
              if (data.respbody.tip.type !== 1) {
                this.tip.isFund = false
              }
              if (!data.respbody.tip.title) {
                this.tip.title = data.respbody.tip.content
                this.tip.content = ''
              } else {
                this.tip.title = data.respbody.tip.title
                this.tip.content = data.respbody.tip.content
              }
              if (data.respbody.tip.code) this.tip.code = data.respbody.tip.code
              this.openMask(0)
            } else {
              this.quotes.num = data.respbody.prize.substr(7, 1)
              this.quotes.id = data.respbody.id
              this.quotes.isGet = true
              this.openMask(1)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          alertNew('服务器响应失败！')
        })
      }
    },
    /**
     * 点击 立即使用
     */
    receive: function () {
      // 跳转至行情模块
      navigator.uniaccount.jumpActivity({linkType: 1, link: 4})
    },
    /**
     * 点击 确定
     */
    sure: function () {
      if (this.$refs.checkbox.checked) {
        this.$ajax({
          url: '/receive',
          params: {
            id: this.quotes.id,
            xuid: this.childData.userinfo.client
          }
        })
        .then((res) => {
          const data = res.data
          console.log(data)
          // alert(JSON.stringify(data))
          if (data.resphead.respcode === '0000') { // 成功
            this.quotes.isGet = false
          } else {
            this.alertNew('领取失败')
          }
        })
        .catch((err) => {
          console.log(err)
          this.alertNew('服务器响应失败！')
        })
      } else {
        this.alertNew('请勾选行情服务协议')
      }
    },

    /**
     * 点击优品城精选
     */
    toUPC: function () {
      // 跳转到优品城
      navigator.uniaccount.jumpActivity({linkType: 1, link: 15})
    },
    /**
     * 点击协议
     */
    toProtocol: function () {
      window.location.href = 'https://static.xyzq.cn/common/protocol/level2/1.0.0/1/protocol.html'
    },
    alertNew: function(name){
      const iframe = document.createElement('IFRAME');
      iframe.style.display = 'none';
      iframe.setAttribute('src', 'data:text/plain,');
      document.documentElement.appendChild(iframe);
      window.frames[0].window.alert(name);
      iframe.parentNode.removeChild(iframe);
    }
  },
  beforeMount: function () {
    // 活动三领取页 埋点
    if (this.childData.inUlb) { // 优理宝APP_狗年春节_套牛抽奖
      setTimeout(() => {
        TDAPP.onEvent("ylbapp_dogyear_taoniu_draw","",{tel: this.childData.userinfo.phone})
      }, 500)
    } else if (this.GLOBAL.isWeixin()){ // 微信_狗年春节_套牛抽奖
      TDAPP.onEvent("xyzqwx_dogyear_taoniu_draw","",{tel: ''})
    }
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

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Drawable{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/drawable-bg3.png");
  background-size: 100% 100%;
  /* background-size: contain; */
  box-sizing: border-box;
  padding-top: 2.854167rem; /* 411 */
  h2{
    font-family: PingFangSC-Medium;
    font-size: .479167rem; /* 69 */
    color: #fff;
    background-image: url("../../assets/drawable-title1.png");
    background-size: 100% 100%;
    width: 4.569444rem; /* 658 */
    height: 1.201389rem; /* 173 */
    line-height: 1.118056rem; /* 161 */
    margin: 0 auto;
    text-align: center;
  }
  > ul{
    margin-top: .354167rem; /* 51 */
    padding-left: .652778rem; /* 94 */
    li{
      float: left;
      width: 2.611111rem; /* 376 */
      height: .8125rem; /* 117 */
      line-height: .694444rem; /* 100 */
      text-align: center;
      margin: .375rem 0 0 .340278rem; /* 54 49 */
      background-image: url("../../assets/drawable-title2.png");
      background-size: 100% 100%;
      font-family: PingFangSC-Medium;
      font-size: .270833rem; /* 39 */
      color: #fff;
      span{
      font-family: PingFangSC-Semibold;
      font-size: .368056rem; /* 53 */
      color: #ffec6a;
      }
    }
  }
  > .get{
    margin: .694444rem auto 0; /* 100 */
    width: 4.666667rem; /* 672 */
    height: .881944rem; /* 127 */
  }
  > .share{
    position: absolute;
    bottom: .798611rem; /* 115 */
    left: 50%;
    margin-left: -1.013889rem; /* 146 */
    width: 2.027778rem; /* 292 */
    height: 1.131944rem; /* 163 */
  }
  .pop-ups{
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
      .container{
        .close{
          width: .569444rem; /* 82 */
          height: .569444rem; /* 82 */
          position: absolute;
          top: -.680556rem; /* 98 */
          right: -.333333rem; /* 48 */
        }
      }
    }
    .tip{
      .container{
        width: 6.638889rem; /* 956 */
        height: 7.180556rem; /* 1034 */
        background-image: url("../../assets/drawable-bg2.png");
        background-size: 100% 100%;
        box-sizing: border-box;
        padding: 3.375rem .791667rem 0 .680556rem; /* 486 114 0 98 */
        text-align: center;
        color: #B70400;
        position: relative;
        h3{
          line-height: .555556rem; /* 80 */
          font-size: .361111rem; /* 52 */
          font-family: "PingFang-SC-Regular";
          border-bottom: .027778rem solid #F8E4CC; /* 4 */
        }
        .content{
          width: 85%;
          margin: .208333rem auto; /* 50 */
        }
        .code{
          font-size: .263889rem; /* 38 */
          line-height: .652778rem; /* 94 */
        }
        h4{
          font-size: .375rem; /* 54 */
          margin-bottom: .381944rem; /* 55 */
        }
        p{
          position: absolute;
          bottom: 1.111111rem; /* 160 */
          left: 50%;
          transform: translateX(-50%);
          line-height: .236111rem; /* 34 */
          color: #80786D;
          font-size: .180556rem; /* 26 */
          width: 75%;
        }
        .go{
          position: absolute;
          bottom: .173611rem; /* 25 */
          color: #fff;
          font-size: .3125rem; /* 45 */
          a{
            color: #7ECAFC;
            i{
              width: .305556rem; /* 44 */
              height: .236111rem; /* 34 */
              background-image: url("../../assets/drawable-jt.png");
              background-size: 100% 100%;
              vertical-align: middle;
              display: inline-block;
            }
          }
        }
      }
    }
    .quotes{
      .container{
        width: 6.638889rem; /* 956 */
        height: 5.736111rem; /* 826 */
        background-image: url("../../assets/drawable-bg1.png");
        background-size: 100% 100%;
        box-sizing: border-box;
        position: relative;
        text-align: center;
        .get{
          h3{
            padding-top: 3.243056rem; /* 467 */
            line-height: .708333rem; /* 102 */
            height: .708333rem; /* 102 */
            color: #B40001;
            font-size: .305556rem; /* 44 */
          }
          p{
            font-size: .208333rem; /* 30 */
            color: #4A433B;
            margin-bottom: .347222rem; /* 50 */
            input{
              vertical-align: middle;
            }
            span{
              color: rgb(102, 130, 240);
            }
          }
        }
        a{
          display: block;
          width: 4.027778rem; /* 580 */
          height: .583333rem; /* 84 */
          line-height: .583333rem; /* 84 */
          color: #FBF3E8;
          border-radius: .284722rem; /* 41 */
          background-color: #DF312A;
          margin: 0 auto;
          font-size: .333333rem;
        }
        .receive{
          h3{
            padding-top: 2.972222rem; /* 428 */
            line-height: 1.631944rem; /* 235 */
            font-size: .333333rem; /* 48 */
            color: #BB0000;
          }
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
    .unLogin{
      .container{
        width: 6.638889rem; /* 956 */
        height: 5.736111rem; /* 826 */
        background-image: url("../../assets/drawable-bg1.png");
        background-size: 100% 100%;
        box-sizing: border-box;
        position: relative;
        text-align: center;
        h3{
          padding-top: 2.972222rem; /* 428 */
          line-height: 1.631944rem; /* 235 */
          font-size: .333333rem; /* 48 */
          color: #BB0000;
        }
        a{
          display: block;
          width: 4.027778rem; /* 580 */
          height: .583333rem; /* 84 */
          line-height: .583333rem; /* 84 */
          color: #FBF3E8;
          border-radius: .284722rem; /* 41 */
          background-color: #DF312A;
          margin: 0 auto;
          font-size: .333333rem;
        }
      }
    }
  }
}
</style>
