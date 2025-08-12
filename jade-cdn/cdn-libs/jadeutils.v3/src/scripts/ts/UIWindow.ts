import { SimpleMap } from "./dataStructure.js";
import { IPoint2D } from "./geo2d.js";
import { JadeUIResource, IconGroup, DefaultIconGroup } from "./resource.js";
import { WebUtil } from "./web.js";

const WIN_Z_IDX_MIN = 2000;

/**
 * 桌面环境的参数配置
 */
type IDesktopConfig = {
	desktop?: { backgroundImage?: string, width: string, height: string },
	dockBar?: DockBarParam
}

/**
 * 桌面环境
 */
export class UIDesktop {
	readonly desktopDiv: HTMLElement; // 窗口在上一级HTML元素
	private allWindows: SimpleMap<string, UIObj> = new SimpleMap(); // 全部窗口的索引
	private windowZIndex: Array<UIObj> = []; // 窗口的z-index序列
	private dockBar?: DockBar; // 程序栏

	private newWindowPosition = { // 管理新窗口弹出位置
		lastPos: { x: 0, y: 0 }, // 上一次窗口弹出的坐标
		lastTopStart: { x: 0, y: 0 } // 叠完一行以后，下移一行开始重新叠
	};

	/**
	 * 创建一个桌面环境
	 * 
	 * @param parentElement 上一级元素
	 * @param cfg 配置参数
	 */
	constructor(desktopDiv: HTMLElement, cfg?: IDesktopConfig) {
		this.desktopDiv = desktopDiv;
		desktopDiv.style.height = cfg?.desktop?.height ? cfg.desktop.height : "100%";
		desktopDiv.style.width  = cfg?.desktop?.width  ? cfg.desktop.width  : "100%";
		desktopDiv.style.backgroundImage = cfg?.desktop?.backgroundImage ? //
			cfg?.desktop?.backgroundImage :  //
			WebUtil.transBase64ImgURL(JadeUIResource.defaultDesktopBackground);
		this.dockBar = cfg?.dockBar ? new DockBar(this, cfg.dockBar) : undefined;
	}

	/**
	 * 桌面上有没有docker
	 * @returns 是否有
	 */
	hasDockBar(): boolean { return this.dockBar ? true : false; }

	/**
	 * 取得桌面上窗口的最大层数
	 * @returns 窗口的最大层数
	 */
	getMaxWindowIndex(): number { return this.windowZIndex.length + WIN_Z_IDX_MIN; }

