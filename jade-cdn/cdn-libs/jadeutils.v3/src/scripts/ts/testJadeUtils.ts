import { NumUtil, StrUtil, TimeUtil } from './basic.js';
import { SimpleMap, SimpleStack, SimpleQueue } from './dataStructure.js'
import { WebUtil } from './web.js';
import { PageConfig, WebHtmlPage } from './webHtmlPage.js';
import { SyntaxHighlighterHelper, MathJaxHelper, BootStrapHelper, DataTableHelper } from './3rdLibTool.js';
import { CanvasCircle2D, CanvasLine2D, CanvasPoint2D, CanvasRay2D, CanvasRectangle2D, CanvasUtils, ICanvasRay2D, ICanvasRectangle2D } from './canvas.js';
import { Geo2DUtils, GeoShape2D, IRay2D, Line2D, Point2D, Ray2D } from './geo2d.js';

let testFunc = (isPassed: boolean, log: (msg: string, sty: string, mk: string) => void) => {
	let sty = isPassed ?
		"color: white; background-color: green" :
		"color: white; background-color: red";
	let mk = isPassed ? "PASSED" : "FAILED";
	let msg = "test func: %s , result: %c%s";
	log(msg, sty, mk);
}

class TestBasicUtil {

	static testNum() {
		//
		console.log(NumUtil.unformat( "123,456"        ));
		console.log(NumUtil.unformat( "123,456.123,456"));
		console.log(NumUtil.unformat("-123,456.123,456"));
		console.log(NumUtil.unformat( "123-456.123,456"));
		//
		testFunc(1         === NumUtil.toFixed(1.1234567, 0), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.1       === NumUtil.toFixed(1.1234567, 1), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.12      === NumUtil.toFixed(1.1234567, 2), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.123     === NumUtil.toFixed(1.1234567, 3), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.1235    === NumUtil.toFixed(1.1234567, 4), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.12346   === NumUtil.toFixed(1.1234567, 5), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.123457  === NumUtil.toFixed(1.1234567, 6), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.1234567 === NumUtil.toFixed(1.1234567, 7), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1.1234567 === NumUtil.toFixed(1.1234567, 8), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });

