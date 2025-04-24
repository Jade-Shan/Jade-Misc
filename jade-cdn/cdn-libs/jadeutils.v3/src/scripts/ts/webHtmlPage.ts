// import * as $ from "jquery"
// import * as $ from "http://www.jade-dungeon.cn:8081/3rd/jquery/2.1.4/jquery.min.js";

declare function $(selector: string): any;

declare namespace $ {
    function ajax(url: string, settings?: any): void;
	function each<T>(arr: Array<T>, fun: (i: number, t: T) => void): void;
}

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

export class NavTreeNode {
	id: (string|null);
	title: string;
	link: (string|null);
	isNewWin: boolean;
	subs: (Array<NavTreeNode> | null);

	constructor(title: string = "", link: (string|null) = null, isNewWin: boolean = false,id?:string, subs?: Array<NavTreeNode>) {
		this.title = title;
		this.link = link;
		this.isNewWin = isNewWin;
		this.subs = subs && subs.length > 0 ? subs : null;
		this.id   = id && id.length > 0 ? id: null;
	}
}


export class WebHtmlPage {

	cfg: PageConfig;

	constructor(cfg: PageConfig) {
		this.cfg = cfg;
	}

	getHtml(sltStr: string): string { return $(sltStr).html(); }

	renderTopNav(cfg: PageConfig, items: Array<NavTreeNode>): void {
		let navhtml = '<div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#example-navbar-collapse"> <span class="sr-only">切换导航</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="/">Jade Dungeon</a> </div> <div class="collapse navbar-collapse" id="example-navbar-collapse"> <ul class="nav navbar-nav">';
		let addLink = (item: NavTreeNode, cfg: PageConfig) =>  {
			if (item.title === "") {
				navhtml = navhtml + '<li class="divider"></li>';
			} else {
				if (cfg && cfg.pageTitle === item.title) {
					navhtml = navhtml + '<li class="active">';
				} else { navhtml = navhtml + '<li>'; }
				navhtml = navhtml + '<a ' ;
				if (item.isNewWin) { navhtml = navhtml + ' target="_blank" '; } 
				if (item.id) { navhtml = navhtml + ' id="' + item.id + '" '; } 
				navhtml = navhtml + ' href="' + item.link + '">' + item.title + '</a></li>';
			}
		};

		let addSub = function (item: NavTreeNode) {
			navhtml = navhtml + '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">';
			navhtml = navhtml + item.title;
			navhtml = navhtml + '<b class="caret"></b></a><ul class="dropdown-menu">';
			if (item.subs && item.subs.length > 0) {
				$.each(item.subs, function (i, item) { addLink(item, cfg); });
			}
			navhtml = navhtml + '</ul></li>';
		};

		$.each(items, (i, item) => {
				if (item.link) { addLink(item, cfg); } else if (item.subs) { addSub(item); }
		});
		navhtml = navhtml + '</ul></div>';
		$("#topnav").html(navhtml);
	}

}