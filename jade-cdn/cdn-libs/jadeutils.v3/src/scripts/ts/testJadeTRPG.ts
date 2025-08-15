import { CanvasCircle2D, CanvasRectangle2D, CanvasUtils } from "./canvas.js";
import { JadeUIResource, DefaultIconGroup } from "./resource.js";
import { JadeWindowUI, UIDesktop, UIObj, UIWindowAdpt, WinParam } from "./UIWindow.js";

export namespace TestJadeTRPG {


	class TestCanvasWindow extends UIWindowAdpt {

		canvas: HTMLCanvasElement = document.createElement("canvas");

		constructor(desktop: UIDesktop, id: string, title: string, cfg?: WinParam) {
			super(desktop, id, title, cfg);
			this.canvas.id = `canvas-${id}`;
			this.canvas.width = 1600;
			this.canvas.height = 600;
			this.canvas.style.width = `1600px`;
			this.canvas.style.height = `600px`;
		}

		renderIn(): void {
			let renderWindowBody = (): HTMLDivElement => {
				let windowBody = this.ui.windowBody;
				windowBody.style.overflow = this.cfg.body.overflow;
				windowBody.style.width = `${this.cfg.body.initSize.width}px`;
				windowBody.style.height = `${this.cfg.body.initSize.height}px`;
				windowBody.style.overflowX = 'auto';
				windowBody.style.overflowY = 'auto';
				windowBody.appendChild(this.canvas);
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

	export let testTrpgUI = () => {
		//
		let desktop01 = document.getElementById(`test-desktop-01`);
		if (desktop01) {
			let desktop: UIDesktop = new UIDesktop(desktop01, { dockBar: { range: 300, maxScale: 1.8 } });
			let canvasWin = new TestCanvasWindow(desktop, "test-canvas-01", "Map-001", {
				icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_FACE),
				body: { initSize: { width: 640, height: 480 }, overflow: "scroll" }
			});
			canvasWin.renderIn();
			//
			let cvsCtx = canvasWin.canvas.getContext("2d");
			if (cvsCtx) {
				let canvas = canvasWin.canvas;
				canvas.addEventListener("mousedown", e => {
					let rect = canvas.getBoundingClientRect();
					CanvasUtils.drawPoint(cvsCtx, { x: e.clientX - rect.left, y: e.clientY - rect.top, radius: 3, fillStyle: "lime" });
				})
			}
		}
	}


}
