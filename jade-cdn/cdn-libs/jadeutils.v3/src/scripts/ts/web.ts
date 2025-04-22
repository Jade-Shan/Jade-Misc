/* jshint esversion: 6 */
import { StrUtil } from './basic.js';

export class WebUtil {

	/**
	 * 创建自定义标签，用于显示Unicode字符
	 */
	static initCustomElements() {
		/** 创建自定义标签，用于显示Unicode字符 */
		class EscapeUnicode extends HTMLElement {
			constructor() {
				super();
				let oldHtml = this.innerHTML;
				// this.innerHTML = "&#x" + oldHtml + ";";
				this.innerHTML = oldHtml.replace(/(&amp;#x?[0-9a-fA-F]{1,6};)/m, (e => e.replace('&amp;', '&')));
			}
		}
		/** 创建自定义标签必须要有一个连字符*/
		customElements.define('esp-unicode', EscapeUnicode);
	}

	/**
	 * 以16进制显示字符的Unicode编码
	 * @param  c 
	 * @returns 
	 */
	static transUnicodeWikiInHex(c: string) {
		// `page.transUnicodeWikiInHex('⛵')`
		//  `"<esp-unicode>&#x26f5;</esp-unicode>"`
		return "<esp-unicode>&#x" + c.charCodeAt(0).toString(16) + ";</esp-unicode>";
	}

	/**
	 * 以10进制显示字符的Unicode编码
	 * @param  c 
	 * @returns 
	 */
	static transUnicodeWikiInDec(c: string) {
		// `page.transUnicodeWikiInDec('⛵')`
		//   `"<esp-unicode>&#9973;</esp-unicode>"`
		return "<esp-unicode>&#" + c.charCodeAt(0) + ";</esp-unicode>";
	}


	/**
	 * 
	 * @param  url 
	 */
	static goUrl(url: string) {
		let el = document.createElement("a");
		document.body.appendChild(el);
		el.href = url;

		if (el.click) {
			el.click();
		} else { // safari 浏览器click事件处理
			try {
				let evt = document.createEvent('Event');
				evt.initEvent('click', true, true);
				el.dispatchEvent(evt);
			} catch (e) {
				// new PointOut(e, 2)
			}
		}
	}

	/**
	 * 
	 * @param url 
	 */
	static openWindow(url: string) {
		let el = document.createElement("a");
		document.body.appendChild(el);
		el.href = url;
		el.target = '_blank';

		if (el.click) {
			el.click();
		} else { // safari 浏览器click事件处理
			try {
				let evt = document.createEvent('Event');
				evt.initEvent('click', true, true);
				el.dispatchEvent(evt);
			} catch (e) {
				// new PointOut(e, 2)
			}
		}
	}

	/**
	 * 
	 * @param username 
	 * @param password 
	 * @returns 
	 */
	static webAuthBasic(username: string, password: string) {
		let auth = 'Basic ' + StrUtil.base64encode(StrUtil.utf16to8(username + ':' + password));
		return auth;
	}


	/**
	 * cookie操作
	 * 
	 * @param {string} name 名称
	 * @param {string} value 值
	 * @param {*} options 其他选项
	 * @returns 
	 */
	static cookieOperator(name: string, value: string, options: any) {
		if (typeof value != 'undefined') {
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			let expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				let date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = ';expires=' + date.toUTCString();
			}
			let path     = options.path     ? ';path='   + options.path : '';
			let domain   = options.domain   ? ';domain=' + options.domain : '';
			let secure   = options.secure   ? ';secure' : '';
			let sameSite = options.SameSite ? ';SameSite=' + options.SameSite : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, sameSite, secure].join('');
		} else {
			let cookieValue: string = "";
			if (document.cookie && document.cookie !== '') {
				let cookies = document.cookie.split(';');
				for (let i = 0; i < cookies.length; i++) {
					let cookie = cookies[i].trim();
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	}


	/**
	 * 验证姓名 中文字、英文字母、数字
	 * 
	 * @param username 
	 * @returns 
	 */
	static checkUsername(username: string) {
		return /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9 ]+$/i.test(username);
	}

	/**
	 * 验证手机号
	 * 
	 * @param  phoneno 
	 * @returns 
	 */
	static checkMobile_zh_CN(phoneno: string) {
		return /^1[3|4|5|8][0-9]\d{8}$/.test(phoneno);
	}


	/**
	 * 按文件扩展名检查是否是图片
	 * 
	 * @param postfix 
	 * @returns 
	 */
	static checkImageFilePostfix(postfix: string) {
		if (!postfix.match(/.jpg|.gif|.png|.bmp/i)) {
			return false;
		}
		return true;
	}


	/**
	 * 验证图片大小
	 * 
	 * @param {*} fileInput 
	 * @param {Number} imgMaxSize 
	 * @returns 
	 */
	static checkImageFileSize(fileInput: HTMLInputElement, imgMaxSize: number) {
		let filePath = fileInput.value;
		let fileExt = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
		if (fileInput.files && fileInput.files[0]) {
			// alert(fileInput);
			// alert(fileInput.files[0]);
			console.log(fileInput.files[0].size);
			if (fileInput.files[0].size > imgMaxSize) {
				alert("图片大于500K，请压缩后上传");
				return false;
			}
			let fileList: FileList = fileInput.files;
			for (let i = 0; i < fileList.length; i++) {
				let file: (File | null) = fileList.item(i);
				if (file && file.size > imgMaxSize) {
					alert("图片大于500K，请压缩后上传");
					return false;
				}

			}
		} else {
			console.error("browser version too old");
			return false;
			//fileInput.select();
			//let url = document.selection.createRange().text;
			//try {
			//	let fso = new ActiveXObject("Scripting.FileSystemObject");
			//	console.log(fso.GetFile(url).size);
			//	if (fso.GetFile(url).size) {
			//		alert("图片大于500K，请压缩后上传");
			//		return false;
			//	}
			//} catch (e) {
			//	alert('如果你用的是ie 请将安全级别调低！');
			//}
		}
		return true;
	}

	/**
	 * 
	 * @param  msgMap 
	 * @param  key 
	 * @returns 
	 */
	static getI18n(msgMap: Map<string, string>, key: string) {
		return msgMap.get(key);
	}


}
