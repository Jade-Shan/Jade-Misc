import { SimpleMap } from "./dataStructure.js";
import { IPoint2D } from "./geo2d.js";

const WIN_Z_IDX_MIN = 2000;

export class UIDesktopStatus {
	readonly parentElement: HTMLElement;
	private allWindows: SimpleMap<string,UIObj> = new SimpleMap();
	private windowZIndex: Array<UIObj> = [];
	private newWindowPosition = { // 管理新窗口弹出位置
		lastPos: {x: 0, y: 0}, // 上一次窗口弹出的坐标
		lastTopStart:{x: 0, y: 0} // 叠完一行以后，下移一行开始重新叠
	};

	constructor(parentElement: HTMLElement) {
		this.parentElement = parentElement;
	}
	
	getNewWindowPosition(width: number, height: number): IPoint2D {
		let margin = 90; // 新弹出的位置的间隔
		let maxLevel = 8; // 同一次弹出时叠加几次
		let maxWidth = this.parentElement.clientWidth - margin;
		let maxHeigh = this.parentElement.clientHeight - margin;

		let newX = this.newWindowPosition.lastPos.x + margin;
		let newY = this.newWindowPosition.lastPos.y + margin;

		let coverlevel = (this.newWindowPosition.lastPos.y -
			this.newWindowPosition.lastTopStart.y) / margin;
		if (coverlevel > maxLevel) { // 叠了几层，换一个位置重新叠
			newX = this.newWindowPosition.lastTopStart.x + margin + margin;
			newY = this.newWindowPosition.lastTopStart.y + margin;
			this.newWindowPosition.lastTopStart.x = newX;
			this.newWindowPosition.lastTopStart.y = newY;
		}

		if (((newX + width) > maxWidth)) {// 一行满了，换一行 
			newX = margin; 
			newY = this.newWindowPosition.lastTopStart.y + margin;
			this.newWindowPosition.lastTopStart.x = newX;
			this.newWindowPosition.lastTopStart.y = newY;
		}
		if ((newY + height) > maxHeigh) { // 纵向满了，回头
			newX = margin; 
			newY = margin;
			this.newWindowPosition.lastTopStart.x = newX;
			this.newWindowPosition.lastTopStart.y = newY;
		}

		let lastPos = { x: newX, y: newY };
		this.newWindowPosition.lastPos = lastPos;
		return lastPos;
	}

	addWindow(window: UIObj) {
		if (this.windowZIndex.length > 0) {
			let last = this.windowZIndex[this.windowZIndex.length -1];
			last.activeWindow(false);
		}
		this.allWindows.put(window.id, window);
		this.windowZIndex.push(window);
	}

	closeWindow(win: UIObj) {
		this.allWindows.remove(win.id);
		let newIndex: Array<UIObj> = [];
		for (let i = 0; i < this.windowZIndex.length; i++) {
			let w = this.windowZIndex[i];
			if (win.id === w.id) {
				// do nothing
			} else {
				w.activeWindow(false);
				w.setZIndex(WIN_Z_IDX_MIN + newIndex.length);
				newIndex.push(w);
			}
		}
		this.windowZIndex = newIndex;
		this.parentElement.removeChild(win.windowDiv);
		if (newIndex.length > 0) {
			let currWin = newIndex[newIndex.length - 1];
			currWin.activeWindow(true);
			currWin.setZIndex(WIN_Z_IDX_MIN + newIndex.length);
		}
	}

	setCurrentActive(win: UIObj) {
		let newIndex: Array<UIObj> = [];
		for (let i = 0; i < this.windowZIndex.length; i++) {
			let w = this.windowZIndex[i];
			if (w.id === win.id) {
				// do nothing
			} else {
				w.activeWindow(false);
				w.setZIndex(WIN_Z_IDX_MIN + newIndex.length);
				newIndex.push(w);
			}
		}
		newIndex.push(win);
		this.windowZIndex = newIndex;
		//
		win.activeWindow(true);
		win.setZIndex(WIN_Z_IDX_MIN + newIndex.length);
	}

}


export interface UIObj {
	readonly desktop: UIDesktopStatus;
	readonly windowDiv: HTMLDivElement;
	readonly id: string;
	title: string;

	renderIn(): void;

	activeWindow(isActive: boolean): void;

	setZIndex(zIdx: number): void;

	minSizeWindow(isMin: boolean): void;

	closeWindow(): void;
}

export abstract class UIWindowAdptt implements UIObj {
	readonly desktop: UIDesktopStatus;
	readonly windowDiv: HTMLDivElement;
	readonly id: string;
	title: string;

	constructor(desktop: UIDesktopStatus, id: string, title: string) {
		this.title = title;
		this.desktop = desktop;
		this.id = JadeWindowUI.genWinId(id);
		this.windowDiv = document.createElement('div');
		this.windowDiv.id = this.id;
		this.windowDiv.classList.add("window");
	}

	abstract renderIn(): void;

	deactiveWindow() {
		let tid = JadeWindowUI.genWinTitleBarId(this.id);
		let div = document.getElementById(tid);
		if (div) {
			if (!div.classList.contains('inactive')) {
				div.classList.add('inactive');
			}
		}
	}

