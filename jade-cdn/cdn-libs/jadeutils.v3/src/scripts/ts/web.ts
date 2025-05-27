/* jshint esversion: 6 */
import { StrUtil, TimeUtil } from './basic';
import { SimpleMap } from './dataStructure';


/** 创建自定义标签，用于显示Unicode字符 */
export class EscapeUnicode extends HTMLElement {
	constructor() {
		super();
		let oldHtml = this.innerHTML;
		// this.innerHTML = "&#x" + oldHtml + ";";
		this.innerHTML = oldHtml.replace(/(&amp;#x?[0-9a-fA-F]{1,6};)/m, (e => e.replace('&amp;', '&')));
	}
}


class HttpRequestOptionImpl {
	ingoreCache: boolean;
	headers: SimpleMap<string, string>;
	timeout: number;
	withCredentials: boolean;

	constructor(ingoreCache: boolean, headers: SimpleMap<string, string> | null, timeout: number, withCredentials: boolean) {
		this.ingoreCache = ingoreCache;
		this.withCredentials = withCredentials;
		this.headers = headers ? headers : new SimpleMap([
			["Accept", "application/json, text/javascript, text/plain; charset=UTF-8"],
			["Content-Type", "application/json; charset=UTF-8"]]);
		this.timeout = timeout ? timeout : 10_000;
	}
}

class HttpRequestImpl<T extends any> {
	method: ("GET" | "POST");
	url: string;
	opt: HttpRequestOptionImpl;
	body: T | null;

	constructor(method: "GET" | "POST", url: string, opt: HttpRequestOptionImpl, body: T | null) {
		this.method = method;
		this.url = url;
		this.body = body;
		this.opt = opt ? opt : new HttpRequestOptionImpl(false, null, 10_000, true);
	}
}

class HttpResponseImpl<T extends any> {
	statusCode: number;
	statusMsg: string;
	headers: SimpleMap<string, string>;
	body: T | null;

	constructor(statusCode: number, statusMsg: string, headers: SimpleMap<string, string> | null, body: T | null) {
		this.statusCode = statusCode;
		this.statusMsg = statusMsg;
		this.headers = headers ? headers : new SimpleMap();
		this.body = body;
	}
}

class HttpRequestHandlerImpl<T extends any, R extends any> {
		onLoad    : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onProgress: (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onTimeout : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onAbort   : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onError   : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;

		constructor(
			onLoad    : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>,
			onProgress: (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>,
			onError   : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>,
			onTimeout : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>,
			onAbort   : (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>)  //
		{
			this.onLoad     = onLoad    ;
			this.onProgress = onProgress;
			this.onError    = onError   ;
			this.onTimeout  = onTimeout ;
			this.onAbort    = onAbort   ;
		}
}

function requestHttp<T extends any, R extends any>(req: HttpRequestImpl<T>, //
	hdl: HttpRequestHandlerImpl<T, R>): Promise<HttpResponseImpl<R>> // 
{
	return new Promise<HttpResponseImpl<R>>((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open(req.method, req.url);
		xhr.withCredentials = req.opt.withCredentials;
		if (req.opt.ingoreCache) {
			xhr.setRequestHeader('Cache-Control', 'no-cache');
		}
		if (req.opt.headers) {
			for (let i = 0; i < req.opt.headers.size(); i++) {
				let hh = req.opt.headers.getElementByIndex(i);
				if (hh) {
					xhr.setRequestHeader(hh[0], hh[1]);
				}
			}
		}
		xhr.timeout = req.opt.timeout;
		//
		xhr.onload     = (evt: ProgressEvent) => { hdl.onLoad    (evt, xhr, req); };
		xhr.onprogress = (evt: ProgressEvent) => { hdl.onProgress(evt, xhr, req); };
		xhr.onerror    = (evt: ProgressEvent) => { hdl.onError   (evt, xhr, req); };
		xhr.ontimeout  = (evt: ProgressEvent) => { hdl.onTimeout (evt, xhr, req); };
		xhr.onabort    = (evt: ProgressEvent) => { hdl.onAbort   (evt, xhr, req); };
	});
}


export interface HttpRequestOption {
	ingoreCache?: boolean;
	headers?: SimpleMap<string, string>;
	timeout?: number;
	withCredentials?: boolean;
}

export interface HttpRequest<T extends any> {
	method?: ("GET" | "POST");
	url: string;
	opt?: HttpRequestOptionImpl;
	body?: T ;
}

export interface HttpResponse<T extends any> {
	statusCode: number;
	statusMsg: string;
	headers: SimpleMap<string, string>;
	body: T | null;
}

export interface HttpRequestHandler<T extends any, R extends any> {
		onLoad    ?: (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onProgress?: (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onTimeout ?: (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onAbort   ?: (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
		onError   ?: (evt: ProgressEvent, xhr: XMLHttpRequest, req: HttpRequestImpl<T>) => HttpResponseImpl<R>;
}


export class WebUtil {

	static doHttpRequest<T extends any, R extends any>(request: HttpRequest<T>, handler?: HttpRequestHandler<T,R>): Promise<HttpResponseImpl<R>> {
		let method = request.method ? request.method : "GET";
		let reqOpt = request.opt ? request.opt : new HttpRequestOptionImpl(false, null, 10_000, true);
		let reqBody = request.body ? request.body : null;
		let req: HttpRequestImpl<T> = new HttpRequestImpl<T>(method, request.url, reqOpt, reqBody);

		let hdl: HttpRequestHandlerImpl<T, R> = new HttpRequestHandlerImpl( //
			handler && handler.onLoad      ? handler.onLoad      : (evt, xhr, req) => new HttpResponseImpl<R>(-1, "unknow err" , null, null),  //
			handler && handler.onProgress  ? handler.onProgress  : (evt, xhr, req) => new HttpResponseImpl<R>(-1, "on progress", null, null),  //
			handler && handler.onTimeout   ? handler.onTimeout   : (evt, xhr, req) => new HttpResponseImpl<R>(-1, "time-out"   , null, null),  //
			handler && handler.onAbort     ? handler.onAbort     : (evt, xhr, req) => new HttpResponseImpl<R>(-1, "abort"      , null, null),  //
			handler && handler.onError     ? handler.onError     : (evt, xhr, req) => new HttpResponseImpl<R>(-1, "unknow err" , null, null));

		return requestHttp(req, hdl);
	}

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
