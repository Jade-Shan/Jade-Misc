export interface Geo {

}


export interface Geo2D extends Geo {

	/**
	 * 图形的中心
	 */
	getCenter(): Point2D;

	/**
	 * 返回图形的所有顶点
	 * 
	 * @returns 所有的顶点
	 */
	getVertex(): Array<Point2D>;

	/**
	 * 对于一个外部的点`(x,y)`，返回这个点到图形近的顶占和距离
	 * 
	 * @param x 外部点的坐标x
	 * @param y 外部点的坐标y
	 * @returns 最近的点`vertex`和距离`distancd`
	 */
	getMostCloseVertex(x: number, y: number): { vertex: Point2D, distance: number }

	/**
	 * 对于一个外部的点`(x,y)`，返回这个点到图形近的顶占的射线
	 * 
	 * @param x 外部点的坐标x
	 * @param y 外部点的坐标y
	 * @param length 射线最大的长度
	 * 
	 * @returns 点到所有顶点的射线
	 */
	getVertexRaysFrom(x: number, y: number): Array<Ray2D>

}

export abstract class ShapeGeo2D implements Geo2D {

	abstract getCenter(): Point2D;

	abstract getVertex(): Array<Point2D>;

	abstract getMostCloseVertex(x: number, y: number): { vertex: Point2D; distance: number; };

	abstract getVertexRaysFrom(x: number, y: number): Array<Ray2D>;

}

export type IPoint2D = { readonly x: number, readonly y: number };
export class Point2D extends ShapeGeo2D implements IPoint2D {
	readonly x: number;
	readonly y: number;
	private center: Point2D | null;

	constructor(x: number, y: number) {
		super();
		this.x = x;
		this.y = y;
		this.center = null;
	}

	getCenter() { 
		let center: Point2D = this.center == null ? new Point2D(this.x, this.y) : this.center;
		if (null == this.center) {
			this.center = center;
		}
		return center;
	}

	/**
	 * 返回图形的所有顶点
	 * 
	 * @returns 所有的顶点
	 */
	getVertex(): Array<Point2D> { return [this]; }

	/**
	 * 对于一个外部的点`(x,y)`，返回这个点到图形近的顶占和距离
	 * 
	 * @param x 外部点的坐标x
	 * @param y 外部点的坐标y
	 * @returns 最近的点`vertex`和距离`distancd`
	 */
	getMostCloseVertex(x: number, y: number): { vertex: Point2D, distance: number } {
		let n = Geo2DUtils.distanceP2P({ x: this.x, y: this.y }, { x: x, y: y });
		return { vertex: this.getCenter(), distance: n };
	}

	/**
	 * 对于一个外部的点`(x,y)`，返回这个点到图形近的顶占的射线
	 * 
	 * @param x 外部点的坐标x
	 * @param y 外部点的坐标y
	 * @param length 射线最大的长度
	 * 
	 * @returns 点到所有顶点的射线
	 */
	getVertexRaysFrom(x: number, y: number): Array<Ray2D> {
		let point = {x: x, y: y};
		let quad = Geo2DUtils.quadOfPoint({ x: this.x - x, y: this.y - y });
		return [Geo2DUtils.calVtxDstAngle(point, this, quad)];
	}

}

export type ILine2D = { readonly a: IPoint2D, readonly b: IPoint2D }
export class Line2D extends ShapeGeo2D implements ILine2D {
	readonly a: Point2D;
	readonly b: Point2D;
	private readonly center: Point2D;

	constructor(a: IPoint2D, b: IPoint2D) {
		super();
		this.a = new Point2D(a.x, a.y);
		this.b = new Point2D(b.x, b.y);
		this.center = new Point2D( //
			Math.abs(this.a.x - this.b.x) / 2 + (this.a.x > this.b.x ? this.b.x : this.a.x), //
			Math.abs(this.a.y - this.b.y) / 2 + (this.a.y > this.b.y ? this.b.y : this.a.y));
	}

	getCenter() { return this.center; }

	getVertex(): Array<Point2D> { return [this.a, this.b]; }