	activeWindow(isActive: boolean): void {
		let tid = JadeWindowUI.genWinTitleBarId(this.id);
		let div = document.getElementById(tid);
		if (div != null) {
			if (isActive && div.classList.contains('inactive')) {
				div.classList.remove('inactive');
			} else if (!isActive && !div.classList.contains('inactive')) {
				div.classList.add('inactive');
			} 
		}
	}

	setZIndex(zIndex: number): void {
		this.windowDiv.style.zIndex = `${zIndex}`;
	}

	minSizeWindow(isMin: boolean): void {
		throw new Error("Method not implemented.");
	}

	closeWindow(): void {
		throw new Error("Method not implemented.");
	}

} 

// 不可以调整大小的UI组件
export interface UNResizeableUI extends UIObj {

}

// 可以调整大小的UI组件
export interface ResizeableUI extends UIObj {

}

export class UIWindow extends UIWindowAdptt implements ResizeableUI {

	constructor(desktop: UIDesktopStatus, id: string, title: string) {
		super(desktop, id, title);
	}

	renderIn(): void {
		let div = JadeWindowUI.renderWindowTplt(this);
		this.desktop.addWindow(this);
		this.desktop.parentElement.appendChild(div);
	}

}

export namespace JadeWindowUI {

	export function genWinId(id: string): string { return `${id}-${(new Date()).getTime()}`; }

	export function genWinTitleBarId(id: string): string { return `titBar-${id}`; }

	export function genWinTitleTextId(id: string): string { return `titText-${id}`; }


	function renderTitleBar(win: UIObj): HTMLDivElement {
		let renderTitleBarText = (win: UIObj): HTMLDivElement => {
			let titleBarText = document.createElement("div");
			titleBarText.id = genWinTitleTextId(win.id);
			titleBarText.classList.add("title-bar-text", "cannot-select");
			titleBarText.innerHTML = win.title;
			return titleBarText;
		}
		let renderTitleBarControls = (win: UIObj): HTMLDivElement => {
			let btnMin = document.createElement("button");
			btnMin.setAttribute("aria-label", "Minimize");
			let btnMax = document.createElement("button");
			btnMax.setAttribute("aria-label", "Maximize");
			let btnClose = document.createElement("button");
			btnClose.setAttribute("aria-label", "Close");
			btnClose.onmouseup = (ev) => { win.desktop.closeWindow(win); }
			//
			let titleBarCtls = document.createElement("div");
			titleBarCtls.classList.add("title-bar-controls");
			titleBarCtls.appendChild(btnMin);
			titleBarCtls.appendChild(btnMax);
			titleBarCtls.appendChild(btnClose);
			return titleBarCtls;
		}
		let titleBar = document.createElement("div");
		titleBar.id = genWinTitleBarId(win.id);
		titleBar.classList.add("title-bar");
		titleBar.appendChild(renderTitleBarText(win));
		titleBar.appendChild(renderTitleBarControls(win));
		return titleBar;
	}

	export function renderWindowBody(win: UIObj): HTMLDivElement {
		let windowBody = document.createElement("div");
		windowBody.classList.add("window-body");
		windowBody.innerHTML = `
			<p> There are just so many possibilities:</p>
			<ul>
				<li>A Task Manager</li>
				<li>A Notepad</li>
				<li>Or even a File Explorer!</li>
			</ul>

			<div class="sunken-panel" style="height: 120px; width: 240px;">
				<table class="interactive">
					<thead>
						<tr><th>Name</th><th>Version</th><th>Company</th></tr>
					</thead>
					<tbody>
						<tr><td>MySQL ODBC 3.51 Driver</td><td>3.51.11.00</td><td>MySQL AB</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
					</tbody>
				</table>
			</div>
		`;
		return windowBody;
	}

	export function renderStatusBar(win: UIObj): HTMLDivElement {
		let statusBar = document.createElement("div");
		statusBar.classList.add("status-bar");
		statusBar.innerHTML= `
			<p class="status-bar-field">Press F1 for help</p>
			<p class="status-bar-field">Slide 1</p>
			<p class="status-bar-field">CPU Usage: 14%</p>
		`;
		return statusBar;
	}

	export function renderWindowTplt(win: UIObj): HTMLDivElement {
		let div: HTMLDivElement = win.windowDiv;
		div.style = "width: 320px"
		let titleBar = renderTitleBar(win);
		let windowBody = renderWindowBody(win);
		let statusBar = renderStatusBar(win);
		div.appendChild(titleBar );
		div.appendChild(windowBody);
		div.appendChild(statusBar);
		// 
		let pos = win.desktop.getNewWindowPosition(div.getBoundingClientRect().width, div.getBoundingClientRect().height);
		div.style.position = 'absolute';
		div.style.left = `${win.desktop.parentElement.getBoundingClientRect().left + pos.x}px`;
		div.style.top  = `${win.desktop.parentElement.getBoundingClientRect().top  + pos.y}px`;
		div.onmousedown = (e) => { win.desktop.setCurrentActive(win); }
		return div;
	};

}


