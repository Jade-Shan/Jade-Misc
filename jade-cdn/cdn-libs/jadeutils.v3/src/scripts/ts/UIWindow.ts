import { SimpleMap } from "./dataStructure.js";
import { IPoint2D } from "./geo2d.js";


export class UIDesktopStatus {
	allWindows: SimpleMap<string,UIObj> = new SimpleMap();
	newWindowPopPosition: IPoint2D = {x: 20, y: 20};
	constructor(){}
}


export interface UIObj {
	readonly id: string;

	renderIn(desktop: UIDesktopStatus, parentElem: HTMLElement): void;
}

// 不可以调整大小的UI组件
export interface UNResizeableUI extends UIObj {

}

// 可以调整大小的UI组件
export interface ResizeableUI extends UIObj {

}

export class UIWindow implements ResizeableUI {
	readonly id: string;

	constructor(id: string) {
		this.id = `${id}-${(new Date()).getTime()}`;
	}

	renderIn(desktop: UIDesktopStatus, parentElem: HTMLElement): void {
		let div = JadeWindowUI.renderWindowTplt(desktop, parentElem, this.id);
		parentElem.appendChild(div);
	}

}

export namespace JadeWindowUI {

	export function renderWindowTplt(desktop: UIDesktopStatus, parentElem: HTMLElement, id: string): HTMLDivElement {
		let winTplt = `
		<div class="title-bar">
			<div class="title-bar-text">A Window With A Status Bar</div>
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
		div.id = id;
		div.classList = "window";
		div.style = "width: 320px"
		div.innerHTML = winTplt;

		// 
		div.style.position = 'absolute';
		div.style.left = `${desktop.newWindowPopPosition.x}px`;
		div.style.top  = `${desktop.newWindowPopPosition.y}px`;
		desktop.newWindowPopPosition = {
			x: desktop.newWindowPopPosition.x + 20,
			y: desktop.newWindowPopPosition.y + 20
		}

		return div;
	};

}


