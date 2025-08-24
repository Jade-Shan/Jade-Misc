import { CanvasShape2D, ICanvas2D } from "./canvas.js";
import { GeoShape2D, IPoint2D, Point2D } from "./geo2d.js";
import { WebUtil } from "./web.js";


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
export interface IScene {
	map: { imageUrl: string, width: number, height: number, shadowColor: string },
	elem: {
		bufferCvs: HTMLCanvasElement,
		finalCvs : HTMLCanvasElement,
		bufferCtx: CanvasRenderingContext2D,
		finalCtx : CanvasRenderingContext2D
	}
}
export interface ISandTable {
}
export class SandTable implements ISandTable {
	scene: IScene;

	constructor(scene: IScene) // 
	{
		this.scene = scene;
	}

	async loadSandTableImage(proxyUrl?: string) {
		// 加载地图
		let oriMap = new Image();
		await WebUtil.loadImageByProxy(oriMap, this.scene.map.imageUrl, proxyUrl).then();
		await SandTableUtils.loadSceneMap(this.scene, oriMap);
	}


}

export namespace SandTableUtils {

	/**
	 * 加载地图
	 * 
	 * @param scene 场景
	 * @param oriMap 图片
	 */
	export let loadSceneMap = async (scene: IScene, oriMap: HTMLImageElement): Promise<void> => {
		scene.map.width  = oriMap.width ;
		scene.map.height = oriMap.height;
		scene.elem.bufferCvs.width  = scene.map.width ;
		scene.elem.bufferCvs.height = scene.map.height;
		scene.elem.bufferCvs.style.width  = `${scene.map.width }px`;
		scene.elem.bufferCvs.style.height = `${scene.map.height}px`;
		scene.elem.bufferCtx.clearRect(0, 0, scene.map.width, scene.map.height);
		scene.elem.bufferCtx.drawImage(oriMap, 0, 0);
		// 加上一层战争迷雾
		scene.elem.bufferCtx.fillStyle = scene.map.shadowColor;
		scene.elem.bufferCtx.fillRect(0, 0, scene.map.width, scene.map.height);
		// 读取被遮盖的图片，转印到最终显示的画布上
		let darkMapData = scene.elem.bufferCvs.toDataURL('image/png', 1);
		let darkMap = new Image();
		darkMap.crossOrigin = 'Anonymous';
		await WebUtil.loadImageByProxy(darkMap, darkMapData);
		// 显示到展示的画布上
		scene.elem.finalCvs.width  = scene.map.width ;
		scene.elem.finalCvs.height = scene.map.height;
		scene.elem.finalCvs.style.width  = `${scene.map.width }px`;
		scene.elem.finalCvs.style.height = `${scene.map.height}px`;
		scene.elem.finalCtx.clearRect(0, 0, scene.map.width, scene.map.height);
		scene.elem.finalCtx.drawImage(darkMap, 0, 0);
	}

}