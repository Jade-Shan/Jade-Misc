
export interface UIObj {
	readonly id: string;

	renderIn(elem: HTMLElement): void;
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
		this.id = id;
	}

	renderIn(elem: HTMLElement): void {
		let div = JadeWindowUI.renderWindowTplt(this.id);
		elem.appendChild(div);
	}

}

export namespace JadeWindowUI {

	export function renderWindowTplt(id: string): HTMLDivElement {
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
		return div;
	};

}


