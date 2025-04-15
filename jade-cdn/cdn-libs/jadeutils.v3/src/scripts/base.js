/* jshint esversion: 6 */
/** 四舍五入：  Number(num).toFixed(size); */
/**
 * 以可读的形式格式化数字
 *
 * 调用例子：var total = Number(0.09999999).add(0.09999999);
 *
 * @param formatExp: 格式表达式（代码还没有写，默认`##,###.##`的形式）
 * @returns {String} : 人类可读性的字符串
 */
Number.prototype.format = function (formatExp) {
	var num = this.toString().replace(/\$|\,/g, '');
	if (isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) +
			',' +
			num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '-') + num + '.' + cents);
};

/**
 * 加法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(0.09999999).add(0.09999999);
 * @param num
 * @returns {String}
 */
Number.prototype.add = function (num) {
	var r1, r2, m;
	try { r1 = this.toString().split(".")[1].length; } catch (e) { r1 = 0; }
	try { r2 = num.toString().split(".")[1].length; } catch (e) { r2 = 0; }
	m = Math.pow(10, Math.max(r1, r2));

	var val = (this * m + num * m) / m;
	m = val.toString();
	var tmpNum = m.split(".");
	if (tmpNum.length > 1) { var l = tmpNum[1]; if (l.length < 2) { m = m + "0"; } }
	return m;
};

/**
 * 减法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(-0.09999999).sub(0.00000001);
 * @param num
 * @returns {String}
 */
Number.prototype.sub = function (num) { return this.add(-num); };

/**
 * 乘法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(parseInt(num)).mul(parseFloat(dj));
 * @param num
 * @returns {String}
 */
Number.prototype.mul = function (num) {
	var m = 0, s1 = this.toString(), s2 = num.toString();
	try { m += s1.split(".")[1].length; } catch (e) { }
	try { m += s2.split(".")[1].length; } catch (e) { }

	var val = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	m = val.toString();
	var tmpNum = m.split(".");
	if (tmpNum.length > 1) {
		var l = tmpNum[1];
		if (l.length < 2) {
			m = m + "0";
		}
	}
	return m;
};

/**
 * 除法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(0.000001).div(0.00000001);
 * @param num
 * @returns {String}
 */
Number.prototype.div = function (num) {
	var t1 = 0, t2 = 0, r1, r2;
	try { t1 = this.toString().split(".")[1].length; } catch (e) { }
	try { t2 = num.toString().split(".")[1].length; } catch (e) { }
	r1 = Number(this.toString().replace(".", ""));
	r2 = Number(num.toString().replace(".", ""));
	return (r1 / r2) * Math.pow(10, t2 - t1);
};

/* 字符串 */
String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); };
String.prototype.trimLeft = function () { return this.replace(/(^\s*)/g, ""); };
String.prototype.trimRight = function () { return this.replace(/(\s*$)/g, ""); };

/**
 * 字符串格式化工具，用下标来替换
 *
 * 例："我是{0}，今年{1}了".format("loogn",22);
 */
String.prototype.format = function (args) {
	var result = this;
	if (arguments.length < 1) { return result; }

	//如果模板参数是数组
	var data = arguments;
	//如果模板参数是对象
	if (arguments.length == 1 && typeof (args) == "object") { data = args; }
	for (var key in data) {
		var value = data[key];
		if (undefined !== value) { result = result.replace("{" + key + "}", value); }
	}
	return result;
};

/**
 * 替换所有匹配exp的字符串为指定字符串
 * @param exp 被替换部分的正则
 * @param newStr 替换成的字符串
 */
String.prototype.replaceAll = function (exp, newStr) {
	return this.replace(new RegExp(exp, "gm"), newStr);
};

/**
 * 字符串格式化工具，用名称来替换
 * 例： "我是{name}，今年{age}了".format({name:"loogn",age:22});
 */
String.prototype.format = function (args) {
	var result = this;
	if (arguments.length < 1) { return result; }

	var data = arguments; // 如果模板参数是数组
	// 如果模板参数是对象
	if (arguments.length == 1 && typeof (args) == "object") { data = args; }
	for (var key in data) {
		var value = data[key];
		if (undefined !== value) { result = result.replaceAll("\\{" + key + "\\}", value); }
	}
	return result;
};


/**
 * add $.browser to compatible jQuery version less than 1.9
 */
