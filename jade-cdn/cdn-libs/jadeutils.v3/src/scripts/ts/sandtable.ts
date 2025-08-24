import { TimeUtil } from "./basic.js";
import { CanvasShape2D, ICanvas2D } from "./canvas.js";
import { GeoShape2D, IPoint2D, Point2D } from "./geo2d.js";
import { ImageProxyConfig, WebUtil } from "./web.js";


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
	frame: { buff: ICanvasFrame, show: ICanvasFrame },
}
export interface ISandTable {
}
export class SandTable implements ISandTable {
	scene: IScene;

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
		await SandTableUtils.loadSceneMap(this.scene, oriMap);
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

	/**
	 * 加载地图
	 * 
	 * @param scene 场景
	 * @param oriMap 图片
	 */
	export let loadSceneMap = async (scene: IScene, oriMap: HTMLImageElement): Promise<void> => {
		let darkMapImage = await drawDarkScene(scene.frame.buff, oriMap, scene.map.shadowStyle); 
		let brightMapImage = await drawBrightScene(scene.frame.buff, oriMap, async (frame) => { //
			await TimeUtil.sleep(1000); 
		});
		// 显示到展示的画布上
		scene.frame.show.cvs.width  = scene.map.width ;
		scene.frame.show.cvs.height = scene.map.height;
		scene.frame.show.cvs.style.width  = `${scene.map.width }px`;
		scene.frame.show.cvs.style.height = `${scene.map.height}px`;
		scene.frame.show.ctx.clearRect(0, 0, scene.map.width, scene.map.height);
		// scene.frame.show.ctx.drawImage(brightMapImage, 0, 0);
		scene.frame.show.ctx.drawImage(darkMapImage, 0, 0);
	}

	// export let loadSceneMapbackup = async (scene: IScene, oriMap: HTMLImageElement): Promise<void> => {
	// 	scene.map.width  = oriMap.width ;
	// 	scene.map.height = oriMap.height;
	// 	scene.elem.bufferCvs.width  = scene.map.width ;
	// 	scene.elem.bufferCvs.height = scene.map.height;
	// 	scene.elem.bufferCvs.style.width  = `${scene.map.width }px`;
	// 	scene.elem.bufferCvs.style.height = `${scene.map.height}px`;
	// 	scene.elem.bufferCtx.clearRect(0, 0, scene.map.width, scene.map.height);
	// 	scene.elem.bufferCtx.drawImage(oriMap, 0, 0);
	// 	// 加上一层战争迷雾
	// 	scene.elem.bufferCtx.fillStyle = scene.map.shadowColor;
	// 	scene.elem.bufferCtx.fillRect(0, 0, scene.map.width, scene.map.height);
	// 	// 读取被遮盖的图片，转印到最终显示的画布上
	// 	let darkMapData = scene.elem.bufferCvs.toDataURL('image/png', 1);
	// 	let darkMap = new Image();
	// 	darkMap.crossOrigin = 'Anonymous';
	// 	await WebUtil.loadImageByProxy(darkMap, darkMapData);
	// 	// 显示到展示的画布上
	// 	scene.elem.finalCvs.width  = scene.map.width ;
	// 	scene.elem.finalCvs.height = scene.map.height;
	// 	scene.elem.finalCvs.style.width  = `${scene.map.width }px`;
	// 	scene.elem.finalCvs.style.height = `${scene.map.height}px`;
	// 	scene.elem.finalCtx.clearRect(0, 0, scene.map.width, scene.map.height);
	// 	scene.elem.finalCtx.drawImage(darkMap, 0, 0);
	// }


	export let drawViewCircle = async (): Promise<void> => {

	}

}