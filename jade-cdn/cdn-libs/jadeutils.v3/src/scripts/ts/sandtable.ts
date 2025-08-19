import { CanvasShape2D, ICanvas2D } from "./canvas";
import { GeoShape2D, IPoint2D, Point2D } from "./geo2d";


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