(function ($) {
	var matched, browser;

	jQuery.uaMatch = function (ua) {
		ua = ua.toLowerCase();

		var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

		return { browser: match[1] || "", version: match[2] || "0" };
	};

	matched = jQuery.uaMatch(navigator.userAgent);
	browser = {};

	if (matched.browser) {
		browser[matched.browser] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if (browser.chrome) {
		browser.webkit = true;
	} else if (browser.webkit) {
		browser.safari = true;
	}

	jQuery.browser = browser;

})(jQuery);

var net = net || {};
net.jadedungeon = net.jadedungeon || {};
net.jadedungeon.utils = net.jadedungeon.utils || {};

(function ($) {
	net.jadedungeon.utils.string = function () { this.init(); return this; };
	var proto = net.jadedungeon.utils.string.prototype;

	proto.init = function (cfg) { };

	proto.formatNumber = function (num, scale) {
		scale = scale > 0 && scale <= 20 ? scale : 2;
		num = num.toFixed(scale) + "";
		var l = num.split(".")[0].split("").reverse(), r = num.split(".")[1];
		var t = "";
		for (var i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? "," : "");
		}
		return t.split("").reverse().join("") + "." + r;
	};

	proto.unformatNumber = function (number) {
		return parseFloat(s.replace(/[^\d\.-]/g, ""));
	};

	proto.utf16to8 = function (str) {
		var out, i, len, c;

		out = "";
		len = str.length;
		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	};

	proto.utf8to16 = function (str) {
		var out, i, len, c;
		var char2, char3;

		out = "";
		len = str.length;
		i = 0;
		while (i < len) {
			c = str.charCodeAt(i++);
			switch (c >> 4) {
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					out += str.charAt(i - 1);
					break;
				case 12: case 13:
					// 110x xxxx   10xx xxxx
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = str.charCodeAt(i++);
					char3 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x0F) << 12) |
						((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
					break;
			}
		}

		return out;
	};

	proto.base64encode = function (str) {
		var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
			"abcdefghijklmnopqrstuvwxyz0123456789+/";
		var out, i, len;
		var c1, c2, c3;

		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	};

	proto.base64decode = function (str) {
		var base64DecodeChars = new Array(
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
			52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
			-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
			15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
			-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
			41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
		var c1, c2, c3, c4;
		var i, len, out;

		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c1 == -1);
			if (c1 == -1) break;

			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c2 == -1);
			if (c2 == -1) break;

			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if (c3 == 61)
					return out;
				c3 = base64DecodeChars[c3];
			} while (i < len && c3 == -1);
			if (c3 == -1) break;

			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if (c4 == 61)
					return out;
				c4 = base64DecodeChars[c4];
			} while (i < len && c4 == -1);
			if (c4 == -1) break;

			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	};

})(jQuery);


