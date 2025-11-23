import { CanvasUtils, ImageClip } from "./canvas.js";
import { JadeUIResource, DefaultIconGroup } from "./resource.js";
import { CircleToken, ImageResource, LineToken, RectangleToken, SandTable, SandTableUtils, ScenceDataResp } from "./sandtable.js";
import { JadeWindowUI, UIDesktop, UIObj, UIWindowAdpt, WinParam } from "./UIWindow.js";

export namespace TestJadeTRPG {

	export let testTrpgCompose = async () => {
		// load image resource
		let imgProxyUrl = "http://www.jade-dungeon.cn:8088/api/sandtable/parseImage?src=";
		let imgResources: ImageResource[] = [{
			"id": "icons", "type": "Image", // 
			"url": "http://www.jade-dungeon.cn:8081/jadeutils.v3/themes/trpg/images/icons.jpg"},{
			"id": "map"  , "type": "Image", //
			"url": "http://www.jade-dungeon.cn:8081/jadeutils.v3/themes/trpg/images/map.jpg"
		}];
		await SandTableUtils.loadImageResources(imgResources, imgProxyUrl);
		//
		let imgUsr01 = { "imgKey": "icons", "sx": 100, "sy": 100, "width": 50, "height": 50 };
		let imgFnt01 = { "imgKey": "icons", "sx":   0, "sy":   0, "width": 50, "height": 50 };
		let imgEnm01 = { "imgKey": "icons", "sx": 100, "sy":   0, "width": 50, "height": 50 };
		//
		let bgImgClip: ImageClip = { "imgKey": "icons", "sx": 0, "sy": 0, "width": 300, "height": 300, "imageElem": imgResources[1].imgElem };
		let user = CircleToken.fromRecord({
			"type": "Circle", "id": "jade", "x": 153, "y": 152, "visiable": true, "blockView": true, "color": "Blue", //
			"img": imgUsr01, "radius": 25 //
		}, imgResources);
		//
		let styleMith = {lineWidth: -3, strokeStyle: "Gray", imgClip: bgImgClip };
		/* ========================== */
		// test 001
		/* ========================== */
		let cvsCtx001 = document.querySelector<HTMLCanvasElement>("#testTrpg001")?.getContext("2d");
		if (null != cvsCtx001) {
			// load token from json
			user.draw(cvsCtx001);
		}
		/* ========================== */
		// test 002
		/* ========================== */
		let cvsCtx002 = document.querySelector<HTMLCanvasElement>("#testTrpg002")?.getContext("2d");
		if (null != cvsCtx002) {
			// load token from json
			let fnt = RectangleToken.fromRecord({ "type": "Rectangle", "id": "furnishing-1696391644699", //
				"x": 156, "y": 190, "width": 50, "height": 50, "visiable": true, "blockView": false, "color": "Blue", //
				"img": imgFnt01
			}, imgResources);
			// draw image
			fnt.draw(cvsCtx002);
		}

		/* ========================== */
		// test 003
		/* ========================== */
		let cvsCtx003 = document.querySelector<HTMLCanvasElement>("#testTrpg003")?.getContext("2d");
		if (null != cvsCtx003) {
			// load token from json
			let line = LineToken.fromRecord({ "type": "Line", "id": "wall-1653882430769", 
				"x": 53, "y": 112, "x2": 160, "y2": 214, "color": "#0000FF", "visiable": false, "blockView": true
			});
			// draw image
			line.draw(cvsCtx003);
		}
		/* ========================== */
		// test 004
		/* ========================== */
		let cvsCtx004 = document.querySelector<HTMLCanvasElement>("#testTrpg004")?.getContext("2d");
		if (null != cvsCtx004) {
			//
			let enm01 = CircleToken.fromRecord({"type": "Circle", "id": "enm01", "x": 150, "y":  80, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm02 = CircleToken.fromRecord({"type": "Circle", "id": "enm02", "x":  80, "y": 150, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm03 = CircleToken.fromRecord({"type": "Circle", "id": "enm03", "x": 220, "y": 150, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm04 = CircleToken.fromRecord({"type": "Circle", "id": "enm04", "x": 150, "y": 220, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			//
			user.draw(cvsCtx004);
			enm01.draw(cvsCtx004);
			enm02.draw(cvsCtx004);
			enm03.draw(cvsCtx004);
			enm04.draw(cvsCtx004);
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx004, user.c.x, user.c.y, enm01, 139, {lineWidth: 1, strokeStyle: "red", fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx004, user.c.x, user.c.y, enm02, 139, {lineWidth: 1, strokeStyle: "red", fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx004, user.c.x, user.c.y, enm03, 139, {lineWidth: 1, strokeStyle: "red", fillStyle: "rgba(100,100,100,0.5)"});
			CanvasUtils.drawVertexShadowFrom(cvsCtx004, user.c.x, user.c.y, enm04, 139, {lineWidth: 1, strokeStyle: "red", fillStyle: "rgba(100,100,100,0.5)"});
		}
		/* ========================== */
		// test 005
		/* ========================== */
		let cvsCtx005 = document.querySelector<HTMLCanvasElement>("#testTrpg005")?.getContext("2d");
		if (null != cvsCtx005) {
			let enm01 = CircleToken.fromRecord({"type": "Circle", "id": "enm01", "x": 150, "y":  80, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm02 = CircleToken.fromRecord({"type": "Circle", "id": "enm02", "x":  80, "y": 150, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm03 = CircleToken.fromRecord({"type": "Circle", "id": "enm03", "x": 220, "y": 150, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm04 = CircleToken.fromRecord({"type": "Circle", "id": "enm04", "x": 150, "y": 220, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx005, user.c.x, user.c.y, enm01, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx005, user.c.x, user.c.y, enm02, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx005, user.c.x, user.c.y, enm03, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx005, user.c.x, user.c.y, enm04, 139, styleMith);
			//
			user.draw(cvsCtx005);
			enm01.draw(cvsCtx005);
			enm02.draw(cvsCtx005);
			enm03.draw(cvsCtx005);
			enm04.draw(cvsCtx005);
		}
		/* ========================== */
		// test 006
		/* ========================== */
		let cvsCtx006 = document.querySelector<HTMLCanvasElement>("#testTrpg006")?.getContext("2d");
		if (null != cvsCtx006) {
			let enm01 = CircleToken.fromRecord({"type": "Circle", "id": "enm01", "x": 100, "y": 100, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm02 = CircleToken.fromRecord({"type": "Circle", "id": "enm02", "x": 200, "y": 100, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm03 = CircleToken.fromRecord({"type": "Circle", "id": "enm03", "x": 100, "y": 200, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			let enm04 = CircleToken.fromRecord({"type": "Circle", "id": "enm04", "x": 200, "y": 200, "visiable": true, "blockView": true, "color": "Red", "img": imgEnm01, "radius": 25}, imgResources);
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx006, user.c.x, user.c.y, enm01, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx006, user.c.x, user.c.y, enm02, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx006, user.c.x, user.c.y, enm03, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx006, user.c.x, user.c.y, enm04, 139, styleMith);
			//
			user.draw(cvsCtx006);
			enm01.draw(cvsCtx006);
			enm02.draw(cvsCtx006);
			enm03.draw(cvsCtx006);
			enm04.draw(cvsCtx006);
		}
		/* ========================== */
		// test 007
		/* ========================== */
		let cvsCtx007 = document.querySelector<HTMLCanvasElement>("#testTrpg007")?.getContext("2d");
		if (null != cvsCtx007) {
			//
			let fnt01 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt01", "x": 125, "y":  50, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources);
			let fnt02 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt02", "x":  50, "y": 125, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources);
			let fnt03 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt03", "x": 200, "y": 125, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources);
			let fnt04 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt04", "x": 125, "y": 200, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources);
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx007, user.c.x, user.c.y, fnt01, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx007, user.c.x, user.c.y, fnt02, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx007, user.c.x, user.c.y, fnt03, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx007, user.c.x, user.c.y, fnt04, 139, styleMith);
			//
			user.draw(cvsCtx007);
			fnt01.draw(cvsCtx007);
			fnt02.draw(cvsCtx007);
			fnt03.draw(cvsCtx007);
			fnt04.draw(cvsCtx007);
		}
		/* ========================== */
		// test 008
		/* ========================== */
		let cvsCtx008 = document.querySelector<HTMLCanvasElement>("#testTrpg008")?.getContext("2d");
		if (null != cvsCtx008) {
			let fnt01 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt01", "x":  60, "y":  60, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources); 
			let fnt02 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt02", "x": 180, "y":  60, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources);
			let fnt03 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt03", "x":  60, "y": 190, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources);
			let fnt04 = RectangleToken.fromRecord({"type": "Rectangle", "id": "fnt04", "x": 180, "y": 190, "visiable": true, "blockView": true, "color": "Gray", "img": imgFnt01, "width": 50, "height": 50}, imgResources);
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx008, user.c.x, user.c.y, fnt01, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx008, user.c.x, user.c.y, fnt02, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx008, user.c.x, user.c.y, fnt03, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx008, user.c.x, user.c.y, fnt04, 139, styleMith);
			//
			user.draw(cvsCtx008);
			fnt01.draw(cvsCtx008);
			fnt02.draw(cvsCtx008);
			fnt03.draw(cvsCtx008);
			fnt04.draw(cvsCtx008);
		}
		/* ========================== */
		// test 009
		/* ========================== */
		let cvsCtx009 = document.querySelector<HTMLCanvasElement>("#testTrpg009")?.getContext("2d");
		if (null != cvsCtx009) {
			let wall01 = LineToken.fromRecord({"type": "Line", "id": "wall001", "x": 120, "y":  80, "x2": 180, "y2":  80, "visiable": true, "blockView": true, "color": "Lime"});
			let wall02 = LineToken.fromRecord({"type": "Line", "id": "wall002", "x": 220, "y": 120, "x2": 220, "y2": 180, "visiable": true, "blockView": true, "color": "Lime"});
			let wall03 = LineToken.fromRecord({"type": "Line", "id": "wall003", "x": 120, "y": 220, "x2": 180, "y2": 220, "visiable": true, "blockView": true, "color": "Lime"});
			let wall04 = LineToken.fromRecord({"type": "Line", "id": "wall002", "x":  80, "y": 120, "x2":  80, "y2": 180, "visiable": true, "blockView": true, "color": "Lime"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx009, user.c.x, user.c.y, wall01, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx009, user.c.x, user.c.y, wall02, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx009, user.c.x, user.c.y, wall03, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx009, user.c.x, user.c.y, wall04, 139, styleMith);
			//
			user.draw(cvsCtx009);
			wall01.draw(cvsCtx009);
			wall02.draw(cvsCtx009);
			wall03.draw(cvsCtx009);
			wall04.draw(cvsCtx009);
		}
		/* ========================== */
		// test 010
		/* ========================== */
		let cvsCtx010 = document.querySelector<HTMLCanvasElement>("#testTrpg010")?.getContext("2d");
		if (null != cvsCtx010) {
			let wall01 = LineToken.fromRecord({"type": "Line", "id": "wall001", "x": 180, "y":  80, "x2": 220, "y2": 120, "visiable": true, "blockView": true, "color": "Lime"});
			let wall02 = LineToken.fromRecord({"type": "Line", "id": "wall002", "x": 220, "y": 180, "x2": 180, "y2": 220, "visiable": true, "blockView": true, "color": "Lime"});
			let wall03 = LineToken.fromRecord({"type": "Line", "id": "wall003", "x": 120, "y": 220, "x2":  80, "y2": 180, "visiable": true, "blockView": true, "color": "Lime"});
			let wall04 = LineToken.fromRecord({"type": "Line", "id": "wall002", "x":  80, "y": 120, "x2": 120, "y2":  80, "visiable": true, "blockView": true, "color": "Lime"});
			//
			CanvasUtils.drawVertexShadowFrom(cvsCtx010, user.c.x, user.c.y, wall01, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx010, user.c.x, user.c.y, wall02, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx010, user.c.x, user.c.y, wall03, 139, styleMith);
			CanvasUtils.drawVertexShadowFrom(cvsCtx010, user.c.x, user.c.y, wall04, 139, styleMith);
			//
			user.draw(cvsCtx010);
			wall01.draw(cvsCtx010);
			wall02.draw(cvsCtx010);
			wall03.draw(cvsCtx010);
			wall04.draw(cvsCtx010);
		}

		/* ================== */
		// test download
		/* ================== */
		// let testDownload = document.querySelector<HTMLCanvasElement>("#testTrpg001");
		// if (testDownload) { CanvasUtils.downloadCanvasImage(testDownload, 'png'); }

	}

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
		// load image resource
		await SandTableUtils.loadImageResources(testSceneData.imgResources, imgProxyUrl);
		//
		let sandTable = new SandTable({ visibility: "default", //
			map: { imageUrl: mapUrl, width: 0, height: 0, shadowStyle: 'rgba(0, 0, 0, 0.7)' },
			frame: { 
				buff: {cvs: bufferCanvas, ctx: bufferCvsCtx},
				show: {cvs:  finalCanvas, ctx: finalCvsCtx }
			}
		});
		// 
		let user = CircleToken.fromRecord(testSceneData.mapDatas.teams[2], testSceneData.imgResources);
		await sandTable.drawSceneWithUserView({proxyUrl: imgProxyUrl});
		//
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
