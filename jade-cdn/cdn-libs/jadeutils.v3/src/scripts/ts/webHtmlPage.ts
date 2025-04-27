import { WebUtil } from "./web";

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

export interface NavTreeNode {
	id?: string;
	title: string;
	link?: string
	isNewWin?: boolean;
	subs?: Array<NavTreeNode>;
}


export class WebHtmlPage {

	cfg: PageConfig;

	constructor(cfg: PageConfig) {
		this.cfg = cfg;
	}

	/**
	 * 
	 * @param cfg 顶部导航栏
	 * @param items 
	 */
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


	renderPagination(pageNo: number, count: number, genPageHref?: (n: number) => string): string {
		pageNo = pageNo && pageNo > 0 ? pageNo : 1;
		count  = count  && count  > 0 ? count  : 1;
		let size = 5;
		// 1 ... 3 4 5 6 7 _8_ 9 10 11 12 13 ... 20
		genPageHref = genPageHref ? genPageHref : (num: number) =>`javascript:nextPage(${num});`; 
		let i = 1;
		let html = '<ul class="pagination center">';
		// first page
		if (pageNo === 1) {
			html = html + '<li><a class="disable" href="javascript:void(0);">&laquo;</a></li>';
		} else {
			html = html + `<li><a href="${genPageHref(pageNo - 1)}">&laquo;</a></li>`;
			html = html + `<li><a href="${genPageHref(i)}'">${i}</a></li>`;
		}
		i = i + 1;
		// elps
		if (pageNo > (size + 2)) {
			i = pageNo - size;
			html = html + '<li><a class="disable" href="javascript:void(0);">...</a></li>';
		}
		// pre no
		while (pageNo > i) {
			html = html + `<li><a href="${genPageHref(i)}'">${i}</a></li>`;
			i = i + 1;
		}
		// curr page
		html = html + `<li class="active"><a href="javascript:void(0);">${pageNo }</a></li>`;
		// post no
		i = pageNo + 1;
		while (i < count && i <= (pageNo + size)) {
			html = html + `<li><a href="${genPageHref(i)}'">${i}</a></li>`;
			i = i + 1;
		}
		// elps
		if ((i + 2) < count) {
			html = html + '<li><a class="disable" href="javascript:void(0);">...</a></li>';
		}
		if (pageNo === count) {
			html = html + '<li><a class="disable" href="javascript:void(0);">&raquo;</a></li>';
		} else {
			html = html + `<li><a href="${genPageHref(count)}">${count}</a></li>`;
			html = html + `<li><a href="${genPageHref(pageNo + 1)}">&raquo;</a></li>`;
		}
		html = html + '</ul>';
		return html;
	};

	/**
	 * 
	 * @param page 
	 * @param elemSlt 
	 */
	renderSubTitle(cfg: PageConfig, elemSlt?: string): void { $(elemSlt ? elemSlt : "#subTitle").html(cfg.subTitle); };

	/**
	 * 
	 * @param elemSlt 
	 */
	renderPhotoFrame(elemSlt?: string): void {
		let html = '<div class="modal-dialog"><div class="modal-content">';
		html = html + '<div class="modal-header">';
		html = html + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html = html + '<h4 class="modal-title" id="photo-frame-label"></h4></div>';
		html = html + '<div class="modal-body row">';
		html = html + '<img id="photo-frame-img" alt="" src="" class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >';
		html = html + '</div></div>';
		$(elemSlt ? elemSlt : "#photo-frame").html(html);
	};

	/**
	 * 
	 * @param elemSlt 
	 */
	viewPic(elemSlt: string) : void {
		let m: JQuery<HTMLElement> = $(elemSlt);
		let str1 = m.attr("alt");
		let str2 = m.attr("src");
		$("#photo-frame-label").html(str1 ? str1 : "");
		$("#photo-frame-img").attr(str2 ? str2 : "");
		$("#photo-frame-img").attr(str1 ? str1 : "");
		($('#photo-frame') as any).modal('show');
	};

	/**
	 * 
	 * @param themeName 
	 * @param cookieKey 
	 * @param elemSlt 
	 */
	changeTheme(themeName: string, cookieKey?: string, elemSlt?: string): void {
		let styles = document.querySelectorAll(elemSlt ? elemSlt : 'link[title]');
		for (let i=0; i < styles.length; i++) {
			let lnk = styles[i] as HTMLLinkElement;
			var ttitle = lnk.title;
			if (ttitle == themeName) { 
				WebUtil.setCookieValue(cookieKey ? cookieKey : "ui.theme", themeName, {sameSite:'Lax'});
				lnk.disabled = false; 
			} else { lnk.disabled = true; }
		}
	};

	/**
	 * 
	 * @param cookieKey 
	 */
	initUITheme(cookieKey?: string): void {
		let currUITheme = WebUtil.loadCookieValue(cookieKey ? cookieKey : "ui.theme");
		if (currUITheme) {
			this.changeTheme(currUITheme);
		}
	};


}