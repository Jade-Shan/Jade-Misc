import { Geo2D, Geo2DUtils, Point2D, Line2D, Ray2D, IPoint2D, ILine2D, IRectangle2D } from './geo2d.js';

export namespace CanvasUtils {

	/**
	 * 画一条线段
	 * @param cvsCtx 
	 * @param a 
	 * @param b 
	 * @param width 
	 * @param style 
	 */
	export function drawLine(cvsCtx: CanvasRenderingContext2D, line: ICanvasLine2D) {
		cvsCtx.save();
		cvsCtx.strokeStyle = line.strokeStyle;
		cvsCtx.lineWidth = line.lineWidth;
		cvsCtx.beginPath();
		cvsCtx.moveTo(line.a.x, line.a.y);
		cvsCtx.lineTo(line.b.x, line.b.y);
		cvsCtx.stroke();
	}

	/**
	 * 绘制多条相同样式的线段
	 * @param cvsCtx 
	 * @param width 
	 * @param style 
	 * @param lines 
	 */
	export function drawLines(cvsCtx: CanvasRenderingContext2D,
		lines: Array<ICanvasLine2D>) //
	{
		if (lines && lines.length > 0) {
			cvsCtx.save();
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				cvsCtx.strokeStyle = line.strokeStyle;
				cvsCtx.lineWidth = line.lineWidth;
				cvsCtx.beginPath();
				cvsCtx.moveTo(line.a.x, line.a.y);
				cvsCtx.lineTo(line.b.x, line.b.y);
				cvsCtx.stroke();
			}
		}
	}

	export function drawPoint(cvsCtx: CanvasRenderingContext2D, p: ICanvasPoint2D) {
		cvsCtx.fillStyle = p.fillStyle;
		cvsCtx.beginPath();
		cvsCtx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
		cvsCtx.fill();
	}

	export function drawRectangle(cvsCtx: CanvasRenderingContext2D, rect: ICanvasRectangle2D) {
		if (rect.lineWidth > 0) {
			cvsCtx.strokeStyle = rect.strokeStyle;
			cvsCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		}
		if (rect.fillStyle && rect.fillStyle.length > 0) {
			cvsCtx.fillStyle = rect.fillStyle;
			cvsCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
		}
	}

}


export interface CanvasShape2D extends Geo2D {
	// cvsCtx: CanvasRenderingContext2D;
	// shape: T;

}

export interface ICanvasPoint2D extends IPoint2D {
	readonly radius: number;
	readonly fillStyle: string;
}
// export class CanvasPoint2D extends Point2D implements CanvasShape2D, ICanvasPoint2D {
// 	readonly radius: number;
// 	readonly fillStyle: string;
//
// 	constructor(x: number, y: number, radius: number, fillStyle: string) {
// 		super(x, y);
// 		this.radius = radius;
// 		this.fillStyle= fillStyle;
// 	}
// }

export interface ICanvasLine2D extends ILine2D {
	readonly lineWidth: number;
	readonly lineCap?: "butt" | "round" | "square";
	readonly lineJoin?: "miter" | "round" | "bevel";
	readonly strokeStyle: string;
}
// export class CanvasLine2D extends Line2D implements CanvasShape2D, ICanvasLine2D {
// 	readonly lineWidth: number;
// 	readonly strokeStyle: string;
//
// 	constructor(a: IPoint2D, b: IPoint2D, lineWidth: number, strokeStyle: string) //
// 	{
// 		super({ x: a.x, y: a.y }, { x: b.x, y: a.y });
// 		this.strokeStyle = strokeStyle;
// 		this.lineWidth = lineWidth;
// 	}
//
// }

export interface ICanvasRectangle2D extends IRectangle2D {
	readonly lineWidth: number;
	readonly strokeStyle: string;
	readonly fillStyle: string;
}