	/**
	 * 通过新窗口的大小计算新窗口弹出的坐标
	 * 
	 * @param width 新窗口的宽度
	 * @param height 新窗口的高度
	 * @returns 新窗口弹出的坐标
	 */
	getNewWindowPosition(width: number, height: number): IPoint2D {
		let margin = 90; // 新弹出的位置的间隔
		let maxLevel = 8; // 同一次弹出时叠加几次
		let maxWidth = this.desktopDiv.clientWidth - margin;
		let maxHeigh = this.desktopDiv.clientHeight - margin;

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

	/**
	 * 在桌面上添加一个新窗口
	 * 
	 * @param window 新的窗口
	 */
	addWindow(window: UIObj) {
		if (this.windowZIndex.length > 0) {
			let last = this.windowZIndex[this.windowZIndex.length - 1];
			last.activeWindow(false);
		}
		this.allWindows.put(window.id, window);
		this.windowZIndex.push(window);
		if (this.dockBar) {
			this.dockBar.addIcon(window);
		}
	}

	/**
	 * 关闭一个窗口
	 * 
	 * @param win 要关闭的窗口
	 */
	optWinClose(win: UIObj) {
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
		this.desktopDiv.removeChild(win.ui.win);
		if (newIndex.length > 0) {
			let currWin = newIndex[newIndex.length - 1];
			currWin.activeWindow(true);
			currWin.setZIndex(WIN_Z_IDX_MIN + newIndex.length);
		}
		if (this.dockBar) {
			this.dockBar.removeIcon(win);
		}
	}

	/**
	 * 指定一个窗口为当前活动窗口
	 * 
	 * @param win 指定的窗口
	 */
	optWinActive(win: UIObj) {
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
		console.log(`winddow z-idx is ${WIN_Z_IDX_MIN + newIndex.length}`);
	}

}

/**
 * 绑定窗口操作
 */
export type IBindWinOpt = {

	/**
	 * 绑定窗口的关闭操作
	 * @param win 窗口
	 */
	bindWinOptActive: (win: UIObj) => any;

	/**
	 * 绑定窗口的关闭操作
	 * 
	 * @param win 窗口
	 * @param btn 绑定的按键 
	 */
	bindWinOptClose: (win: UIObj, btn: HTMLElement) => any;

	/**
	 * 绑定窗口的最大化操作
	 * 
	 * @param win 窗口
	 * @param btn 绑定的按键 
	 */
	bindWinOptMax: (win: UIObj, btn: HTMLElement) => any;

	/**
	 * 绑定窗口的最小化操作
	 * 
	 * @param win 窗口
	 * @param btn 绑定的按键 
	 */
	bindWinOptMin: (win: UIObj, btn: HTMLElement) => any;

}

/**
 * 默认的窗口操作绑定
 */
export let defaultWinOption = {

	/**
	 * 绑定窗口的关闭操作
	 * @param win 窗口
	 */
	bindWinOptActive: (win: UIObj): any => {
		win.ui.win.onmousedown = e => {
			console.log(`click win ${win.id}`);
			win.desktop.optWinActive(win);
		}
	},

	/**
	 * 绑定窗口的关闭操作
	 * 
	 * @param win 窗口
	 * @param btn 绑定的按键 
	 */
	bindWinOptClose: (win: UIObj, btn: HTMLElement): any => {
		btn.onmouseup = e => {
			win.desktop.optWinClose(win);
		}
	},

	/**
	 * 绑定窗口的最大化操作
	 * 
	 * @param win 窗口
	 * @param btn 绑定的按键 
	 */
	bindWinOptMax: (win: UIObj, btn: HTMLElement): any => {
		btn.onmousedown = e => {
			let winDiv = win.ui.win;
			if (win.status.isMax) {
				win.status.isMax = false;
				winDiv.style.left = `${win.status.lastPos.x}px`;
				winDiv.style.top = `${win.status.lastPos.y}px`;
				winDiv.style.width = `${win.status.lastSize.width}px`;
				winDiv.style.height = `${win.status.lastSize.height}px`;
			} else {
				win.status.isMax = true;
				let pElem = win.desktop.desktopDiv;
				winDiv.style.left = `0px`;
				winDiv.style.top = `0px`;
				winDiv.style.width = `${pElem.clientWidth - 6}px`;
				winDiv.style.height = `${win.desktop.hasDockBar() ?
					// 如果桌面上有dock，留几个像素让dock可以响应鼠标
					pElem.clientHeight - 10 : pElem.clientHeight - 6}px`;
			}
			let height = win.ui.win.offsetHeight - win.ui.titleBar.clientHeight;
			if (win.ui.statusBar) {
				height = height - win.ui.statusBar.clientHeight;
			}
			win.ui.windowBody.style.height = `${height - 40}px`;
		}
	},

	/**
	 * 绑定窗口的最小化操作
	 * 
	 * @param win 窗口
	 * @param btn 绑定的按键 
	 */
	bindWinOptMin: (win: UIObj, btn: HTMLElement): any => {
		btn.onmousedown = e => {
			let winDiv = win.ui.win;
			if (win.status.isMin) {
				win.status.isMin = false;
				win.ui.win.style.visibility = "visible";
				win.desktop.optWinActive(win); // 恢复的窗口为顶层
			} else {
				win.status.isMin = true;
				win.ui.win.style.visibility = "hidden";
			}
		}
	},

};

/**
 * 窗口配置
 */
type WinCfg = {
	icons: IconGroup, // 窗口的图标
	bindWinOpt: IBindWinOpt, // 绑定窗口的操作
};

type WinParam = {
	icons?: IconGroup, // 窗口的图标
	bindWinOpt?: IBindWinOpt, // 绑定窗口的操作
};
/**
 * 窗口状态
 */
type WinStatus = {
	isMax: boolean; // 是否最大化
	isMin: boolean; // 是否最小化
	isDragging: boolean; // 是否在拖动状态
	readonly lastPos : {x: number, y: number}; // 正常状态时最后状态
	readonly lastSize: {width: number, height: number}; // 正常状态时最后的大小
};

/**
 * 窗口要用的HTML元素
 */
type WinUIElement = {
	readonly win: HTMLDivElement;        // 窗口
	readonly titleBar: HTMLDivElement;   // 标题栏
	readonly windowBody: HTMLDivElement; // 窗口主体
	statusBar?: HTMLDivElement;          // 窗口状态栏
}

/**
 * 窗口元素的接口
 */
export interface UIObj {
	readonly desktop: UIDesktop;      // 桌面实例
	readonly ui: WinUIElement;        // 窗口中用到的HTML元素
	readonly status: WinStatus;       // 窗口的状态
	readonly id: string;              // 窗口的ID
	title: string;                    // 窗口的标题
	cfg: WinCfg;

