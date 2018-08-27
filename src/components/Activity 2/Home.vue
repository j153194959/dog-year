<template>
  <div class="Home" ref="home">
    <header>
      <img src="../../assets/Main vision.png" alt="">
      <div @click="openMask(1)">活动规则</div>
      <div @click="share">分享</div>
    </header>
    <main>
      <div @click="goMeasuring" v-bind:class="['title', isTest ? 'isTest' : 'noTest']"></div>
      <div class="show">
        <h3 v-if="!isTest" class="noTest">
          <div></div>
        </h3>
        <h3 v-if="isTest" v-bind:class="['isTest', current ? 'current2' : 'current1']">
          <div @click="tab(0)"></div><div @click="tab(1)"></div>
        </h3>
        <div class="container">
          <div class="picture_top"><img src="../../assets/icon_On axis.png" alt=""></div>
          <div class="picture_bottom"><img src="../../assets/icon_Under the shaft.png" alt=""></div>
          <div class="ul">
            <ul v-if="!current" class="left clearfix">
              <li v-for="(value, index) in dogs" :key="index">
                <div @click="openMask(3, value.image)">
                  <div class="img"><img v-bind:src=value.image alt=""></div>
                  <div class="crown"><img src="../../assets/icon_crown.png" alt=""></div>
                  <div class="name">{{value.nickname}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="current" class="right">
            <div v-if="haveRecord" class="haveRecord">
              <div v-if="childData.userinfo.isLogin" class="login">
                <div>{{numDeal(childData.userinfo.phone)}}</div>
                <a @click="logOut" href="javascript:void(0)">注销</a>
              </div>
              <ul>
                <li v-for="(value, index) in myDogs" :key="index">
                  <div class="img">
                    <div class="img"><img v-bind:src=value.image alt=""></div>
                    <div class="crown"><img src="../../assets/icon_crown.png" alt=""></div>
                  </div>
                  <div class="description">
                    <div><img src="../../assets/icon_Rope.png" alt=""></div>
                    <h4>{{value.nickname}}</h4>
                    <!-- <p>人往往懦弱而爱抱歉：他不敢直说“我想”“我是”，而是援引一些圣人智者的话语；面对一片草叶或一朵玫瑰。</p> -->
                    <p>{{value.description}}</p>
                  </div>
                </li>
              </ul>
              <a v-if="!isThree" @click="goJoin" href="javascript:void(0)"><img src="../../assets/btn_Competition.png" alt=""></a>
            </div>
            <div v-if="!haveRecord" class="noRecord">
              <div class="img"><img src="../../assets/icon_404.png" alt=""></div>
              <div class="go">
                <a @click="goJoin" href="javascript:void(0)"><img src="../../assets/btn_dogSelection.png" alt=""></a>
                <i @click="currentHook = !currentHook" v-bind:class="[currentHook ? 'current' : '']"></i> <span>阅读并同意<a @click="openMask(0)" href="javascript:void(0)">《免责声明》</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div><img src="../../assets/icon_UEDlogo.png" alt=""></div>
    </footer>
    <!-- 弹窗 -->
    <div class="pop-ups">
      <!-- 免责声明 -->
      <transition name="fade">
        <div v-if="mask.statement" class="supernatant statement">
          <div class="container">
            <div @click="closeMask(0)" class="close">
              <img src="../../assets/icon_close.png" alt="">
            </div>
            <p>
              <span>1.</span>客户需确保照片版权归属自身，并同意照片接受评选，接受我司将其用于活动宣传使用。</p>
            <p>
              <span>2.</span>用户参与“十大旺财狗”评选活动，即视为同意以上活动规则和免责声明。</p>
            <p>
              <span>3.</span>本次活动最终解释权归兴业证券股份有限公司所有，如有任何疑问，请致电兴业证券官方热线95562。</p>
          </div>
        </div>
      </transition>
      <!-- 活动规则 -->
      <transition name="fade">
        <div v-if="mask.rule" class="supernatant rule">
          <div class="container">
            <div @click="closeMask(1)" class="close">
              <img src="../../assets/icon_close.png" alt="">
            </div>
            <div class="context">
              <p>
                <span>1.</span><strong>活动时间：</strong>2018/2/12-2018/2/27</p>
              <p>
                <span>2.</span><strong>活动玩法：</strong><br>
                测财运：活动期间，用户可以在活动页上传爱犬的昵称和照片，后台将帮助您测出2018年好运值；<br>
                评选“十大旺财狗”：单个用户有最多3次机会提交爱犬照片评选最受欢迎十大旺财狗。
              </p>
              <p>
                <span>3.</span>活动结束后，入选<span>“十大旺财狗”</span>照片的主人，将收到一份神秘礼物；<br>
                兴业证券工作人员将在评选结果出炉后14个工作日内主动联系客户发放礼物。</p>
              <p>
                <span>4.</span><strong>免责声明：</strong>客户需确保照片版权归属自身，并且同意兴业证券将照片用于本活动宣传使用。</p>
              <p>
                <span>5.</span>客户参与活动，即视为同意以上活动规则和免责声明。</p>
              <p>
                <span>6.</span>本次活动最终解释权归兴业证券股份有限公司所有，如有任何疑问，请致电兴业证券官方热线95562</p>
            </div>
          </div>
        </div>
      </transition>
      <!-- 放大图片 -->
      <transition name="fade">
        <div v-if="mask.enlarge" @click="closeMask(3)" class="supernatant enlarge">
          <div class="container">
            <img v-bind:src=clickImg alt="">
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // isWechat: false, // 是否在微信页面
      isTest: true, // 是否有测财运
      current: 0, // tab栏选中 0 为左边 1 为右边
      haveRecord: false, // 是否有参赛纪录
      currentHook: true, // 勾是否选中
      isThree: false, // 是否3次全参加
      clickImg: '', // 被点击的图片的src
      isEnd: false, // 活动是否已结束
      isApp: false, // 是否在app
      mask: {
        statement: false, // 免责声明弹窗是否显示
        rule: false, // 免责声明弹窗是否显示
        enlarge: false // 放大图片弹窗是否显示
      },
      imgBaseUrl: 'https://static.xyzq.cn/activity/dogs-images/', // 照片墙公共路径
      dogs: [ // 照片墙
        // {
        //   'nickname': '测测', // 昵称
        //   'image': 'lksdlasdlk' // 图片
        // }
      ],
      myDogs: [ // 参赛纪录
        // {
        //   'nickname': '哈哈', // 昵称
        //   'description': '参赛宣言', // 参赛宣言
        //   'image': '1516261081370892722.jpg' // 图片
        // }
      ]
    }
  },
  props: ['childData', 'commonMask', 'againLogin', 'cordovaLoad'], // 接收父组件的值
  methods: {
    /**
     * 点击tab栏
     */
    tab: function (type) {
      this.current = type
    },
    /**
     * 打开弹窗
     */
    openMask: function (index, img) {
      var arr = ['statement', 'rule', 'share', 'enlarge', 'end']
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.home.style.top = -this.scrollTop + 'px'
      // console.log(this.$parent.$refs.app.scrollTop)
      this.$refs.home.style.position = 'fixed'
      if (index === 3) {
        this.clickImg = img
      }
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['statement', 'rule', 'share', 'enlarge', 'end']
      this.$refs.home.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
    },
    /**
     * 点击注销
     */
    logOut: function () {
      if (this.childData.inUlb) { // 如果在优理宝中
        // 调用app接口注销帐号
        navigator.uniaccount.ulbAccLogout({
          accounttype: 1
        })
      } else { // 不在优理宝中 清除缓存
        window.localStorage.removeItem('dogYear-phone')
        window.localStorage.removeItem('dogYear-token')
      }
      this.myDogs = []
      this.haveRecord = false
      this.isThree = false
      // 把数据传递出去
      this.$emit('transferUser', {
        isLogin: false,
        phone: '',
        token: '',
        nickname: '',
        declaration: '',
        files: ''
      })
    },
    /**
     * 跳转到测财运
     */
    goMeasuring: function () {
      if (this.isTest) {
        if (this.isEnd) {
          this.commonMask(0, '抱歉，活动已结束！')
        } else {
          window.location.href = '#/Measuring'
        }
      }
    },
    /**
     * 获取数据
     */
    getData: function () {
      this.$ajax({
        url: '/dailyDog'
      })
      .then((res) => {
        // console.log(res.data)
        const Data = res.data.respbody
        // alert(JSON.stringify(Data))
        // 是否出结果
        if (Data.isReach) this.isTest = false
        // 照片墙
        for (let i = 0; i < Data.dogs.length; i++) {
          const el = Data.dogs[i]
          const obj = {}
          obj.nickname = el.nickname
          obj.image = this.imgBaseUrl + el.image
          this.dogs.push(obj)
        }
      })
    },
    /**
     * 参赛纪录数据
     */
    getRecordData: function () {
      // console.log(this.mask)
      //var params = new URLSearchParams()
      var params = new FormData()
      params.append('phone', this.childData.userinfo.phone)
      params.append('Token', this.childData.userinfo.token)
      params.append('Client', this.childData.userinfo.phone)
      if (this.childData.inUlb) params.append('isApp', '1')
      this.$ajax({
        method: 'post',
        url: '/myDog',
        data: params
      })
      .then((res) => {
        const Data = res.data.respbody
        // alert('phone: ' + this.childData.userinfo.phone + '---Token: ' + this.childData.userinfo.token + '---Client: ' + this.childData.userinfo.phone)
        // alert(JSON.stringify(res.data))
        if (Data && Data.length > 0) {
          this.myDogs = []
          for (let i = 0; i < Data.length; i++) {
            const el = Data[i]
            const obj = {}
            obj.nickname = el.nickname
            obj.description = el.description
            obj.image = this.imgBaseUrl + el.image
            this.myDogs.push(obj)
          }
          this.isThree = this.myDogs.length < 3 ? 0 : true
          this.haveRecord = true
        }
        // 照片墙
        // for (let i = 0; i < Data.dogs.length; i++) {
        //   const el = Data.dogs[i]
        //   const obj = {}
        //   obj.nickname = el.nickname
        //   obj.image = this.imgBaseUrl + el.image
        //   this.dogs.push(obj)
        // }
      })
    },
    /**
     * 手机号码处理
     */
    numDeal: function (phone) {
      var str = phone.substr(0, 3) + '****' + phone.substr(7)
      return str
    },
    /**
     * 点击参加
     */
    goJoin: function () {
      // alert(this.childData.userinfo.isLogin)
      if (this.isEnd) { // 如果活动已结束
        this.commonMask(0, '抱歉，活动已结束！')
      } else if (!this.currentHook) { // 如果未勾选免责声明
        alert('请勾选免责声明!')
      } else if (!this.childData.userinfo.isLogin && this.childData.inUlb) { // 如果未登录则跳登录框
        this.againLogin(this.getRecordData)
      } else {
        window.location.href = '#/Selection'
      }
    },
    /**
     * 点击分享
     */
    share: function () {
      if (this.GLOBAL.isWeixin()) {
        this.commonMask(1)
      } else if (this.childData.inUlb) {
        navigator.uniaccount.ulbShare('兴“汪”发达测财运', 'https://static.xyzq.cn/activity/dog-year/static/images/activity2-shareIcon.png', '兴业证券邀请您携带爱犬测出2018年财运值~', 'https://static.xyzq.cn/activity/dog-year/index.html#/')
      }
    },
    /**
     * 设置微信分享
     */
    setWeixinShare: function () {
      var SHARE_TITLE = '兴“汪”发达测财运'
      var SHARE_DESC = '兴业证券邀请您携带爱犬测出2018年财运值~'
      var SHARE_URL = 'https://static.xyzq.cn/activity/dog-year/index.html#/' // 必须是对的地址
      var SHARE_IMG = 'https://static.xyzq.cn/activity/dog-year/static/images/activity2-shareIcon.png'

      var appid = ''
      var timestamp = ''
      var noncestr = ''
      var signature = ''
      var currentDomain = window.location.href.split(/\?|\#/)
      var replaceDomain=''
      //过滤?后面的，不能过滤#后面的
      
      if (currentDomain.length == 3)
      {
        replaceDomain=currentDomain[0] + '#' + currentDomain[2];
      }
      else if (currentDomain.length == 2)
      {
        replaceDomain=currentDomain[0] + '#' + currentDomain[1];
      }
      else
      {
        replaceDomain=currentDomain[0];   
      }
      history.replaceState('', document.title, replaceDomain);
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
          alert('wx.error'+res.errMsg)
        })
      })
    },
    /**
     * 获取活动是否结束状态
     */
    getStatu: function () {
      var timer = setInterval(() => {
        if (this.childData.status.length > 0) {
          clearInterval(timer)
          if (this.childData.status[1] === 2) this.isEnd = true
        } else {
          console.log('1')
        }
      }, 300)
    }
  },
  mounted: function () {
    // console.log(window.location.href)
    // 活动二主页 埋点
    if (this.childData.inUlb) { // 优理宝APP_狗年春节_测财运主页
      setTimeout(() => {
        TDAPP.onEvent("ylbapp_dogyear_fortune","",{tel: this.childData.userinfo.phone})
      }, 500)
    } else if (this.GLOBAL.isWeixin()){ // 微信_狗年春节_测财运主页
      TDAPP.onEvent("xyzqwx_dogyear_fortune","",{tel: ''})
    }
    // this.cordovaLoad(this.getRecordData)
    if (this.childData.inUlb) { // 如果在优理宝中
      this.getData()
      var ulbTimer = setInterval(() => {
        if (navigator.uniaccount.setTitleBar) {
          // 修改title
          navigator.uniaccount.setTitleBar({title: '兴“汪”发达测财运'})
          this.cordovaLoad(this.getRecordData)
          clearInterval(ulbTimer)
        } else {
          console.log('1')
        }
      }, 300)
    } else {
      if (this.GLOBAL.isWeixin()) { // 如果在微信页面
        // 加载微信分享文件
        window.onload = this.setWeixinShare
      }
      this.getData()
      if (this.childData.userinfo.isLogin) { // 如果已登录
        // 获取参赛数据
        this.getRecordData()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Home{
  background: url('../../assets/cloud.png') repeat-y;
  background-size: contain;
  position: relative;
  header{
    width: 100%;
    padding-top: .243056rem; /* 35 */
    position: relative;
    div{
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
      &:last-child{
        top: .972222rem; /* 140 */
      }
    }
  }
  main{
    > .title{
      margin: .569444rem auto .541667rem; /* 82 78 */
      background-size: contain;
    }
    > .isTest{
      width: 4.4375rem; /* 639 */
      height: 1.472222rem; /* 212 */
      background-image: url('../../assets/btn_Fortune.png');
      background-repeat: no-repeat;
    }
    > .noTest{
      width: 5.125rem; /* 738 */
      height: .986111rem; /* 142 */
      background-image: url('../../assets/icon_Title.png');
      background-repeat: no-repeat;
    }
    > .show{
      width: 7.298611rem; /* 1051 */
      margin: 0 auto;
      .noTest{
        text-align: center;
        > div{
          display: inline-block;
          width: 2.75rem; /* 396 */
          height: .868056rem; /* 125 */
          background-image: url("../../assets/btn_tendog.png");
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      .isTest{
        text-align: center;
        > div{
          display: inline-block;
          width: 2.055556rem; /* 296 */
          height: .868056rem; /* 125 */
          background-size: contain;
          background-repeat: no-repeat;
          &:last-child{
            margin-left: -.013889rem; /* 2 */
          }
        }
      }
      .current1{
        > div{
          &:first-of-type{
            background-image: url("../../assets/btn_dogphoto_click.png");
          }
          &:last-child{
            background-image: url("../../assets/btn_Entry record_Unclick.png");
          }
        }
      }
      .current2{
        > div{
          &:first-of-type{
            background-image: url("../../assets/icon_dogphoto_Unclicked.png");
          }
          &:last-child{
            background-image: url("../../assets/btn_Entry record_click.png");
          }
        }
      }
      .container{
        position: relative;
        background-image: url("../../assets/dog_claws.png");
        background-repeat: repeat-y;
        background-size: contain;
        min-height: 200px;
        width: 6.020833rem; /* 867 */
        margin: 0 auto;
        border: .041667rem solid #000; /* 6 */
        padding-bottom: .798611rem; /* 115 */
        .picture_top{
          width: 7.229167rem; /* 1041 */
          height: .972222rem; /* 140 */
          position: absolute;
          top: -.263889rem; /* 38 */
          left: 50%;
          margin-left: -3.611111rem; /* 520 */
        }
        .picture_bottom{
          width: 7.298611rem; /* 1051 */
          height: 1.020833rem; /* 147 */
          position: absolute;
          bottom: -.208333rem; /* 30 */
          left: 50%;
          margin-left: -3.652778rem; /* 526 */
        }
        > .ul{
          max-height: 6.944444rem; /* 1000 */
          overflow-y: scroll;
          margin-top: .694444rem; /* 100 */
          > .left{
            padding-bottom: .555556rem; /* 80 */
            li{
              float: left;
              width: 50%;
              &:nth-child(1), &:nth-child(2){
                > div{
                  margin-top: .347222rem;
                }
              }
              > div{
                width: 2.277778rem; /* 328 */
                height: 2.256944rem; /* 325 */
                box-sizing: border-box;
                position: relative;
                margin: 1.027778rem auto 0; /* 148 */
                > .img{
                  width: 100%;
                  height: 1.944444rem; /* 280 */
                  border: .041667rem solid #000; /* 6 */
                  border-radius: .486111rem .486111rem 0 0; /* 70 */
                  background-color: #fff;
                  display:-webkit-box;
                  display: -moz-box;
                  display: -ms-flexbox;
                  display: -webkit-flex;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                }
                .crown{
                  position: absolute;
                  width: 1.083333rem; /* 156 */
                  height: .993056rem; /* 143 */
                  top: -.451389rem;
                  left: -.361111rem;
                }
                .name{
                  position: absolute;
                  width: 2.819444rem; /* 406 */
                  height: .819444rem; /* 118 */
                  bottom: -.472222rem; /* 68 */
                  left: 50%;
                  margin-left: -1.409722rem; /* 203 */
                  background-image: url("../../assets/icon_redribbon.png");
                  background-repeat: no-repeat;
                  background-size: contain;
                  line-height: .729167rem; /* 105 */
                  color: #fff;
                  font-size: .298611rem; /* 43 */
                  text-align: center;
                }
              }
            }
          }
        }
        > .right{
          .haveRecord{
            position: relative;
            padding-top: .236111rem; /* 34 */
            .login{
              position: absolute;
              text-align: right;
              line-height: .458333rem; /* 66 */
              top: .409722rem; /* 59 */
              right: .25rem; /* 36 */
              div{
                display: inline;
                font-family: PingFang-SC-Regular;
                text-decoration: underline;
                font-size: .25rem; /* 36 */
                color: #42071d;
              }
              a{
                font-family: PingFang-SC-Regular;
                font-size: .25rem; /* 36 */
                color: #0072ff;
              }
            }
            li{
              > .img{
                width: 2.756944rem; /* 397 */
                height: 2.618056rem; /* 377 */
                box-sizing: border-box;
                position: relative;
                margin: .625rem auto 0; /* 90 */
                .img{
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  border: .041667rem solid #000; /* 6 */
                  border-radius: .486111rem .486111rem 0 0; /* 70 */
                  background-color: #fff;
                  display:-webkit-box;
                  display: -moz-box;
                  display: -ms-flexbox;
                  display: -webkit-flex;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .crown{
                  position: absolute;
                  width: 1.569444rem; /* 226 */
                  height: 1.569444rem; /* 226 */
                  top: -.576389rem; /* 83 */
                  left: -.576389rem; /* 83 */
                }
              }
              .description{
                position: relative;
                border: .041667rem solid #452612; /* 6 */
                border-radius: .243056rem; /* 35 */
                padding: .270833rem .173611rem .361111rem .229167rem; /* 39 25 52 33 */
                width: 4.409722rem; /* 635 */
                box-sizing: border-box;
                margin: .479167rem auto 0; /* 69 */
                div{
                  position: absolute;
                  width: 2.888889rem; /* 416 */
                  height: 1.013889rem; /* 146 */
                  top: -.833333rem;
                  left: 50%;
                  margin-left: -1.444444rem; /* 208 */
                }
                h4{
                  font-family: "HappyZcool-2016";
                  font-size: .388889rem; /* 56 */
                  color: #42071d;
                  height: .347222rem; /* 50 */
                  line-height: .347222rem; /* 50 */
                  text-align: center;
                  margin-bottom: .118056rem; /* 17 */
                }
                p{
                  font-family: "HappyZcool-2016";
                  font-size: .243056rem; /* 35 */
                  letter-spacing: .034722rem; /* 5 */
                  color: #42071d;
                  line-height: .305556rem; /* 44 */
                }
              }
            }
            > a{
              display: block;
              width: 4.041667rem; /* 582 */
              height: .888889rem; /* 128 */
              margin: .458333rem auto 0;
            }
          }
          .noRecord{
            .img{
              width: 3.513889rem; /* 506 */
              height: 3.590278rem; /* 517 */
              margin: 0 auto;
            }
            .go{
              margin: .791667rem auto 0; /* 114 */
              width: 4.041667rem; /* 582 */
              font-family: PingFang-SC-Medium;
              font-size: .25rem; /* 36 */
              color: #42071d;
              > a{
                display: block;
                height: .888889rem; /* 128 */
                margin-bottom: .208333rem; /* 30 */
              }
              i{
                display: inline-block;
                width: .263889rem; /* 38 */
                height: .263889rem; /* 38 */
                vertical-align: middle;
                background-image: url("../../assets/btn_Unchecked.png");
                background-size: contain;
              }
              .current{
                background-image: url("../../assets/btn_checked.png");
              }
              span{
                vertical-align: middle;
                a{
                  color: #0072ff;
                }
              }
            }
          }
        }
      }
    }
  }
  footer{
    padding: .201389rem 0 .333333rem; /* 29 48 */
    background-color: #D52826;
    background-image: url("../../assets/small_cloud.png");
    background-size: contain;
    div{
      width: 2.375rem; /* 342 */
      height: .236111rem; /* 34 */
      margin: 0 auto;
    }
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
    }
    .statement{
      .container{
        background-image: url('../../assets/Pop - up window_Activity.png');
        background-size: 100% 100%;
        width: 6.152778rem; /* 886 */
        height: 5.798611rem; /* 835 */
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
    .rule{
      .container{
        background-image: url('../../assets/active_rule.png');
        background-size: 100% 100%;
        width: 6.152778rem; /* 886 */
        height: 8.541667rem; /* 1230 */
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
        .context{
          max-height: 5.208333rem; /* 750 */
          overflow-y: scroll;
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
            }
          }
        }
      }
    }
    .enlarge{
      .container{
        width: 100%;
      }
    }
  }
}
</style>
