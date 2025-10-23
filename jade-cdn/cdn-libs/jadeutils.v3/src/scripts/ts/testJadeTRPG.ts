import { CanvasCircle2D, CanvasRectangle2D, CanvasUtils } from "./canvas.js";
import { JadeUIResource, DefaultIconGroup } from "./resource.js";
import { CircleToken, SandTable, ScenceDataResp } from "./sandtable.js";
import { JadeWindowUI, UIDesktop, UIObj, UIWindowAdpt, WinParam } from "./UIWindow.js";

export namespace TestJadeTRPG {


	class TestCanvasWindow extends UIWindowAdpt {

		bufferCanvas: HTMLCanvasElement = document.createElement("canvas");
		finalCanvas : HTMLCanvasElement = document.createElement("canvas");

		constructor(desktop: UIDesktop, id: string, title: string, cfg?: WinParam) {
			super(desktop, id, title, cfg);
			let width  = 640;
			let height = 480;
			this.finalCanvas.id = `canvas-final-${id}`;
			this.finalCanvas.width  = width ;
			this.finalCanvas.height = height;
			this.finalCanvas.style.width  = `${width }px`;
			this.finalCanvas.style.height = `${height}px`;
			this.bufferCanvas.id = `canvas-buffer-${id}`;
			this.bufferCanvas.width  = width ;
			this.bufferCanvas.height = height;
			this.bufferCanvas.style.width  = `${width }px`;
			this.bufferCanvas.style.height = `${height}px`;
			this.bufferCanvas.style.display = `hidden`;
		}

		renderIn(): void {
			let renderWindowBody = (): HTMLDivElement => {
				let windowBody = this.ui.windowBody;
				windowBody.style.overflow = this.cfg.body.overflow;
				windowBody.style.width = `${this.cfg.body.initSize.width}px`;
				windowBody.style.height = `${this.cfg.body.initSize.height}px`;
				windowBody.style.overflowX = 'scroll';
				windowBody.style.overflowY = 'scroll';
				windowBody.appendChild(this.finalCanvas);
				return windowBody;
			}

			let renderStatusBar = (): HTMLDivElement => {
				let statusBar = document.createElement("div");
				statusBar.classList.add("status-bar");
				statusBar.innerHTML = `
					<p class="status-bar-field">Press F1 for help</p>
					<p class="status-bar-field">Slide 1</p>
					<p class="status-bar-field">canvas for map</p>
				`;
				return statusBar;
			}
			JadeWindowUI.renderWindowTplt(this, renderWindowBody, renderStatusBar);
		}

	}

	export let testTrpgCompose = async () => {

	}

	export let testTrpgUI = async () => {
		// window UI
		let desktop01 = document.getElementById(`test-desktop-01`)!;
		let desktop: UIDesktop = new UIDesktop(desktop01, { dockBar: { range: 300, maxScale: 1.8 } });
		let canvasWin = new TestCanvasWindow(desktop, "test-canvas-01", "Map-001", {
			icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_FACE),
			body: { initSize: { width: 640, height: 480 }, overflow: "scroll" }
		});
		canvasWin.renderIn();
		//
		let bufferCanvas = canvasWin.bufferCanvas;
		let finalCanvas  = canvasWin.finalCanvas;
		let bufferCvsCtx = canvasWin.bufferCanvas.getContext("2d")!;
		let finalCvsCtx  = canvasWin.finalCanvas .getContext("2d")!;
		// 
		finalCanvas.addEventListener("mousedown", e => {
			let rect = finalCanvas.getBoundingClientRect();
			CanvasUtils.drawPoint(finalCvsCtx, { x: e.clientX - rect.left, y: e.clientY - rect.top, radius: 3, fillStyle: "lime" });
		})

		// load sandtable
		let mapUrl = "http://www.jade-dungeon.cn:8081/jadeutils.v3/themes/trpg/images/map.jpg";
		let imgProxyUrl = "http://www.jade-dungeon.cn:8088/api/sandtable/parseImage?src=";
		let sandTable = new SandTable({ visibility: "default", //
			map: { imageUrl: mapUrl, width: 0, height: 0, shadowStyle: 'rgba(0, 0, 0, 0.7)' },
			frame: { 
				buff: {cvs: bufferCanvas, ctx: bufferCvsCtx},
				show: {cvs:  finalCanvas, ctx: finalCvsCtx }
			}
		});
		// 
		let user = CircleToken.fromRecord(testSceneData.mapDatas.teams[2]);
		await sandTable.drawSceneWithUserView({proxyUrl: imgProxyUrl});
		user.draw(finalCvsCtx)
	}

}


