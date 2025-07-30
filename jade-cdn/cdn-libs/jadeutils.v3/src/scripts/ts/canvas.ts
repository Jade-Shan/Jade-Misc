import { Geo2D, Geo2DUtils, Point2D, Line2D, Ray2D, IPoint2D, ILine2D } from './geo2d.js';

export namespace CanvasUtils {

	/**
	 * 画一条线段
	 * @param cvsCtx 
	 * @param a 
	 * @param b 
	 * @param width 
	 * @param style 
	 */
	function drawLine(cvsCtx: CanvasRenderingContext2D,  //
		a: { x: number, y: number }, b: { x: number, y: number }, //
		width: number, style: string) //
	{
		cvsCtx.save();
		cvsCtx.strokeStyle = style;
		cvsCtx.lineWidth = width;
		cvsCtx.beginPath();
		cvsCtx.moveTo(a.x, a.y);
		cvsCtx.lineTo(b.x, b.y);
		cvsCtx.stroke();
	}

	/**
	 * 绘制多条相同样式的线段
	 * @param cvsCtx 
	 * @param width 
	 * @param style 
	 * @param lines 
	 */
	function drawLines(cvsCtx: CanvasRenderingContext2D,
		width: number, style: string, //
		lines: Array<{ a: { x: number, y: number }, b: { x: number, y: number } }>) //
	{
		if (lines && lines.length > 0) {
			cvsCtx.save();
			cvsCtx.strokeStyle = style;
			cvsCtx.lineWidth = width;
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				cvsCtx.beginPath();
				cvsCtx.moveTo(line.a.x, line.a.y);
				cvsCtx.lineTo(line.b.x, line.b.y);
				cvsCtx.stroke();
			}
		}
	}

}


export interface CanvasShape2D extends Geo2D {
	// cvsCtx: CanvasRenderingContext2D;
	// shape: T;

}

export interface ICanvasPoint2D extends IPoint2D {
	readonly color: string;
	readonly radius: number;
}
export class CanvasPoint2D extends Point2D implements CanvasShape2D, ICanvasPoint2D {
	readonly color: string;
	readonly radius: number;

	// this.shape = new Point2D(x, y);
	//let cck: HTMLCanvasElement = document.getElement();
	//let cvsCtx: CanvasRenderingContext2D = cck.getContext("2d");
	constructor(x: number, y: number, color: string, radius: number) {
		super(x, y);
		this.color = color;
		this.radius = radius;
	}
}

export interface ICanvasLine2D extends ILine2D {
	readonly strokeStyle: string;
	readonly lineWidth: number;
}
export class CanvasLine2D extends Line2D implements CanvasShape2D, ICanvasLine2D {
	readonly strokeStyle: string;
	readonly lineWidth: number;

	constructor(a: IPoint2D, b: IPoint2D, lineWidth: number, strokeStyle: string) //
	{
		super({ x: a.x, y: a.y }, { x: b.x, y: a.y });
		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;
	}


	// this.shape = new Point2D(x, y);
	//let cck: HTMLCanvasElement = document.getElement();
	//let cvsCtx: CanvasRenderingContext2D = cck.getContext("2d");
}


export class CanvasRay2D extends Ray2D implements CanvasShape2D {

	// this.shape = new Point2D(x, y);
	//let cck: HTMLCanvasElement = document.getElement();
	//let cvsCtx: CanvasRenderingContext2D = cck.getContext("2d");
}