		testFunc(1234570 === NumUtil.toFixed(1234567.1, -1), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1234600 === NumUtil.toFixed(1234567.1, -2), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1235000 === NumUtil.toFixed(1234567.1, -3), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1230000 === NumUtil.toFixed(1234567.1, -4), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1200000 === NumUtil.toFixed(1234567.1, -5), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(1000000 === NumUtil.toFixed(1234567.1, -6), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		testFunc(      0 === NumUtil.toFixed(1234567.1, -7), (msg, sty, mk) => { console.log(msg, "NumUtil.toFixed()", sty, mk); });
		//
		testFunc("0.09" === NumUtil.format(0.091), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("0.10" === NumUtil.format(0.095), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("0.10" === NumUtil.format(0.099), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		//
		testFunc("1,234,567.09" === NumUtil.format(1234567.091, "#,###.##"), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,234,567.10" === NumUtil.format(1234567.095, "#,###.##"), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,234,567.10" === NumUtil.format(1234567.099, "#,###.##"), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		//
		testFunc("1,234,567.12"        === NumUtil.format(1234567.123456789, "#,###.##"     ), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,234,567.123"       === NumUtil.format(1234567.123456789, "#,###.###"    ), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,234,567.123,5"     === NumUtil.format(1234567.123456789, "#,###.####"   ), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,234,567.123,456,8" === NumUtil.format(1234567.123456789, "#,###.#######"), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		//
		testFunc("1,2345,6789.12"          === NumUtil.format(123456789.123456789, "#,####.##"       ), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,2345,6789.1235"        === NumUtil.format(123456789.123456789, "#,####.####"     ), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,2345,6789.1234,6"      === NumUtil.format(123456789.123456789, "#,####.#####"    ), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		testFunc("1,2345,6789.1234,5679,0" === NumUtil.format(123456789.123456789, "#,####.#########"), (msg, sty, mk) => { console.log(msg, "NumUtil.format()", sty, mk); });
		//
		testFunc( 123456        === NumUtil.unformat( "123,456"        ), (msg, sty, mk) => { console.log(msg, "NumUtil.unformat()", sty, mk); });
		testFunc( 123456.123456 === NumUtil.unformat( "123,456.123,456"), (msg, sty, mk) => { console.log(msg, "NumUtil.unformat()", sty, mk); });
		testFunc(-123456.123456 === NumUtil.unformat("-123,456.123,456"), (msg, sty, mk) => { console.log(msg, "NumUtil.unformat()", sty, mk); });
		testFunc(    123        === NumUtil.unformat( "123-456.123,456"), (msg, sty, mk) => { console.log(msg, "NumUtil.unformat()", sty, mk); });
		//
		testFunc(0.12    === NumUtil.add(0.1  , 0.02   ), (msg, sty, mk) => { console.log(msg, "NumUtil.add()", sty, mk); });
		testFunc(0.123   === NumUtil.add(0.12 , 0.003  ), (msg, sty, mk) => { console.log(msg, "NumUtil.add()", sty, mk); });
		testFunc(0.12345 === NumUtil.add(0.123, 0.00045), (msg, sty, mk) => { console.log(msg, "NumUtil.add()", sty, mk); });
		//
		testFunc(0.08    === NumUtil.sub(0.1  , 0.02   ), (msg, sty, mk) => { console.log(msg, "NumUtil.sub()", sty, mk); });
		testFunc(0.117   === NumUtil.sub(0.12 , 0.003  ), (msg, sty, mk) => { console.log(msg, "NumUtil.sub()", sty, mk); });
		testFunc(0.12255 === NumUtil.sub(0.123, 0.00045), (msg, sty, mk) => { console.log(msg, "NumUtil.sub()", sty, mk); });
		//
		testFunc(0.002      === NumUtil.mul(0.1  , 0.02   ), (msg, sty, mk) => { console.log(msg, "NumUtil.mul()", sty, mk); });
		testFunc(0.00036    === NumUtil.mul(0.12 , 0.003  ), (msg, sty, mk) => { console.log(msg, "NumUtil.mul()", sty, mk); });
		testFunc(0.00005535 === NumUtil.mul(0.123, 0.00045), (msg, sty, mk) => { console.log(msg, "NumUtil.mul()", sty, mk); });
		testFunc(55.35      === NumUtil.mul(12.3 , 4.5    ), (msg, sty, mk) => { console.log(msg, "NumUtil.mul()", sty, mk); });
		//
		testFunc( "0.33" === NumUtil.format(NumUtil.div(  1.11, 3.33)), (msg, sty, mk) => { console.log(msg, "NumUtil.div()", sty, mk); });
		testFunc( "2.00" === NumUtil.format(NumUtil.div(  4.0 , 2   )), (msg, sty, mk) => { console.log(msg, "NumUtil.div()", sty, mk); });
		testFunc("46.58" === NumUtil.format(NumUtil.div(155.11, 3.33)), (msg, sty, mk) => { console.log(msg, "NumUtil.div()", sty, mk); });
		testFunc("50.00" === NumUtil.format(NumUtil.div(150   , 3   )), (msg, sty, mk) => { console.log(msg, "NumUtil.div()", sty, mk); });
	}

	static testStr() {
		//
		testFunc("aaaa"          === StrUtil.trim     ("   \t   aaaa   \t   "), (msg, sty, mk) => { console.log(msg, "StrUtil.trim()"     , sty, mk); });
		testFunc("aaaa   	   " === StrUtil.trimLeft ("   \t   aaaa   \t   "), (msg, sty, mk) => { console.log(msg, "StrUtil.trimLeft()" , sty, mk); });
		testFunc("   	   aaaa" === StrUtil.trimRight("   \t   aaaa   \t   "), (msg, sty, mk) => { console.log(msg, "StrUtil.trimRight()", sty, mk); });
		//
		testFunc("0123456789abcdefg" === StrUtil.utf8to16("0123456789abcdefg"), (msg, sty, mk) => { console.log(msg, "StrUtil.utf8to16()", sty, mk); });
		testFunc("0123456789abcdefg" === StrUtil.utf16to8("0123456789abcdefg"), (msg, sty, mk) => { console.log(msg, "StrUtil.utf16to8()", sty, mk); });
		//
		testFunc("SGVsbG8gV29ybGQh" === StrUtil.base64encode("Hello World!"    ), (msg, sty, mk) => { console.log(msg, "StrUtil.base64encode()", sty, mk); });
		testFunc("Hello World!"     === StrUtil.base64decode("SGVsbG8gV29ybGQh"), (msg, sty, mk) => { console.log(msg, "StrUtil.base64decode()", sty, mk); });
		//
		testFunc("^^^^^^^^^^^^test-str" === StrUtil.leftPad ("test-str", 20, '^'), (msg, sty, mk) => { console.log(msg, "StrUtil.leftPad ()", sty, mk); });
		testFunc("test-str^^^^^^^^^^^^" === StrUtil.rightPad("test-str", 20, '^'), (msg, sty, mk) => { console.log(msg, "StrUtil.rightPad()", sty, mk); });
	}

	static testTime() {
		//
		let d = new Date(1736656496123);
		//
		testFunc("2025-01-12 12:34:56.123" === TimeUtil.format(d, "yyyy-MM-dd HH:mm:ss.SSS"), (msg, sty, mk) => { console.log(msg, "TimeUtil.format()", sty, mk); });
		testFunc("2025-01-12 12:34:57.123" === TimeUtil.format(TimeUtil.addMilliseconds(d, 1000)), (msg, sty, mk) => { console.log(msg, "TimeUtil.addMilliseconds()", sty, mk); });
		testFunc("2025-01-12 12:51:36.123" === TimeUtil.format(TimeUtil.addSeconds(d, 1000)     ), (msg, sty, mk) => { console.log(msg, "TimeUtil.addSeconds()", sty, mk); });
		testFunc("2025-01-13 12:34:56.123" === TimeUtil.format(TimeUtil.addDays   (d, 1)        ), (msg, sty, mk) => { console.log(msg, "TimeUtil.addDays   ()", sty, mk); });
		testFunc("2025-02-12 12:34:56.123" === TimeUtil.format(TimeUtil.addMonths (d, 1)        ), (msg, sty, mk) => { console.log(msg, "TimeUtil.addMonths ()", sty, mk); });
		testFunc("2026-01-12 12:34:56.123" === TimeUtil.format(TimeUtil.addYears  (d, 1)        ), (msg, sty, mk) => { console.log(msg, "TimeUtil.addYears  ()", sty, mk); });
		testFunc("2025-01-12 00:00:00.000" === TimeUtil.format(TimeUtil.cleanDay  (d   )        ), (msg, sty, mk) => { console.log(msg, "TimeUtil.cleanDay  ()", sty, mk); });
		//
		console.log(TimeUtil.getLocalTimeZoneName());
		console.log(TimeUtil.getLocalTimeZone()    );
	}


}

class TestDataStructure {

	static testSimpleMap() {
		let m: SimpleMap<string, string> = new SimpleMap([["key001","aaa"], ["key002","bbb"], ["key003","ccc"]]);
		m.put("key004", "ddd");
		m.put("key005", "eee");
		m.put("key006", "fff");
		testFunc("aaa" === m.get          ("key001"), (msg, sty, mk) => { console.log(msg, "SimpleMap.get()"          , sty, mk); });
		testFunc(true  === m.containsKey  ("key005"), (msg, sty, mk) => { console.log(msg, "SimpleMap.containsKey()"  , sty, mk); });
		testFunc(true  === m.containsValue("bbb"   ), (msg, sty, mk) => { console.log(msg, "SimpleMap.containsValue()", sty, mk); });
		testFunc(6     === m.size          (       ), (msg, sty, mk) => { console.log(msg, "SimpleMap.size()"         , sty, mk); });
	}

	static testSimpleStack() {
		let stk: SimpleStack<string> = new SimpleStack(["aaa", "bbb", "ccc"]);
		stk.push("ddd");
		stk.push("eee", "fff");
		testFunc("fff,eee,ddd,ccc,bbb,aaa" === stk.toString(), (msg, sty, mk) => { console.log(msg, "SimpleStack.toString()"  , sty, mk); });
		testFunc(6     === stk.size  (), (msg, sty, mk) => { console.log(msg, "SimpleStack.size()"  , sty, mk); });
		testFunc("fff" === stk.getTop(), (msg, sty, mk) => { console.log(msg, "SimpleStack.getTop()", sty, mk); });
		testFunc("fff" === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
		testFunc("eee" === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
		testFunc("ddd" === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
		testFunc("ccc" === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
		testFunc("bbb" === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
		testFunc("aaa" === stk.getTop(), (msg, sty, mk) => { console.log(msg, "SimpleStack.getTop()", sty, mk); });
		testFunc("aaa" === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
		testFunc(null  === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
		testFunc(null  === stk.pop   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"   , sty, mk); });
	}

	static testSimpleQueue() {
		let que: SimpleQueue<string> = new SimpleQueue(["aaa", "bbb", "ccc"]);
		que.push("ddd");
		que.push("eee", "fff");
		console.log(que.toString());
		testFunc("aaa,bbb,ccc,ddd,eee,fff" === que.toString(), (msg, sty, mk) => { console.log(msg, "SimpleStack.toString()"   , sty, mk); });
		testFunc(6     === que.size   (), (msg, sty, mk) => { console.log(msg, "SimpleStack.size()"   , sty, mk); });
		testFunc("aaa" === que.getHead(), (msg, sty, mk) => { console.log(msg, "SimpleStack.getHead()", sty, mk); });
		testFunc("fff" === que.getTail(), (msg, sty, mk) => { console.log(msg, "SimpleStack.getTail()", sty, mk); });
		testFunc("aaa" === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
		testFunc("bbb" === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
		testFunc("ccc" === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
		testFunc("ddd" === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
		testFunc("eee" === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
		testFunc("fff" === que.getHead(), (msg, sty, mk) => { console.log(msg, "SimpleStack.getHead()", sty, mk); });
		testFunc("fff" === que.getTail(), (msg, sty, mk) => { console.log(msg, "SimpleStack.getTail()", sty, mk); });
		testFunc("fff" === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
		testFunc(null  === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
		testFunc(null  === que.pop    (), (msg, sty, mk) => { console.log(msg, "SimpleStack.pop()"    , sty, mk); });
	}

}

class TestWebUtil {

	static testHtml() {
		WebUtil.initCustomElements();

		testFunc("Basic YWFhOmJiYg==" === WebUtil.webAuthBasic("aaa", "bbb"), (msg, sty, mk) => { console.log(msg, "WebUtil.webAuthBasic()", sty, mk); });
	}

}

class TestWebHtmlPage {

	static testJquery() {
		let cfg: PageConfig = { apiRoot: "/", pageTitle: "test-page", subTitle: "for-test", ajaxTimeout: 500 };
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
		// _1_ 2 3 4 5 6 ... 20
		WebHtmlPage.setElemHtmlBySelectorAll('#pageBar01', WebHtmlPage.renderPagination( 1, 20, n => `javascript:queryBlog(${n})`));
		// 1 2 3 4 5 6 _7_ 8 9 10 11 12 ... 20
		WebHtmlPage.setElemHtmlBySelectorAll('#pageBar02', WebHtmlPage.renderPagination( 7, 20, n => `javascript:queryBlog(${n})`));
		// 1 ... 3 4 5 6 7 _8_ 9 10 11 12 13 ... 20
		WebHtmlPage.setElemHtmlBySelectorAll('#pageBar03', WebHtmlPage.renderPagination( 8, 20, n => `javascript:queryBlog(${n})`));
		// 1 ... 8 9 10 11 12 _13_ 14 15 16 17 18 ... 20
		WebHtmlPage.setElemHtmlBySelectorAll('#pageBar07', WebHtmlPage.renderPagination(13, 20, n => `javascript:queryBlog(${n})`));
		// 1 ...  9 10 11 12 13 _14_ 15 16 17 18 19 20
		WebHtmlPage.setElemHtmlBySelectorAll('#pageBar08', WebHtmlPage.renderPagination(14, 20, n => `javascript:queryBlog(${n})`));
		// 1 ... 15 16 17 18 19 _20_
		WebHtmlPage.setElemHtmlBySelectorAll('#pageBar09', WebHtmlPage.renderPagination(20, 20, n => `javascript:queryBlog(${n})`));

		//
		DataTableHelper.bindInitDataTable();

		//
		page.bindImageNewTab("img.img-newwin");

		// 
		BootStrapHelper.initPhotoFrame("photo-frame");
		//
		BootStrapHelper.bindImageFrame("img.img-frame");
		//
		SyntaxHighlighterHelper.loadCodeHightlight("http://www.jade-dungeon.cn:8081","/3rd/SyntaxHighlighter/2.1.364/scripts");
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

	}

}

class TestCanvas {

	static testAtan2(x: number, y: number) {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2 
		let a1 = Math.atan2(y, x);
		let angle = Geo2DUtils.formatAngle(a1);
		console.log(`atan2(${y},${x}) = ${
			NumUtil.toFixed(angle.oriAgl, 6) } = ${
			NumUtil.toFixed(angle.fmtAgl, 6) } = ${
			NumUtil.toFixed(angle.oriDgr, 3) }° = ${
			NumUtil.toFixed(angle.fmtDgr, 3) }°`);
	}

	static testTriFun() {
		this.testAtan2(100,0);
		this.testAtan2(100,100);
		this.testAtan2(0,100);
		this.testAtan2(-100,100);
		this.testAtan2(-100,0);
		this.testAtan2(-100,-100);
		this.testAtan2(0,-100);
		this.testAtan2(100,-100);
	}

	static testLinePointSide() {

		let line1 = new Line2D({ x:20, y:20 }, { x:90, y:90 });
		Geo2DUtils.checkPointLineSide(line1, {x: 60, y: 50})
		Geo2DUtils.checkPointLineSide(line1, {x: 50, y: 60})

		let line2 = new Line2D({ x:90, y:20 }, { x:20, y:90 });
		Geo2DUtils.checkPointLineSide(line2, {x: 70, y: 70})
		Geo2DUtils.checkPointLineSide(line2, {x: 40, y: 40})

		let line3 = new Line2D({ x:90, y:90 }, { x:20, y:20 });
		Geo2DUtils.checkPointLineSide(line1, {x: 60, y: 50})
		Geo2DUtils.checkPointLineSide(line1, {x: 50, y: 60})

		let line4 = new Line2D({ x:20, y:90 }, { x:90, y:20 });
		Geo2DUtils.checkPointLineSide(line2, {x: 70, y: 70})
		Geo2DUtils.checkPointLineSide(line2, {x: 40, y: 40})
	}

	static testCanvas() {
		this.testTriFun();

		this.testLinePointSide();

		let cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs001")?.getContext("2d");
		let testPt1 = {x: 50, y: 50, radius: 3, fillStyle: "red"    };
		let testPt2 = {x:250, y: 50, radius: 3, fillStyle: "lime"   };
		let testPt3 = {x:250, y:250, radius: 3, fillStyle: "blue"   };
		let testPt4 = {x: 50, y:250, radius: 3, fillStyle: "gray"   };
		let center  = {x:150, y:150, radius: 3, fillStyle: "fuchsia"};
		if (null != cvsCtx) {
			CanvasUtils.drawPoint(cvsCtx, testPt1);
			CanvasUtils.drawPoint(cvsCtx, testPt2);
			CanvasUtils.drawPoint(cvsCtx, testPt3);
			CanvasUtils.drawPoint(cvsCtx, testPt4);
			CanvasUtils.drawPoint(cvsCtx, center );
		}
		//
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs002")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawLines(cvsCtx, [
				{a:{x:20, y: 20}, b: {x:135, y:135}, strokeStyle: "red" , lineWidth: 1},
				{a:{x:120, y: 20}, b: {x:35, y:135}, strokeStyle: "lime", lineWidth: 1},
				{a:{x:200, y: 200}, b: {x:79, y:65}, strokeStyle: "blue", lineWidth: 1}]);
		}
		//
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs003")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawPoints(cvsCtx, [testPt1, testPt2, testPt3, testPt4, center ]);
			// 
			let testRay1: Ray2D = Geo2DUtils.setRayLength(new Ray2D(center , testPt1), 160);
			let testRay2: Ray2D = Geo2DUtils.setRayLength(new Ray2D(center , testPt2), 160);
			let testRay3: Ray2D = Geo2DUtils.setRayLength(new Ray2D(center , testPt3), 160);
			let testRay4: Ray2D = Geo2DUtils.setRayLength(new Ray2D(center , testPt4), 160);
			//
			CanvasUtils.drawRay(cvsCtx, new CanvasRay2D(testRay1.start, testRay1.mid, 1, "red" ));
			CanvasUtils.drawRay(cvsCtx, new CanvasRay2D(testRay2.start, testRay2.mid, 1, "lime"));
			CanvasUtils.drawRay(cvsCtx, new CanvasRay2D(testRay3.start, testRay3.mid, 1, "blue"));
			CanvasUtils.drawRay(cvsCtx, new CanvasRay2D(testRay4.start, testRay4.mid, 1, "gray"));
		}

		//
		let rect01 = new CanvasRectangle2D( 50,  50,  60, 120, 3, "red" , "");
		let rect02 = new CanvasRectangle2D(130,  50, 120,  60, 3, "lime", "");
		let rect03 = new CanvasRectangle2D(190, 130,  60, 120, 3, "blue", "");
		let rect04 = new CanvasRectangle2D( 50, 190, 120,  60, 3, "gray", "");
		//
		console.log("========================== test cvs 004 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs004")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawRectangle(cvsCtx, rect01);
			CanvasUtils.drawRectangle(cvsCtx, rect02);
			CanvasUtils.drawRectangle(cvsCtx, rect03);
			CanvasUtils.drawRectangle(cvsCtx, rect04);
		}

		//
		console.log("========================== test cvs 005 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs005")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawRectangle(cvsCtx, rect01);
			CanvasUtils.drawRectangle(cvsCtx, rect02);
			CanvasUtils.drawRectangle(cvsCtx, rect03);
			CanvasUtils.drawRectangle(cvsCtx, rect04);
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			//
			CanvasUtils.drawShapeVertexes(cvsCtx, rect01, 3, "blue"   );
			CanvasUtils.drawShapeVertexes(cvsCtx, rect02, 3, "gray"   );
			CanvasUtils.drawShapeVertexes(cvsCtx, rect03, 3, "fuchsia");
			CanvasUtils.drawShapeVertexes(cvsCtx, rect04, 3, "red"    );

		}

		//
		console.log("========================== test cvs 006 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs006")?.getContext("2d");
		if (null != cvsCtx) {
			let testLine01 = new CanvasLine2D({x: 30, y: 60}, {x: 60, y: 30}, 1, "red");
			let testLine02 = new CanvasLine2D({x:240, y: 30}, {x:270, y: 60}, 1, "lime");
			let testLine03 = new CanvasLine2D({x:270, y:240}, {x:240, y:270}, 1, "blue");
			let testLine04 = new CanvasLine2D({x: 60, y:270}, {x: 30, y:240}, 1, "gray");
			CanvasUtils.drawLines(cvsCtx, [testLine01, testLine02, testLine03, testLine04]);
			//
			CanvasUtils.drawPoint(cvsCtx, center );
			//
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.b, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.a, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.b, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.a, 1, "gray"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.b, 1, "gray"));
			//
			let ag1 = Geo2DUtils.revolveRay(center , testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(center , testLine02.a, testLine02.b);
			let ag3 = Geo2DUtils.revolveRay(center , testLine03.a, testLine03.b);
			let ag4 = Geo2DUtils.revolveRay(center , testLine04.a, testLine04.b);
			//
			CanvasUtils.drawArc(cvsCtx, center , 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, center , 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
			CanvasUtils.drawArc(cvsCtx, center , 50, ag3, {lineWidth: 1, strokeStyle: "blue"});
			CanvasUtils.drawArc(cvsCtx, center , 60, ag4, {lineWidth: 1, strokeStyle: "gray"});
		}
		//
		console.log("========================== test cvs 007 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs007")?.getContext("2d");
		if (null != cvsCtx) {
			let testLine01 = new CanvasLine2D({x: 60, y: 30}, {x: 30, y: 60}, 1, "red");
			let testLine02 = new CanvasLine2D({x:270, y: 60}, {x:240, y: 30}, 1, "lime");
			let testLine03 = new CanvasLine2D({x:240, y:270}, {x:270, y:240}, 1, "blue");
			let testLine04 = new CanvasLine2D({x: 30, y:240}, {x: 60, y:270}, 1, "gray");
			CanvasUtils.drawLines(cvsCtx, [testLine01, testLine02, testLine03, testLine04]);
			//
			CanvasUtils.drawPoint(cvsCtx, center );
			//
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.b, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.a, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.b, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.a, 1, "gray"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.b, 1, "gray"));
			//
			let ag1 = Geo2DUtils.revolveRay(center , testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(center , testLine02.a, testLine02.b);
			let ag3 = Geo2DUtils.revolveRay(center , testLine03.a, testLine03.b);
			let ag4 = Geo2DUtils.revolveRay(center , testLine04.a, testLine04.b);
			//
			CanvasUtils.drawArc(cvsCtx, center , 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, center , 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
			CanvasUtils.drawArc(cvsCtx, center , 50, ag3, {lineWidth: 1, strokeStyle: "blue"});
			CanvasUtils.drawArc(cvsCtx, center , 60, ag4, {lineWidth: 1, strokeStyle: "gray"});
		}
		//
		console.log("========================== test cvs 008 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs008")?.getContext("2d");
		if (null != cvsCtx) {
			let testLine01 = new CanvasLine2D({x: 20, y: 10}, {x:280, y: 10},  1, "red");
			let testLine02 = new CanvasLine2D({x:290, y: 20}, {x:290, y:280},  1, "lime");
			let testLine03 = new CanvasLine2D({x:280, y:290}, {x: 20, y:290},  1, "blue");
			let testLine04 = new CanvasLine2D({x: 10, y:280}, {x: 10, y: 20},  1, "gray");
			CanvasUtils.drawLines(cvsCtx, [testLine01, testLine02, testLine03, testLine04]);
			//
			CanvasUtils.drawPoint(cvsCtx, center );
			//
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.b, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.a, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.b, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.a, 1, "gray"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.b, 1, "gray"));
			//	
			let ag1 = Geo2DUtils.revolveRay(center , testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(center , testLine02.a, testLine02.b);
			let ag3 = Geo2DUtils.revolveRay(center , testLine03.a, testLine03.b);
			let ag4 = Geo2DUtils.revolveRay(center , testLine04.a, testLine04.b);
			//
			CanvasUtils.drawArc(cvsCtx, center , 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, center , 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
			CanvasUtils.drawArc(cvsCtx, center , 50, ag3, {lineWidth: 1, strokeStyle: "blue"});
			CanvasUtils.drawArc(cvsCtx, center , 60, ag4, {lineWidth: 1, strokeStyle: "gray"});
		}
		//
		console.log("========================== test cvs 009 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs009")?.getContext("2d");
		if (null != cvsCtx) {
			let testLine01 = new CanvasLine2D({x:280, y: 10}, {x: 20, y: 10},  1, "red");
			let testLine02 = new CanvasLine2D({x:290, y:280}, {x:290, y: 20},  1, "lime");
			let testLine03 = new CanvasLine2D({x: 20, y:290}, {x:280, y:290},  1, "blue");
			let testLine04 = new CanvasLine2D({x: 10, y: 20}, {x: 10, y:280},  1, "gray");
			CanvasUtils.drawLines(cvsCtx, [testLine01, testLine02, testLine03, testLine04]);
			//
			CanvasUtils.drawPoint(cvsCtx, center );
			//
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine02.b, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.a, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine03.b, 1, "blue"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.a, 1, "gray"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(center , testLine04.b, 1, "gray"));
			//
			let ag1 = Geo2DUtils.revolveRay(center , testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(center , testLine02.a, testLine02.b);
			let ag3 = Geo2DUtils.revolveRay(center , testLine03.a, testLine03.b);
			let ag4 = Geo2DUtils.revolveRay(center , testLine04.a, testLine04.b);
			//
			CanvasUtils.drawArc(cvsCtx, center , 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, center , 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
			CanvasUtils.drawArc(cvsCtx, center , 50, ag3, {lineWidth: 1, strokeStyle: "blue"});
			CanvasUtils.drawArc(cvsCtx, center , 60, ag4, {lineWidth: 1, strokeStyle: "gray"});
		}

		//
		console.log("========================== test cvs 010 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs010")?.getContext("2d");
		if (null != cvsCtx) {
			let p1 = {x:170, y:130, radius: 3, fillStyle: "red"};
			let p2 = {x:130, y:170, radius: 3, fillStyle: "blue"};
			let testLine01 = new CanvasLine2D({x: 80, y: 80}, {x:220, y: 220},  1, "gray");
			//
			CanvasUtils.drawLines(cvsCtx, [testLine01]);
			CanvasUtils.drawPoint(cvsCtx, p1);
			CanvasUtils.drawPoint(cvsCtx, p2);
			// 
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.b, 1, "lime"));
			//
			let ag1 = Geo2DUtils.revolveRay(p1, testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(p2, testLine01.a, testLine01.b);
			//
			CanvasUtils.drawArc(cvsCtx, p1, 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, p2, 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
		}
		//
		console.log("========================== test cvs 011 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs011")?.getContext("2d");
		if (null != cvsCtx) {
			let p1 = {x:130, y:130, radius: 3, fillStyle: "red"};
			let p2 = {x:170, y:170, radius: 3, fillStyle: "blue"};
			let testLine01 = new CanvasLine2D({x: 220, y: 80}, {x:80, y: 220},  1, "gray");
			//
			CanvasUtils.drawLines(cvsCtx, [testLine01]);
			CanvasUtils.drawPoint(cvsCtx, p1);
			CanvasUtils.drawPoint(cvsCtx, p2);
			//
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.b, 1, "lime"));
			//
			let ag1 = Geo2DUtils.revolveRay(p1, testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(p2, testLine01.a, testLine01.b);
			//
			CanvasUtils.drawArc(cvsCtx, p1, 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, p2, 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
		}

		//
		console.log("========================== test cvs 012 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs012")?.getContext("2d");
		if (null != cvsCtx) {
			let p1 = {x:170, y:130, radius: 3, fillStyle: "red"};
			let p2 = {x:130, y:170, radius: 3, fillStyle: "blue"};
			let testLine01 = new CanvasLine2D({x:220, y: 220}, {x: 80, y: 80},  1, "gray");
			//
			CanvasUtils.drawLines(cvsCtx, [testLine01]);
			CanvasUtils.drawPoint(cvsCtx, p1);
			CanvasUtils.drawPoint(cvsCtx, p2);
			// TODO:
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.b, 1, "lime"));
			//
			let ag1 = Geo2DUtils.revolveRay(p1, testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(p2, testLine01.a, testLine01.b);

			CanvasUtils.drawArc(cvsCtx, p1, 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, p2, 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
		}

		//
		console.log("========================== test cvs 013 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs013")?.getContext("2d");
		if (null != cvsCtx) {
			let p1 = {x:130, y:130, radius: 3, fillStyle: "red"};
			let p2 = {x:170, y:170, radius: 3, fillStyle: "blue"};
			let testLine01 = new CanvasLine2D({x:80, y: 220}, {x: 220, y: 80},  1, "gray");
			// 
			CanvasUtils.drawLines(cvsCtx, [testLine01]);
			CanvasUtils.drawPoint(cvsCtx, p1);
			CanvasUtils.drawPoint(cvsCtx, p2);
			//
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.a, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p1, testLine01.b, 1, "red" ));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.a, 1, "lime"));
			CanvasUtils.drawLine(cvsCtx, new CanvasLine2D(p2, testLine01.b, 1, "lime"));
			//
			let ag1 = Geo2DUtils.revolveRay(p1, testLine01.a, testLine01.b);
			let ag2 = Geo2DUtils.revolveRay(p2, testLine01.a, testLine01.b);
			//
			CanvasUtils.drawArc(cvsCtx, p1, 30, ag1, {lineWidth: 1, strokeStyle: "red" });
			CanvasUtils.drawArc(cvsCtx, p2, 40, ag2, {lineWidth: 1, strokeStyle: "lime"});
		}

		//
		console.log("========================== test cvs 014 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs014")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawRectangle(cvsCtx, rect01);
			CanvasUtils.drawRectangle(cvsCtx, rect03);
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			//
			CanvasUtils.drawVertexRaysFrom(cvsCtx, center.x, center.y, rect01, 150, 1, "red" );
			CanvasUtils.drawVertexRaysFrom(cvsCtx, center.x, center.y, rect03, 150, 1, "blue");
			//let vtxRays1 = Geo2DUtils.genVertexRaysFrom(center.x, center.y, rect01, 150);
			//let vtxRays2 = Geo2DUtils.genVertexRaysFrom(center.x, center.y, rect03, 150);
		}

		//
		console.log("========================== test cvs 015 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs015")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawRectangle(cvsCtx, rect02);
			CanvasUtils.drawRectangle(cvsCtx, rect04);
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			//
			CanvasUtils.drawVertexRaysFrom(cvsCtx, center.x, center.y, rect02, 150, 1, "lime");
			CanvasUtils.drawVertexRaysFrom(cvsCtx, center.x, center.y, rect04, 150, 1, "gray");
			//let vtxRays1 = Geo2DUtils.genVertexRaysFrom(center.x, center.y, rect02, 150);
			//let vtxRays2 = Geo2DUtils.genVertexRaysFrom(center.x, center.y, rect04, 150);
		}

		//
		console.log("========================== test cvs 016 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs016")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawRectangle(cvsCtx, rect01);
			CanvasUtils.drawRectangle(cvsCtx, rect03);
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, rect01, 150, {lineWidth: 1,  strokeStyle:"red" ,fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, rect03, 150, {lineWidth: 1,  strokeStyle:"blue",fillStyle: "rgba(100,100,100,0.5)"});
		}

		//
		console.log("========================== test cvs 017 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs017")?.getContext("2d");
		if (null != cvsCtx) {
			CanvasUtils.drawRectangle(cvsCtx, rect02);
			CanvasUtils.drawRectangle(cvsCtx, rect04);
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, rect02, 150, {lineWidth: 1,  strokeStyle:"lime",fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, rect04, 150, {lineWidth: 1,  strokeStyle:"gray",fillStyle: "rgba(100,100,100,0.5)"});
		}

		//
		console.log("========================== test cvs 018 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs018")?.getContext("2d");
		if (null != cvsCtx) {
			let cric01 = new CanvasCircle2D(150,  80, 60, 3, "red" , "");
			let cric03 = new CanvasCircle2D(150, 220, 60, 3, "blue", "");
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			CanvasUtils.drawCircle(cvsCtx, cric01);
			CanvasUtils.drawCircle(cvsCtx, cric03);
			//
			let vtxPts1 = cric01.getVertexesFrom(center.x, center.y);
			let vtxPts3 = cric03.getVertexesFrom(center.x, center.y);
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts1[0].x, y: vtxPts1[0].y, radius: 3, fillStyle: "red" });
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts1[1].x, y: vtxPts1[1].y, radius: 3, fillStyle: "red" });
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts3[0].x, y: vtxPts3[0].y, radius: 3, fillStyle: "blue"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts3[1].x, y: vtxPts3[1].y, radius: 3, fillStyle: "blue"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric01, 145, {lineWidth: 1,  strokeStyle:"red" ,fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric03, 145, {lineWidth: 1,  strokeStyle:"blue",fillStyle: "rgba(100,100,100,0.5)"});
		}

		//
		console.log("========================== test cvs 019 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs019")?.getContext("2d");
		if (null != cvsCtx) {
			let cric02 = new CanvasCircle2D(220, 150, 60, 3, "lime", "");
			let cric04 = new CanvasCircle2D( 80, 150, 60, 3, "gray", "");
			CanvasUtils.drawPoint(cvsCtx, center);
			CanvasUtils.drawCircle(cvsCtx, cric02);
			CanvasUtils.drawCircle(cvsCtx, cric04);
			//
			let vtxPts2 = cric02.getVertexesFrom(center.x, center.y);
			let vtxPts4 = cric04.getVertexesFrom(center.x, center.y);
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts2[0].x, y: vtxPts2[0].y, radius: 3, fillStyle: "lime"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts2[1].x, y: vtxPts2[1].y, radius: 3, fillStyle: "lime"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts4[0].x, y: vtxPts4[0].y, radius: 3, fillStyle: "gray"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts4[1].x, y: vtxPts4[1].y, radius: 3, fillStyle: "gray"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric02, 145, {lineWidth: 1,  strokeStyle:"lime",fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric04, 145, {lineWidth: 1,  strokeStyle:"gray",fillStyle: "rgba(100,100,100,0.5)"});
		}

		//
		console.log("========================== test cvs 020 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs020")?.getContext("2d");
		if (null != cvsCtx) {
			let cric01 = new CanvasCircle2D(100, 100, 60, 3, "red" , "");
			let cric03 = new CanvasCircle2D(200, 200, 60, 3, "blue", "");
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			CanvasUtils.drawCircle(cvsCtx, cric01);
			CanvasUtils.drawCircle(cvsCtx, cric03);
			//
			let vtxPts1 = cric01.getVertexesFrom(center.x, center.y);
			let vtxPts3 = cric03.getVertexesFrom(center.x, center.y);
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts1[0].x, y: vtxPts1[0].y, radius: 3, fillStyle: "red" });
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts1[1].x, y: vtxPts1[1].y, radius: 3, fillStyle: "red" });
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts3[0].x, y: vtxPts3[0].y, radius: 3, fillStyle: "blue"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts3[1].x, y: vtxPts3[1].y, radius: 3, fillStyle: "blue"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric01, 145, {lineWidth: 1,  strokeStyle:"red" ,fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric03, 145, {lineWidth: 1,  strokeStyle:"blue",fillStyle: "rgba(100,100,100,0.5)"});
		}

		//
		console.log("========================== test cvs 021 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs021")?.getContext("2d");
		if (null != cvsCtx) {
			let cric02 = new CanvasCircle2D(100, 200, 60, 3, "lime", "");
			let cric04 = new CanvasCircle2D(200, 100, 60, 3, "gray", "");
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			CanvasUtils.drawCircle(cvsCtx, cric02);
			CanvasUtils.drawCircle(cvsCtx, cric04);
			//
			let vtxPts2 = cric02.getVertexesFrom(center.x, center.y);
			let vtxPts4 = cric04.getVertexesFrom(center.x, center.y);
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts2[0].x, y: vtxPts2[0].y, radius: 3, fillStyle: "lime"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts2[1].x, y: vtxPts2[1].y, radius: 3, fillStyle: "lime"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts4[0].x, y: vtxPts4[0].y, radius: 3, fillStyle: "gray"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts4[1].x, y: vtxPts4[1].y, radius: 3, fillStyle: "gray"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric02, 145, {lineWidth: 1,  strokeStyle: "lime", fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric04, 145, {lineWidth: 1,  strokeStyle: "gray", fillStyle: "rgba(100,100,100,0.5)"});
		}

		//
		console.log("========================== test cvs 022 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs022")?.getContext("2d");
		if (null != cvsCtx) {
			let cric01 = new CanvasCircle2D( 70,  70, 60, 3, "red" , "");
			let cric03 = new CanvasCircle2D(230, 230, 60, 3, "blue", "");
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			CanvasUtils.drawCircle(cvsCtx, cric01);
			CanvasUtils.drawCircle(cvsCtx, cric03);
			//
			let vtxPts1 = cric01.getVertexesFrom(center.x, center.y);
			let vtxPts3 = cric03.getVertexesFrom(center.x, center.y);
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts1[0].x, y: vtxPts1[0].y, radius: 3, fillStyle: "red" });
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts1[1].x, y: vtxPts1[1].y, radius: 3, fillStyle: "red" });
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts3[0].x, y: vtxPts3[0].y, radius: 3, fillStyle: "blue"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts3[1].x, y: vtxPts3[1].y, radius: 3, fillStyle: "blue"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric01, 145, {lineWidth: 1,  strokeStyle:"red" ,fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric03, 145, {lineWidth: 1,  strokeStyle:"blue",fillStyle: "rgba(100,100,100,0.5)"});
		}

		//
		console.log("========================== test cvs 023 ======================")
		cvsCtx = document.querySelector<HTMLCanvasElement>("#testCvs023")?.getContext("2d");
		if (null != cvsCtx) {
			let cric02 = new CanvasCircle2D( 70, 230, 60, 3, "lime", "");
			let cric04 = new CanvasCircle2D(230,  70, 60, 3, "gray", "");
			//
			CanvasUtils.drawPoint(cvsCtx, center);
			CanvasUtils.drawCircle(cvsCtx, cric02);
			CanvasUtils.drawCircle(cvsCtx, cric04);
			//
			let vtxPts2 = cric02.getVertexesFrom(center.x, center.y);
			let vtxPts4 = cric04.getVertexesFrom(center.x, center.y);
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts2[0].x, y: vtxPts2[0].y, radius: 3, fillStyle: "lime"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts2[1].x, y: vtxPts2[1].y, radius: 3, fillStyle: "lime"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts4[0].x, y: vtxPts4[0].y, radius: 3, fillStyle: "gray"});
			CanvasUtils.drawPoint(cvsCtx, {x: vtxPts4[1].x, y: vtxPts4[1].y, radius: 3, fillStyle: "gray"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric02, 145, {lineWidth: 1,  strokeStyle: "lime", fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx, center.x, center.y, cric04, 145, {lineWidth: 1,  strokeStyle: "gray", fillStyle: "rgba(100,100,100,0.5)"});
		}

	}



}


export class TestJadeUtils {

	static testAll() {
		// 
		TestBasicUtil.testNum();
		TestBasicUtil.testStr();
		TestBasicUtil.testTime();
		//
		TestDataStructure.testSimpleMap();
		TestDataStructure.testSimpleStack();
		TestDataStructure.testSimpleQueue();
		// 
		TestWebUtil.testHtml();
		//
		TestWebHtmlPage.testJquery();
	}

	static testWiki() {
		TestWebHtmlPage.testJquery();
	}

	static testCanvas() {
		TestCanvas.testCanvas();
	}

}
