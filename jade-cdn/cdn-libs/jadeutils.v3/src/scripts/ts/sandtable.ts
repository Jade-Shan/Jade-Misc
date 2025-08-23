import { CanvasShape2D, ICanvas2D } from "./canvas";
import { GeoShape2D, IPoint2D, Point2D } from "./geo2d";
import { WebUtil } from "./web";


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

	private shape: CanvasShape2D;

	constructor(id: string, pos: IPoint2D, color: string, visiable: boolean, blockView: boolean) {
		this.id = id;
		this.pos = pos;
		this.color = color;
		this.visiable = visiable;
		this.blockView = blockView;
	}


	/**
	 * 图形的中心
	 */
	getCenter(): Point2D { return this.shape.getCenter(); }

	/**
	 * 对于一个外部的点`(x,y)`，返回这个点到图形近的顶占和距离
	 * 
	 * @param x 外部点的坐标x
	 * @param y 外部点的坐标y
	 * @returns 最近的点`vertex`和距离`distancd`
	 */
	getMostCloseVertex(x: number, y: number): { vertex: Point2D, distance: number } {
		return this.shape.getMostCloseVertex(x, y);
	}


	/**
	 * 
	 * 对于一个外部的点`(x,y)`，返回这个点到图形的多个顶点
	 * 
	 * @param x 外部点的坐标x
	 * @param y 外部点的坐标y
	 * @returns 多个顶点
	 */
	getVertexesFrom(x: number, y: number): Array<Point2D> {
		return this.shape.getVertexesFrom(x, y);
	}

}

export interface ISandTable {
	map: {imageUrl: string, width: number, height: number};
}
export class SandTable implements ISandTable {
	map = {imageUrl: "", width:0, height: 0};
	bufferCanvas: HTMLCanvasElement;
	finalCanvas : HTMLCanvasElement;
	bufferCvsCtx: CanvasRenderingContext2D;
	finalCvsCtx : CanvasRenderingContext2D;


	constructor(mapImgUrl: string, bufferCanvas: HTMLCanvasElement, finalCanvas: HTMLCanvasElement) // 
	{
		this.map.imageUrl = mapImgUrl;
		this.bufferCanvas = bufferCanvas;
		this.finalCanvas  = finalCanvas;
		this.bufferCvsCtx = bufferCanvas.getContext("2d")!;
		this.finalCvsCtx  = finalCanvas.getContext("2d")!;
	}

	loadSandTableImage() {
		let image = new Image();
		let imageUrl = "https://s21.ax1x.com/2024/06/29/pk6vkEF.jpg";
		// let imageUrl = "https://raw.githubusercontent.com/Jade-Shan/Jade-Dungeon/refs/heads/dev/jade-dungeon-page/src/images/sandtable/map.jpg";
		let proxyUrl = "http://www.jade-dungeon.cn:8088/api/sandtable/parseImage?src=";
		WebUtil.loadImageByProxy(image, imageUrl, proxyUrl);
		this.map.width  = image.width ;
		this.map.height = image.height;
		this.bufferCanvas.setAttribute('width' , `${this.map.width }px`);
		this.bufferCanvas.setAttribute('height', `${this.map.height}px`);
		this.bufferCvsCtx.clearRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
		this.bufferCvsCtx.drawImage(image, 0, 0);
	}


}

export namespace SandTableUtils {



}