	/**
	 * 在桌面上渲染窗口
	 */
	renderIn(): void;

	/**
	 * 设置窗口为当前窗口
	 * @param isActive 是否是当前窗口
	 */
	activeWindow(isActive: boolean): void;

	/**
	 * 设置窗口的层级
	 * @param zIdx 设置层级
	 */
	setZIndex(zIdx: number): void;

}

/**
 * 窗口的部分实现
 */
export abstract class UIWindowAdptt implements UIObj {
	readonly desktop: UIDesktop;
	readonly ui: WinUIElement;
	readonly status: WinStatus = { 
		isMin: false, isMax: false, isDragging: false,
		lastPos: { x: 10, y: 10 },
		lastSize: { width: 320, height: 250 }
	};
	readonly id: string;
	title: string;
	cfg: WinCfg = {
		icons: 	JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_FACE),
		bindWinOpt: defaultWinOption
	};

	/**
	 * 创建窗口对象 
	 * @param desktop 所在的桌面
	 * @param id  窗口ID
	 * @param title 窗口标题
	 * @param bindWinOpt 绑定窗口的操作 
	 */
	constructor(desktop: UIDesktop, id: string, title: string, cfg?: WinParam) {
		this.title = title;
		this.desktop = desktop;
		this.id = JadeWindowUI.genWinId(id);
		let winDiv = document.createElement('div');
		winDiv.id = this.id;
		winDiv.classList.add("window");
		let titleBar = document.createElement('div');
		let windowBody = document.createElement('div');
		this.ui = { win: winDiv, titleBar: titleBar, windowBody: windowBody };
		if (cfg) {
			if (cfg.bindWinOpt) { this.cfg.bindWinOpt = cfg.bindWinOpt; }
			if (cfg.icons) { this.cfg.icons = cfg.icons; }
		}
	}

	/**
	 * 渲染窗口
	 */
	abstract renderIn(): void;

	/**
	 * 设置窗口为当前窗口
	 * @param isActive 是否是当前窗口
	 */
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

	/**
	 * 设置窗口的层级
	 * @param zIdx 设置层级
	 */
	setZIndex(zIndex: number): void {
		this.ui.win.style.zIndex = `${zIndex}`;
	}

} 

// 不可以调整大小的UI组件
export interface UNResizeableUI extends UIObj {

}

// 可以调整大小的UI组件
export interface ResizeableUI extends UIObj {

}

export class UIWindow extends UIWindowAdptt implements ResizeableUI {

	constructor(desktop: UIDesktop, id: string, title: string, cfg?: WinParam) {
		super(desktop, id, title, cfg);
	}

