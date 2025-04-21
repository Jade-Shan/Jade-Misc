import { WebUtil } from './web.js';

let testFunc = (isPassed: boolean, log: (msg: string, sty: string, mk: string) => void) => {
	let sty = isPassed ?
		"color: white; background-color: green" :
		"color: white; background-color: red";
	let mk = isPassed ? "PASSED" : "FAILED";
	let msg = "test func: %s , result: %c%s";
	log(msg, sty, mk);
}


export class TestJadeUtils {

	static testAll() {
		testFunc("Basic YWFhOmJiYg==" === WebUtil.webAuthBasic("aaa", "bbb"), (msg, sty, mk) => {
			console.log(msg, "WebUtil.webAuthBasic()", sty, mk);
		});

		testFunc("Basic YWFhOmJiYg= " === WebUtil.webAuthBasic("aaa", "bbb"), (msg, sty, mk) => {
			console.log(msg, "WebUtil.webAuthBasic()", sty, mk);
		});
	}

}
