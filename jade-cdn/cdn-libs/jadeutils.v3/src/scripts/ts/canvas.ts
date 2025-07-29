import { Geo2D, Geo2DUtils, Point2D } from './geo2d.js';

export interface CanvasShape2D<T extends Geo2D> {
	cvsCtx: CanvasRenderingContext2D;
	id: string;
	shape: T;

} 

export class CanvasPoint2D implements CanvasShape2D<Point2D> {
	cvsCtx: CanvasRenderingContext2D;
	id: string;
	shape: Point2D;

	constructor(cvsCtx: CanvasRenderingContext2D, id: string, x: number, y: number) {
		this.cvsCtx = cvsCtx;
		this.id = id;
		this.shape = new Point2D(x, y);
		//let cck: HTMLCanvasElement = document.getElement();
		//let cvsCtx: CanvasRenderingContext2D = cck.getContext("2d");
	}
}


export namespace CanvasUtils {

	function test() : void{
		console.log('hello');
	}

}
