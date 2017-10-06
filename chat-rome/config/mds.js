function getCooikeItem (key) {
	return document.cookie.split(';')[0].split('=')[1]
}

function setCookieItem (key, value) {
	var str = ['; ', key, '=', value].join('')
	return document.cookie += str
}

var cookieMds = {
	'getCookie': getCooikeItem,
	'setCookie': setCookieItem
}

export default cookieMds