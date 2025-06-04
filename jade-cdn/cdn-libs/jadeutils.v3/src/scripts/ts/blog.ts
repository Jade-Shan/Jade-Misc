import { PageConfig, WebHtmlPage } from './webHtmlPage.js';
import { SyntaxHighlighterHelper, MathJaxHelper, BootStrapHelper, DataTableHelper } from './3rdLibTool.js';

import { WebUtil, HttpRequest, HttpRequestHandler, HttpResponse, requestHttp } from "./web.js"

export class BlogPage {

	static async initWikiPage(basePath: string, title: string) {


		let cfg: PageConfig = { apiRoot: "/", pageTitle: "Study Notes", subTitle: title, ajaxTimeout: 500 };
		let page = new WebHtmlPage(cfg);
		page.renderSubTitle(cfg);
		//
		page.renderTopNav(cfg, [
			{ title: "Journal", link: "/" },
			{ title: "Gallery", link: "/gallery.html" },
			{ title: "Note", link: "//118.178.197.156/study/study/wiki_html" },
			{
				title: "About Me", subs: [
					{ title: "Github", link: "//github.com/Jade-Shan/", isNewWin: true },
					{ title: "", link: "" },
					{ title: "Resume", link: "/resume.html" }]
			},
			{
				title: "Themes", subs: [
					{ title: "hobbit", id: "switch-theme-hobbit"     , link: "#" },
					{ title: "lo-fi" , id: "switch-theme-lo-fi"      , link: "#" },
					{ title: "paper" , id: "switch-theme-paper-print", link: "#" }]
			}
		]);

		//
		DataTableHelper.bindInitDataTable();

		//
		page.bindImageNewTab("img.img-newwin");

		// 
		BootStrapHelper.initPhotoFrame("photo-frame");
		//
		BootStrapHelper.bindImageFrame("img.img-frame");
		//
		SyntaxHighlighterHelper.loadCodeHightlight(basePath, "../../3rd/SyntaxHighlighter/2.1.364/scripts");
		//
		MathJaxHelper.initMathJax();
		//
		let tocOri = document.querySelector<HTMLElement>("div.toc");
		if (null != tocOri) {
			WebHtmlPage.prepareTocIndex(tocOri.innerHTML, "div.sideTocIdx" );
			tocOri.remove();
		}
		//
		WebHtmlPage.bindOnClickBySelectorAll('#tocLevBtn' ,  () => {page.toggleSideTocContract("div.sideTocIdx")});
		WebHtmlPage.bindOnClickBySelectorAll('#tocLevBtn2',  () => {page.toggleSideTocContract("div.sideTocIdx")});
		WebHtmlPage.bindOnClickBySelectorAll('#tocBoxBtn' ,  () => {page.toggleSideTocWrap    ("div.sideTocIdx", 90, "div.sideToc")});
		WebHtmlPage.bindOnClickBySelectorAll('#tocBoxBtn2',  () => {page.toggleSideTocWrap    ("div.sideTocIdx", 80, "div.sideToc")});

		let changeTocWithWindow = () => {
			page.changeTocPanelSize("div#sideTocIdxTree" , 80);
			page.changeTocPanelSize("div#floatTocIdxTree", 90);
		};

		// $(window).resize(changeTocWithWindow);

		window.onresize = changeTocWithWindow;

		page.initUITheme();
		let themes = [
			{ elemSlt: "#switch-theme-hobbit"     , themeName: "hobbit" },
			{ elemSlt: "#switch-theme-lo-fi"      , themeName: "lo-fi"  },
			{ elemSlt: "#switch-theme-paper-print", themeName: "paper-print" },
		]
		page.bindChangeTheme(themes);

		let resp: HttpResponse<string> = await requestHttp<string, string>({
			method: "GET", url: "http://www.jade-dungeon.cn:8088/api/blog/loadUserById?userId=teo"
		}, {
			onLoad: (evt, xhr, req) => {
				// console.log(xhr.response);
				return {statusCode: xhr.status, statusMsg: xhr.statusText, body: xhr.responseText};
			},	
		});

		console.log(resp);

	}

}