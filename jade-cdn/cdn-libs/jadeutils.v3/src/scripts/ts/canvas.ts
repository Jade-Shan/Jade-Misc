import { Geo2D, Geo2DUtils, Point2D, Line2D, Ray2D, IPoint2D, ILine2D, IRectangle2D, Rectangle2D, ShapeGeo2D } from './geo2d.js';

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
		cvsCtx.restore();
	}

	/**
	 * 绘制多条相同样式的线段
	 * @param cvsCtx 
	 * @param lines 
	 */
	export function drawLines(cvsCtx: CanvasRenderingContext2D, lines: Array<ICanvasLine2D>) {
		if (lines && lines.length > 0) {
			for (let i = 0; i < lines.length; i++) {
				drawLine(cvsCtx, lines[i]);
			}
		}
	}

	export function drawPoint(cvsCtx: CanvasRenderingContext2D, point: ICanvasPoint2D) {
		cvsCtx.save();
		cvsCtx.fillStyle = point.fillStyle;
		cvsCtx.beginPath();
		cvsCtx.arc(point.x, point.y, point.radius, 0, Geo2DUtils.PI_DOUBLE, true);
		cvsCtx.fill();
		cvsCtx.restore();
	}

	export function drawPoints(cvsCtx: CanvasRenderingContext2D, points: Array<ICanvasPoint2D>) {
		if (points && points.length > 0) {
			for (let i = 0; i < points.length; i++) {
				drawPoint(cvsCtx, points[i]);
			}
		}
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

	export function genVertexes(shape: CanvasShape2D, radius: number, fillStyle: string): Array<CanvasPoint2D> {
		let result: Array<CanvasPoint2D> = [];
		let vtxs = shape.getVertex();
		if (vtxs && vtxs.length > 0) {
			for (let i = 0; i < vtxs.length; i++) {
				let vtx = vtxs[i];
				result.push(new CanvasPoint2D(vtx.x, vtx.y, radius, fillStyle));
			}
		}
		return result;
	}

	export function drawShapeVertexes(cvsCtx: CanvasRenderingContext2D, shape: CanvasShape2D, radius: number, fillStyle: string) {
		let vtxs: Array<CanvasPoint2D> = genVertexes(shape, radius, fillStyle);
		drawPoints(cvsCtx, vtxs);
	}

	export function drawVertexRaysFrom(cvsCtx: CanvasRenderingContext2D, x: number, y: number, shape: ShapeGeo2D, lineWidth: number, strokeStyle: string) {
		let rays: Array<Ray2D> = shape.getVertexRaysFrom(x, y);
		if (rays && rays.length > 0) {
			for (let i = 0; i < rays.length; i++) {
				// let ray = rays[i];
				let ray = Geo2DUtils.extendRayLength(rays[i], 30) ;
				drawLine(cvsCtx, { a: { x: ray.start.x, y: ray.start.y }, b: { x: ray.mid.x, y: ray.mid.y }, lineWidth, strokeStyle });
			}
		}
	}



	export function genShapeTengentLine(x: number, y: number, shape: CanvasShape2D, lineWidth: number, strokeStyle: string): Array<CanvasLine2D> {
		let result: Array<CanvasLine2D> = [];
		let lines = Geo2DUtils.genTengentLine(x, y, shape, length);
		if (lines && lines.length > 0) {
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				result.push(new CanvasLine2D(line.a, line.b, lineWidth, strokeStyle));
			}
		}
		return result;
	}

	export function drawShapeTengentLine(cvsCtx: CanvasRenderingContext2D, x: number, y: number, shape: CanvasShape2D, lineWidth: number, strokeStyle: string) {
		let lines: Array<CanvasLine2D> = genShapeTengentLine(x, y, shape, lineWidth, strokeStyle);
		drawLines(cvsCtx, lines);
	}
}


export interface CanvasShape2D extends Geo2D {

}

export interface ICanvasPoint2D extends IPoint2D {
	readonly radius: number;
	readonly fillStyle: string;
}
export class CanvasPoint2D extends Point2D //
	implements CanvasShape2D, ICanvasPoint2D // 
{
	readonly radius: number;
	readonly fillStyle: string;

	constructor(x: number, y: number, radius: number, fillStyle: string) {
		super(x, y);
		this.radius = radius;
		this.fillStyle= fillStyle;
	}

	static from (point: ICanvasPoint2D): CanvasPoint2D {
		return new CanvasPoint2D(point.x, point.y, point.radius, point.fillStyle);
	}
}

export interface ICanvasLine2D extends ILine2D {
	readonly lineWidth: number;
	readonly lineCap?: "butt" | "round" | "square";
	readonly lineJoin?: "miter" | "round" | "bevel";
	readonly strokeStyle: string;
}
export class CanvasLine2D extends Line2D implements CanvasShape2D, ICanvasLine2D {
	readonly lineWidth: number;
	readonly strokeStyle: string;

	constructor(a: IPoint2D, b: IPoint2D, lineWidth: number, strokeStyle: string) //
	{
		super({ x: a.x, y: a.y }, { x: b.x, y: a.y });
		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;
	}

	static from(line: ICanvasLine2D): CanvasLine2D {
		return new CanvasLine2D(line.a, line.b, line.lineWidth, line.strokeStyle);
	}

}

export interface ICanvasRectangle2D extends IRectangle2D {
	readonly lineWidth: number;
	readonly strokeStyle: string;
	readonly fillStyle: string;
}
export class CanvasRectangle2D extends Rectangle2D //
	implements CanvasShape2D, ICanvasRectangle2D //
{
	readonly lineWidth: number;
	readonly strokeStyle: string;
	readonly fillStyle: string;

	constructor(x: number, y: number, width: number, height: number, //
		lineWidth: number, strokeStyle: string, fillStyle: string) 
	{
		super(x, y, width, height);
		this.lineWidth = lineWidth;
		this.strokeStyle = strokeStyle;
		this.fillStyle = fillStyle;
	}

	static from(rect: ICanvasRectangle2D): CanvasRectangle2D {
		return new CanvasRectangle2D(rect.x, rect.y, rect.width, rect.height, //
			rect.lineWidth, rect.strokeStyle, rect.fillStyle);
	}

}