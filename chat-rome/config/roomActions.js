import cmds from './mds.js'

// @param type: 1 for ; 0 for receive
// $('#msg-list')====> tele
// 两个选择，一个是不用双向绑定；一个是双向绑定。后者增大渲染开销。and then socket send
function addMsg (list, message, type, from, jEle, tEle, tag) {
  var srh = gh(jEle) > tEle.height() ? gh(jEle) : tEle.height()
  if (message.length === 0 || !message) {
    return
  }
  if (tag) {
    console.log(srh)
    tEle.scrollTop(srh)
    list.push({msg: message, type: type, from: from})
  } else {
    list.push({msg: message, type: type, from: from})
    tEle.animate({
      scrollTop: srh
    })
  }
}

// $('#msg-list #msg-items')
function gh (jEle) {
  var hA = [].map.call(jEle, function (cv, i) {
    return cv.offsetHeight
  })
  var tH = hA.reduce(function (pree, cure, index) {
    return pree + cure
  }, 0)
  return tH
}

//  $('#info-detail')==>se
// $('#info-basic').get(0).offsetHeight ===> height
function sID (scrollEle, height) {
  scrollEle.animate({
    'bottom': height
  })
}


// -500  ====>height
function hID (scrollEle, height) {
  scrollEle.animate({
    'bottom': height
  })
}

// issign
function isSignIn (vueObj) {
  console.log(document.cookie)
  var token = cmds.getCookie('token')
  var isLogin = cmds.getCookie('islogin')
  if (token === undefined || token === '' || !isLogin) {
    alert('未登录！')
    vueObj.$router.push('login')
  }
}

// convert string
function convertStr (str) {
  var hc = {
    ' ': '&nbsp;',
    '>': '&gt;',
    '<': '&lt;',
    '"': '&quot;',
    '&': '&amp;',
    "'": '&#39;'
  }
  var reg = /\'{1}|\"{1}|\>{1}|\<{1}|\s{1}|\&{1}/g
  var arr = str.split('')
  var mySexec = null
  while(mySexec = reg.exec(str) !== null) {
    arr[reg.lastIndex - 1] = hc[str.charAt(reg.lastIndex-1)]
  }
  return arr.join('')
}

var roomActions = {
  'addMessage': addMsg,
  'getHeight': gh,
  'showID': sID,
  'hideID': hID,
  'isSignIn': isSignIn,
  'convertStr': convertStr
}

export default roomActions
