<template>
  <div class="Measuring" ref="measuring">
    <div class="input">
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
    <div class="file">
      <input type="file" ref="m_upload" accept="image/*" @change="handleFiles">
      <div class="crown"><img src="../../assets/upload_photo.png" alt=""></div>
      <div class="img" ref="m_upload_box"></div>
    </div>
    <div v-if="childData.inUlb" class="prompt"><span>温馨提示：</span>请事先开启APP使用照片/相机权限</div>
    <a @click="goFortune" href="javascript:void(0)"><img src="../../assets/btn_Fortune.png" alt=""></a>
    <!-- 弹窗 -->
    <div class="pop-ups">
      <transition name="fade">
        <div v-if="mask.prompt" class="supernatant prompt">
          <div class="container">
            <p>{{prompt}}</p>
            <a @click="closeMask(0)" href="javascript:void(0)"><img src="../../assets/btn_confirm_pop.png" alt=""></a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Measuring',
  data () {
    return {
      txt1: '', // 昵称
      txt2: '', // 宣言
      img: '', // 上传的图片
      prompt: '', // 弹窗提示语
      isUpload: false, // 是否上传照片
      isSubmitOk: true, // 是否提交成功 (节流阀，防止连续提交)
      mask: {
        prompt: false // 规则弹窗是否显示
      }
    }
  },
  props: ['childData', 'commonMask', 'againLogin'], // 接收父组件的值
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['prompt']
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.measuring.style.top = -this.scrollTop + 'px'
      // console.log(this.$parent.$refs.app.scrollTop)
      this.$refs.measuring.style.position = 'fixed'
      this.mask[arr[index]] = true
    },
    /**
     * 打开弹窗
     */
    closeMask: function (index) {
      var arr = ['prompt']
      this.$refs.measuring.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
    },
    /**
     * 上传图片框发生变化
     */
    handleFiles: function () {
      window.URL = window.URL || window.webkitURL
      var fileList = this.$refs.m_upload
      var box = this.$refs.m_upload_box
      var files = fileList.files
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
      } else if (window.FileReader) {
        // opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
        var reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = function (e) {
          // alert(files[0].name + "," + e.total + " bytes")
          img.src = this.result
          img.width = 200
          html = '<img src=' + img.src + ' >'
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
      }
      box.innerHTML = html
      this.isUpload = true
      this.files = files
      // console.log(this.files)
    },
    /**
     * 点击测财运
     */
    goFortune: function () {
      if (!this.txt1) {
        this.prompt = '您忘记填写狗狗昵称了'
        this.openMask(0)
        return
      } else if (!this.isUpload) {
        this.prompt = '您忘记上传狗狗照片了'
        this.openMask(0)
        return
      } else if (this.txt1.indexOf(' ') > -1) {
        this.prompt = '提交的昵称不得含有空格'
        this.openMask(0)
        return
      } else if (this.GLOBAL.strlen(this.txt1) > 10) {
        this.prompt = '呀~狗狗昵称太长了'
        this.openMask(0)
        return
      } else if (this.GLOBAL.strlen(this.txt2) > 50) {
        this.prompt = '呀~狗狗宣言太长了'
        this.openMask(0)
        return
      }
      if (!this.isSubmitOk) return
      this.isSubmitOk = false
      // alert(1)
      // alert(URLSearchParams)
      //var params = new URLSearchParams()
      var params = new FormData()
      params.append('word', this.txt1)
      // alert(params)
      this.$ajax({
        method: 'post',
        url: '/sensitiveWordCheck',
        data: params
      })
      .then((res) => {
        this.isSubmitOk = true
        const data = res.data.resphead
        //alert (JSON.stringify(data))
        if (data.respcode === '0000') {
          // 跳转页面并把昵称传递出去
          this.$emit('transferUser', {
            nickname: this.txt1,
            declaration: this.txt2,
            files: this.files
          })
          window.location.href = '#/Fortune-sign'
        } else if (data.respcode === '1111') {
          this.prompt = '敏感词无法提交哦!'
          this.openMask(0)
        } else {
          this.prompt = '出现未知错误'
          this.openMask(0)
        }
      })
      .catch((err) => {
        this.isSubmitOk = true
        console.log(err)
        this.prompt = '服务器响应失败！'
        this.openMask(0)
      })
    }
  },
  beforeMount: function () {
    console.log('测财运')
    // 活动二测财运 埋点
    // if (this.childData.inUlb) {
    //   TDAPP.onEvent("dog-year/index.html?inUlb=1#/Measuring","",{})
    // } else {
    //   TDAPP.onEvent("dog-year/index.html#/Measuring","",{})
    // }
    // 更改页面标题
    document.getElementsByTagName('title')[0].innerHTML = '测财运'
    if (this.childData.inUlb) {
      var that = this
      var ulbTimer = setInterval(function () {
        if (navigator.uniaccount.ulbAccLogin) {
          navigator.uniaccount.setTitleBar({title: '测财运'})
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
.Measuring{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/background.png");
  background-size: 100% 100%;
  .input{
    padding-top: .277778rem; /* 40 */
    > div{
      width: 6.208333rem; /* 894 */
      height: 1.159722rem; /* 167 */
      box-sizing: border-box;
      border: .069444rem solid #42071D;
      border-radius: .243056rem; /* 35 */
      margin: .416667rem auto; /* 60 */
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
  .file{
    width: 4.284722rem; /* 617 */
    height: 4.284722rem; /* 617 */
    background-image: url("../../assets/upload.png");
    background-size: 100% 100%;
    margin: 1.111111rem auto 0; /* 160 */
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
      width: 4.166667rem; /* 586 */
      height: 4.166667rem; /* 586 */
      margin: -2.083333rem 0 0 -2.083333rem; /* 293 */
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
  > a{
    display: block;
    width: 4.4375rem; /* 639 */
    height: 1.472222rem; /* 212 */
    margin: .708333rem auto 0; /* 102 */
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
          padding-top: 1.847222rem; /* 266 */
          height: 1.944444rem; /* 280 */
          line-height: 1.944444rem; /* 280 */
          color: #fff;
          font-size: .347222rem;
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