/**
 * JS时间Date格式化参数
 *
 * @param fmt : 格式化字符串如：'yyyy-MM-dd HH:mm:ss'
 *
 * @returns {String}
 */
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"H+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	var year = this.getFullYear();
	var yearstr = year + '';
	yearstr = yearstr.length >= 4 ? yearstr : '0000'.substr(0, 4 - yearstr.length) + yearstr;

	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (yearstr + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/**
 * 添加毫秒数
 *
 * @param ms: 加上的毫秒数
 *
 * @returns {Date}
 */
Date.prototype.addMilliseconds = function (ms) {
	var date = new Date(this);
	date.setTime(date.getTime() + ms);
	return date;
};

/**
 * 添加秒数
 *
 * @param secs: 加上的秒数
 *
 * @returns {Date}
 */
Date.prototype.addSeconds = function (secs) {
	var date = new Date(this);
	date.setSeconds(date.getSeconds() + secs);
	return date;
};

/**
 * 添加天数
 *
 * @param days: 加上的天数，比如40天
 *
 * @returns {Date} 加上天数以后的日期
 */
Date.prototype.addDays = function (days) {
	var date = new Date(this);
	date.setDate(date.getDate() + days);
	return date;
};

/**
 * 添加月数
 *
 * @param months: 加上的月数
 *
 * @returns {Date}
 */
Date.prototype.addMonths = function (months) {
	var date = new Date(this);
	date.setMonth(date.getMonth() + months);
	return date;
};

/**
 * 添加年数
 *
 * @param years: 加上的年数
 *
 * @returns {Date}
 */
Date.prototype.addYear = function (years) {
	var date = new Date(this);
	date.setFullYear(date.getFullYear() + years);
	return date;
};

(function ($) {
	net.jadedungeon.utils.time = function () { this.init(); return this; };
	var proto = net.jadedungeon.utils.time.prototype;

	proto.init = function (cfg) { };

	proto.addDay = function (date, days) {
		var newDate = new Date();
		newDate.setDate(date.getDate() + days);
		return newDate;
	};

	proto.cleanDay = function (date) {
		var newDate = new Date();
		newDate.setTime(date.getTime());
		newDate.setHours(0, 0, 0, 0);
		return newDate;
	};

	proto.getLocalTimeZone = function () {
		var d = new Date();
		return ("GMT" + d.getTimezoneOffset() / 60);
	};

	proto.getLocalTimeZoneName = function () {
		var tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
		var so = -1 * tmSummer.getTimezoneOffset();
		var tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
		var wo = -1 * tmWinter.getTimezoneOffset();
		if (-660 == so && -660 == wo) return 'Pacific/Midway';
		if (-600 == so && -600 == wo) return 'Pacific/Tahiti';
		if (-570 == so && -570 == wo) return 'Pacific/Marquesas';
		if (-540 == so && -600 == wo) return 'America/Adak';
		if (-540 == so && -540 == wo) return 'Pacific/Gambier';
		if (-480 == so && -540 == wo) return 'US/Alaska';
		if (-480 == so && -480 == wo) return 'Pacific/Pitcairn';
		if (-420 == so && -480 == wo) return 'US/Pacific';
		if (-420 == so && -420 == wo) return 'US/Arizona';
		if (-360 == so && -420 == wo) return 'US/Mountain';
		if (-360 == so && -360 == wo) return 'America/Guatemala';
		if (-360 == so && -300 == wo) return 'Pacific/Easter';
		if (-300 == so && -360 == wo) return 'US/Central';
		if (-300 == so && -300 == wo) return 'America/Bogota';
		if (-240 == so && -300 == wo) return 'US/Eastern';
		if (-240 == so && -240 == wo) return 'America/Caracas';
		if (-240 == so && -180 == wo) return 'America/Santiago';
		if (-180 == so && -240 == wo) return 'Canada/Atlantic';
		if (-180 == so && -180 == wo) return 'America/Montevideo';
		if (-180 == so && -120 == wo) return 'America/Sao_Paulo';
		if (-150 == so && -210 == wo) return 'America/St_Johns';
		if (-120 == so && -180 == wo) return 'America/Godthab';
		if (-120 == so && -120 == wo) return 'America/Noronha';
		if ( -60 == so &&  -60 == wo) return 'Atlantic/Cape_Verde';
		if (   0 == so &&  -60 == wo) return 'Atlantic/Azores';
		if (   0 == so &&    0 == wo) return 'Africa/Casablanca';
		if (  60 == so &&    0 == wo) return 'Europe/London';
		if (  60 == so &&   60 == wo) return 'Africa/Algiers';
		if (  60 == so &&  120 == wo) return 'Africa/Windhoek';
		if ( 120 == so &&   60 == wo) return 'Europe/Amsterdam';
		if ( 120 == so &&  120 == wo) return 'Africa/Harare';
		if ( 180 == so &&  120 == wo) return 'Europe/Athens';
		if ( 180 == so &&  180 == wo) return 'Africa/Nairobi';
		if ( 240 == so &&  180 == wo) return 'Europe/Moscow';
		if ( 240 == so &&  240 == wo) return 'Asia/Dubai';
		if ( 270 == so &&  210 == wo) return 'Asia/Tehran';
		if ( 270 == so &&  270 == wo) return 'Asia/Kabul';
		if ( 300 == so &&  240 == wo) return 'Asia/Baku';
		if ( 300 == so &&  300 == wo) return 'Asia/Karachi';
		if ( 330 == so &&  330 == wo) return 'Asia/Calcutta';
		if ( 345 == so &&  345 == wo) return 'Asia/Katmandu';
		if ( 360 == so &&  300 == wo) return 'Asia/Yekaterinburg';
		if ( 360 == so &&  360 == wo) return 'Asia/Colombo';
		if ( 390 == so &&  390 == wo) return 'Asia/Rangoon';
		if ( 420 == so &&  360 == wo) return 'Asia/Almaty';
		if ( 420 == so &&  420 == wo) return 'Asia/Bangkok';
		if ( 480 == so &&  420 == wo) return 'Asia/Krasnoyarsk';
		if ( 480 == so &&  480 == wo) return 'Australia/Perth';
		if ( 540 == so &&  480 == wo) return 'Asia/Irkutsk';
		if ( 540 == so &&  540 == wo) return 'Asia/Tokyo';
		if ( 570 == so &&  570 == wo) return 'Australia/Darwin';
		if ( 570 == so &&  630 == wo) return 'Australia/Adelaide';
		if ( 600 == so &&  540 == wo) return 'Asia/Yakutsk';
		if ( 600 == so &&  600 == wo) return 'Australia/Brisbane';
		if ( 600 == so &&  660 == wo) return 'Australia/Sydney';
		if ( 630 == so &&  660 == wo) return 'Australia/Lord_Howe';
		if ( 660 == so &&  600 == wo) return 'Asia/Vladivostok';
		if ( 660 == so &&  660 == wo) return 'Pacific/Guadalcanal';
		if ( 690 == so &&  690 == wo) return 'Pacific/Norfolk';
		if ( 720 == so &&  660 == wo) return 'Asia/Magadan';
		if ( 720 == so &&  720 == wo) return 'Pacific/Fiji';
		if ( 720 == so &&  780 == wo) return 'Pacific/Auckland';
		if ( 765 == so &&  825 == wo) return 'Pacific/Chatham';
		if ( 780 == so &&  780 == wo) return 'Pacific/Enderbury';
		if ( 840 == so &&  840 == wo) return 'Pacific/Kiritimati';
		return 'Not in US';
	};

	proto.getTimeArea = function (date, days) {
		var d1 = proto.cleanDay(date);
		var d2 = proto.cleanDay(proto.addDay(d1, days));

		if (d1 < d2) {
			return { floor: d1, ceil: d2 };
		} else {
			return { floor: d2, ceil: d1 };
		}
	};

	proto.getLocalTimeStr = function (date) {
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +
			date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" +
			date.getSeconds();
	};

})(jQuery);



(function ($) {
	net.jadedungeon.utils.validator = function () { this.init(); return this; };
	var proto = net.jadedungeon.utils.validator.prototype;

	proto.init = function (cfg) { };

	/**
	 * 验证姓名 中文字、英文字母、数字
	 */
	proto.checkUsername = function (username) {
		return /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9 ]+$/i.test(username);
	};

	/**
	 * 验证手机号
	 */
	proto.checkMobile_zh_CN = function (phoneno) {
		return /^1[3|4|5|8][0-9]\d{8}$/.test(phoneno);
	};


	/**
	 * 按文件扩展名检查是否是图片
	 */
	proto.checkImageFilePostfix = function (postfix) {
		if (!postfix.match(/.jpg|.gif|.png|.bmp/i)) {
			return false;
		}
		return true;
	};

	/**
	 * 验证图片大小
	 */
	proto.checkImageFileSize = function (fileInput, imgMaxSize) {
		var filePath = fileInput.value;
		var fileExt = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
		if (fileInput.files && fileInput.files[0]) {
			// alert(fileInput);
			// alert(fileInput.files[0]);
			console.log(fileInput.files[0].size);
			if (fileInput.files[0].size > imgMaxSize) {
				alert("图片大于500K，请压缩后上传");
				return false;
			}
			var xx = fileInput.files[0];
			for (var i in xx) {
				if (xx[i].size > imgMaxSize) {
					alert("图片大于500K，请压缩后上传");
					return false;
				}
			}
		} else {
			fileInput.select();
			var url = document.selection.createRange().text;
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				console.log(fso.GetFile(url).size);
				if (fso.GetFile(url).size) {
					alert("图片大于500K，请压缩后上传");
					return false;
				}
			} catch (e) {
				alert('如果你用的是ie 请将安全级别调低！');
			}
		}
		return true;
	};

})(jQuery);