let testSceneData: ScenceDataResp = {
  "username": "jade",
  "loginToken": "jade|a8dce1e8-63c3-4825-8932-5dd8f430aaa4|1747416892778",
  "imgResources": [
    {"id": "icons", "type": "Image", "url": "http://www.jade-dungeon.cn:8081/jadeutils.v3/themes/trpg/images/icons.jpg"},
    {"id": "map"  , "type": "Image", "url": "http://www.jade-dungeon.cn:8081/jadeutils.v3/themes/trpg/images/map.jpg"  }
  ],
  "mapDatas": {
    "teams": [
      {"id": "spectator", "x": 236, "y": 230, "visiable": false, "blockView": false, "color": "#0000FF", "img": {"imgKey": "icons", "sx": 100, "sy": 150, "width": 50, "height": 50}, "type": "Circle", "radius": 25},
      {"id": "teo"      , "x": 240, "y": 299, "visiable": true , "blockView": true , "color": "#0000FF", "img": {"imgKey": "icons", "sx": 100, "sy": 50 , "width": 50, "height": 50}, "type": "Circle", "radius": 25},
      {"id": "jade"     , "x": 344, "y": 152, "visiable": true , "blockView": true , "color": "#0000FF", "img": {"imgKey": "icons", "sx": 100, "sy": 100, "width": 50, "height": 50}, "type": "Circle", "radius": 25}
    ],
    "creaters": [
      {"id": "orc1"                 , "x": 150, "y": 245, "visiable": true, "blockView": true, "color": "#FF0000", "img": {"imgKey": "icons", "sx": 100, "sy":  0, "width":  50, "height":  50}, "type": "Circle", "radius": 25},
      {"id": "creater-1696391803781", "x": 150, "y": 550, "visiable": true, "blockView": true, "color": "#0000FF", "img": {"imgKey": "icons", "sx":   0, "sy": 50, "width": 100, "height": 100}, "type": "Circle", "radius": 50}
    ],
    "furnishings": [
      {"id": "furnishing-1696391644699", "x":  56, "y": 590, "visiable": true, "blockView": false, "color": "#0000FF", "img": {"imgKey": "icons", "sx": 0, "sy": 0, "width": 50, "height": 50}, "type": "Rectangle", "width": 62, "height": 57},
      {"id": "furnishing-1696391761836", "x": 189, "y": 587, "visiable": true, "blockView": false, "color": "#0000FF", "img": {"imgKey": "icons", "sx": 0, "sy": 0, "width": 50, "height": 50}, "type": "Rectangle", "width": 61, "height": 58}
    ],
    "doors": [
      {"id": "door-1696391873911", "x": 539, "y": 161, "visiable": true, "blockView": true, "color": "#0000FF", "img": {"imgKey": "icons", "sx": 0, "sy": 150, "width": 50, "height": 50}, "type": "Rectangle", "width": 23, "height": 64},
      {"id": "door-1696392071983", "x": 261, "y": 440, "visiable": true, "blockView": true, "color": "#0000FF", "img": {"imgKey": "icons", "sx": 0, "sy": 150, "width": 50, "height": 50}, "type": "Rectangle", "width": 80, "height": 21}
    ],
    "walls": [
      {"id": "wall-1653882416304", "x":  87, "y": 342, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2":   7, "y2": 343},
      {"id": "wall-1653882423195", "x":  65, "y": 118, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2":  61, "y2": 345},
      {"id": "wall-1653882430769", "x": 253, "y": 112, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2":  60, "y2": 114},
      {"id": "wall-1653882436394", "x": 252, "y": 148, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 253, "y2":  38},
      {"id": "wall-1653882453537", "x": 342, "y":  38, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 238, "y2":  37},
      {"id": "wall-1653882460387", "x": 342, "y":   2, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 345, "y2":  53},
      {"id": "wall-1653882466531", "x": 456, "y":   1, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 459, "y2":  49},
      {"id": "wall-1653882472219", "x": 459, "y":  39, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 568, "y2":  45},
      {"id": "wall-1653882478634", "x": 563, "y":  39, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 562, "y2": 147},
      {"id": "wall-1653882484634", "x": 846, "y": 106, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 559, "y2": 109},
      {"id": "wall-1653882489986", "x": 854, "y":  24, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 851, "y2": 121},
      {"id": "wall-1653882549427", "x": 555, "y": 230, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 558, "y2": 300},
      {"id": "wall-1653882556026", "x": 154, "y": 451, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2":   8, "y2": 452},
      {"id": "wall-1653882561250", "x": 552, "y": 444, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 349, "y2": 447},
      {"id": "wall-1653882565866", "x": 543, "y": 447, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 548, "y2": 339},
      {"id": "wall-1653882644179", "x": 543, "y": 344, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 762, "y2": 342},
      {"id": "wall-1696391396938", "x": 246, "y": 760, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 258, "y2": 448},
      {"id": "wall-1696391405167", "x": 251, "y": 654, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2":  45, "y2": 653},
      {"id": "wall-1696391411067", "x":  40, "y": 654, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2":  49, "y2": 450},
      {"id": "wall-1696391417911", "x": 556, "y": 750, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 249, "y2": 755},
      {"id": "wall-1696391424165", "x": 552, "y": 754, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 555, "y2": 646},
      {"id": "wall-1696391428367", "x": 550, "y": 650, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 754, "y2": 653},
      {"id": "wall-1696391433055", "x": 541, "y": 550, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 755, "y2": 547},
      {"id": "wall-1696391437780", "x": 752, "y": 552, "visiable": false, "blockView": true, "color": "#0000FF", "type": "Line", "x2": 755, "y2": 447}
    ]
  }
};
