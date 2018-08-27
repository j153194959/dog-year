<template>
  <div class="Selection" ref="selection">
    <div v-if="!childData.inUlb">
      <!-- 未登录 -->
      <div v-if="!childData.userinfo.isLogin">
        <div class="input">
          <div>
            <div class="left">手机号码:</div>
            <div class="text"><input v-model="phone" type="tel" maxlength="11"></div>
          </div>
          <div>
            <div class="left">验证码：</div>
            <!-- <a href="javascript:void(0)"></a> -->
            <a @click="getCode" v-bind:class="[clicked ? 'clicked' : '']" href="javascript:void(0)"><i v-if="clicked">获取验证码<span>{{time}}s</span></i></a>
            <div class="text"><input v-model="code" type="number"></div>
          </div>
        </div>
        <div class="description">
          点击“提交”，即表示您已同意<a href="https://estock.xyzq.com.cn/views/hallwap/platform/app/serviceterm.html">《兴证通用户服务条款》</a>
        </div>
      </div>
      <!-- 已登录 -->
      <div v-if="childData.userinfo.isLogin" class="has-logged">
        <span>{{numDeal(childData.userinfo.phone)}}</span> <a @click="logOut" href="javascript:void(0)"> 注销</a>
      </div>
    </div>
    <div v-if="childData.inUlb" class="visibility"></div>
    <div class="file">
      <input type="file" ref="m_upload" accept="image/*" @change="handleFiles(0)">
      <div v-if="childData.userinfo.isLogin || childData.inUlb" class="crown"><img src="../../assets/upload_photo.png" alt=""></div>
      <div class="img" ref="m_upload_box"></div>
    </div>
    <div v-if="childData.inUlb" class="prompt"><span>温馨提示：</span>请事先开启APP使用照片/相机权限</div>
    <div class="others">
      <div>
        <div class="left">爱犬昵称:</div>
        <div class="right"><i>*</i> 必填项</div>
        <div class="text"><input v-model="txt1" type="text" placeholder="最多10字符" maxlength="10"></div>
      </div>
      <div>
        <div class="left">宣言:</div>
        <div class="right">选填项</div>
        <div class="text"><input v-model="txt2" type="text" placeholder="最多50字符" maxlength="50"></div>
      </div>
    </div>
    <a v-show="isChanged" @click="modify" href="javascript:void(0)"><img src="../../assets/btn_Modify the picture.png" alt=""></a>
    <a @click="submit" href="javascript:void(0)"><img src="../../assets/btn_Submit.png" alt=""></a>
    <!-- 弹窗 -->
    <div class="pop-ups">
      <!-- 输入框结果提示 -->
      <transition name="fade">
        <div v-if="mask.prompt" class="supernatant prompt">
          <div class="container">
            <p>{{mask.promptTxt1}}<br>{{mask.promptTxt2}}</p>
            <a @click="closeMask(0)" href="javascript:void(0)"><img src="../../assets/btn_confirm_pop.png" alt=""></a>
          </div>
        </div>
      </transition>
      <!-- 提交成功提示 -->
      <transition name="fade">
        <div v-if="success" class="success">
          <img src="../../assets/layer_complete.png" alt="">
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Selection',
  data () {
    return {
      phone: '', // 输入框电话号码
      code: '', // 输入框验证码
      txt1: '', // 输入框昵称
      txt2: '', // 输入框宣言
      clicked: false, // 是否点击获取验证码
      time: 60, // 倒计时时间
      isChanged: false, // 是否上传过照片
      token: '', // token值
      files: {}, // 上传图片文件
      isSubmitOk: true, // 是否提交成功 (节流阀，防止连续提交)
      mask: {
        prompt: false, // 弹窗是否显示
        promptTxt1: '您忘记上传狗狗照片了', // 弹窗提示语1
        promptTxt2: '' // 弹窗提示语2
      },
      success: false // 是否提交成功
    }
  },
  props: ['childData'], // 接收父组件的值
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['prompt']
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.selection.style.top = -this.scrollTop + 'px'
      // console.log(this.$parent.$refs.app.scrollTop)
      this.$refs.selection.style.position = 'fixed'
      this.mask[arr[index]] = true
    },
    /**
     * 打开弹窗
     */
    closeMask: function (index) {
      var arr = ['prompt']
      this.$refs.selection.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
    },
    /**
     * 上传图片框发生变化
     */
    handleFiles: function (type) {
      window.URL = window.URL || window.webkitURL
      var fileList = this.$refs.m_upload
      var box = this.$refs.m_upload_box
      if (type) {
        var files = this.files
      } else {
        var files = fileList.files
        this.files = ''
      }
      var img = new Image()
      var html = ''
      if (window.URL) {
        // File API
        // alert(files[0].name + "," + files[0].size + " bytes")
        img.src = window.URL.createObjectURL(files[0]) // 创建一个object URL，并不是你的本地路径
        img.width = 200
        img.onload = function (e) {
          window.URL.revokeObjectURL(this.src) // 图片加载后，释放object URL
        }
        html = '<img src=' + img.src + ' >'
        box.innerHTML = html
      } else if (window.FileReader) {
        // opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
        var reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = function (e) {
          // alert(files[0].name + "," + e.total + " bytes")
          img.src = this.result
          img.width = 200
          html = '<img src=' + img.src + ' >'
          box.innerHTML = html
        }
      } else {
        // ie
        fileList.select()
        fileList.blur()
        var nfile = document.selection.createRange().text
        document.selection.empty()
        img.src = nfile
        img.width = 200
        img.onload = function () {
          // alert(nfile + "," + img.fileSize + " bytes")
        }
        html = '<img src=' + img.src + ' >'
        box.innerHTML = html
      }
      this.isChanged = true
    },
    /**
     * 点击修改
     */
    modify: function () {
      this.iosClick(this.$refs.m_upload)
    },
    /**
     * 点击提交
     */
    submit: function () {
      if (this.childData.userinfo.isLogin) {
        this.phone = this.childData.userinfo.phone
        this.token = this.childData.userinfo.token
      }
      this.process(this.childData.userinfo.isLogin)
    },
    /**
     * 点击 获取验证码
     */
    getCode: function () {
      if (this.clicked) return
      if (this.phone) {
        if (!this.GLOBAL.pattern(this.phone)) {
          this.mask.promptTxt1 = '手机号码无效'
          this.mask.promptTxt2 = ''
          this.mask.prompt = true
          this.phone = ''
          return
        }
        this.$ajax({
          url: '/sendSms',
          params: {
            phone: this.phone
          }
        })
        .then((res) => {
          var data = res.data.resphead
          console.log(data)
          if (data.respcode === '1002') { // 失败
            // alert('短信发送失败')
            this.mask.promptTxt1 = '短信发送失败'
            this.mask.promptTxt2 = ''
            this.mask.prompt = true
            this.phone = ''
          } else if (data.respcode === '0000') { // 成功
            this.clicked = true
            this.time = 60
            var that = this
            var timer = setInterval(function () {
              that.time--
              if (that.time <= 0) {
                clearInterval(timer)
                that.clicked = false
              }
            }, 1000)
          }
        })
        .catch((err) => {
          console.log(err)
          alert('服务器出现异常')
        })
      }
    },
    /**
     * 上传照片
     */
    upLoadPhoto: function () {
      if (!this.isSubmitOk) return
      this.isSubmitOk = false
      if (this.files) {
        var file = this.files[0]
      } else {
        var file = this.$refs.m_upload.files[0]
      }
      var form = new FormData() // 创建一个FormData对象
      form.append('file', file)
      form.append('nickname', this.txt1)
      form.append('phone', this.phone)
      form.append('des', this.txt2)
      form.append('Token', this.token)
      form.append('Client', this.phone)
      if (this.childData.inUlb) form.append('isApp', '1')
      // console.log('nickname: ' + this.txt1 + '---phone: ' + this.phone + '---des: ' + this.txt2 + '---Token: ' + this.token + '---Client: ' + this.phone + '---isApp: ' + this.childData.inUlb)
      this.$ajax({
        method: 'post',
        url: '/upload',
        data: form
      })
      .then((res) => {
        var data = res.data.resphead
        console.log('接口1: ' + JSON.stringify(data))
        if (data.respcode === '0000') { // 上传成功
          this.success = true
          this.$emit('transferUser', {
            nickname: '',
            declaration: '',
            files: ''
          })
          // var that = this
          setTimeout(() => {
            this.success = false
          }, 2000)
        } else if (data.respcode === '1004') { // 次数不够
          this.mask.promptTxt1 = '感谢积极参选！'
          this.mask.promptTxt2 = '您已参选3次了~'
          this.mask.prompt = true
        } else if (data.respcode === '1005') { // 上传失败
          this.mask.promptTxt1 = '照片上传失败'
          this.mask.prompt = true
        } else if (data.respcode === '1111') {
          this.mask.promptTxt1 = '敏感词无法提交哦！'
          this.mask.prompt = true
        } else if (data.respcode === '9999') { // 上传失败
          this.mask.promptTxt1 = '登录超时！'
          this.mask.prompt = true
          this.logOut()
          // this.isLogin = false
        } else {
          this.mask.promptTxt1 = '未知错误'
          this.mask.prompt = true
        }
        this.isSubmitOk = true
      })
      .catch((err) => {
        console.log(err)
        this.mask.promptTxt1 = '服务器响应失败！'
        this.mask.prompt = true
        this.isSubmitOk = true
      })
    },
    /**
     * 昵称验证
     */
    checkNick: function () {
      // alert(1)
      //var params = new URLSearchParams()
      var params = new FormData()
      params.append('word', this.txt1)
      this.$ajax({
        method: 'post',
        url: '/sensitiveWordCheck',
        data: params
      })
      .then((res) => {
        const data = res.data.resphead
        // console.log(data)
        if (data.respcode === '0000') { // 验证通过
          // 跳转页面并把昵称传递出去
        } else if (data.respcode === '1111') {
          this.mask.promptTxt1 = '敏感词无法提交哦！'
          this.mask.prompt = true
        } else {
          this.mask.promptTxt1 = '出现未知错误'
          this.mask.prompt = true
        }
      })
      .catch((err) => {
        console.log(err)
        this.mask.promptTxt1 = '服务器响应失败！'
        this.mask.prompt = true
      })
    },
    /**
     * 验证码校验
     */
    VC_verification: function (type) {
      if (!type) {
        this.$ajax({
          url: '/checkSms',
          params: {
            phone: this.phone,
            code: this.code
          }
        })
        .then((res) => {
          const data = res.data
          // console.log(data)
          console.log('接口2: ' + JSON.stringify(data))
          if (data.resphead.respcode === '0000') {
            this.token = data.respbody
            window.localStorage.setItem('dogYear-phone', this.phone)
            window.localStorage.setItem('dogYear-token', this.token)
            // 把数据传递出去
            this.$emit('transferUser', {
              isLogin: true,
              phone: this.phone,
              token: this.token
            })
            this.upLoadPhoto()
          } else if (data.resphead.respcode === '1003') {
            this.mask.promptTxt1 = '验证码校验错误'
            this.mask.prompt = true
          } else {
            this.mask.promptTxt1 = '未知错误'
            this.mask.prompt = true
          }
        })
        .catch((err) => {
          console.log(err)
          this.mask.promptTxt1 = '服务器响应失败！'
          this.mask.prompt = true
        })
      } else {
        this.upLoadPhoto()
      }
    },
    /**
     * 点击注销
     */
    logOut: function () {
      window.localStorage.removeItem('dogYear-phone')
      window.localStorage.removeItem('dogYear-token')
      this.phone = ''
      this.code = ''
      this.txt1 = ''
      this.txt2 = ''
      this.$refs.m_upload_box.innerHTML = ''
      this.isChanged = false
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
     * 提交处理
     */
    process: function (type) {
      this.mask.promptTxt2 = ''
      if (!this.phone && !type) { // 如果没有填手机号
        this.mask.promptTxt1 = '您忘记填写手机号了'
        this.mask.prompt = true
      } else if (!this.isChanged) { // 如果没有上传照片
        this.mask.promptTxt1 = '您忘记上传狗狗照片了'
        this.mask.prompt = true
      // } else if (!this.txt2) {
      //   this.mask.promptTxt1 = '您忘记填写狗狗宣言了'
      //   this.mask.prompt = true
      } else { // 昵称和验证码验证
        // 昵称验证
        if (!this.txt1) { // 如果未填写昵称
          this.mask.promptTxt1 = '您忘记填写狗狗昵称了'
          this.mask.prompt = true
          return
        } else if (this.txt1.indexOf(' ') > -1) {
          this.mask.promptTxt1 = '提交的昵称不得含有空格'
          this.mask.prompt = true
          return
        } else if (this.GLOBAL.strlen(this.txt1) > 10) {
          this.mask.promptTxt1 = '呀~狗狗昵称太长了'
          this.mask.prompt = true
          return
        } else if (this.GLOBAL.strlen(this.txt2) > 50) {
          this.mask.promptTxt1 = '呀~狗狗宣言太长了'
          this.mask.prompt = true
          return
        } else { // 填写了，验证敏感词
          this.checkNick()
        }
        // 验证码验证
        if (!this.code && !type) { // 如果未填写验证码
          this.mask.promptTxt1 = '您忘记填写验证码了'
          this.mask.prompt = true
        } else { // 填写了，验证码校验
          this.VC_verification(type)
        }
      }
    },
    /**
     * 手机号码处理
     */
    numDeal: function (phone) {
      var str = phone.substr(0, 3) + '****' + phone.substr(7)
      return str
    }
  },
  beforeMount: function () {
    // 更改页面标题
    document.getElementsByTagName('title')[0].innerHTML = '参加“十大旺财狗”评选'
    if (this.childData.inUlb) {
      var that = this
      var ulbTimer = setInterval(function () {
        if (navigator.uniaccount.ulbAccLogin) {
          navigator.uniaccount.setTitleBar({title: '参加“十大旺财狗”评选'})
          clearInterval(ulbTimer)
        } else {
          console.log('1')
        }
      }, 300)
    }
  },
  mounted: function () {
    // 活动二参赛 埋点
    if (this.childData.inUlb) { // 优理宝APP_狗年春节_测财运_评选页
      setTimeout(() => {
        TDAPP.onEvent("ylbapp_dogyear_fortune_select","",{tel: this.childData.userinfo.phone})
      }, 500)
    } else if (this.GLOBAL.isWeixin()){ // 微信_狗年春节_测财运_评选页
      TDAPP.onEvent("xyzqwx_dogyear_fortune_select","",{tel: ''})
    }
    // 获取前一个页面的数据
    this.txt1 = this.childData.nickname
    this.txt2 = this.childData.declaration
    this.files = this.childData.files
    // console.log(this.files)
    if (this.txt1) {
      this.handleFiles(1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Selection{
  width: 100%;
  min-height: 100%;
  background-image: url("../../assets/background.png");
  background-size: 100% 100%;
  .input{
    padding-top: .277778rem; /* 40 */
    > div{
      width: 6.069444rem; /* 874 */
      height: 1.159722rem; /* 167 */
      box-sizing: border-box;
      border: .069444rem solid #42071D;
      border-radius: .243056rem; /* 35 */
      margin: .208333rem auto; /* 30 */
      line-height: 1.020833rem; /* 147 */
      overflow: hidden;
      .left{
        float: left;
        height: 1.020833rem; /* 147 */
        font-family: "PingFang-SC-Bold";
        font-size: .375rem; /* 54 */
        color: #42071d;
        margin-left: .152778rem; /* 22 */
        font-weight: bold;
      }
      .text{
        width: 100%;
        height: 100%;
        height: 1.020833rem; /* 147 */
        padding-left: 1.840278rem; /* 265 */
        background-color: #fff;
        box-sizing: border-box;
        input{
          width: 100%;
          height: 100%;
          font-family: "PingFang-SC-Medium";
          font-size: .277778rem; /* 40 */
          color: #ccc;
        }
      }
      &:last-child{
        border: none;
        a{
          float: right;
          width: 2.222222rem; /* 320 */
          height: 1.041667rem; /* 150 */
          background-image: url("../../assets/btn_verifying code.png");
          background-size: 100% 100%;
          font-size: .291667rem; /* 42 */
          line-height: 1.041667rem; /* 150 */
          color: #42071D;
          text-align: center;
          font-family: "PingFang-SC-Semibold";
          font-weight: bold;
          span{
            font-size: .3125rem; /* 45 */
          }
        }
        .clicked{
          background-image: url("../../assets/btn_verifying code2.png");
        }
        .text{
          padding-left: 1.597222rem; /* 230 */
          width: 3.75rem; /* 540 */
          border: .069444rem solid #42071D;
          border-radius: .243056rem; /* 35 */
          input{
            width: 98%;
            height: .555556rem; /* 80 */
            line-height: .555556rem; /* 80 */
            margin-top: -.069444rem; /* 10 */
          }
        }
      }
    }
  }
  .description{
    height: .555556rem; /* 80 */
    line-height: .555556rem; /* 80 */
    font-family: PingFang-SC-Medium;
    font-size: .25rem; /* 36 */
    color: #fff;
    text-align: center;
    margin-top: -.347222rem; /* 50 */
    a{
      color: #00aeff;
    }
  }
  .has-logged{
    font-family: PingFang-SC-Regular;
    font-size: .25rem; /* 36 */
    line-height: .458333rem; /* 66 */
    color: #fff;
    text-align: right;
    padding: .347222rem .243056rem .347222rem 0; /* 50 35 50 */
    span{
      text-decoration: underline;
    }
    a{
      font-family: PingFang-SC-Regular;
      font-size: .25rem; /* 36 */
      color: #0072ff;
      /* text-decoration: none; */
    }
  }
  .visibility{
    height: 2.083333rem;
    visibility: hidden;
  }
  .file{
    width: 4.111111rem; /* 592 */
    height: 4.111111rem; /* 592 */
    background-image: url("../../assets/Upload photos.png");
    background-size: 100% 100%;
    margin: .069444rem auto 0; /* 10 */
    position: relative;
    .crown{
      position: absolute;
      width: 2.680556rem; /* 386 */
      height: 2.708333rem; /* 390 */
      top: -1.041667rem; /* 150 */
      left: -1.041667rem; /* 150 */
      z-index: 3;
    }
    input{
      position: absolute;
      z-index: 4;
      top: 0;
      left: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
    }
    .img{
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      width: 3.972222rem; /* 572 */
      height: 3.972222rem; /* 572 */
      margin: -1.986111rem 0 0 -1.986111rem; /* 286 */
      border-radius: .138889rem;
      overflow: hidden;
      display:-webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  > .prompt{
    margin: .409722rem 0; /* 59 */
    font-family: "PingFang-SC-Medium";
    font-size: .277778rem; /* 40 */
    color: #fff;
    text-align: center;
    span{
      color: #ffe430;
    }
  }
  > .others{
    > div{
      width: 6.208333rem; /* 894 */
      height: 1.159722rem; /* 167 */
      box-sizing: border-box;
      border: .069444rem solid #42071D;
      border-radius: .243056rem; /* 35 */
      margin: .208333rem auto; /* 60 */
      line-height: 1.020833rem; /* 147 */
      overflow: hidden;
      .left{
        float: left;
        height: 1.020833rem; /* 147 */
        font-family: "PingFang-SC-Bold";
        font-size: .375rem; /* 54 */
        color: #42071d;
        margin-left: .152778rem; /* 22 */
        font-weight: bold;
      }
      .right{
        float: right;
        height: 1.020833rem; /* 147 */
        font-family: "PingFang-SC-Bold";
        font-size: .25rem; /* 36 */
        color: #ccc;
        margin-right: .152778rem;/* 22 */
        i {
          color: #ff0000;
        }
      }
      .text{
        width: 6.055556rem; /* 872 */
        height: 1.020833rem; /* 147 */
        padding: 0 1.145833rem 0 1.875rem; /* 165 265 */
        background-color: #fff;
        box-sizing: border-box;
        input{
          width: 100%;
          height: 100%;
          font-family: "PingFang-SC-Medium";
          font-size: .277778rem; /* 40 */
          color: #ccc;
        }
      }
      &:last-child .text{
        padding-left: 1.111111rem; /* 160 */
      }
    }
  }
  > a{
    display: block;
    width: 5.777778rem; /* 832 */
    height: 1.097222rem; /* 158 */
    margin: .208333rem auto 0; /* 30 */
    &:last-of-type{
      width: 5.791667rem; /* 834 */
      height: 1.118056rem; /* 161 */
      padding-bottom: .208333rem; /* 30 */
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
    .prompt{
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
    .success{
      position: fixed;
      z-index: 5;
      width: 2.083333rem; /* 300 */
      height: 2.083333rem; /* 300 */
      top: 50%;
      left: 50%;
      margin: -1.041667rem 0 0 -1.041667rem; /* 150 */
    }
  }
}
</style>
