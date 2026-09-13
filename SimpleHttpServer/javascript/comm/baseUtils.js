const fs = require('fs');

/**
 * 通过返回一个promis,实现sleep后执行。
 *
 * example:
 *
 * baseUtils.sleep(5000).then(() => { do something ..... });
 */
exports.sleep = function (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
};

/**
 * 通过返回一个promis,连接多个操作。
 *
 * example:
 *
 * baseUtils.sleep(5000).then(() => { do something ..... });
 * async(() => { 
 * 	console.log("step 1"); 
 * }, 3000).then(() => { return async(() => { 
 * 	console.log("step 2"); 
 * }, 3000) }).then(() => { return async(() => { 
 * 	console.log("step 3"); 
 * }, 3000) }).then(() => { return async(() => { 
 * 	console.log("step 4"); 
 * }, 3000) }).then(() => { return async(() => { 
 * 	console.log("step 5"); }) 
 * }).then(() => { return async(() => { 
 * 	console.log("step 6"); 
 * }) });
 */
exports.async = function (callback, time) {
	return new Promise((resolve, reject) => {
		callback();
		setTimeout(() => { resolve(); }, time);
	});
};



/**
 * 保存cookie
 *
 * example:
 *
 * baseUtils.saveCookieAll('filename.txt', agodaHomePage.window.document.cookie)
 */
exports.saveCookieAll = function(fileName, cookie) {
	try {
		fs.writeFile(fileName, cookie);
	} catch(e) {
		fs.writeFile(fileName, 'save-cookie-failed');
	}          
};



/**
 * 当指定dom节点中的内容发生变化后，执行对应的操作
 *
 * 参数：
 *   pageWindow:页面所在的window对象 
 *   target: 是监控的节点 
 *   callback: 当被监控节点变化后,具体操作内容的回调函数
 *   config: 相关配置：{attributes: true, childList: true, characterData: true,subtree:true }
 *
 *
 */
// 	config = { attributes: true, childList: true, characterData: true,subtree:true }
exports.observeToRun = function(pageWindow, target, callback, config) {
	var MutationObserver = pageWindow.window.MutationObserver || 
		pageWindow.window.WebKitMutationObserver || 
		pageWindow.window.MozMutationObserver;
	// 创建观察者对象
	var observer = new MutationObserver(callback);
	observer.observe(target, config);
};



/**
 * cookie操作器
 *
 * @param name 名称
 * @param value 值
 * @param options 其他选项
 *
 * @returns
 */
exports.cookieOperator = function (name, value, options) {
	if (typeof value != 'undefined') {
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires &&
				(typeof options.expires == 'number' || options.expires.toUTCString))
		{
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() +
						(options.expires * 24 * 60 * 60 * 1000) + 1);
			} else {
				date = options.expires;
			}
			expires = ';expires=' + date.toUTCString();
		}
		var path = options.path ? ';path=' + options.path : '';
		var domain = options.domain ? ';domain=' + options.domain : '';
		var secure = options.secure ? ';secure' : '';
		document.cookie = [ name, '=', encodeURIComponent(value), expires,
		path, domain, secure ].join('');
	} else {
		var cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for ( var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie
							.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};