(function ($) {
	net.jadedungeon.utils.web = function () { this.init(); return this; };
	var proto = net.jadedungeon.utils.web.prototype;

	proto.init = function (cfg) { };

	proto.goUrl = function (url) {
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

	proto.openWindow = function (url) {
		var el = document.createElement("a");
		document.body.appendChild(el);
		el.href = url;
		el.target = '_blank';

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

	proto.webAuthBasic = function (username, password) {
		var auth = 'Basic ' + jadeUtils.string.base64encode(
			jadeUtils.string.utf16to8(username + ':' + password));
		return auth;
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
	proto.cookieOperator = function (name, value, options) {
		if (typeof value != 'undefined') {
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires &&
				(typeof options.expires == 'number' || options.expires.toUTCString)) {
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
			var sameSite = options.SameSite ? ';SameSite=' + options.SameSite : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires,
				path, domain, sameSite, secure].join('');
		} else {
			var cookieValue = null;
			if (document.cookie && document.cookie !== '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
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

})(jQuery);


(function ($) {
	net.jadedungeon.utils.i18n = function (data) { this.init(data); return this; };
	var proto = net.jadedungeon.utils.i18n.prototype;

	proto.init = function (data) {
		var self = this;
		self.msg = data || {};
	};

	proto.get = function (key) {
		var self = this;
		return self.msg[key];
	};

})(jQuery);