	renderIn(): void {
		let div = JadeWindowUI.renderWindowTplt(this);
	}

}

type DockBarCfg = {
	dockColor: string, 
	iconColor: string,
	opacity: number,
	range: number, 
	maxScale: number,
};

type DockBarParam = {
	dockColor?: string, 
	iconColor?: string,
	opacity?: number,
	range?: number, 
	maxScale?: number,
};

export class DockBar {

	private barDiv: HTMLDivElement;
	private parentElement: HTMLElement;
	cfg: DockBarCfg = {
		dockColor: "rgb(100, 100, 100)",
		iconColor: "rgb(34, 199, 158)",
		opacity: 70,
		range: 300,
		maxScale: 1.8
	};


	constructor(desktop: UIDesktop, cfg?: DockBarParam) {
		if (cfg) {
			if (cfg.dockColor  ) { this.cfg.dockColor = cfg.dockColor; }
			if (cfg.iconColor  ) { this.cfg.iconColor = cfg.iconColor; }
			if (cfg.opacity    ) { this.cfg.opacity   = cfg.opacity  ; }
			if (cfg.range      ) { this.cfg.range     = cfg.range    ; }
			if (cfg.maxScale   ) { this.cfg.maxScale  = cfg.maxScale ; }
		}
		//let range = cfg?.color ? cfg.color : 300;
		//let maxScale = cfg?.maxScale ? cfg.maxScale : 1.8;
		//if (cfg && cfg.range   ) { range    = cfg.range   ; }
		//if (cfg && cfg.maxScale) { maxScale = cfg.maxScale; }
		//
		this.parentElement = desktop.desktopDiv;
		let barDiv = document.createElement('div');
		this.barDiv = barDiv;
		barDiv.classList.add('dock-bar');
		barDiv.style.backgroundColor = this.cfg.dockColor;
		barDiv.style.opacity = `${this.cfg.opacity}%`;
		this.parentElement.appendChild(this.barDiv);
		barDiv.onmousemove = e => {
			let curve = this.createCurve(this.cfg.range, e.clientX, 1, this.cfg.maxScale);
			this.layout(curve);
		};
		barDiv.onmouseleave = e => {
			this.layout(() => 1);
			barDiv.style.setProperty('width', 'fit-content');
			barDiv.style.zIndex = `${WIN_Z_IDX_MIN - 1}`; // 下到最低层
			console.log(`dock z-idx is ${barDiv.style.zIndex}`)
		};
		this.barDiv.onmouseenter = e => {
			barDiv.style.zIndex = `${desktop.getMaxWindowIndex() + 10}`;// 提到最上层
			let rect = barDiv.getBoundingClientRect();
			let width = rect.right - rect.left + 80;
			barDiv.style.setProperty('width', `${width}px`);
			console.log(`dock z-idx is ${barDiv.style.zIndex}`)
		};
	}

	// 生成一个曲线函数
	private createCurve(totalDis: number, topX: number,  //
		minY: number, maxY: number): (x: number) => number //
	{
		let baseCurve = (x: number): number => {
			return x < 0 || x > 1 ? 0 : Math.sin(x * Math.PI);
		};
		let curve = (x: number): number => {
			let beginX = topX - totalDis / 2
			let endX = topX + totalDis / 2
			return x < beginX || x > endX ? minY : //
				baseCurve((x - beginX) / totalDis) * (maxY - minY) + minY;
		}
		return curve;
	}

	private layout(curve: (x: number) => number) {
		let items = this.barDiv.children;
		for (let i=0; i<items.length;i++) {
			let item: Element|null = items.item(i);
			if (item != null) {
				let rect = item.getBoundingClientRect();
				let x = rect.left + rect.width / 2;
				let scale = curve(x);
				let elm: any = item;
				elm.style.setProperty('--i', scale);
			}
		}
	}

	genAppGrapId(winId: string): string { return `appGrp-${winId}`; };

