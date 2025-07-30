import { Geo2D, Geo2DUtils, Point2D } from './geo2d.js';

export interface CanvasShape2D extends Geo2D {
	// cvsCtx: CanvasRenderingContext2D;
	// shape: T;

} 

export class CanvasPoint2D extends Point2D implements CanvasShape2D {

		// this.shape = new Point2D(x, y);
		//let cck: HTMLCanvasElement = document.getElement();
		//let cvsCtx: CanvasRenderingContext2D = cck.getContext("2d");
}


// export namespace CanvasUtils {

// 	function test() : void{
// 		console.log('hello');
// 	}

// }
