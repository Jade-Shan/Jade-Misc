/* jshint esversion: 6 */
var net = net || {};
(function ($) {
	net.jadedungeon = function () { init(); return this; };
	var self = net.jadedungeon.prototype;
	var init = function (cfg) {
		self.ui = {};
		self.data = {};
		self.cfg = {ajaxTimeout: 5000};

		self.data.nav = [
			{title: "Journal", link: "/"},
			{title: "Gallery", link: "/gallery.html"},
			{title: "Note", link: "//118.178.197.156/study/study/wiki_html"},
			{title: "About Me", subs: [
				{title: "Github", link: "//github.com/Jade-Shan/", isNewWin: true},
				{title: "", link: ""},
				{title: "Resume", link: "/resume.html"}]},
			{title: "Themes", subs: [
				{title: "hobbit", id: "switch-theme-hobbit", link: "#"},
				{title: "lo-fi",  id: "switch-theme-lo-fi", link: "#"},
				{title: "paper",  id: "switch-theme-paper-print", link: "#"}]}
		];
	};

	self.renderTopNav = function (page) {
		var addLink = function (item, page) {
			if (item.title === "") {
				navhtml = navhtml + '<li class="divider"></li>';
			} else {
				if (page && page.pageTitle === item.title) {
					navhtml = navhtml + '<li class="active">';
				} else { navhtml = navhtml + '<li>'; }
				navhtml = navhtml + '<a ' ;
				if (item.isNewWin) { navhtml = navhtml + ' target="_blank" '; } 
				if (item.id) { navhtml = navhtml + ' id="' + item.id + '" '; } 
				navhtml = navhtml + ' href="' + item.link + '">' + item.title + '</a></li>';
			}
		};

		var addSub = function (item) {
			navhtml = navhtml + '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">';
			navhtml = navhtml + item.title;
			navhtml = navhtml + '<b class="caret"></b></a><ul class="dropdown-menu">';
			$.each(item.subs, function (i, item) { addLink(item, false); });
			navhtml = navhtml + '</ul></li>';
		};

		var navhtml = '<div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#example-navbar-collapse"> <span class="sr-only">切换导航</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="/">Jade Dungeon</a> </div> <div class="collapse navbar-collapse" id="example-navbar-collapse"> <ul class="nav navbar-nav">';
		$.each(self.data.nav, function (i, item) {
				if (item.link) { addLink(item, page); }
				else if (item.subs) { addSub(item); }
		});
		navhtml = navhtml + '</ul></div>';
		$("#topnav").html(navhtml);
	};

	self.renderPagination = function(page, count, callbackName) {
		let i = 1;
		let html = '<ul class="pagination center">';
		if (page === 1) {
			html = html + '<li><a class="disable" href="javascript:void(0);">&laquo;</a></li>';
		} else {
			html = html + '<li><a href="javascript:' + callbackName + '(' + (page - 1) + ');">&laquo;</a></li>' + '<li><a href="javascript:' + callbackName + '(' + i + ');">' + i + '</a></li>';
		}
		i = i + 1;
		if (page > 6) {
			i = page - 5;
			html = html + '<li><a class="disable" href="javascript:void(0);">...</a></li>';
		}
		while (page > i) {
			html = html + '<li><a href="javascript:' + callbackName + '(' + i + ');">' + i + '</a></li>';
			i = i + 1;
		}
		html = html + '<li class="active"><a href="javascript:void(0);">' + page + '</a></li>';
		i = page + 1;
		if ((count - page) > 6) {
			while (i <= (page + 5)) {
				html = html + '<li><a href="javascript:' + callbackName + '(' + i + ');">' + i + '</a></li>';
				i = i + 1;
			}
			i = count;
			html = html + '<li><a class="disable" href="javascript:void(0);">...</a></li>';
		}
		while (i <= count) {
			html = html + '<li><a href="javascript:' + callbackName + '(' + i + ');">' + i + '</a></li>';
			i = i + 1;
		}
		if (page === count) {
			html = html + '<li><a class="disable" href="javascript:void(0);">&raquo;</a></li>';
		} else {
			html = html + '<li><a href="javascript:' + callbackName + '(' + (page + 1) + ');">&raquo;</a></li>';
		}
		html = html + '</ul>';
		return html;
	};

	self.renderSubTitle = function (page) { $("#subTitle").html(page.subTitle); };

	self.renderPhotoFrame = function () {
		let html = '<div class="modal-dialog"><div class="modal-content">';
		html = html + '<div class="modal-header">';
		html = html + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html = html + '<h4 class="modal-title" id="photo-frame-label"></h4></div>';
		html = html + '<div class="modal-body row">';
		html = html + '<img id="photo-frame-img" alt="" src="" class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >';
		html = html + '</div></div>';
		$("#photo-frame").html(html);
	};

	self.initUITheme = function () {
		let currUITheme = jadeUtils.web.cookieOperator("ui.theme");
		if (currUITheme) {
			self.changeTheme(currUITheme);
		}
	};

	self.viewPic = function (img) {
		var m = $(img);
		$("#photo-frame-label").html(m.attr("alt"));
		$("#photo-frame-img").attr("src", m.attr("src"));
		$("#photo-frame-img").attr("alt", m.attr("alt"));
		$('#photo-frame').modal('show');
	};

	self.changeTheme = (themeName) => {
		var styles = document.querySelectorAll('link[title]');
		for (var i=0; i<styles.length; i++) {
			var lnk = styles[i];
			var ttitle = lnk.title;
			if (ttitle == themeName) { 
				jadeUtils.web.cookieOperator("ui.theme", themeName, {SameSite:'Lax'});
				lnk.disabled = false; 
			} else { lnk.disabled = true; }
		}
	};

})(jQuery);



