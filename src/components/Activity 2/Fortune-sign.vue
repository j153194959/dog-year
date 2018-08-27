<template>
  <div class="Fortune-sign" ref="fortune">
    <div class="fortune" @click="openMask(1)">
      <div class="container">
        <p>e小兴与天生财质自带{{fortune.tsl}}特斯拉(T)<br>招财磁场的狗宝：</p>
        <h3>{{fortune.name}}</h3>
        <div>{{fortune.txt1}}<br>{{fortune.txt2}}</div>
      </div>
    </div>
    <a href="javascript:void(0)" class="save"><span>温馨提示：</span>点击图片再截屏保存</a>
    <p>
      评选十大旺财狗，奖励主人<span>神秘礼物</span><br>
      每个用户限参与评选3次
    </p>
    <a @click="join" class="join" href="javascript:void(0)"><img src="../../assets/btn_dogSelection (2).png" alt=""></a>
    <div class="statement">
      <i @click="isRead = !isRead"><em v-if="isRead"></em></i> <span>阅读并同意<a @click="openMask(0)" href="javascript:void(0)">《免责声明》</a></span>
    </div>
    <!-- 弹窗 -->
    <div class="pop-ups">
      <!-- 免责声明 -->
      <transition name="fade">
        <div v-if="mask.statement" class="supernatant rule">
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
      <!-- 放大财运签 -->
      <transition name="fade">
        <div v-if="mask.fortune" class="supernatant fortune">
          <div class="container" @click="closeMask(1)">
            <div class="box">
              <p>e小兴与天生财质自带{{fortune.tsl}}特斯拉(T)<br>招财磁场的狗宝：</p>
              <h3>{{fortune.name}}</h3>
              <div>{{fortune.txt1}}<br>{{fortune.txt2}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fortune-sign',
  data () {
    return {
      isRead: true, // 是否阅读免责声明
      mask: {
        statement: false, // 免责声明弹窗是否显示
        fortune: false // 规则弹窗是否显示
      },
      fortune: { // 财运签内容
        name: '爱喝雪碧的狗',
        tsl: 66,
        txt1: 'x个',
        txt2: '涨停板'
      }
    }
  },
  props: ['childData', 'commonMask', 'againLogin'], // 接收父组件的值
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['statement', 'fortune']
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.fortune.style.top = -this.scrollTop + 'px'
      // console.log(this.$parent.$refs.app.scrollTop)
      this.$refs.fortune.style.position = 'fixed'
      this.mask[arr[index]] = true
    },
    /**
     * 打开弹窗
     */
    closeMask: function (index) {
      var arr = ['statement', 'fortune']
      this.$refs.fortune.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
    },
    join: function () {
      if (!this.isRead) {
        alert('请勾选免责声明')
      } else if (!this.childData.userinfo.isLogin && this.childData.inUlb) { // 如果未登录则跳登录框
        this.againLogin()
      } else {
        window.location.href = '#/Selection'
      }
    }
  },
  beforeMount: function () {
    // 活动二新年签 埋点
    // if (this.childData.inUlb) {
    //   TDAPP.onEvent("dog-year/index.html?inUlb=1#/Fortune-sign","",{})
    // } else {
    //   TDAPP.onEvent("dog-year/index.html#/Fortune-sign","",{})
    // }
    // 随机设置新年签内容
    var tslArr = [88, 99, 100, 168, 188]
    this.fortune.tsl = tslArr[parseInt(Math.random() * 5)]
    var x = parseInt(Math.random() * 8 + 2)
    var txt = [
      {txt1: '中' + x, txt2: '个新股'},
      {txt1: '高抛', txt2: '低吸'},
      {txt1: '跑赢', txt2: '大盘'},
      {txt1: x + '个', txt2: '涨停板'},
      {txt1: '升职', txt2: '加薪'},
      {txt1: '满仓', txt2: '牛股'},
      {txt1: '笑傲', txt2: '股海'},
      {txt1: '股市', txt2: '大赚'}
    ]
    var txtRandom = parseInt(Math.random() * 8)
    this.fortune.txt1 = txt[txtRandom].txt1
    this.fortune.txt2 = txt[txtRandom].txt2
    // 从父组件中获得昵称并赋值
    console.log(this.childData)
    this.fortune.name = this.childData.nickname
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
.Fortune-sign{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/background.png");
  background-size: 100% 100%;
  box-sizing: border-box;
  padding-top: .555556rem; /* 80 */
  > .fortune{
    width: 6.201389rem; /* 893 */
    height: 6.201389rem; /* 893 */
    margin: 0 auto;
    box-sizing: border-box;
    border: .069444rem solid #42071D;
    border-radius: .243056rem; /* 35 */
    position: relative;
    overflow: hidden;
    .container{
      width: 7.5rem; /* 1080 */
      height: 13.333333rem; /* 1920 */
      width: 100%;
      height: 100%;
      background-image: url("../../assets/fortune_img.png");
      background-size: cover;
      background-repeat: no-repeat;
      box-sizing: border-box;
      padding-top: 3.395833rem; /* 489 */
      text-align: center;
      font-family: PingFangSC-Regular;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: scale(.7, .7) translate(-50%, -50%);
      -ms-transform: scale(.7, .7) translate(-50%, -50%);
      -moz-transform: scale(.7, .7) translate(-50%, -50%);
      -webkit-transform: scale(.7, .7) translate(-50%, -50%);
      -o-transform: scale(.7, .7) translate(-50%, -50%);
      transform-origin: 0% 0%;
      -ms-transform-origin: 0% 0%;       /* IE 9 */
      -webkit-transform-origin: 0% 0%;   /* Safari 和 Chrome */
      -moz-transform-origin: 0% 0%;      /* Firefox */
      -o-transform-origin: 0% 0%;        /* Opera */
      p{
        font-size: .333333rem; /* 48 */
        color: #df312b;
        line-height: .375rem; /* 54 */
      }
      h3{
        margin-top: .3125rem; /* 45 */
        font-size: .388889rem; /* 56 */
        color: #fff;
        font-weight: normal;
      }
      div{
        margin-top: 2.083333rem; /* 300 */
        font-size: .902778rem; /* 130 */
        line-height: 1.069444rem; /* 154 */
        color: #db2d29;
      }
    }
    @media screen and (min-width: 320px) {
      .container{
        width: 7.5rem; /* 1080 */
        height: 13.333333rem; /* 1920 */
      }
    }
  }
  > .save{
    display: block;
    margin: .409722rem 0; /* 59 */
    font-family: "PingFang-SC-Medium";
    font-size: .277778rem; /* 40 */
    color: #fff;
    text-align: center;
    span{
      color: #ffe430;
    }
  }
  > p{
    line-height: .375rem; /* 54 */
    font-family: "PingFang-SC-Medium";
    font-size: .277778rem; /* 40 */
    color: #fff;
    text-align: center;
    span{
      color: #ffe430;
    }
  }
  > .join{
    width: 4.743056rem; /* 683 */
    height: 1.118056rem; /* 161 */
    margin: .243056rem auto; /* 35 */
    display: block;
  }
  > .statement{
    font-family: PingFang-SC-Medium;
    font-size: .25rem; /* 36 */
    color: #fff;
    text-align: center;
    i{
      display: inline-block;
      width: .263889rem; /* 38 */
      height: .263889rem; /* 38 */
      vertical-align: middle;
      background-image: url("../../assets/white_uncurrent.png");
      background-size: contain;
      position: relative;
      em{
        background-image: url("../../assets/white_current.png");
        background-size: contain;
        width: .208333rem; /* 30 */
        height: .166667rem; /* 24 */
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -.104167rem; /* 15 */
        margin-top: -.083333rem; /* 12 */
      }
    }
    .current{

    }
    span{
      vertical-align: middle;
      a{
        color: #0072ff;
      }
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
    .rule{
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
    .fortune{
      .container{
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        .box{
          width: 7.5rem; /* 1080 */
          height: 13.333333rem; /* 1920 */
          background-image: url("../../assets/fortune_img.png");
          background-position: center;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          box-sizing: border-box;
          padding-top: 3.395833rem; /* 489 */
          text-align: center;
          font-family: PingFangSC-Regular;
          p{
            font-size: .333333rem; /* 48 */
            color: #df312b;
            line-height: .375rem; /* 54 */
          }
          h3{
            margin-top: .3125rem; /* 45 */
            font-size: .388889rem; /* 56 */
            color: #fff;
            font-weight: normal;
          }
          div{
            margin-top: 2.083333rem; /* 300 */
            font-size: .902778rem; /* 130 */
            line-height: 1.069444rem; /* 154 */
            color: #db2d29;
          }
        }
      }
      @media screen and (min-width: 420px) {
        .container{
          width: 7.5rem; /* 1080 */
          height: 13.333333rem; /* 1920 */
        }
      }
    }
  }
}
</style>
