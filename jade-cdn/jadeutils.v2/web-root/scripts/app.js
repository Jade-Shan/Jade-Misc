String.prototype.trim=function() { return this.replace(/(^\s*)|(\s*$)/g, ""); };
String.prototype.trimLeft=function() { return this.replace(/(^\s*)/g, ""); };
String.prototype.trimRight=function() { return this.replace(/(\s*$)/g, ""); };

var net = net || {};
net.jadedungeon = net.jadedungeon || {};
net.jadedungeon.utils = net.jadedungeon.utils || {};

(function ($) {
	net.jadedungeon.utils.string = function () { init(); return this; };
	var self = net.jadedungeon.utils.string.prototype;
	var init = function (cfg) {
	};

	self.formatNumber = function (num, scale) {
		scale = scale > 0 && scale <= 20 ? scale : 2;
		num = num.toFixed(scale) + "";
		var l = num.split(".")[0].split("").reverse(), r = num.split(".")[1];
		var t = "";
		for (var i = 0; i < l.length; i++) {  
			t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? "," : "");  
		}  
		return t.split("").reverse().join("") + "." + r;  
	};

	self.unformatNumber = function (number) {
		return parseFloat(s.replace(/[^\d\.-]/g, ""));
	};

	self.utf16to8 = function (str) {
		var out, i, len, c;

		out = "";
		len = str.length;
		for(i = 0; i < len; i++) {
			c = str.charCodeAt(i);
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
	};
	
	self.utf8to16 = function (str) {
		var out, i, len, c;
		var char2, char3;

		out = "";
		len = str.length;
		i = 0;
		while(i < len) {
			c = str.charCodeAt(i++);
			switch(c >> 4) {
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					out += str.charAt(i-1);
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
	
	self.base64encode = function (str) {
		var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + 
			"abcdefghijklmnopqrstuvwxyz0123456789+/";
		var out, i, len;
		var c1, c2, c3;
	
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	};
	
	self.base64decode = function (str) {
		var base64DecodeChars = new Array(
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
				52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
				-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
				15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
				-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
				41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
		var c1, c2, c3, c4;
		var i, len, out;
	
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while(i < len && c1 == -1);
			if(c1 == -1)
				break;
	
			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while(i < len && c2 == -1);
			if(c2 == -1)
				break;
	
			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
	
			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if(c3 == 61)
					return out;
				c3 = base64DecodeChars[c3];
			} while(i < len && c3 == -1);
			if(c3 == -1)
				break;
	
			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
	
			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if(c4 == 61)
					return out;
				c4 = base64DecodeChars[c4];
			} while(i < len && c4 == -1);
			if(c4 == -1)
				break;
			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	};

})(jQuery);


(function ($) {
	net.jadedungeon.utils.time= function () { init(); return this; };
	var self = net.jadedungeon.utils.time.prototype;
	var init = function (cfg) {
	};

	self.addDay = function (date, days) {
		var newDate = new Date();
		newDate.setDate(date.getDate() + days);
		return newDate;
	};
	
	self.cleanDay = function (date) {
		var newDate = new Date();
		newDate.setTime(date.getTime());
		newDate.setHours(0,0,0,0);
		return newDate;
	};

	self.getLocalTimeZone = function () {
		var d = new Date();
		return ("GMT" + d.getTimezoneOffset() / 60);
	};

	self.getLocalTimeZoneName = function () {
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
		if (-60 == so && -60 == wo) return 'Atlantic/Cape_Verde';
		if (0 === so && -60 === wo) return 'Atlantic/Azores';
		if (0 === so && 0 === wo) return 'Africa/Casablanca';
		if (60 == so && 0 === wo) return 'Europe/London';
		if (60 == so && 60 == wo) return 'Africa/Algiers';
		if (60 == so && 120 == wo) return 'Africa/Windhoek';
		if (120 == so && 60 == wo) return 'Europe/Amsterdam';
		if (120 == so && 120 == wo) return 'Africa/Harare';
		if (180 == so && 120 == wo) return 'Europe/Athens';
		if (180 == so && 180 == wo) return 'Africa/Nairobi';
		if (240 == so && 180 == wo) return 'Europe/Moscow';
		if (240 == so && 240 == wo) return 'Asia/Dubai';
		if (270 == so && 210 == wo) return 'Asia/Tehran';
		if (270 == so && 270 == wo) return 'Asia/Kabul';
		if (300 == so && 240 == wo) return 'Asia/Baku';
		if (300 == so && 300 == wo) return 'Asia/Karachi';
		if (330 == so && 330 == wo) return 'Asia/Calcutta';
		if (345 == so && 345 == wo) return 'Asia/Katmandu';
		if (360 == so && 300 == wo) return 'Asia/Yekaterinburg';
		if (360 == so && 360 == wo) return 'Asia/Colombo';
		if (390 == so && 390 == wo) return 'Asia/Rangoon';
		if (420 == so && 360 == wo) return 'Asia/Almaty';
		if (420 == so && 420 == wo) return 'Asia/Bangkok';
		if (480 == so && 420 == wo) return 'Asia/Krasnoyarsk';
		if (480 == so && 480 == wo) return 'Australia/Perth';
		if (540 == so && 480 == wo) return 'Asia/Irkutsk';
		if (540 == so && 540 == wo) return 'Asia/Tokyo';
		if (570 == so && 570 == wo) return 'Australia/Darwin';
		if (570 == so && 630 == wo) return 'Australia/Adelaide';
		if (600 == so && 540 == wo) return 'Asia/Yakutsk';
		if (600 == so && 600 == wo) return 'Australia/Brisbane';
		if (600 == so && 660 == wo) return 'Australia/Sydney';
		if (630 == so && 660 == wo) return 'Australia/Lord_Howe';
		if (660 == so && 600 == wo) return 'Asia/Vladivostok';
		if (660 == so && 660 == wo) return 'Pacific/Guadalcanal';
		if (690 == so && 690 == wo) return 'Pacific/Norfolk';
		if (720 == so && 660 == wo) return 'Asia/Magadan';
		if (720 == so && 720 == wo) return 'Pacific/Fiji';
		if (720 == so && 780 == wo) return 'Pacific/Auckland';
		if (765 == so && 825 == wo) return 'Pacific/Chatham';
		if (780 == so && 780 == wo) return 'Pacific/Enderbury';
		if (840 == so && 840 == wo) return 'Pacific/Kiritimati';
		return 'Not in US';
	};

	self.getTimeArea = function (date, days) {
			var d1 = self.cleanDay(date);
			var d2 = self.cleanDay(self.addDay(d1, days));
	
			if (d1 < d2) {
				return {floor: d1, ceil: d2};
			} else {
				return {floor: d2, ceil: d1};
			}
	};

	self.getLocalTimeStr = function (date) {
		return  date.getFullYear() + "-" + (date.getMonth()+1) + "-" + 
			date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + 
			date.getSeconds();
	};

})(jQuery);



(function ($) {
	net.jadedungeon.utils.validator= function () { init(); return this; };
	var self = net.jadedungeon.utils.validator.prototype;
	var init = function (cfg) {
	};

	/**
	 * 验证姓名 中文字、英文字母、数字
	 */
	self.checkUsername = function (username) {
		return /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9 ]+$/i.test(username);
	};

	/**
	 * 验证手机号
	 */
	self.checkMobile_zh_CN = function (phoneno) {
		return /^1[3|4|5|8][0-9]\d{8}$/.test(phoneno);
	};


	/**
	 * 按文件扩展名检查是否是图片
	 */
	self.checkImageFilePostfix = function (postfix) {
		if (!postfix.match(/.jpg|.gif|.png|.bmp/i)) {
			return false;
		}
		return true;
	};

 /**
  * 验证图片大小
  */
 self.checkImageFileSize = function (fileInput, imgMaxSize) {
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
 		for ( var i in xx) {
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
	net.jadedungeon.utils.web = function () { init(); return this; };
	var self = net.jadedungeon.utils.web.prototype;
	var init = function (cfg) {
	};

	self.goUrl = function (url) {
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

	self.openWindow = function (url) {
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
	self.cookieOperator = function (name, value, options) {
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
	
})(jQuery);


(function ($) {
	net.jadedungeon.utils.i18n = function (data) { init(data); return this; };
	var self = net.jadedungeon.utils.i18n.prototype;

	var init = function (data) {
		self.msg = data || {};
	};
	
	self.get = function (key) {
		return self.msg[key];
	};

})(jQuery);



(function ($) {
	net.jadedungeon.dataStructure = function () { init(); return this; };
	var self = net.jadedungeon.dataStructure.prototype;
	var init = function (cfg) {
	};

	/*
	 * MAP对象，实现MAP功能
	 *
	 * 接口：
	 * size()     获取MAP元素个数
	 * isEmpty()    判断MAP是否为空
	 * removeAll()     删除MAP所有元素
	 * put(key, value)   向MAP中增加元素（key, value) 
	 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
	 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
	 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	 * containsKey(key)  判断MAP中是否含有指定KEY的元素
	 * containsValue(value) 判断MAP中是否含有指定VALUE的元素
	 * values()    获取MAP中所有VALUE的数组（ARRAY）
	 * keys()     获取MAP中所有KEY的数组（ARRAY）
	 *
	 * 例子：
	 * var map = new Map();
	 *
	 * map.put("key", "value");
	 * var val = map.get("key")
	 * ……
	 *
	 */
	(function ($) {
		net.jadedungeon.dataStructure.Map = function () { init(); return this; };
		var mapSelf = net.jadedungeon.dataStructure.Map.prototype;
		var init = function (initData) {
			mapSelf.elements = initData || [];
		};

		//获取MAP元素个数
		mapSelf.size = function() { return mapSelf.elements.length; };

		//判断MAP是否为空
		mapSelf.isEmpty = function() { return (mapSelf.elements.length < 1); };

		//删除MAP所有元素
		mapSelf.removeAll = function() { mapSelf.elements = []; };

		//向MAP中增加元素（key, value) 
		mapSelf.put = function(_key, _value) {
			mapSelf.elements.push({ key : _key, value : _value });
		};

		//删除指定KEY的元素，成功返回True，失败返回False
		mapSelf.remove = function(_key) {
			var bln = false;
			try {
				for (i = 0; i < mapSelf.elements.length; i++) {
					if (mapSelf.elements[i].key == _key) {
						mapSelf.elements.splice(i, 1);
						return true;
					}
				}
			} catch (e) { bln = false; }
			return bln;
		};

		//获取指定KEY的元素值VALUE，失败返回NULL
		mapSelf.get = function(_key) {
			try {
				for (i = 0; i < mapSelf.elements.length; i++) {
					if (mapSelf.elements[i].key == _key) {
						return mapSelf.elements[i].value;
					}
				}
			} catch (e) { return null; }
		};

		//获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），
		//失败返回NULL
		mapSelf.element = function(_index) {
			if (_index < 0 || _index >= mapSelf.elements.length) {
				return null;
			}
			return mapSelf.elements[_index];
		};

		//判断MAP中是否含有指定KEY的元素
		mapSelf.containsKey = function(_key) {
			var bln = false;
			try {
				for (i = 0; i < mapSelf.elements.length; i++) {
					if (mapSelf.elements[i].key == _key) { bln = true; }
				}
			} catch (e) { bln = false; }
			return bln;
		};

		//判断MAP中是否含有指定VALUE的元素
		mapSelf.containsValue = function(_value) {
			var bln = false;
			try {
				for (i = 0; i < mapSelf.elements.length; i++) {
					if (mapSelf.elements[i].value == _value) { bln = true; }
				}
			} catch (e) { bln = false; }
			return bln;
		};

		//获取MAP中所有VALUE的数组（ARRAY）
		mapSelf.values = function() {
			var arr = [];
			for (i = 0; i < mapSelf.elements.length; i++) {
				arr.push(mapSelf.elements[i].value);
			}
			return arr;
		};

		//获取MAP中所有KEY的数组（ARRAY）
		mapSelf.keys = function() {
			var arr = [];
			for (i = 0; i < mapSelf.elements.length; i++) {
				arr.push(mapSelf.elements[i].key);
			}
			return arr;
		};

	})(jQuery);

	/**
	 * 定义堆栈类 实现堆栈基本功能
	 */
	(function ($) {
		net.jadedungeon.dataStructure.Stack = function () { init(); return this; };
		var stackSelf = net.jadedungeon.dataStructure.Stack.prototype;
		var init = function (initData) {
			stackSelf.aElement = initData || []; // 存储元素数组
		};

		/**
		 * 元素入栈 1.Push方法参数可以多个 2.参数为空时返回-1
		 * 
		 * @param: 入栈元素列表
		 * @return: 堆栈元素个数
		 */
		stackSelf.push = function(vElement) {
			if (arguments.length === 0) return -1;
			// 元素入栈
			for ( var i = 0; i < arguments.length; i += 1) {
				stackSelf.aElement.push(arguments[i]);
			}
			return stackSelf.aElement.length;
		};

		/**
		 * 元素出栈 当堆栈元素为空时,返回null
		 * 
		 * @return: vElement
		 */
		stackSelf.pop = function() {
			if (stackSelf.aElement.length === 0)
				return null;
			else
				return stackSelf.aElement.pop();
		};

		/**
		 * 获取堆栈元素个数
		 * 
		 * @return: 元素个数
		 */
		stackSelf.size = function() { return stackSelf.aElement.length; };

		/**
		 * 返回栈顶元素值 若堆栈为空则返回null
		 * 
		 * @return: vElement
		 */
		stackSelf.getTop = function() {
			if (stackSelf.aElement.length === 0)
				return null;
			else
				return stackSelf.aElement[stackSelf.aElement.length - 1];
		};

		/**
		 * 将堆栈置空
		 */
		stackSelf.removeAll = function() { stackSelf.aElement.length = 0; };

		/**
		 * 判断堆栈是否为空
		 * 
		 * @return: 堆栈为空返回true,否则返回false
		 */
		stackSelf.isEmpty = function() {
			if (stackSelf.aElement.length === 0)
				return true;
			else
				return false;
		};

		/**
		 * 将堆栈元素转化为字符串
		 * 
		 * @return: 堆栈元素字符串
		 */
		stackSelf.toString = function() {
			var sResult = (stackSelf.aElement.reverse()).toString();
			stackSelf.aElement.reverse();
			return sResult;
		};
	})(jQuery);


	/**
	 * 定义队列类 实现队列基本功能
	 */
	(function ($) {
		net.jadedungeon.dataStructure.Queue = function () { init(); return this; };
		var queueSelf = net.jadedungeon.dataStructure.Queue.prototype;
		var init = function (cfg) {
			queueSelf.aElement = []; // 存储元素数组
		};

		/**
		 * 元素入队 1.EnQueue方法参数可以多个 2.参数为空时返回-1
		 * 
		 * @param: vElement元素列表
		 * @return: 返回当前队列元素个数
		 */
		queueSelf.push = function(vElement) {
			if (arguments.length === 0) return -1;
			// 元素入队
			for ( var i = 0; i < arguments.length; i += 1) { queueSelf.aElement.push(arguments[i]); }
			return queueSelf.aElement.length;
		};

		/**
		 * 元素出队 当队列元素为空时,返回null
		 * 
		 * @return: vElement
		 */
		queueSelf.pop = function() {
			if (queueSelf.aElement.length === 0)
				return null;
			else
				return queueSelf.aElement.shift();
		};

		/**
		 * 获取队列元素个数
		 * 
		 * @return: 元素个数
		 */
		queueSelf.size = function() { return queueSelf.aElement.length; };

		/**
		 * 返回队头素值 若队列为空则返回null
		 * 
		 * @return: vElement
		 */
		queueSelf.GetHead = function() {
			if (queueSelf.aElement.length === 0)
				return null;
			else
				return queueSelf.aElement[0];
		};

		/**
		 * 返回队尾素值 若队列为空则返回null
		 * 
		 * @return: vElement
		 */
		queueSelf.GetEnd = function() {
			if (queueSelf.aElement.length === 0)
				return null;
			else
				return queueSelf.aElement[queueSelf.aElement.length - 1];
		};

		/**
		 * 将队列置空
		 */
		queueSelf.removeAll = function() { queueSelf.aElement.length = 0; };

		/**
		 * 判断队列是否为空
		 * 
		 * @return: 队列为空返回true,否则返回false
		 */
		queueSelf.isEmpty = function() {
			if (queueSelf.aElement.length === 0)
				return true;
			else
				return false;
		};

		/**
		 * 将队列元素转化为字符串
		 * 
		 * @return: 队列元素字符串
		 */
		queueSelf.toString = function() {
			var sResult = (queueSelf.aElement.reverse()).toString();
			queueSelf.aElement.reverse();
			return sResult;
		};
	})(jQuery);


	(function () {
		net.jadedungeon.dataStructure.TreeNode = function () { init(); return this; };
		var treeNodeSelf = net.jadedungeon.dataStructure.TreeNode.prototype;
		var init = function (cfg) {
		};

	})();

})(jQuery);

var jadeUtils = jadeUtils || {};
jadeUtils.string = new net.jadedungeon.utils.string(); 
jadeUtils.time = new net.jadedungeon.utils.time(); 
jadeUtils.dataStructure = new net.jadedungeon.dataStructure(); 
jadeUtils.validator = new net.jadedungeon.utils.validator(); 
jadeUtils.web = new net.jadedungeon.utils.web(); 

