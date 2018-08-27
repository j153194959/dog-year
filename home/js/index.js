/* 判断手机是安卓还是ios */
function isAndroid () {
  var u = navigator.userAgent
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
  // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  if (isAndroid) {
    return true
  }
  return false
}

// 判断微信环境
function isWeixin () {
  var ua = navigator.userAgent.toLowerCase()
  if ((ua.match(/MicroMessenger/i) + '') === 'micromessenger') {
    return true
  } else {
    return false
  }
}

/* 引入cordova */
function addCordova () {
  var head, script1, scriptSrc1
  if (isAndroid()) {
    scriptSrc1 = './js/cordova1.0.3/android/cordova.js'
  } else {
    scriptSrc1 = './js/cordova1.0.3/ios/cordova.js'
  }
  head = document.getElementsByTagName('head')[0]
  script1 = document.createElement('script')
  script1.src = scriptSrc1
  head.appendChild(script1)
}

/* 引入微信分享文件 */
function addWechatShare () {
  var head, script1, scriptSrc1
  head = document.getElementsByTagName('head')[0]
  script1 = document.createElement('script')
  scriptSrc1 = './js/jweixin/jweixin-1.2.0.js'
  script1.src = scriptSrc1
  head.appendChild(script1)
}

/**
 * 获取url地址参数
 * @param  {[type]} name [地址参数名]
 * @return {[type]}      [description]
 */
function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 判断优理宝环境
 */
function isUlb () {
  var params = getQueryString('inUlb')
  if (params) {
    return true
  } else {
    return false
  }
}

/**
 * 封装ajax
 */
function ajax () {
  var ajaxData = {
    type: arguments[0].type || 'GET',
    url: arguments[0].url || '',
    async: arguments[0].async || 'true',
    data: arguments[0].data || null,
    dataType: arguments[0].dataType || 'text',
    contentType: arguments[0].contentType || 'application/x-www-form-urlencoded',
    beforeSend: arguments[0].beforeSend || function () { },
    success: arguments[0].success || function () { },
    error: arguments[0].error || function () { }
  }
  ajaxData.beforeSend()
  var xhr = createxmlHttpRequest()
  xhr.responseType = ajaxData.dataType
  xhr.open(ajaxData.type, ajaxData.url, ajaxData.async)
  xhr.setRequestHeader('Content-Type', ajaxData.contentType)
  xhr.send(convertData(ajaxData.data))
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        ajaxData.success(xhr.response)
      } else {
        ajaxData.error()
      }
    }
  }
}

function createxmlHttpRequest () {
  if (window.ActiveXObject) {
    return new ActiveXObject('Microsoft.XMLHTTP')
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest()
  }
}

function convertData (data) {
  if (typeof data === 'object') {
    var convertResult = ''
    for (var c in data) {
      convertResult += c + '=' + data[c] + '&'
    }
    convertResult = convertResult.substring(0, convertResult.length - 1)
    return convertResult
  } else {
    return data
  }
}

if (isUlb()) {
  addCordova()
} else if (isWeixin()) {
  addWechatShare()
}