	getMostCloseVertex(x: number, y: number): { vertex: Point2D, distance: number } {
		let l1 = Geo2DUtils.distanceP2P({ x: this.a.x, y: this.a.y }, { x: x, y: y });
		let l2 = Geo2DUtils.distanceP2P({ x: this.b.x, y: this.b.y }, { x: x, y: y });
		return l1 < l2 ? { vertex: this.a, distance: l1 } : { vertex: this.b, distance: l2 };
	}

	getVertexRaysFrom(x: number, y: number): Array<Ray2D> {
		let point = {x: x, y: y};
		let quad = Geo2DUtils.quadOfLine({a: {x: this.a.x - x, y: this.a.y - y}, b: {x: this.b.x - x, y: this.b.y - y}});
		return [Geo2DUtils.calVtxDstAngle(point, this.a, quad), Geo2DUtils.calVtxDstAngle(point, this.b, quad)];
	}

}

export type Ray2D = {
	readonly start: IPoint2D, // 起点
	readonly mid: IPoint2D, // 经过的点
	readonly angle: number,  // 角度
	readonly cAngle: number, // 规范后的角度
	readonly length: number, // start 到 end 的距离
}

export type IRectangle2D = { readonly x: number, readonly y: number, readonly width: number, readonly height: number }
export class Rectangle2D extends ShapeGeo2D implements IRectangle2D {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	private readonly center: Point2D;

	private readonly vertexs: Array<Point2D>;
	private readonly sides: Array<Line2D>;

	constructor(x: number, y: number, width: number, height: number) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.center = new Point2D((this.x + this.width) / 2, (this.y + this.height) / 2);
		this.vertexs = [ //
			new Point2D(this.x, this.y), //
			new Point2D(this.x + this.width, this.y), //
			new Point2D(this.x + this.width, this.y + this.height), //
			new Point2D(this.x, this.y + this.height)//
		];
		this.sides = [ //
			new Line2D(this.vertexs[0], this.vertexs[1]), //
			new Line2D(this.vertexs[1], this.vertexs[2]), //
			new Line2D(this.vertexs[2], this.vertexs[3]), //
			new Line2D(this.vertexs[3], this.vertexs[0]) //
		];
	}

	getCenter() { return this.center; }

	getVertex(): Array<Point2D> {
		return this.vertexs;
	}

	getMostCloseVertex(x: number, y: number): { vertex: Point2D, distance: number } {
		let pt = this.vertexs[0];
		let md = Geo2DUtils.distanceP2P({ x: x, y: y }, pt);
		for (let i = 1; i < this.vertexs.length; i++) {
			let nd = Geo2DUtils.distanceP2P({ x: x, y: y }, this.vertexs[i]);
			if (md > nd) {
				pt = this.vertexs[i];
				md = nd;
			}
		}
		return { vertex: pt, distance: md };
	}

	getVertexRaysFrom(x: number, y: number): Array<Ray2D> {
		let point = {x: x, y: y};
		let quad = 0b0000;
		quad = quad | Geo2DUtils.quadOfLine({a: {x: this.vertexs[0].x - x, y: this.vertexs[0].y - y}, b: {x: this.vertexs[1].x - x, y: this.vertexs[1].y - y}});
		quad = quad | Geo2DUtils.quadOfLine({a: {x: this.vertexs[1].x - x, y: this.vertexs[1].y - y}, b: {x: this.vertexs[2].x - x, y: this.vertexs[2].y - y}});
		quad = quad | Geo2DUtils.quadOfLine({a: {x: this.vertexs[2].x - x, y: this.vertexs[2].y - y}, b: {x: this.vertexs[3].x - x, y: this.vertexs[3].y - y}});
		return [ //
			Geo2DUtils.calVtxDstAngle(point, this.vertexs[0], quad),
			Geo2DUtils.calVtxDstAngle(point, this.vertexs[1], quad),
			Geo2DUtils.calVtxDstAngle(point, this.vertexs[2], quad),
			Geo2DUtils.calVtxDstAngle(point, this.vertexs[3], quad)];
	}

}

/**
 * Quadrant position
 * 代表点在直角坐标系中的位置，四个bit代表四个象限。
 * 因为绘图默认顺时针方向画，
 * 所以为了计算方便坐标轴上的点并入顺时钟方向的象限中。
 * 比如X轴正方向上的点，都同时属于第一与第四象限。
 */
