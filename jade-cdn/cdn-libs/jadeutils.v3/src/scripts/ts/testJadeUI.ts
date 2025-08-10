//import { NumUtil, StrUtil, TimeUtil } from './basic.js';
//import { SimpleMap, SimpleStack, SimpleQueue } from './dataStructure.js'
//import { WebUtil } from './web.js';
//import { PageConfig, WebHtmlPage } from './webHtmlPage.js';
//import { SyntaxHighlighterHelper, MathJaxHelper, BootStrapHelper, DataTableHelper } from './3rdLibTool.js';
//import { CanvasCircle2D, CanvasLine2D, CanvasPoint2D, CanvasRay2D, CanvasRectangle2D, CanvasUtils, ICanvasRay2D, ICanvasRectangle2D } from './canvas.js';
//import { Geo2DUtils, GeoShape2D, IRay2D, Line2D, Point2D, Ray2D } from './geo2d.js';

import { UIDesktop, UIWindow } from "./UIWindow.js";


export class TestJadeUI {


	static testWindowUI() {
		for (let i = 0; i < 5; i++) {
			let ddiv = document.getElementById(`test-desktop-${i}`);
			if (ddiv) {
				let desktop: UIDesktop = new UIDesktop(ddiv);
				for (let j = 0; j < 3; j++) {
					let win = new UIWindow(desktop, `test-win-${i}-${j}`, `test win ${i}-${j}`);
					win.renderIn();
				}
			}
		}
	}


}