	genAppIconId(winId: string): string { return `appIco-${winId}`; };

	addIcon(win: UIObj) {
		let items = this.barDiv.children;
		if (items.length > 0) {
			let gap = document.createElement('div');
			gap.id = this.genAppGrapId(win.id);
			gap.classList.add('gap');
			this.barDiv.appendChild(gap);
		}
		//
		let icon = document.createElement('div');
		icon.id = this.genAppIconId(win.id);
		icon.classList.add('menu-item');
		icon.style.backgroundImage = WebUtil.transBase64ImgURL(win.cfg.icons.x32);
		icon.style.backgroundSize = "100%";
		icon.style.opacity = `${this.cfg.opacity}%`;
		this.barDiv.appendChild(icon);
		win.cfg.bindWinOpt.bindWinOptMin(win, icon);
	}

	removeIcon(win: UIObj) {
		let iconId = this.genAppIconId(win.id);
		let items = this.barDiv.children;
		if (items.length > 0) {
			for (let i = 0; i < items.length; i++) {
				if (iconId === items.item(i)?.id) {
					let gap : Element | null = null;
					let icon: Element | null = items.item(i);
					if (items.length == 0) {
						// 最后一个，没有间隔符
					} else if (i == 0 && items.item(i + 1)?.classList.contains("gap")) {
						// 如果是第一个元素，删除右边的间隔
						gap = items.item(i + 1);
					} else if (items.item(i - 1)?.classList.contains("gap")) {
						// 其他的元素默认删除左边的间隔
						gap = items.item(i - 1);
					}
					if (icon) { this.barDiv.removeChild(icon); }
					if (gap ) { this.barDiv.removeChild(gap ); }
				}
			}
		}
	}

}


export namespace JadeWindowUI {

	export function genWinId(id: string): string { return `${id}-${(new Date()).getTime()}`; }

	export function genWinTitleBarId(id: string): string { return `titBar-${id}`; }

	export function genWinTitleIconId(id: string): string { return `titIcon-${id}`; }

	export function genWinTitleTextId(id: string): string { return `titText-${id}`; }


	function renderTitleBar(win: UIObj): HTMLDivElement {
		let titleBar = win.ui.titleBar;
		titleBar.id = genWinTitleBarId(win.id);
		titleBar.classList.add("title-bar");
		return titleBar;
	}
	let renderTitleBarIcon = (win: UIObj): HTMLDivElement => {
		let titleBarIcon = document.createElement("img");
		titleBarIcon.id = genWinTitleIconId(win.id);
		titleBarIcon.src = WebUtil.transBase64ImgSrc(win.cfg.icons.x12);
		return titleBarIcon;
	}
	let renderTitleBarText = (win: UIObj): HTMLDivElement => {
		let titleBarText = document.createElement("div");
		titleBarText.id = genWinTitleTextId(win.id);
		titleBarText.classList.add("title-bar-text", "cannot-select");
		titleBarText.innerHTML = win.title;
		return titleBarText;
	}
	let renderTitleBarControls = (win: UIObj): HTMLDivElement => {
		//
		let btnMin = document.createElement("button");
		btnMin.setAttribute("aria-label", "Minimize");
		win.cfg.bindWinOpt.bindWinOptMin(win, btnMin);
		//
		let btnMax = document.createElement("button");
		btnMax.setAttribute("aria-label", "Maximize");
		win.cfg.bindWinOpt.bindWinOptMax(win, btnMax);
		//
		let btnClose = document.createElement("button");
		btnClose.setAttribute("aria-label", "Close");
		win.cfg.bindWinOpt.bindWinOptClose(win, btnClose);
		//
		let titleBarCtls = document.createElement("div");
		titleBarCtls.classList.add("title-bar-controls");
		titleBarCtls.appendChild(btnMin);
		titleBarCtls.appendChild(btnMax);
		titleBarCtls.appendChild(btnClose);
		return titleBarCtls;
	}