export enum QuadPos {
	/** 第一象限 */ QUAD_1ST = 0b0001,
	/** 第二象限 */ QUAD_2ND = 0b0010,
	/** 第三象限 */ QUAD_3RD = 0b0100,
	/** 第四象限 */ QUAD_4TH = 0b1000,
	/** 原点    */  ORIG_PNT = 0b1111,
	/** X轴正   */ AXIS_X_POS = 0b1001,
	/** X轴负   */ AXIS_X_NAG = 0b0110,
	/** Y轴正   */ AXIS_Y_POS = 0b0011,
	/** Y轴负   */ AXIS_Y_NAG = 0b1100,
}

export namespace Geo2DUtils {
	export const PI_HALF = Math.PI / 2;
	export const PI_ONE_HALF = Math.PI + PI_HALF;
	export const PI_DOUBLE = Math.PI * 2;

	/**
	 * 计算两点的距离
	 * @param a point 
	 * @param b point
	 * @returns size
	 */
	export function distanceP2P(a: IPoint2D, b: IPoint2D): number {
		let g = a.x - b.x;
		let j = a.y - b.y;
		return Math.sqrt(g * g + j * j);
	}

	/**
	 * 判断点p是在线段line左边还是右边的
	 * @param line line
	 * @param p point
	 * @returns  result > 0为左， < 0为右， =0为线上
	 */
	export function pointOfLineSide(line: { a: IPoint2D, b: IPoint2D }, // 
		p: IPoint2D): number //
	{
		return (line.a.y - line.b.y) * p.x + // 
			(line.b.x - line.a.x) * p.y + line.a.x * line.a.y - //
			line.b.x * line.a.y;
	}

	/*  */
	/**
	 * 判断点p在线段line 的垂直交点
	 * @param line line
	 * @param p point
	 * @returns point
	 */
	export function pointToLine(line: ILine2D, p: IPoint2D): Point2D {
		if (line.a.x == line.b.x && line.a.y == line.b.y) {
			return new Point2D(line.a.x, line.b.y);
		} else if (line.a.x == line.b.x) {
			return new Point2D(line.a.x, p.y);
		} else if (line.a.y == line.b.y) {
			return new Point2D(p.x, line.a.y);
		} else {
			let a = p.x - line.a.x;
			let b = p.y - line.a.y;
			let c = line.b.x - line.a.x;
			let d = line.b.y - line.a.y;

			let dot = a * c + b * d;
			let lenSq = c * c + d * d;
			let param = dot / lenSq;

			if (param < 0) {
				return new Point2D(line.a.x, line.a.y);
			} else if (param > 1) {
				return new Point2D(line.b.x, line.b.y);
			} else {
				return new Point2D(line.a.x + param * c, line.a.y + param * d);
			}
		}
	}

	/**
	 * 计算点到线段的距离
	 * @param line line
	 * @param p point
	 * @returns distance
	 */
	export function pointToLineDistence(line: ILine2D, p: IPoint2D): number {
		let q = pointToLine(line, p);
		return distanceP2P(p, q);
	}

	/**
	 * 检查两条线段a-b与c-d是否相交，交点的坐标
	 * @param line1 line1
	 * @param line2 line2
	 * @returns 是否相交，如果相交就返回交点的坐标
	 */
	export function segmentsIntr(line1: ILine2D, line2: ILine2D): boolean | Point2D {
		let isCross: boolean = false;
		let x = 0;
		let y = 0;

		// 三角形abc 面积的2倍 
		let area_abc = (line1.a.x - line2.a.x) * (line1.b.y - line2.a.y) - (line1.a.y - line2.a.y) * (line1.b.x - line2.a.x);
		// 三角形abd 面积的2倍 
		let area_abd = (line1.a.x - line2.b.x) * (line1.b.y - line2.b.y) - (line1.a.y - line2.b.y) * (line1.b.x - line2.b.x);
		// 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理); 
		if (area_abc * area_abd > -1) {
			return false;
		}

		// 三角形cda 面积的2倍 
		let area_cda = (line2.a.x - line1.a.x) * (line2.b.y - line1.a.y) - (line2.a.y - line1.a.y) * (line2.b.x - line1.a.x);
		// 三角形cdb 面积的2倍 
		// 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出. 
		let area_cdb = area_cda + area_abc - area_abd;
		if (area_cda * area_cdb > -1) {
			return false;
		}

		//计算交点坐标 
		let t = area_cda / (area_abd - area_abc);
		let dx = Math.round(t * (line1.b.x - line1.a.x));
		let dy = Math.round(t * (line1.b.y - line1.a.y));
		return new Point2D(line1.a.x + dx, line1.a.y + dy);
	}

