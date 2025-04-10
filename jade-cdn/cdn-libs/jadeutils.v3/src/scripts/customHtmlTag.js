/* jshint esversion: 6 */

jadeUtils.initCustomElements = function () {

	/** 创建自定义标签，*/
	class EscapeUnicode extends HTMLElement {
		constructor() {
			super();
			let oldHtml = this.innerHTML;
			this.innerHTML = "&#x" + oldHtml + ";";
		}
	}

	/** 创建自定义标签必须要有一个连字符*/
	customElements.define('esp-unicode', EscapeUnicode);

};
