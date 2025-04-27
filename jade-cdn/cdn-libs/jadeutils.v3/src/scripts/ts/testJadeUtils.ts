import { NumUtil, StrUtil, TimeUtil } from './basic.js';
import {SimpleMap, SimpleStack, SimpleQueue} from './dataStructure.js'
import { WebUtil } from './web.js';
import { PageConfig, WebHtmlPage, NavTreeNode} from './webHtmlPage.js';

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
		let cfg = new PageConfig("/", "tast-page", "for test");
		let page = new WebHtmlPage(cfg);
		//
		let sub01 = new Array<NavTreeNode>();
		let n = new NavTreeNode("page00", "page00.html", false); sub01.push(n);
		n = new NavTreeNode("page01", "page01.html", false); sub01.push(n);
		n = new NavTreeNode("page02", "page01.html", false); sub01.push(n);
		let nav01 = new Array<NavTreeNode>();
		n = new NavTreeNode("page_A1", "page_A1.html", false); nav01.push(n);
		n = new NavTreeNode("page_A2", null, false, "A2", sub01); nav01.push(n);
		n = new NavTreeNode("page_A3", "page_A3.html", false); nav01.push(n);
		page.renderTopNav(cfg, nav01);
		}
}


export class TestJadeUtils {

	static testAll($: any) {
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

}