	/**
	 * 判断一点在第几象限。
	 * 因为绘图默认顺时针方向画，
	 * 所以为了计算方便坐标轴上的点并入顺时钟方向的象限中
	 * @param p point
	 * @returns location
	 */
	export function quadOfPoint(p: IPoint2D): QuadPos {
		if (p.x > 0 && p.y > 0) { return QuadPos.QUAD_1ST; }
		else if (p.x < 0 && p.y > 0) { return QuadPos.QUAD_2ND; }
		else if (p.x < 0 && p.y < 0) { return QuadPos.QUAD_3RD; }
		else if (p.x > 0 && p.y < 0) { return QuadPos.QUAD_4TH; }
		else if (p.x == 0 && p.y == 0) { return QuadPos.ORIG_PNT; }
		else if (p.x > 0 && p.y == 0) { return QuadPos.AXIS_X_POS; }
		else if (p.x < 0 && p.y == 0) { return QuadPos.AXIS_X_NAG; }
		else if (p.x == 0 && p.y > 0) { return QuadPos.AXIS_Y_POS; }
		else /*if (x == 0 && y < 0)*/ { return QuadPos.AXIS_Y_NAG; }
	}

	/**
	 * 判断线段经过哪几个象限
	 * 
	 * 方程组：
	 * 
	 * ``` 
	 * l.a.y = k * l.a.x + b
	 * l.b.y = k * l.b.x + b
	 * ``` 
	 * 
	 * 推得：
	 * 
	 * ``` 
	 * let k = (l.a.y - l.b.y) / (l.a.x - l.b.x);
	 * let b = (l.a.x * l.b.y - l.b.x * l.a.y) / (l.a.x - l.b.x);
	 * ```
	 * 
	 * @param l line
	 * 
	 * @returns location
	 * 
	 */
	export function quadOfLine(line: ILine2D): QuadPos {
		// x1 = l.a.x
		// y1 = l.a.y
		// x2 = l.b.x
		// y2 = l.b.y
		let quadP1 = quadOfPoint(line.a) as number;
		let quadP2 = quadOfPoint(line.b) as number;

		let quad: number = quadP1 | quadP2;

		if (quadP1 == quadP2) { // 线段两端点在同一象限
			// do nothing
		} else {
			let diffX = line.a.x == line.b.x ? 1 : line.a.x - line.b.x;
			let k = (line.a.y - line.b.y) / diffX;
			let b = (line.a.x * line.b.y - line.b.x * line.a.y) / diffX;

			if (k > 0 && b > 0) { quad = 0b0010 | quad; } // 函数过 1, 2, 3 象限
			else if (k > 0 && b < 0) { quad = 0b1000 | quad; } // 函数过 1, 3, 4 象限
			else if (k < 0 && b > 0) { quad = 0b0001 | quad; } // 函数过 1, 2, 4 象限
			else if (k < 0 && b < 0) { quad = 0b0100 | quad; } // 函数过 2, 3, 4 象限
		}
		// console.log(`line: (${x1},${y1})->${x2},${y2}) : 0b${quad.toString(2)}`);
		return quad as QuadPos;
	}

	export function extendRayLength(ray: Ray2D, extendLength: number): Ray2D {
		let length = ray.length + extendLength;
		let x = Math.cos(ray.angle + Math.PI) * length + ray.start.x;
		let y = Math.sin(ray.angle + Math.PI) * length + ray.start.y;
		return { start: ray.start, mid: {x:x,y:y}, // 
			angle: ray.angle, cAngle: ray.cAngle, length: length };
	}


