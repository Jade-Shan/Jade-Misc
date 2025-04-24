// import * as $ from "jquery"
// import * as $ from "http://www.jade-dungeon.cn:8081/3rd/jquery/2.1.4/jquery.min.js";

export class PageConfig {
	apiRoot: string;
	pageTitle: string;
	subTitle: string;
	ajaxTimeout: number;

	constructor(apiRoot: string = "/", pageTitle: string = "New Page", subTitle: string = "new Desc",
		ajaxTimeout: number = 5000) //
	{
		this.apiRoot = apiRoot;
		this.pageTitle = pageTitle;
		this.subTitle = subTitle;
		this.ajaxTimeout = ajaxTimeout;
	}
}

export class WebHtmlPage {

	$: any; 
	cfg: PageConfig;

	constructor($: any, cfg: PageConfig) {
		this.$ = $;
		this.cfg = cfg;
	}

	getTitle(): string {
		let result = "";
		result = this.$("h1").html();
		console.log(result)
		return result;
	}

}