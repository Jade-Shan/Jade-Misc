import { TimeUtil } from "./basic.js";
import { CanvasShape2D, ICanvas2D } from "./canvas.js";
import { GeoShape2D, IPoint2D, Point2D } from "./geo2d.js";
import { ImageProxyConfig, WebUtil } from "./web.js";

type VisibilityType = "default" | "glimmer" | "dark";

export interface IObserver {
	pos: IPoint2D,
	viewRange: (type: VisibilityType) => number
}
export interface IToken2D {
	id: string, 
	pos: IPoint2D,
	color: string,
	visiable: boolean,
	blockView: boolean
}

export abstract class Token2D<T extends CanvasShape2D> implements IToken2D {
	id: string; 
	pos: IPoint2D;
	color: string;
	visiable: boolean;
	blockView: boolean;

	constructor(id: string, pos: IPoint2D, color: string, visiable: boolean, blockView: boolean) {
		this.id = id;
		this.pos = pos;
		this.color = color;
		this.visiable = visiable;
		this.blockView = blockView;
	}

}

export interface ICanvasFrame {
		cvs: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D
}
export interface IScene {
	map: { imageUrl: string, width: number, height: number, shadowStyle: string },
	visibility: VisibilityType,
	frame: { buff: ICanvasFrame, show: ICanvasFrame },
}
export interface ISandTable {
}
export class SandTable implements ISandTable {
	scene: IScene;
	observer: IObserver = {
		pos: { x: 250, y: 300 },
		viewRange: (type: string) => { return 150; }
	};

	constructor(scene: IScene) // 
	{
		this.scene = scene;
	}

	async loadSandTableImage(proxyCfg?: ImageProxyConfig) {
		// 加载地图
		let oriMap = new Image();
		await WebUtil.loadImageByProxy(oriMap, this.scene.map.imageUrl, proxyCfg);
		this.scene.map.width  = oriMap.width ;
		this.scene.map.height = oriMap.height;
		await SandTableUtils.loadSceneMap(this.scene, oriMap, this.observer);
	}


}

export namespace SandTableUtils {

	export let drawDarkScene = async (frame: ICanvasFrame, // 
		oriMap: HTMLImageElement, shadowStyle: string): Promise<HTMLImageElement> => // 
	{
		let width  = oriMap.width ;
		let height = oriMap.height;
		frame.cvs.style.width  = `${width }px`;
		frame.cvs.style.height = `${height}px`;
		frame.ctx.clearRect(0, 0, width, height);
		frame.ctx.drawImage(oriMap, 0, 0);
		// 加上一层战争迷雾
		frame.ctx.fillStyle = shadowStyle
		frame.ctx.fillRect(0, 0, width, height);
		let darkMapData = frame.cvs.toDataURL('image/png', 1);
		let darkMapImage = new Image();
		darkMapImage.crossOrigin = 'Anonymous';
		await WebUtil.loadImageByProxy(darkMapImage, darkMapData);
		return darkMapImage;
	}



	export let drawBrightScene = async (frame: ICanvasFrame, // 
		oriMap: HTMLImageElement , drawItems: (frame: ICanvasFrame) => Promise<void> //
	): Promise<HTMLImageElement> => // 
	{
		let width  = oriMap.width ;
		let height = oriMap.height;
		frame.cvs.style.width  = `${width }px`;
		frame.cvs.style.height = `${height}px`;
		frame.ctx.clearRect(0, 0, width, height);
		frame.ctx.drawImage(oriMap, 0, 0);

		// TODO: add other things
		await drawItems(frame);

		let brightMapData = frame.cvs.toDataURL('image/png', 1);
		let brightMapImage = new Image();
		brightMapImage.crossOrigin = 'Anonymous';
		await WebUtil.loadImageByProxy(brightMapImage, brightMapData);
		return brightMapImage;
	}

	export let drawScopeOfVisionOnDarkMap = async (frame: ICanvasFrame, // 
		darkMapImage: HTMLImageElement, brightMapImage: HTMLImageElement, //
		observer: IObserver, visiable: VisibilityType //
	): Promise<HTMLImageElement> => {
		frame.ctx.drawImage(darkMapImage, 0, 0);
		frame.ctx.save();
		frame.ctx.beginPath();
		frame.ctx.arc(observer.pos.x, observer.pos.y, observer.viewRange(visiable), 0, Math.PI * 2);
		frame.ctx.clip();
		frame.ctx.drawImage(brightMapImage, 0, 0);
		frame.ctx.restore();	
		let viewMapData = frame.cvs.toDataURL('image/png', 1);
		let viewMapImage = new Image();
		await WebUtil.loadImageByProxy(viewMapImage, viewMapData);
		return viewMapImage;
	}

	/**
	 * 加载地图
	 * 
	 * @param scene 场景
	 * @param oriMap 图片
	 */
	export let loadSceneMap = async (scene: IScene, oriMap: HTMLImageElement, observer: IObserver): Promise<void> => {
		let darkMapImage = await drawDarkScene(scene.frame.buff, oriMap, scene.map.shadowStyle); 
		let brightMapImage = await drawBrightScene(scene.frame.buff, oriMap, async (frame) => { //
			await TimeUtil.sleep(1000); 
		});
		let viewMapImage = await drawScopeOfVisionOnDarkMap(scene.frame.buff, darkMapImage, brightMapImage, observer, scene.visibility);
		// 显示到展示的画布上
		scene.frame.show.cvs.width  = scene.map.width ;
		scene.frame.show.cvs.height = scene.map.height;
		scene.frame.show.cvs.style.width  = `${scene.map.width }px`;
		scene.frame.show.cvs.style.height = `${scene.map.height}px`;
		scene.frame.show.ctx.clearRect(0, 0, scene.map.width, scene.map.height);
		// scene.frame.show.ctx.drawImage(brightMapImage, 0, 0);
		scene.frame.show.ctx.drawImage(viewMapImage, 0, 0);
	}




}