export interface Geo {

}

export interface Geo2D extends Geo {

}

export class Point2D implements Geo2D {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

}

export class Line2D implements Geo2D {
	a: Point2D = { x: 0, y: 0 };
	b: Point2D = { x: 0, y: 0 };

	constructor(a: Point2D, b: Point2D) {
		this.a = a;
		this.b = b;
	}
}

export class Ray implements Geo2D {
	start: Point2D = { x: 0, y: 0 };
	end  : Point2D = { x: 0, y: 0 };
	angle : number = 0;
	cAngel: number = 0;
	range : number = 0;

	/**
	 * 
	 * @param start start
	 * @param end end  
	 * @param angl  angel [0 ~ Pi]
	 * @param cAngle formated angel [0 ~ 2*Pi]
	 * @param range range
	 */
	constructor(start: Point2D, end: Point2D, angle: number, cAngle: number, range: number) {
		this.start = start;
		this.end   = end  ;
		this.angle = angle;
		this.cAngel = cAngle;
		this.range = range;
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
	const PI_HALF = Math.PI / 2;
	const PI_ONE_HALF = Math.PI + PI_HALF;
	const PI_DOUBLE = Math.PI * 2;

	/**
	 * 计算两点的距离
	 * @param a point 
	 * @param b point
	 * @returns size
	 */
	function distanceP2P(a: Point2D, b: Point2D): number {
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
	function pointOfLineSide(line: Line2D, p: Point2D): number {
		return (line.a.y - line.b.y) * p.x + (line.b.x - line.a.x) * p.y + line.a.x * line.a.y - line.b.x * line.a.y;
	}

	/*  */
	/**
	 * 判断点p在线段line 的垂直交点
	 * @param line line
	 * @param p point
	 * @returns point
	 */
	function pointToLine(line: Line2D, p: Point2D): Point2D {
		if (line.a.x == line.b.x && line.a.y == line.b.y) {
			return { x: line.a.x, y: line.b.y };
		} else if (line.a.x == line.b.x) {
			return { x: line.a.x, y: p.y };
		} else if (line.a.y == line.b.y) {
			return { x: p.x, y: line.a.y };
		} else {
			let a = p.x - line.a.x;
			let b = p.y - line.a.y;
			let c = line.b.x - line.a.x;
			let d = line.b.y - line.a.y;

			let dot = a * c + b * d;
			let lenSq = c * c + d * d;
			let param = dot / lenSq;

			if (param < 0) {
				return { x: line.a.x, y: line.a.y };
			} else if (param > 1) {
				return { x: line.b.x, y: line.b.y };
			} else {
				return { x: line.a.x + param * c, y: line.a.y + param * d };
			}
		}
	}

	/**
	 * 计算点到线段的距离
	 * @param line line
	 * @param p point
	 * @returns distance
	 */
	function pointToLineDistence(line: Line2D, p: Point2D): number {
		let q = pointToLine(line, p);
		return distanceP2P(p, q);
	}

	/**
	 * 检查两条线段a-b与c-d是否相交，交点的坐标
	 * @param line1 line1
	 * @param line2 line2
	 * @returns 是否相交，如果相交就返回交点的坐标
	 */
	function segmentsIntr(line1: Line2D, line2: Line2D): boolean | Point2D {
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
		return { x: line1.a.x + dx, y: line1.a.y + dy };
	}

	/**
	 * 判断一点在第几象限。
	 * 因为绘图默认顺时针方向画，
	 * 所以为了计算方便坐标轴上的点并入顺时钟方向的象限中
	 * @param p point
	 * @returns location
	 */
	function quadOfPoint(p: Point2D): QuadPos {
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
	function quadOfLine(l: Line2D): QuadPos {
		// x1 = l.a.x
		// y1 = l.a.y
		// x2 = l.b.x
		// y2 = l.b.y
		let quadP1 = quadOfPoint(l.a) as number;
		let quadP2 = quadOfPoint(l.b) as number;

		let quad: number = quadP1 | quadP2;

		if (quadP1 == quadP2) { // 线段两端点在同一象限
			// do nothing
		} else {
			let diffX = l.a.x == l.b.x ? 1 : l.a.x - l.b.x;
			let k = (l.a.y - l.b.y) / diffX;
			let b = (l.a.x * l.b.y - l.b.x * l.a.y) / diffX;

			if (k > 0 && b > 0) { quad = 0b0010 | quad; } // 函数过 1, 2, 3 象限
			else if (k > 0 && b < 0) { quad = 0b1000 | quad; } // 函数过 1, 3, 4 象限
			else if (k < 0 && b > 0) { quad = 0b0001 | quad; } // 函数过 1, 2, 4 象限
			else if (k < 0 && b < 0) { quad = 0b0100 | quad; } // 函数过 2, 3, 4 象限
		}
		// console.log(`line: (${x1},${y1})->${x2},${y2}) : 0b${quad.toString(2)}`);
		return quad as QuadPos;
	}

}
