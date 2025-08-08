import { SimpleMap } from "./dataStructure.js";
import { IPoint2D } from "./geo2d.js";


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

	setCurrentActive(id: string) {
		let newIndex: Array<UIObj> = [];
		let currWin: null | UIObj = null;
		for (let i = 0; i < this.windowZIndex.length; i++) {
			let win = this.windowZIndex[i];
			if (id === win.id) {
				currWin = win;
			} else {
				win.activeWindow(false);
				win.setZIndex(500 + i);
			}
		}
		if (currWin == null && newIndex.length > 0) {
			currWin = newIndex[newIndex.length - 1];
		}
		if (currWin) {
			currWin.activeWindow(false);
			currWin.setZIndex(500 + newIndex.length - 1);
		}
	}

}


export interface UIObj {
	readonly desktop: UIDesktopStatus;
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
	readonly id: string;
	title: string;

	constructor(desktop: UIDesktopStatus, id: string, title: string) {
		this.desktop = desktop;
		this.id = `${id}-${(new Date()).getTime()}`;
		this.title = title;
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
		let div = document.getElementById(this.id);
		if (div) {
			div.style.zIndex = `${zIndex}`;
		}
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

	export function genWinTitleBarId(id: string): string { return `titBar-${id}`; }
	export function genWinTitleTextId(id: string): string { return `titText-${id}`; }

	export function renderWindowTplt(win: UIObj): HTMLDivElement {
		let winTplt = `
		<div class="title-bar" id="${genWinTitleBarId(win.id)}">
			<div class="title-bar-text cannot-select" id="${genWinTitleTextId(win.id)}">${win.title}</div>
			<div class="title-bar-controls">
				<button aria-label="Minimize"></button>
				<button aria-label="Maximize"></button>
				<button aria-label="Close"></button>
			</div>
		</div>
		<div class="window-body">
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

		</div>
		<div class="status-bar">
			<p class="status-bar-field">Press F1 for help</p>
			<p class="status-bar-field">Slide 1</p>
			<p class="status-bar-field">CPU Usage: 14%</p>
		</div>`;
		let div: HTMLDivElement = document.createElement('div');
		div.id = win.id;
		div.classList = "window";
		div.style = "width: 320px"
		div.innerHTML = winTplt;

		
		// 
		let pos = win.desktop.getNewWindowPosition(div.getBoundingClientRect().width, div.getBoundingClientRect().height);
		div.style.position = 'absolute';
		div.style.left = `${win.desktop.parentElement.getBoundingClientRect().left + pos.x}px`;
		div.style.top  = `${win.desktop.parentElement.getBoundingClientRect().top  + pos.y}px`;
		return div;
	};

}