	/**
	 * 计算以`start`为起点，经过`point`的射线
	 * 
	 * @param start 起点
	 * @param mid 经过的点
	 * @param quad 点经过的点相对起点所在的象限
	 * @returns 返回射线
	 */
	export function calRayByPoints(start: IPoint2D, mid: IPoint2D, quad: number): Ray2D {
		// 注意三角函数使用时的坐标
		// 数学上的坐标轴第一象限的原点在左下角
		// 在Canvas画布上，原点在左上角
		let dx = start.x - mid.x;
		let dy = start.y - mid.y;
		let angle = Math.atan2(dy, dx);
		let cAngle = 0;
		if (quad == 0b1001 || quad == 0b1101 || quad == 0b1011) {
			cAngle = angle;
		} else if (angle < 0) {
			cAngle = Math.PI * 2 + angle;
		} else {
			cAngle = angle;
		}
		return { start: start, mid: mid, angle: angle, cAngle: cAngle, length: Math.sqrt(dx * dx + dy * dy) };
	}


	/**
	 * 计算以`start`为起点，经过`point`的射线
	 * 
	 * @param start 起点
	 * @param mid 经过的点
	 * @param quad 点经过的点相对起点所在的象限
	 * @returns 返回射线
	 */
	export function calVtxDstAngle(start: IPoint2D, mid: IPoint2D, quad: number): Ray2D {
		// 注意三角函数使用时的坐标
		// 数学上的坐标轴第一象限的原点在左下角
		// 在Canvas画布上，原点在左上角
		let dx = start.x - mid.x;
		let dy = start.y - mid.y;
		let angle = Math.atan2(dy, dx);
		let cAngle = 0;
		if (quad == 0b1001 || quad == 0b1101 || quad == 0b1011) {
			cAngle = angle;
		} else if (angle < 0) {
			cAngle = Math.PI * 2 + angle;
		} else {
			cAngle = angle;
		}
		return { start: start, mid: mid, angle: angle, cAngle: cAngle, length: Math.sqrt(dx * dx + dy * dy) };
	}



	/**
	 * 对于一个外部的点，它到指定的图形每个顶点会有对应的多条射线`rays`。
	 * 在所有的`rays`中找到两条切线。
	 * 
	 * @param rays 所有的射线
	 * @returns 返回切线
	 */
	export function filterObstacleRays(rays: Array<Ray2D>): Array<Ray2D> {
		let results: Array<Ray2D> = [];
		// 找到角度最大的点与最小的点
		let minIdx = 0;
		let maxIdx = 0;
		for (let i = 1; i < rays.length; i++) {
			if (rays[i].cAngle < rays[minIdx].cAngle) { minIdx = i; }
			if (rays[i].cAngle > rays[maxIdx].cAngle) { maxIdx = i; }
		}

		// 从角度最小的顶点顺时针遍历到角度最大的顶点
		// 就是所有面向外部点的顶点
		let loopStart = minIdx > maxIdx ? minIdx : rays.length + minIdx;
		let loopEnd = maxIdx > -1 ? maxIdx - 1 : rays.length - 1;
		for (let i = loopStart; i > loopEnd; i--) {
			let idx = i < rays.length ? i : i - rays.length;
			results.push(rays[idx]);
		}
		return results;
	}

	/**
	 * 两条点到图形的切线，用线段表示
	 * 
	 * @param x 点的坐标x
	 * @param y 点的坐标y
	 * @param length 线段的长度
	 * @param rays 多条射线
	 * @returns 返回两条切线的线段
	 */
	export function genTengentLine(x: number, y: number, geo2D: Geo2D, length: number): Array<Line2D> {
		// 注意三角函数使用时的坐标
		// 数学上的坐标轴第一象限的原点在左下角
		// 在Canvas画布上，原点在左上角
		let rayArr: Array<Ray2D> = geo2D.getVertexRaysFrom(x, y);
		let rays = filterObstacleRays(rayArr);
		let result: Array<Line2D> = [];
		for (let i = 0; i < rays.length; i++) {
			let endX = x + Math.round(length * Math.cos(rays[i].angle));
			let endY = y + Math.round(length * Math.sin(rays[i].angle));
			result.push(new Line2D({ x: x, y: y }, { x: endX, y: endY }));
		}
		return result;
	}
}
