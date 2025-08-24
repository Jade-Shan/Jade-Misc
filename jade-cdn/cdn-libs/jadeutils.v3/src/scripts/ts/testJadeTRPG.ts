import { CanvasCircle2D, CanvasRectangle2D, CanvasUtils } from "./canvas.js";
import { JadeUIResource, DefaultIconGroup } from "./resource.js";
import { SandTable } from "./sandtable.js";
import { JadeWindowUI, UIDesktop, UIObj, UIWindowAdpt, WinParam } from "./UIWindow.js";

export namespace TestJadeTRPG {


	class TestCanvasWindow extends UIWindowAdpt {

		bufferCanvas: HTMLCanvasElement = document.createElement("canvas");
		finalCanvas : HTMLCanvasElement = document.createElement("canvas");

		constructor(desktop: UIDesktop, id: string, title: string, cfg?: WinParam) {
			super(desktop, id, title, cfg);
			this.finalCanvas.id = `canvas-final-${id}`;
			this.finalCanvas.width = 1600;
			this.finalCanvas.height = 600;
			this.finalCanvas.style.width = `1600px`;
			this.finalCanvas.style.height = `600px`;
			this.bufferCanvas.id = `canvas-buffer-${id}`;
			this.bufferCanvas.width = 1600;
			this.bufferCanvas.height = 600;
			this.bufferCanvas.style.width = `1600px`;
			this.bufferCanvas.style.height = `600px`;
			this.bufferCanvas.style.display = `hidden`;
		}

		renderIn(): void {
			let renderWindowBody = (): HTMLDivElement => {
				let windowBody = this.ui.windowBody;
				windowBody.style.overflow = this.cfg.body.overflow;
				windowBody.style.width = `${this.cfg.body.initSize.width}px`;
				windowBody.style.height = `${this.cfg.body.initSize.height}px`;
				windowBody.style.overflowX = 'auto';
				windowBody.style.overflowY = 'auto';
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
		//
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
		let mapUrl = "http://www.jade-dungeon.cn:8081/jadeutils.v3/themes/trpg/images/map.jpg";
		let sandTable = new SandTable({ //
			map: { imageUrl: mapUrl, width: 0, height: 0, shadowColor: 'rgba(0, 0, 0, 0.7)' },
			elem: { bufferCvs: bufferCanvas, finalCvs: finalCanvas, bufferCtx: bufferCvsCtx, finalCtx: finalCvsCtx }
		});

		await sandTable.loadSandTableImage("http://www.jade-dungeon.cn:8088/api/sandtable/parseImage?src=");
		finalCanvas.addEventListener("mousedown", e => {
			let rect = finalCanvas.getBoundingClientRect();
			CanvasUtils.drawPoint(finalCvsCtx, { x: e.clientX - rect.left, y: e.clientY - rect.top, radius: 3, fillStyle: "lime" });
		})
	}


}
