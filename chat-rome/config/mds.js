function getCooikeItem (key) {
  var arr = document.cookie.split(';')
  var t = null
  arr.forEach(function (v) {
    var k = v.split('=')[0]
    var value = v.split('=')[1]
    if (k === key) {
      t = value
    }
  })
  return t
}

function setCookieItem (key, value) {
  var str = ['; ', key, '=', value].join('')
  return document.cookie += str
}

function rememberUP (sto, obj, tag) {
  sto.setItem('email', obj.eMail)
  sto.setItem('password', obj.password)
  sto.setItem('isStore', tag)
}

var localMethods = {
  'getCookie': getCooikeItem,
  'setCookie': setCookieItem,
  'storePasswd' : rememberUP
}

export default localMethods