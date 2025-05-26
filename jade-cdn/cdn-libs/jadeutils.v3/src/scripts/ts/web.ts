/* jshint esversion: 6 */
import { StrUtil, TimeUtil } from './basic';


/** 创建自定义标签，用于显示Unicode字符 */
export class EscapeUnicode extends HTMLElement {
	constructor() {
		super();
		let oldHtml = this.innerHTML;
		// this.innerHTML = "&#x" + oldHtml + ";";
		this.innerHTML = oldHtml.replace(/(&amp;#x?[0-9a-fA-F]{1,6};)/m, (e => e.replace('&amp;', '&')));
	}
}

export class WebUtil {

	/**
	 * 创建自定义标签，用于显示Unicode字符
	 */
	static initCustomElements(): void {
		/** 创建自定义标签必须要有一个连字符*/
		customElements.define('esp-unicode', EscapeUnicode);
	}

	/**
	 * 以16进制显示字符的Unicode编码
	 * @param  c 
	 * @returns 
	 */
	static transUnicodeWikiInHex(c: string): string {
		// `page.transUnicodeWikiInHex('⛵')`
		//  `"<esp-unicode>&#x26f5;</esp-unicode>"`
		return "<esp-unicode>&#x" + c.charCodeAt(0).toString(16) + ";</esp-unicode>";
	}

	/**
	 * 以10进制显示字符的Unicode编码
	 * @param  c 
	 * @returns 
	 */
	static transUnicodeWikiInDec(c: string): string {
		// `page.transUnicodeWikiInDec('⛵')`
		//   `"<esp-unicode>&#9973;</esp-unicode>"`
		return "<esp-unicode>&#" + c.charCodeAt(0) + ";</esp-unicode>";
	}


	/**
	 * 
	 * @param  url 
	 */
	static goUrl(url: string): void {
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
	static openWindow(url: string): void {
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
	static webAuthBasic(username: string, password: string): string {
		let auth = 'Basic ' + StrUtil.base64encode(StrUtil.utf16to8(username + ':' + password));
		return auth;
	}


	/**
	 * cookie操作
	 * 
	 */
	static loadCookieValue(name: string): string {
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

	/**
	 * 
	 * @param name 
	 */
	static deleteCooke(name: string): void {
		let d = new Date();
		d.setTime(d.getTime() + ((-1 * TimeUtil.UNIT_DAY)));
	}

	/**
	 * 
	 * @param name 
	 * @param rec 
	 * @returns 
	 */
	static setCookieValue(name: string,  value: string, rec: {expireDays?: number, 
		path?: string, domain?: string, secure?: boolean, sameSite?: string}): void 
	{
		if (!value) {
			return;
		}
		rec.expireDays  = rec.expireDays  ? rec.expireDays  : 30;
		rec.path        = rec.path        ? rec.path        : "";
		rec.domain      = rec.domain      ? rec.domain      : "";
		rec.sameSite    = rec.sameSite    ? rec.sameSite    : "Lax";
		rec.secure      = rec.secure      ? rec.secure      : false;

		if ("None" === rec.sameSite) {
			rec.secure = true;
		} else if ("Lax" != rec.sameSite && "Strict" != rec.sameSite) {
			rec.sameSite = "Lax";
		}
		//
		let expireStr   = `;expires=${(new Date((new Date()).getTime() + (rec.expireDays * TimeUtil.UNIT_DAY))).toUTCString()}`;
		let pathStr     = rec.path     ? `;path=${    rec.path    }` : '';
		let domainStr   = rec.domain   ? `;domain=${  rec.domain  }` : '';
		let sameSiteStr = rec.sameSite ? `;SameSite=${rec.sameSite}` : '';
		let secureStr   = rec.secure   ? `;secure`                   : '';
		document.cookie = `${name}=${encodeURIComponent(value)}${expireStr}${pathStr}${domainStr}${sameSiteStr}${secureStr}`;


	}

	/**
	 * 验证姓名 中文字、英文字母、数字
	 * 
	 * @param username 
	 * @returns 
	 */
	static checkUsername(username: string): boolean {
		return /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9 ]+$/i.test(username);
	}

	/**
	 * 验证手机号
	 * 
	 * @param  phoneno 
	 * @returns 
	 */
	static checkMobile_zh_CN(phoneno: string): boolean {
		return /^1[3|4|5|8][0-9]\d{8}$/.test(phoneno);
	}


	/**
	 * 按文件扩展名检查是否是图片
	 * 
	 * @param postfix 
	 * @returns 
	 */
	static checkImageFilePostfix(postfix: string): boolean {
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
	static checkImageFileSize(fileInput: HTMLInputElement, imgMaxSize: number): boolean {
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
	static getI18n(msgMap: Map<string, string>, key: string): (string | undefined) {
		return msgMap.get(key);
	}


}
