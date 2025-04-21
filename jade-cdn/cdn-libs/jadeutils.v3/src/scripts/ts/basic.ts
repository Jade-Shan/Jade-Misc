/**
 * 
 */
export class NumUtil {

	/** 四舍五入：  Number(num).toFixed(size); */
	static toFixed(n: number, size: number) {
		let m = Math.pow(10, size);
		return Math.floor(n * m + 0.50000000001) / m;
	}


	/**
	 * 以可读的形式格式化数字
	 *
	 * 调用例子：var total = Number(0.09999999).add(0.09999999);
	 *
	 * @param n: 
	 * @param formatExp: 格式表达式（代码还没有写，默认`##,###.##`的形式）
	 * @returns: 人类可读性的字符串
	 */
	static format(n: number, formatExp?: string) {
		// let numStr: string = n.toString().replace(/\$|\,/g, '');
		// 解析格式
		let p = 0; // 分隔位符
		let m = 0; // 小数位数
		if (formatExp && formatExp.length > 0) {
			let sArr = formatExp.split(".");
			let s1 = sArr[0]; // 整数格式
			if (s1.length > 0) {
				let pArr = s1.split(",");
				if (pArr.length > 0) {
					for (let pt of pArr) {
						if (pt.length > p) { p = pt.length; } 
					}
				}
			}
			let s2 = sArr[1]; // 小数格式
			if (s2.length > 0) {
				for (let ms of s2) {
					if ("#" == ms) { m = m + 1;}
				}
			}
		}
		if (p < 3) { p = 3; }
		if (!formatExp && m < 1) { m = 2; }
		// 开始格式化数字
		let numStr: string = n.toString();
		try {
			let num: number = Math.abs(n);
			let sign = num == n;
			let sArr = this.toFixed(num, m).toString().split(".");
			let s1 = sArr[0] ? sArr[0] : "" ; // 整数字符串
			let s2 = sArr[1] ? sArr[1] : "" ; // 小数字符串
			if (s2.length < m) {
				for (let i = s2.length; i < m ; i++) {
					s2 = s2 + '0';
				}
			}
			// 给整数部分加上分隔符
			let part1 = "";
			for (let i = 0; i < s1.length; i++) {
				part1 = s1[s1.length - 1 - i] + part1;
				if (i > 0 && i < (s1.length - 1) && 0 == ((i + 1) % p)) {
					part1 = "," + part1;
				}
			}
			// 给小数部分加上分隔符
			let part2 = "";
			for (let i = 0; i < s2.length; i++) {
				part2 = part2 + s2[i];
				if (i > 0 && i < (s2.length - 1) && 0 == ((i + 1) % p)) {
					part2 = part2 + ",";
				}
			}
			return (((sign) ? '' : '-') + part1 + '.' + part2);
		} catch (e) {
			console.error(e);
			numStr = "NaN";
		}
		return numStr;
	}

	/**
	 * 
	 * @param s 
	 * @returns 
	 */
	static unformat(s: string) {
		let ns = s.replace(/[^\d\.-]/g, "");
		return ns.includes(".") ? parseFloat(ns) : parseInt(ns);
	}

