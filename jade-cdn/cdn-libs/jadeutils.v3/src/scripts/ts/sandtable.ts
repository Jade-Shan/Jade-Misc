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

export interface ISandTable {
	map: {imageUrl: string, width: number, height: number, shadowColor: string},
}
export class SandTable implements ISandTable {
	map = {imageUrl: "", width:0, height: 0, shadowColor: 'rgba(0, 0, 0, 0.7)'};
	bufferCanvas: HTMLCanvasElement;
	finalCanvas : HTMLCanvasElement;
	bufferCvsCtx: CanvasRenderingContext2D;
	finalCvsCtx : CanvasRenderingContext2D;


	constructor(mapImgUrl: string, bufferCanvas: HTMLCanvasElement, finalCanvas: HTMLCanvasElement,
		bufferCvsCtx: CanvasRenderingContext2D, finalCvsCtx : CanvasRenderingContext2D) // 
	{
		this.map.imageUrl = mapImgUrl;
		this.bufferCanvas = bufferCanvas;
		this.finalCanvas  =  finalCanvas;
		this.bufferCvsCtx = bufferCvsCtx;
		this.finalCvsCtx  =  finalCvsCtx;
	}

	async loadSandTableImage(proxyUrl?: string) {
		// 加载地图
		let brightMap = new Image();
		await WebUtil.loadImageByProxy(brightMap, this.map.imageUrl, proxyUrl).then();
		this.map.width  = brightMap.width ;
		this.map.height = brightMap.height;
		this.bufferCanvas.width  = this.map.width ;
		this.bufferCanvas.height = this.map.height;
		this.bufferCanvas.style.width  = `${this.map.width }px`;
		this.bufferCanvas.style.height = `${this.map.height}px`;
		this.bufferCvsCtx.clearRect(0, 0, this.map.width, this.map.height);
		this.bufferCvsCtx.drawImage(brightMap, 0, 0);
		// 加上一层战争迷雾
		this.bufferCvsCtx.fillStyle = this.map.shadowColor;
		this.bufferCvsCtx.fillRect(0, 0, this.map.width, this.map.height);
		// 读取被遮盖的图片
		let darkMap = new Image();
		darkMap.crossOrigin = 'Anonymous';
		await WebUtil.loadImageByProxy(darkMap, this.bufferCanvas.toDataURL('image/png', 1), proxyUrl);
		// 显示到展示的画布上
		this.finalCanvas.width  = this.map.width ;
		this.finalCanvas.height = this.map.height;
		this.finalCanvas.style.width  = `${this.map.width }px`;
		this.finalCanvas.style.height = `${this.map.height}px`;
		this.finalCvsCtx.clearRect(0, 0, this.map.width, this.map.height);
		this.finalCvsCtx.drawImage(darkMap, 0, 0);
	}


}

export namespace SandTableUtils {



}