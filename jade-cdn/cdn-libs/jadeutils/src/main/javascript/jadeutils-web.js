jadeUtils.url = {};
jadeUtils.url.goUrl = function (url) {
	var el = document.createElement("a");
	document.body.appendChild(el);
	el.href = url;

	if (el.click) {
		el.click();
	} else { // safari 浏览器click事件处理
		try {
			var evt = document.createEvent('Event');
			evt.initEvent('click', true, true);
			el.dispatchEvent(evt);
		} catch (e) {
			// new PointOut(e, 2)
		}
	}
};
jadeUtils.url.openWindow = function (url) {
	var el = document.createElement("a");
	document.body.appendChild(el);
	el.href = url;
	el.target='_blank';

	if (el.click) {
		el.click();
	} else { // safari 浏览器click事件处理
		try {
			var evt = document.createEvent('Event');
			evt.initEvent('click', true, true);
			el.dispatchEvent(evt);
		} catch (e) {
			// new PointOut(e, 2)
		}
	}
};

/**
 * cookie操作器
 * 
 * @param name
 *            名称
 * @param value
 *            值
 * @param options
 *            其他选项
 * @returns
 */
jadeUtils.cookieOperator = function (name, value, options) {
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
						(options.expires * 24 * 60 * 60 * 1000));
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

jadeUtils.i18n = {};
jadeUtils.i18n.msg = {};
jadeUtils.i18n.load = function (key) {
	return jadeUtils.i18n.msg[key];
};

jadeUtils.formatter = {};
jadeUtils.formatter.formatNumber = function (num, scale) {
	scale = scale > 0 && scale <= 20 ? scale : 2;
	num = num.toFixed(scale) + "";
	var l = num.split(".")[0].split("").reverse(), r = num.split(".")[1];
	var t = "";
	for (var i = 0; i < l.length; i++) {  
		t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? "," : "");  
	}  
	return t.split("").reverse().join("") + "." + r;  
};
jadeUtils.formatter.unformatNumber = function (number) {
	return parseFloat(s.replace(/[^\d\.-]/g, ""));
};

jadeUtils.datastructures = {};
jadeUtils.datastructures.treeNode = {};
jadeUtils.datastructures.treeNode.countLeafNode = function (node, subsName, count) {
	if (node && node[subsName] && 0 < node[subsName].length) {
		for (var i=0; i < node[subsName].length; i++) {
			count = jadeUtils.datastructures.treeNode.countLeafNode(node[subsName][i], subsName, count);
		}
		return count;
	} else {
		return count + 1;
	}
};