	export function renderWindowBody(win: UIObj): HTMLDivElement {
		let windowBody = win.ui.windowBody;
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

	export function countWindowHeight(divs: Array<HTMLDivElement>): number {
		let totalHeight = 0;
		for (let i = 0; i < divs.length; i++) {
			totalHeight += divs[i].offsetHeight;
		}
		return totalHeight;
	}

	export function countWindowWidth(divs: Array<HTMLDivElement>): number {
		let totalWidth = 0;
		for (let i = 0; i < divs.length; i++) {
			totalWidth += divs[i].offsetWidth;
		}
		return totalWidth;
	}

	export function renderWindowTplt(win: UIObj): HTMLDivElement {
		let parent = win.desktop.desktopDiv;
		let winDiv: HTMLDivElement = win.ui.win;
		let titleBarIcon = renderTitleBarIcon(win);
		let titleBarText = renderTitleBarText(win);
		let titleBarControl = renderTitleBarControls(win);
		let titleBar = renderTitleBar(win);
		titleBar.appendChild(titleBarIcon);
		titleBar.appendChild(titleBarText);
		titleBar.appendChild(titleBarControl);
		let windowBody = renderWindowBody(win);
		let statusBar = renderStatusBar(win);
		winDiv.appendChild(titleBar );
		winDiv.appendChild(windowBody);
		winDiv.appendChild(statusBar);
		// 
		let pos = win.desktop.getNewWindowPosition( //
			winDiv.getBoundingClientRect().width, //
			winDiv.getBoundingClientRect().height);
		win.status.lastPos.x = pos.x;
		win.status.lastPos.y = pos.y;
		winDiv.style.position = 'absolute';
		winDiv.style.left = `${pos.x}px`;
		winDiv.style.top  = `${pos.y}px`;
		parent.style.position = 'relative';
		//
		parent.appendChild(winDiv);
		//
		win.cfg.bindWinOpt.bindWinOptActive(win);
		//
		win.desktop.addWindow(win);
		//计算窗口大小
		let width = winDiv.offsetWidth;
		if (width > parent.offsetWidth) {
			win.status.lastSize.width = width;
			winDiv.style.left = `0px`;
			winDiv.style.width = `${width}px`;
		} else if ((width + win.status.lastPos.x) > parent.offsetWidth) {
			win.status.lastPos.x = parent.offsetHeight - width;
			winDiv.style.left = `${win.status.lastPos.x}px`;
		}
		let height = winDiv.offsetHeight;
		if (height > parent.offsetHeight) {
			win.status.lastSize.height = height;
			winDiv.style.top = `0px`;
			winDiv.style.height = `${height}px`;
		} else if ((height + win.status.lastPos.y) > parent.offsetHeight) {
			win.status.lastPos.y = parent.offsetHeight - height;
			winDiv.style.top = `${win.status.lastPos.y}px`;
		}

		{ /* 拖动窗口 */
			titleBar.style.cursor = "move";
			titleBarControl.style.cursor = "pointer";
			let dargStart = {x: 0, y: 0}, dargDistance = {left:0, top:0};
			titleBar.onmouseleave = (e) => { win.status.isDragging = false; }; 
			titleBar.onmouseup = (e) => { win.status.isDragging = false; };
			titleBar.onmousedown = (e) => {
				win.status.isDragging = true;
				dargStart.x = e.clientX;
				dargStart.y = e.clientY;
				dargDistance.left = parseInt(winDiv.style.left) || 0;
				dargDistance.top  = parseInt(winDiv.style.top ) || 0;
				e.preventDefault();
			};
			document.onmousemove = (e) => {
				if (win.status.isDragging) {
					let dx = e.clientX - dargStart.x;
					let dy = e.clientY - dargStart.y;
					winDiv.style.left =  `${dargDistance.left + dx}px`;
					winDiv.style.top  =  `${dargDistance.top  + dy}px`;
				}
			}
		}

		return winDiv;
	};
}