(function ($) {
	net.jadedungeon.wiki = function (cfg) {
		init(cfg);
		return this; 
	};
	var self = net.jadedungeon.wiki.prototype;

	var init = function (cfg) {
		net.jadedungeon = new net.jadedungeon();
		self.initCfg = cfg;
	};

	self.render = function () {
		net.jadedungeon.renderTopNav(this.initCfg);
		jadeUtils.initCustomElements();
		$("#switch-theme-hobbit").on("click", (t) => {page.changeTheme('hobbit');});
		$("#switch-theme-lo-fi").on("click", (t) => {page.changeTheme('lo-fi');});
		$("#switch-theme-paper-print").on("click", (t) => {page.changeTheme('paper-print');});
		this.prepareImg();
		this.prepareTables();
		this.loadCodeHightlight(this.initCfg);
		this.prepareSideIndex();
		this.prepareFloatIndex();
		$('.toc').remove();
		net.jadedungeon.initUITheme();
		// net.jadedungeon.renderPhotoFrame();
	};

	self.changeTheme = function (idx) {
		net.jadedungeon.changeTheme(idx);
	};

	self.prepareImg = function () {
		$('img.atc-img').each(function (t, s) {
			var e = $(s), c = e.attr('src');
			e.on('click', function (t) { jadeUtils.web.openWindow(c); });
			// net.jadedungeon.viewPic(s);
		});
	};

	/* vimwiki生成的table没有thead,
	把tbody中单元格是th的那一行抽出来作为表头 */
	self.prepareTables = function () {
		$('div.content>table').each(function (n,t) { 
			var table = $(t); 
			var thead = table.find('thead');
			if (thead.size() < 1) {
				thead = $('<thead></thead>');
				var rows = table.find('tbody>tr');
				rows.each(function (ln, r) {
					var row = $(r); var th = row.find("th");
					if (th.size() > 0) { thead.append(row); }
				});
				if (thead.find('th').size() > 0) { // 要有表头才能加上DataTable
					table.append(thead); 
					var rowCount = rows.size();
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
	};

	/**
	 * 调整目录的大小
	 */
	self.caculateFloatTocBoxHeight = function () {
		var tocBoxMargin = 47;
		return document.documentElement.clientHeight - tocBoxMargin - tocBoxMargin - 1;
	};
	self.changeFloatTocSize = function () {
		if ($('div.tocIdx').attr('class').indexOf("toc-close") > -1) {
		} else {
			var style = 'height: ' + self.caculateFloatTocBoxHeight() + 'px; transition: 1s;';
			$("div.tocIdx").attr('style', style);
		}
	};

	/**
	 * 打开、收起所有目录盒子
	 */
	self.toggleTocWrap = function () {
		if ($('div.tocIdx').attr('class').indexOf("toc-close") > -1) {
			var style2 = 'height: ' + self.caculateFloatTocBoxHeight() + 'px; transition: 1s;';
			$("div.tocIdx").attr('style', style2);
			$('div.tocIdx').removeClass('toc-close');
			$("div.tocWrap").attr('style', "width: 300px; transition: 1s;");
		} else {
			var style3 = 'height: 3px; transition: 1s;';
			$("div.tocIdx").attr('style', style3);
			$('div.tocIdx').addClass('toc-close');
			$("div.tocWrap").attr('style', "width: 100px; transition: 1s;");
		}
	};

	/**
	 * 打开、收起所有目录
	 */
	self.toggleTocContract = function () {
		if ($('div.tocIdx').attr('class').indexOf("toc-cont-flg") > -1) {
			$('div.tocIdx').removeClass('toc-cont-flg');
			$('div.tocIdx    ul').removeClass('toc-icon-close');
			$('div.tocIdx    ul').addClass('toc-icon-open');
			$('div.tocIdx>ul ul').removeClass('toc-sub-close');
			$('div.tocIdx>ul ul').addClass('toc-sub-open');
		} else {
			$('div.tocIdx').addClass('toc-cont-flg');
			$('div.tocIdx    ul').removeClass('toc-icon-open');
			$('div.tocIdx    ul').addClass('toc-icon-close');
			$('div.tocIdx>ul ul').removeClass('toc-sub-open');
			$('div.tocIdx>ul ul').addClass('toc-sub-close');
		}
	};

	/**
	 * 准备目录
	 */
	self.prepareSideIndex = function () {
		// $(".blog-sidebar").height($(".ctx-main").height());
		var idxBody = '<div class="tocIdx">' + $('.toc').html() + '</div>';
		$(".sideToc").html(idxBody);
	};
	self.prepareFloatIndex = function () {
		// 目录内容区
		var idxBody = '<div class="tocIdx">' + $('.toc').html() + '</div>';
		// 目录标题
		var idxTitle = '<div class="toggler"><em id="tocBoxBtn">目录</em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em id="tocLevBtn">层级</em></div>';
		// 目录全部
		var idxAll = '<div class="tocWrap hidden-md hidden-lg">' + idxTitle + idxBody + '</div>';

		/* 添加到内容中 */
		$('div.ctx-main').append(idxAll);
		$('div.tocIdx    ul').addClass('toc-icon-close');
		var toggler = $('.toggler');
		var tocWrap = $('.tocWrap');
		this.changeFloatTocSize();         // 调整目录大小
		$(window).resize(function() {
			self.changeFloatTocSize();
		});
		$('#tocBoxBtn').click(this.toggleTocWrap); // 开关目录事件
		$('#tocLevBtn').click(this.toggleTocContract); // 开关目录事件
		$('div.tocWrap').show(); // 显示目录
	};

	/**
	 * 各语言高亮脚本的路径
	 */
	self.loadCodeHightlight = function (cfg) {
		var path = function () {
			var args = arguments, result = [];
			for(var i = 1; i < args.length; i++) {
				result.push(args[i].replace('@', cfg.hlRootPath + cfg.hlCodePath ));
			}
			return result;
		};
		SyntaxHighlighter.autoloader.apply(null, path(cfg,
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
			'xml xhtml xslt html    @shBrushXml.js'));
		SyntaxHighlighter.all();
	};
})(jQuery);




function changeStyle(idx) {
	var styles = document.querySelectorAll('link[title]');
	for (var i=0; i<styles.length; i++) {
		var lnk = styles[i];
		if (i == idx) { lnk.disabled = false; } else { lnk.disabled = true; }
	}
}

/*
$(document).ready(function() {
	loadCodeHightlight(); // 启用语法高亮
	prepareIndex();				// 准备目录
	prepareTables();
});
*/