window.onload = function () {
  /**
   * 切换类名 用于显示隐藏弹窗
   * @param {*} dom 目标dom元素
   * @param {*} oldClass 旧类名
   * @param {*} newClass 目的类名
   */
  function replaceClass (dom, oldClass, newClass) {
    var classVal = dom.getAttribute('class')
    classVal = classVal.replace(oldClass, newClass)
    dom.setAttribute('class', classVal)
  }
  /**
   * 设置微信分享
   */
  function setWeixinShare () {
    var SHARE_TITLE = '狗年春节，三重好礼'
    var SHARE_DESC = '兴业证券恭祝大家狗年兴“汪”发达，大吉大利接好礼'
    var SHARE_URL = 'https://static.xyzq.cn/activity/dog-year/home/index.html' // 必须是对的地址
    var SHARE_IMG = 'https://static.xyzq.cn/activity/dog-year/home/images/center-share.jpg'
    var appid = ''
    var timestamp = ''
    var noncestr = ''
    var signature = ''
    var currentDomain = window.location.href.split('?')
    history.replaceState('', document.title, (currentDomain[0]))
    alert(1)
    ajax({
      type: 'post',
      // url: 'https://estock.xyzq.com.cn/coin/eightyeight/getWxInfo',
      url: 'https://wechat.xyzq.cn/wechatbiz/accountApi?act=getJsapiInfo',
      data: { 'url': SHARE_URL }, // 微信直接分享地址会变
      dataType: 'json',
      success: function (data) {
        alert(JSON.stringify(data))
        if (data.resphead.respcode === '0000') {
          appid = data.respbody.appId
          timestamp = data.respbody.timestamp
          noncestr = data.respbody.nonceStr
          signature = data.respbody.signature
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
              'onMenuShareAppMessage',
            ]
          })
        }
      }
    })
    wx.ready(function () {
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

        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      })
      wx.error(function (res) {
        alert('wx.error' + res.errMsg)
      })
    })
  }
  /**
   * 列表渲染
   */
  function setAjax () {
    ajax({
      url: 'https://estock.xyzq.com.cn/coin/springFestival/index',
      dataType: 'json',
      success: function (data) {
        console.log(data)
        var Data = data.respbody
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
        var str = ''
        var html = ''
        for (let i = 0; i < Data.length; i++) {
          const el = Math.abs(Data[i].status - 2)
          arr[i].statu = el
          // this.list.push(arr[i])
        }
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i]
          str = '<li>' +
            '<a class="link' + (el.statu + 1) + '" href="javascript:void(0)"></a>' +
            '<div class="left">' +
            '<div>' + el.time + '</div>' +
            '<div>' + el.title + '</div>' +
            '</div>' +
            '</li>'
          html += str
        }
        document.querySelector('main > ul').innerHTML = html
        listClick()
      },
      error: function () {
        alert('服务器响应失败！')
      }
    })
  }
  setAjax()
  // 点击活动规则打开规则弹窗
  document.querySelector('header > div').onclick = function () {
    replaceClass(document.querySelectorAll('.pop-ups .supernatant')[1], 'none', 'flex')
  }
  // 关闭规则弹窗
  document.querySelector('.pop-ups .rule .close').onclick = function () {
    replaceClass(document.querySelectorAll('.pop-ups .supernatant')[1], 'flex', 'none')
  }
  /**
   * 点击列表按钮
   */
  function listClick () {
    var list = document.querySelectorAll('main ul a')
    for (let i = 0; i < list.length; i++) {
      const el = list[i]
      console.log(el);
      (function (i) {
        list[i].onclick = function () {
          if (i === 0) {
            replaceClass(document.querySelectorAll('.pop-ups .supernatant')[0], 'none', 'flex')
          } else if (i === 1) {
            if (this.className === 'link2') {
              if (isUlb()) {
                // https://static.xyzq.cn/activity/pjm-test/dog-year/index.html?inUlb=1#/
                window.location.href = 'https://static.xyzq.cn/activity/dog-year/index.html?inUlb=1#/'
              } else {
                window.location.href = 'https://static.xyzq.cn/activity/dog-year/index.html#/'
              }
            } else if (this.className === 'link1') {
              replaceClass(document.querySelectorAll('.pop-ups .supernatant')[3], 'none', 'flex')
            }
          } else if (i === 2) {
            // alert(1)
            if (this.className === 'link2') {
              window.location.href = 'https://static.xyzq.cn/activity/dog-year/index.html?inUlb=1#/Home3'
            } else if (this.className === 'link1') {
              replaceClass(document.querySelectorAll('.pop-ups .supernatant')[3], 'none', 'flex')
            }
          }
        }
      })(i)
    }
  }

  // document.querySelectorAll('main > ul a').onclick = function () {
  //   console.log(this)
  // }
  // 关闭飞机弹窗
  document.querySelector('.pop-ups .aircraft a').onclick = function () {
    replaceClass(document.querySelectorAll('.pop-ups .supernatant')[0], 'flex', 'none')
  }
  // 关闭结束弹窗
  document.querySelector('.pop-ups .end a').onclick = function () {
    replaceClass(document.querySelectorAll('.pop-ups .supernatant')[3], 'flex', 'none')
  }
  // 点击分享
  document.querySelector('footer .share').onclick = function () {
    if (isUlb()) { // 如果再优理宝中则弹出调用cordova分享
      navigator.uniaccount.ulbShare('狗年春节，三重好礼', 'https://static.xyzq.cn/activity/dog-year/home/images/center-share.jpg', '兴业证券恭祝大家狗年兴“汪”发达，大吉大利接好礼', 'https://static.xyzq.cn/activity/dog-year/home/index.html')
    } else if (isWeixin()) { // 如果再微信中则弹出分享弹窗
      replaceClass(document.querySelectorAll('.pop-ups .supernatant')[2], 'none', 'flex')
    }
  }
  // 关闭分享弹窗
  document.querySelector('.pop-ups .share').onclick = function () {
    replaceClass(document.querySelectorAll('.pop-ups .supernatant')[2], 'flex', 'none')
  }
  if (isWeixin()) {
    setWeixinShare()
  }
}
