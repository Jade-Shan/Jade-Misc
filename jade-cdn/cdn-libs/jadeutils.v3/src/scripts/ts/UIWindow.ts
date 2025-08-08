import { SimpleMap } from "./dataStructure.js";
import { IPoint2D } from "./geo2d.js";


export class UIDesktopStatus {
	private allWindows: SimpleMap<string,UIObj> = new SimpleMap();
	private windowZIndex: Array<UIObj> = [];
	newWindowPopPosition: IPoint2D = {x: 20, y: 20};

	constructor(){}

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

	renderIn(parentElem: HTMLElement): void;

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

	abstract renderIn(parentElem: HTMLElement): void;

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

	renderIn(parentElem: HTMLElement): void {
		let div = JadeWindowUI.renderWindowTplt(parentElem, this);
		this.desktop.addWindow(this);
		parentElem.appendChild(div);
	}

}

export namespace JadeWindowUI {

	export function genWinTitleBarId(id: string): string { return `titBar-${id}`; }
	export function genWinTitleTextId(id: string): string { return `titText-${id}`; }

	export function renderWindowTplt(parentElem: HTMLElement, win: UIObj): HTMLDivElement {
		let winTplt = `
		<div class="title-bar" id="${genWinTitleBarId(win.id)}">
			<div class="title-bar-text .cannot-select" id="${genWinTitleTextId(win.id)}">${win.title}</div>
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
		div.style.position = 'absolute';
		div.style.left = `${win.desktop.newWindowPopPosition.x}px`;
		div.style.top  = `${win.desktop.newWindowPopPosition.y}px`;
		win.desktop.newWindowPopPosition = {
			x: win.desktop.newWindowPopPosition.x + 20,
			y: win.desktop.newWindowPopPosition.y + 20
		}
		return div;
	};

}


