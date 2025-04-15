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



export let formatNumber = function (num, scale) {
	scale = scale > 0 && scale <= 20 ? scale : 2;
	num = num.toFixed(scale) + "";
	var l = num.split(".")[0].split("").reverse(), r = num.split(".")[1];
	var t = "";
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
};

export let unformatNumber = function (number) {
	return parseFloat(s.replace(/[^\d\.-]/g, ""));
};

export let utf16to8 = function (str) {
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

export let utf8to16 = function (str) {
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

export let base64encode = function (str) {
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

export let base64decode = function (str) {
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