	/**
	 * 加法得到金额数据（保留精度问题）
	 * 调用例子：var total = Number(0.09999999).add(0.09999999);
	 * @param n1
	 * @param n2
	 * @returns 
	 */
	static add(n1: number, n2: number) {
		let r1: number, r2: number;
		try { r1 = n1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
		try { r2 = n2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
		let m = Math.pow(10, Math.max(r1, r2));
		var value = (n1 * m + n2 * m) / m;
		//let mStr = value.toString();
		//var tmpNum = mStr.split(".");
		//if (tmpNum.length > 1) { var l = tmpNum[1]; if (l.length < 2) { mStr = mStr + "0"; } }
		return value;
	}

	/**
	 * 减法得到金额数据（保留精度问题）
	 * 调用例子：var total = Number(-0.09999999).sub(0.00000001);
	 * @param n1
	 * @param n2
	 * @returns
	 */
	static sub(n1: number, n2: number) {
		let r1: number, r2: number;
		try { r1 = n1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
		try { r2 = n2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
		let m = Math.pow(10, Math.max(r1, r2));
		let value = (n1 * m - n2 * m) / m;
		let mStr = value.toString();
		//var tmpNum = mStr.split(".");
		//if (tmpNum.length > 1) { var l = tmpNum[1]; if (l.length < 2) { mStr = mStr + "0"; } }
		return value;
	}

	/**
	 * 乘法得到金额数据（保留精度问题）
	 * 调用例子：var total = Number(parseInt(num)).mul(parseFloat(dj));
	 * @param n1
	 * @param n2
	 * @returns {String}
	 */
	static mul(n1: number, n2: number) {
		let m = 0, s1 = n1.toString(), s2 = n2.toString();
		try { m += s1.split(".")[1].length; } catch (e) { }
		try { m += s2.split(".")[1].length; } catch (e) { }
		let value = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
		//let mStr = value.toString();
		//var tmpNum = mStr.split(".");
		//if (tmpNum.length > 1) {
		//	var l = tmpNum[1];
		//	if (l.length < 2) { mStr = mStr + "0"; }
		//}
		return value;
	}

	/**
	 * 除法得到金额数据（保留精度问题）
	 * 调用例子：var total = Number(0.000001).div(0.00000001);
	 * @param n1
	 * @param n2
	 * @returns {String}
	 */
	static div(n1: number, n2: number) {
		let t1 = 0, t2 = 0;
		try { t1 = n1.toString().split(".")[1].length; } catch (e) { }
		try { t2 = n2.toString().split(".")[1].length; } catch (e) { }
		let m = t2 - t1;
		let r1 = Number(n1.toString().replace(".", ""));
		let r2 = Number(n2.toString().replace(".", ""));
		let value = (r1 / r2) * Math.pow(10, m + 1);
		return value / 10;
	}

}


/**
 * 
 */
export class StrUtil {

	static trim(s: string) {
		return s.replace(/(^\s*)|(\s*$)/g, ""); 
	}

	static trimLeft(s: string) {
		return s.replace(/(^\s*)/g, ""); 
	}

	static trimRight(s: string) {
		return s.replace(/(\s*$)/g, ""); 
	}


	/**
	 * 字符串格式化工具，用名称来替换
	 * 例： "我是{name}，今年{age}了".format({name:"loogn",age:22});
	 */
	static format(s: string, args: string) {
		let result = s;
		if (arguments.length < 1) {
			return result;
		}
		let data = arguments; // 如果模板参数是数组
		// 如果模板参数是对象
		if (arguments.length == 1 && typeof (args) == "object") {
			data = args;
		}
		for (var key in data) {
			var value = data[key];
			if (undefined !== value) { result = result.replace("\\{" + key + "\\}", value); }
		}
		return result;
	}


	/**
	 * 替换所有匹配exp的字符串为指定字符串
	 * @param exp 被替换部分的正则
	 * @param newStr 替换成的字符串
	 */
	static replaceAll(s: String, exp: string, newStr: string) {
		return s.replace(new RegExp(exp, "gm"), newStr);
	}


// 	/**
// 	 * 
// 	 * @param num 
// 	 * @param scale 
// 	 * @returns 
// 	 */
// 	static formatNumber(num: number, scale: number) {
// 		scale = scale > 0 && scale <= 20 ? scale : 2;
// 		let numStr = num.toFixed(scale) + "";
// 		let l = numStr.split(".")[0].split("").reverse(), r = numStr.split(".")[1];
// 		let t = "";
// 		for (var i = 0; i < l.length; i++) {
// 			t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? "," : "");
// 		}
// 		return t.split("").reverse().join("") + "." + r;
// 	}

	/**
	 * 
	 * @param str 
	 * @returns 
	 */
	static utf16to8(str: string) {
		let out = "";
		let len = str.length;
		for (let i = 0; i < len; i++) {
			let c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			}
		}
		return out;
	}

	/**
	 * 
	 * @param str 
	 * @returns 
	 */
	static utf8to16(str: string) {
		let out = "";
		let len = str.length;
		let i = 0;
		let char2, char3;
		while (i < len) {
			let c = str.charCodeAt(i++);
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
	}

	/**
	 * 
	 * @param str 
	 * @returns 
	 */
	static base64encode(str: string) {
		let base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
			"abcdefghijklmnopqrstuvwxyz0123456789+/";
		let len = str.length;
		let out = "";
		let c1, c2, c3;
		let i = 0;
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
	}

	/**
	 * 
	 * @param str 
	 * @returns 
	 */
	static base64decode(str: string) {
		let base64DecodeChars = new Array(
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
			52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
			-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
			15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
			-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
			41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
		let len = str.length;
		let out = "";
		let i = 0, c1, c2, c3, c4;
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
	}

}


/**
 * 
 */
export class TimeUtil {

	/**
	 * JS时间Date格式化参数
	 *
	 * @param d: date
	 * @param fmt : 格式化字符串如：'yyyy-MM-dd HH:mm:ss'
	 *
	 * @returns 
	 */
	static format(d: Date, fmt: string) {
		let yearstr = "" + d.getFullYear();
		yearstr = yearstr.length >= 4 ? yearstr : '0000'.substr(0, 4 - yearstr.length) + yearstr;
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (yearstr + "").substr(4 - RegExp.$1.length));

		let processPart = (part: string, num: number) => {
			if (new RegExp('(M+)').test(fmt)) {
				let str01 = RegExp.$1;
				let str02 = `${num}`;
				fmt = fmt.replace(str01, (str01.length == 1) ? (str02) : (("00" + str02).substr(str02.length)));
			}
		} 
		processPart("M+", d.getMonth() + 1);
		processPart("d+", d.getDate()     );
		processPart("H+", d.getHours()    );
		processPart("m+", d.getMinutes()  );
		processPart("s+", d.getSeconds()  );
		processPart("q+", Math.floor((d.getMonth() + 3) / 3));
		processPart("S" , d.getMilliseconds());
		return fmt;
	}


	/**
	 * 添加毫秒数
	 * 
	 * @param d: date
	 * @param ms: 加上的毫秒数
	 * @returns 
	 */
	static addMilliseconds(d: Date, ms: number) {
		var date = new Date(d);
		date.setTime(date.getTime() + ms);
		return date;
	}


	/**
	 * 添加秒数
	 *
	 * @param d: date
	 * @param secs: 加上的秒数
	 *
	 * @returns {Date}
	 */
	static addSeconds(d: Date, secs: number) {
		var date = new Date(d);
		date.setSeconds(date.getSeconds() + secs);
		return date;
	}


	/**
	 * 添加天数
	 *
	 * @param d: date
	 * @param days: 加上的天数，比如40天
	 *
	 * @returns  加上天数以后的日期
	 */
	static addDays(d: Date, days: number) {
		var date = new Date(d);
		date.setDate(date.getDate() + days);
		return date;
	}

	/**
	 * 添加月数
	 *
	 * @param d: date
	 * @param months: 加上的月数
	 *
	 * @returns 
	 */
	static addMonths(d: Date, months: number) {
		var date = new Date(d);
		date.setMonth(date.getMonth() + months);
		return date;
	}


	/**
	 * 添加年数
	 *
	 * @param d: date
	 * @param years: 加上的年数
	 *
	 * @returns 
	 */
	static addYear(d: Date, years: number) {
		var date = new Date(d);
		date.setFullYear(date.getFullYear() + years);
		return date;
	}

	/**
	 * 初始化为一天的`00:00:00`
	 * @param date 
	 * @returns 
	 */
	static cleanDay(date: Date) {
		var newDate = new Date();
		newDate.setTime(date.getTime());
		newDate.setHours(0, 0, 0, 0);
		return newDate;
	}

	/**
	 * 取得所在的时区
	 * 
	 * @returns 
	 */
	static getLocalTimeZone() {
		var d = new Date();
		return ("GMT" + d.getTimezoneOffset() / 60);
	}

	/**
	 * 取得所在的时区名
	 * @returns 
	 */
	static getLocalTimeZoneName() {
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
	}

	/**
	 * 取得两天之间的时间范围
	 * 
	 * @param date 
	 * @param days 
	 * @returns 
	 */
	static getTimeArea(date: Date, days: number) {
		var d1 = TimeUtil.cleanDay(date);
		var d2 = TimeUtil.cleanDay(TimeUtil.addDays(d1, days));
		if (d1 < d2) {
			return { floor: d1, ceil: d2 };
		} else {
			return { floor: d2, ceil: d1 };
		}
	}

	/**
	 * 取得时间的可读文本
	 * @param date 
	 * @returns 
	 */
	static getLocalTimeStr(date: Date) {
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +
			date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" +
			date.getSeconds();
	}


}