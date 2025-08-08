//import { NumUtil, StrUtil, TimeUtil } from './basic.js';
//import { SimpleMap, SimpleStack, SimpleQueue } from './dataStructure.js'
//import { WebUtil } from './web.js';
//import { PageConfig, WebHtmlPage } from './webHtmlPage.js';
//import { SyntaxHighlighterHelper, MathJaxHelper, BootStrapHelper, DataTableHelper } from './3rdLibTool.js';
//import { CanvasCircle2D, CanvasLine2D, CanvasPoint2D, CanvasRay2D, CanvasRectangle2D, CanvasUtils, ICanvasRay2D, ICanvasRectangle2D } from './canvas.js';
//import { Geo2DUtils, GeoShape2D, IRay2D, Line2D, Point2D, Ray2D } from './geo2d.js';

import { UIDesktopStatus, UIWindow } from "./UIWindow.js";


export class TestJadeUI {


	static testWindowUI() {
		let desktop: UIDesktopStatus = new UIDesktopStatus();
		let win1 = new UIWindow(desktop, "test-win-01", "test win 01");
		win1.renderIn(document.body);
		let win2 = new UIWindow(desktop, "test-win-02", "test win 02" );
		win2.renderIn(document.body);
		let win3 = new UIWindow(desktop, "test-win-03", "test win 03" );
		win3.renderIn(document.body);
	}


}
