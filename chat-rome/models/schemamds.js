const crypto = require('crypto')

function pcrypto(password, key){
    password = password.split("").reverse().join("");
    var md5 = crypto.createHash("md5"),
        hmac = crypto.createHmac("sha256", key);
    md5.update(password);
    hmac.update(md5.digest('hex'));
    return hmac.digest('latin1');
}

// cal date
function cd(millisecond) {
  var date = new Date(millisecond)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  return `${y} 年 ${m} 月 ${d}日`
}

// parse useritem
function pui(obj) {
  var result = {
    name: obj.name,
    avator: obj.avator,
    email: obj.email,
    online: obj.online,
    currentRoomId: obj.currentRoomId,
    createAt: cd(obj.createAt)
  }
  return result
}

module.exports = {
  'pct': pcrypto,
  'cd': cd,
  'pui': pui
}
