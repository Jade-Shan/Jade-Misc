/* jshint esversion: 6 */


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


export let addDay = function (date, days) {
	var newDate = new Date();
	newDate.setDate(date.getDate() + days);
	return newDate;
};

export let cleanDay = function (date) {
	var newDate = new Date();
	newDate.setTime(date.getTime());
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};

export let getLocalTimeZone = function () {
	var d = new Date();
	return ("GMT" + d.getTimezoneOffset() / 60);
};

export let getLocalTimeZoneName = function () {
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

export let getTimeArea = function (date, days) {
	var d1 = proto.cleanDay(date);
	var d2 = proto.cleanDay(proto.addDay(d1, days));

	if (d1 < d2) {
		return { floor: d1, ceil: d2 };
	} else {
		return { floor: d2, ceil: d1 };
	}
};

export let getLocalTimeStr = function (date) {
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +
		date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" +
		date.getSeconds();
};
