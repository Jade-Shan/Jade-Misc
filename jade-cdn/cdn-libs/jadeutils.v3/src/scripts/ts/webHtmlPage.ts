import { WebUtil } from "./web.js";

export interface PageConfig {
	apiRoot: string;
	pageTitle: string;
	subTitle: string;
	ajaxTimeout: number;

	//constructor(apiRoot: string = "/", pageTitle: string = "New Page", subTitle: string = "new Desc",
	//	ajaxTimeout: number = 5000) //
	//{
	//	this.apiRoot = apiRoot;
	//	this.pageTitle = pageTitle;
	//	this.subTitle = subTitle;
	//	this.ajaxTimeout = ajaxTimeout;
	//}

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
	renderTopNav(cfg: PageConfig, items: Array<NavTreeNode>, elemSlt?: string): void {
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
		$(elemSlt ? elemSlt : "#topnav").html(navhtml);
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
	bindInitDataTable(elemSlt?: string): void {
		$(elemSlt ? elemSlt : 'div.content>table').each((n, t) => { 
			let table = $(t) as any; 
			let thead = table.find('thead') as any;
			if (thead.size() < 1) {
				thead = $('<thead></thead>');
				let rows = table.find('tbody>tr') as any;
				rows.each((ln: any, r: any) => {
					let row = $(r); let th = row.find("th") as any;
					if (th.size() > 0) { thead.append(row); }
				});
				if (thead.find('th').size() > 0) { // 要有表头才能加上DataTable
					table.append(thead); 
					let rowCount = rows.size() as number;
					if (rowCount > 20) {  // 20行不到的表就不加DataTable了
						try { 
							var info = false; var paging = false; var searching = false;
							if (rowCount > 30) { // 大于30行的表要加上搜索和分页
								info = true; 
								paging = true; 
								searching = true;
							}
							table.DataTable({info: info, paging: paging, searching: searching}); 
						} catch (e) { console.error(e); }
					}
				}
			}
		});
	}


	/**
	 * 必须要在页面上加上：
	 * `<div id="photo-frame" class="modal fade photo-frame" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>`
	 * 因为bootstrap的导入在是最前面。如果bootstrap.js已经导入了，再添加`div`就没有用了。
	 * 
	 * @param photoFrameId 
	 */
	initPhotoFrame(photoFrameId?: string): void {
		photoFrameId = photoFrameId ? photoFrameId: "photo-frame";
		let html = `
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h4 class="modal-title" id="${photoFrameId}-label"></h4>
						</div>
						<div class="modal-body row">
							<img id="${photoFrameId}-img" alt="" src="" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
						</div>
					</div>
				</div>`;
		$(`#${photoFrameId}`).html(html);
	};

	/**
	 * 
	 * @param elemSlt 
	 */
	static viewPic(title: string, url: string, photoFrameId?: string) : void {
		photoFrameId = photoFrameId ? photoFrameId: "photo-frame";
		$(`#${photoFrameId}-label`).html(title);
		$(`#${photoFrameId}-img`).attr('src', url);
		$(`#${photoFrameId}-img`).attr('alt', title);
		($(`#${photoFrameId}`) as any).modal('show');
	};

	/**
	 * 
	 * @param elemSlt 
	 */
	bindImageFrame(elemSlt?: string, photoFrameId?: string): void {
		elemSlt = elemSlt ? elemSlt : 'img.atc-img';
		$(elemSlt ).each(function (t, s) {
			let e = $(s); 
			let title = e.attr('alt') as string;
			let url   = e.attr('src') as string;
			e.on('click', function (t) { WebHtmlPage.viewPic(title, url, photoFrameId); });
		});
	} 


	/**
	 * 
	 * @param elemSlt 
	 */
	bindImageNewTab(elemSlt?: string): void {
		$(elemSlt ? elemSlt : 'img.atc-img').each(function (t, s) {
			let e = $(s); 
			let c = e.attr('src') as string;
			e.on('click', function (t) { WebUtil.openWindow(c); });
			// net.jadedungeon.viewPic(s);
		});
	} 

	/**
	 * 各语言高亮脚本的路径
	 * 
	 * @param hlRootPath 
	 * @param hlCodePath 
	 */
	loadCodeHightlight(hlRootPath?: string,  hlCodePath?: string) {
		hlRootPath = hlRootPath ? hlRootPath : "";
		hlCodePath = hlCodePath ? hlCodePath : "../../vimwiki-theme/3rd-libs/hightlight-code/scripts/";
		let basePath = `${hlRootPath}${hlCodePath}/`;
		let parsePath = (arr: Array<string>): Array<string> => {
			let lines: Array<string> = [];
			for(let i = 0; i < arr.length; i++) {
				let arg = arr[i];
				let line = arg.replace('@', basePath);
				lines.push(line);
			}
			return lines;
		};
		let pathArr = parsePath([
			'applescript            @shBrushAppleScript.js',
			'actionscript3 as3      @shBrushAS3.js',
			'bash shell             @shBrushBash.js',
			'coldfusion cf          @shBrushColdFusion.js',
			'cpp c                  @shBrushCpp.js',
			'c# c-sharp csharp      @shBrushCSharp.js',
			'css                    @shBrushCss.js',
			'delphi pascal          @shBrushDelphi.js',
			'diff patch pas         @shBrushDiff.js',
			'erl erlang             @shBrushErlang.js',
			'groovy                 @shBrushGroovy.js',
			'java                   @shBrushJava.js',
			'jfx javafx             @shBrushJavaFX.js',
			'js jscript javascript  @shBrushJScript.js',
			'perl pl                @shBrushPerl.js',
			'php                    @shBrushPhp.js',
			'text plain             @shBrushPlain.js',
			'py python              @shBrushPython.js',
			'ruby rails ror rb      @shBrushRuby.js',
			'sass scss              @shBrushSass.js',
			'latex                  @shBrushLatex.js',
			'less                   @shBrushLess.js',
			'scala                  @shBrushScala.js',
			'scheme                 @shBrushScheme.js',
			'clojure                @shBrushClojure.js',
			'sql                    @shBrushSql.js',
			'vb vbnet               @shBrushVb.js',
			'xml xhtml xslt html    @shBrushXml.js'])
		SyntaxHighlighter.autoloader.apply(null, pathArr);
		SyntaxHighlighter.all();
	};

	/**
	 * 大窗口时用的固定边栏目录
	 * @param srcSlt 
	 * @param tagSlt 
	 */
	prepareTocIndex(html: string, tagSlt?: string): void {
		//srcSlt = srcSlt ? srcSlt : "div.toc";
		tagSlt = tagSlt ? tagSlt : "div#sideTocIdxTree";
		$(tagSlt).html(html);
		$(`${tagSlt}    ul`).removeClass('toc-icon-close');
		$(`${tagSlt}    ul`).addClass('toc-icon-open');
		$(`${tagSlt}>ul ul`).removeClass('toc-sub-close');
		$(`${tagSlt}>ul ul`).addClass('toc-sub-open');
	};


	/**
	 * 计算边栏目录的高度
	 * 
	 * @param margin 
	 * @returns 
	 */
	static caculateSideTocBoxHeight(margin: number): number {
		return document.documentElement.clientHeight - margin - margin -1;
	};


	/**
	 * 大窗口时用的固定调整边栏目录的高度
	 * 
	 * @param elemSlt 
	 */
	changeTocPanelSize(elemSlt?: string, margin?: number): void {
		elemSlt = elemSlt ? elemSlt : "div#floatTocIdxTree";
		margin = margin ? margin : 80;
		if (($(elemSlt).attr('class') as any).indexOf("toc-close") > -1) {
			// do nothing
		} else {
			$(elemSlt).attr('style', `height: ${WebHtmlPage.caculateSideTocBoxHeight(margin)}px; transition: 1s;`);
		}
	};


	/**
	 * 展开与折叠目录树
	 */
	toggleSideTocWrap(): void {
		let h = WebHtmlPage.caculateSideTocBoxHeight(80);
		if (($('div.sideTocIdx') as any).attr('class').indexOf('toc-close') > - 1) {
			let n = '';
			$('div.sideToc').attr('style', `padding: 10px 20px; height: ${ h }px; transition: 1s;`);
			$('div.sideToc').css('overflow', 'hidden');
			$('div.sideTocIdx').removeClass('toc-close');
		} else {
			$('div.sideToc').attr('style', 'padding: 0px 20px; height: 0px; transition: 1s;');
			$('div.sideToc').css('overflow', 'auto');
			$('div.sideTocIdx').addClass('toc-close');
		}
	};

	/**
	 * 展开与折叠目录面板
	 */
	toggleSideTocContract(): void {
		if (($('div.sideTocIdx') as any).attr('class').indexOf('toc-cont-flg') > - 1) {
			$('div.sideTocIdx').removeClass('toc-cont-flg');
			$('div.sideTocIdx    ul').removeClass('toc-icon-close');
			$('div.sideTocIdx    ul').   addClass('toc-icon-open' );
			$('div.sideTocIdx>ul ul').removeClass('toc-sub-close' );
			$('div.sideTocIdx>ul ul').   addClass('toc-sub-open'  );
		} else {
			$('div.sideTocIdx').addClass('toc-cont-flg');
			$('div.sideTocIdx    ul').removeClass('toc-icon-open' );
			$('div.sideTocIdx    ul').   addClass('toc-icon-close');
			$('div.sideTocIdx>ul ul').removeClass('toc-sub-open'  );
			$('div.sideTocIdx>ul ul').   addClass('toc-sub-close' );
		}
	};






//  t.toggleTocWrap = function () {
//    if (e('div.tocIdx').attr('class').indexOf('toc-close') > - 1) {
//      var n = 'height: ' + t.caculateFloatTocBoxHeight() + 'px; transition: 1s;';
//      e('div.tocIdx').attr('style', n),
//      e('div.tocIdx').removeClass('toc-close'),
//      e('div.tocWrap').attr('style', 'width: 300px; transition: 1s;')
//    } else {
//      e('div.tocIdx').attr('style', 'height: 3px; transition: 1s;'),
//      e('div.tocIdx').addClass('toc-close'),
//      e('div.tocWrap').attr('style', 'width: 100px; transition: 1s;')
//    }
//  },





	// /**
	 // * 打开、收起所有目录盒子
	 // */
	// toggleTocWrap() {
		// if (($('div.tocIdx').attr('class') as any).indexOf("toc-close") > -1) {
			// var style2 = '';
			// $("div.tocIdx").attr('style', `height: ${this.caculateFloatTocBoxHeight()}px; transition: 1s;`);
			// $('div.tocIdx').removeClass('toc-close');
			// $("div.tocWrap").attr('style', "width: 300px; transition: 1s;");
		// } else {
			// $("div.tocIdx").attr('style', 'height: 3px; transition: 1s;');
			// $('div.tocIdx').addClass('toc-close');
			// $("div.tocWrap").attr('style', "width: 100px; transition: 1s;");
		// }
	// };




	// /**
	 // * 打开、收起所有目录
	 // */
	// toggleTocContract(): void {
		// if (($('div.tocIdx').attr('class') as any).indexOf("toc-cont-flg") > -1) {
			// $('div.tocIdx').removeClass('toc-cont-flg');
			// $('div.tocIdx    ul').removeClass('toc-icon-close');
			// $('div.tocIdx    ul').addClass('toc-icon-open');
			// $('div.tocIdx>ul ul').removeClass('toc-sub-close');
			// $('div.tocIdx>ul ul').addClass('toc-sub-open');
		// } else {
			// $('div.tocIdx').addClass('toc-cont-flg');
			// $('div.tocIdx    ul').removeClass('toc-icon-open');
			// $('div.tocIdx    ul').addClass('toc-icon-close');
			// $('div.tocIdx>ul ul').removeClass('toc-sub-open');
			// $('div.tocIdx>ul ul').addClass('toc-sub-close');
		// }
	// };


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

	/**
	 * 
	 * @param themes 
	 */
	bindChangeTheme(themes: Array<{elemSlt: String, themeName: string}>): void {
		for(let theme of themes) {
			$(theme.elemSlt).on("click", (t) => {this.changeTheme(theme.themeName)});
		}
	}

}











