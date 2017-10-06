const crypto = require('crypto')

function pcrypto(password, key){
    password = password.split("").reverse().join("");
    var md5 = crypto.createHash("md5"),
        hmac = crypto.createHmac("sha256", key);
    md5.update(password);
    hmac.update(md5.digest('hex'));
    return hmac.digest('latin1');
}

module.exports = {
	pct: pcrypto
}
