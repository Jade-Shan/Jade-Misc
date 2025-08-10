//import { NumUtil, StrUtil, TimeUtil } from './basic.js';
//import { SimpleMap, SimpleStack, SimpleQueue } from './dataStructure.js'
//import { WebUtil } from './web.js';
//import { PageConfig, WebHtmlPage } from './webHtmlPage.js';
//import { SyntaxHighlighterHelper, MathJaxHelper, BootStrapHelper, DataTableHelper } from './3rdLibTool.js';
//import { CanvasCircle2D, CanvasLine2D, CanvasPoint2D, CanvasRay2D, CanvasRectangle2D, CanvasUtils, ICanvasRay2D, ICanvasRectangle2D } from './canvas.js';
//import { Geo2DUtils, GeoShape2D, IRay2D, Line2D, Point2D, Ray2D } from './geo2d.js';

import { NumUtil } from "./basic.js";
import { UIDesktop, UIWindow } from "./UIWindow.js";


export class TestJadeUI {


	static testWindowUI() {
		//
		let desktop00 = document.getElementById(`test-desktop-00`);
		if (desktop00) {
			let desktop: UIDesktop = new UIDesktop(desktop00);
			for (let j = 0; j < 3; j++) {
				let win = new UIWindow(desktop, `test-win-00-${j}`, `test win 00-${j}`);
				win.renderIn();
			}
		}
		//
		let desktop01 = document.getElementById(`test-desktop-01`);
		if (desktop01) {
			let desktop: UIDesktop = new UIDesktop(desktop01, {dockBar:{}});
			for (let j = 0; j < 3; j++) {
				let win = new UIWindow(desktop, `test-win-01-${j}`, `test win 01-${j}`);
				win.renderIn();
			}
		}
		//
		let desktop02 = document.getElementById(`test-desktop-02`);
		if (desktop02) {
			let desktop: UIDesktop = new UIDesktop(desktop02);
			for (let j = 0; j < 3; j++) {
				let win = new UIWindow(desktop, `test-win-02-${j}`, `test win 02-${j}`);
				win.renderIn();
			}
		}
	}


}
