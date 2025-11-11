import { TimeUtil } from "./basic.js";
import { CanvasCircle2D, CanvasLine2D, CanvasRectangle2D, CanvasShape2D, ICanvas2D, ICanvasCircle2D, ICanvasLine2D, ICanvasRectangle2D } from "./canvas.js";
import { Geo2DUtils, GeoShape2D, IPoint2D, Point2D } from "./geo2d.js";
import { ImageProxyConfig, WebUtil } from "./web.js";

export type VisibilityType = "default" | "glimmer" | "dark";

export interface IObserver {
	c: IPoint2D,
	viewRange: (type: VisibilityType) => number
};

/* ======================
 * 序列化的记录
 * ======================= */
export interface ImageResource {
	type    : "Image" | "Other",
	id      : string,
	url     : string,
	imgElem?: HTMLImageElement
}

/**
 * 从图片中截取一部分
 */
export interface ImageClip {
	imgKey    : string, // 对应的图片ID
	sx        : number, // 左上角X
	sy        : number, // 左上角Y
	width     : number, // 宽度
	height    : number, // 高度
	imageElem?: HTMLImageElement;
};


export interface IToken2DRec {
	type     : "Circle" | "Rectangle" | "Line",
	id       : string,
	x        : number,
	y        : number,
	visiable : boolean,
	blockView: boolean,
	color    : string,
}
export interface IToken2D extends CanvasShape2D {
	id       : string,
	color    : string,
	visiable : boolean,
	blockView: boolean

	toRecord(): IToken2DRec;
}

export interface ICircleTokenRec extends IToken2DRec {
	type  : "Circle",
	radius: number,
	img   : ImageClip,
}

export interface ICircleToken extends ICanvasCircle2D { color: string, imgClip: ImageClip };
export class CircleToken extends CanvasCircle2D implements IToken2D, ICircleToken {
	id       : string = "";
	color    : string;
	visiable : boolean = true;
	blockView: boolean = true;
	imgClip  : ImageClip;

	constructor(id: string, x: number, y: number, radius: number, //
		lineWidth: number, strokeStyle: string, fillStyle: string, //
		visiable: boolean, blockView: boolean, color: string, image: ImageClip) //
	{
		super(x, y, radius, lineWidth, strokeStyle, fillStyle);
		this.id = id;
		this.visiable = visiable;
		this.blockView = blockView;
		this.color = color;
		this.imgClip = image;
	}

	toRecord(): ICircleTokenRec {
		return { "type": "Circle", "id": this.id, "x": this.c.x, "y": this.c.y, "radius": this.radius, // 
			"visiable": this.visiable, "blockView": this.blockView, "color": this.strokeStyle, "img": this.imgClip };
	}

	static fromRecord(rec: ICircleTokenRec, imageRecs: Array<ImageResource>): CircleToken {
		let cc = new CircleToken(rec.id, rec.x, rec.y, rec.radius, 0, rec.color, rec.color, // 
			rec.visiable, rec.blockView, rec.color, rec.img);
		if (null != imageRecs && imageRecs.length > 0) {
			for (let i = 0; i < imageRecs.length; i++) {
				let img = imageRecs[i];
				if (img.id == rec.img.imgKey) {
					if (img.imgElem) {
						rec.img.imageElem = img.imgElem;
					}
				}
			}
		}
		return cc;
	}

	draw(cvsCtx: CanvasRenderingContext2D): void {
		cvsCtx.save();
		cvsCtx.lineWidth = 0;
		cvsCtx.strokeStyle = this.color;
		// draw a circle
		cvsCtx.beginPath();
		cvsCtx.arc(this.c.x, this.c.y, this.radius, 0, Geo2DUtils.PI_DOUBLE, true);
		cvsCtx.fillStyle = this.color;
		cvsCtx.fill();
		cvsCtx.stroke();
		// clip Image
		cvsCtx.beginPath();
		cvsCtx.arc(this.c.x, this.c.y, this.radius - 3, 0, Geo2DUtils.PI_DOUBLE, true);
		cvsCtx.stroke();
		cvsCtx.clip();
		if (this.imgClip && this.imgClip.imageElem) {
			let dx = this.c.x - this.radius;
			let dy = this.c.y - this.radius;
			let dwidth  = this.radius * 2;
			let dheight = dwidth;
			cvsCtx.drawImage(this.imgClip.imageElem, this.imgClip.sx, this.imgClip.sy, 
				this.imgClip.width, this.imgClip.height, dx, dy, dwidth, dheight);
		}
		cvsCtx.restore();
	}

}

export interface IRectangleTokenRec extends IToken2DRec {
	type  : "Rectangle",
	width : number,
	height: number,
	img   : ImageClip,
};
export interface IRectangleToken extends ICanvasRectangle2D { color: string, imgClip: ImageClip }

export class RectangleToken extends CanvasRectangle2D implements IToken2D, IRectangleToken {
	id       : string = "";
	color    : string;
	visiable : boolean = true;
	blockView: boolean = true;
	imgClip  : ImageClip;

	constructor(id: string, x: number, y: number, width: number, heigh: number,//
		lineWidth: number, strokeStyle: string, fillStyle: string, //
		visiable: boolean, blockView: boolean, color: string, image: ImageClip) //
	{
		super(x, y, width, heigh, lineWidth, strokeStyle, fillStyle);
		this.id        = id;
		this.visiable  = visiable;
		this.blockView = blockView;
		this.color     = color;
		this.imgClip   = image;
	}

	static fromRecord(rec: IRectangleTokenRec, imageRecs: Array<ImageResource>): RectangleToken {
		let rtg = new RectangleToken(rec.id, rec.x, rec.y, rec.width, rec.height, 0, //
			rec.color, rec.color, rec.visiable, rec.blockView, rec.color, rec.img);
		if (null != imageRecs && imageRecs.length > 0) {
			for (let i = 0; i < imageRecs.length; i++) {
				let img = imageRecs[i];
				if (img.id == rec.img.imgKey) {
					if (img.imgElem) {
						rec.img.imageElem = img.imgElem;
					}
				}
			}
		}
		return rtg;
	}

	toRecord(): IRectangleTokenRec {
		return {
			"type": "Rectangle", "id": this.id, "x": this.x, "y": this.y, //
			"width": this.width, "height": this.height, "visiable": this.visiable, // 
			"blockView": this.blockView, "color": this.color, //
			"img": { "imgKey": "icons", "sx": 0, "sy": 0, "width": 50, "height": 50 }
		};
	}

	draw(cvsCtx: CanvasRenderingContext2D): void {
		cvsCtx.save();
		cvsCtx.lineWidth = 0;
		// draw a rectangle
		cvsCtx.beginPath();
		cvsCtx.fillStyle = this.color;
		cvsCtx.fillRect(this.x, this.y, this.width, this.height);
		cvsCtx.fill();
		// clip Image
		// cvsCtx.beginPath();
		cvsCtx.rect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
		// cvsCtx.stroke();
		// cvsCtx.clip();
		if (this.imgClip && this.imgClip.imageElem) {
			let dx = this.x + 3;
			let dy = this.y + 3;
			let dwidth  = this.width  - 6;
			let dheight = this.height - 6;
			cvsCtx.drawImage(this.imgClip.imageElem, this.imgClip.sx, this.imgClip.sy, 
				this.imgClip.width, this.imgClip.height, dx, dy, dwidth, dheight);
		}
		cvsCtx.restore();
	}
}

export interface ILineTokenRec extends IToken2DRec {
	type: "Line",
	x2  : number,
	y2  : number,
}
export interface ILineToken extends ICanvasLine2D { color: string }
export class LineToken extends CanvasLine2D implements IToken2D, ILineToken {
	id: string = "";
	color: string;
	visiable: boolean = true;
	blockView: boolean = true;

	constructor(id: string, x1: number, y1: number, x2: number, y2: number, // 
		lineWidth: number, strokeStyle: string, color: string, // 
		visiable: boolean, blockView: boolean ) // 
	{
		super({x: x1, y: y1}, {x: x2, y: y2}, lineWidth, strokeStyle);
		this.id        = id;
		this.color     = color;
		this.visiable  = visiable;
		this.blockView = blockView;
	}

	static fromRecord(rec: ILineTokenRec): LineToken {
		return new LineToken(rec.id, rec.x, rec.y, rec.x2, rec.y2, 6, "", rec.color, rec.visiable, rec.blockView);
	}

	toRecord(): ILineTokenRec {
		return {"type": "Line", "id": this.id, "x": this.a.x, "y": this.a.y, "x2":this.b.x, "y2": this.b.y,
			"color": this.color, "visiable": this.visiable, "blockView": this.blockView };
	}

	draw(cvsCtx: CanvasRenderingContext2D): void {
		console.log(`cal opp color: \n${this.color}\n${
			this.oppColor(this.color, 4)}\n${
			this.oppColor(this.color,-4)}\n${
			this.oppColor(this.color,-2)}\n`);
		cvsCtx.save();
		// 
		cvsCtx.lineWidth = 7;
		// cvsCtx.fillStyle = this.color;
		cvsCtx.strokeStyle = this.oppColor(this.color,  4);
		cvsCtx.beginPath();
		cvsCtx.moveTo(this.a.x, this.a.y);
		cvsCtx.lineTo(this.b.x, this.b.y);
		cvsCtx.closePath();
		cvsCtx.stroke();
		// cvsCtx.fill();
		//
		cvsCtx.lineWidth = 3;
		// cvsCtx.fillStyle = this.color;
		cvsCtx.strokeStyle = this.color;
		cvsCtx.beginPath();
		cvsCtx.moveTo(this.a.x, this.a.y);
		cvsCtx.lineTo(this.b.x, this.b.y);
		cvsCtx.closePath();
		cvsCtx.stroke();
		// cvsCtx.fill();
		cvsCtx.restore();
	}

	// ilighten为对比度，范围从(-1 ~ -15)
	oppColor2(color: string,ilighten: number){
		let a = color.replace('#','');
		let max16 = Math.floor(15 + (ilighten || 0));
		if (max16 < 0 || max16 > 15) {
			max16 = 15;
		}
		let c16 = 0, c10 = 0, b=[];
		for (let i =0; i< a.length; i++) {
			c16 = parseInt(a.charAt(i), 16);
			c10 = max16 - c16;
			if (c10 < 0) {
				c10 = Math.abs(c10);
			}
			b.push(c10.toString(16));
		}
		return '#' + b.join('');
	}

	oppColor(color: string,ilighten: number){
		let asHex = '0123456789ABCDEF';
		let sResult = '#';
		let iTemp = 0;
		for (let i=1; i<7;i++) {
			iTemp = parseInt(`0x${color.substring(i, 1)}`) + ilighten;
			if (iTemp > 15) {
				iTemp = 15;
			} else if (iTemp < 0) {
				iTemp= 0;
			}
			sResult = sResult + asHex.charAt(iTemp);
		}
		return sResult;
	}

}


export interface ScenceDataResp {
	username    : string,
	loginToken  : string,
	imgResources: Array<ImageResource>,
	mapDatas: {
		teams      : Array<ICircleTokenRec>,
		creaters   : Array<ICircleTokenRec>,
		furnishings: Array<IRectangleTokenRec>,
		doors      : Array<IRectangleTokenRec>,
		walls      : Array<ILineTokenRec>,
	}
}


export interface ICanvasFrame {
		cvs: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D
}
export interface IScene {
	map: { imageUrl: string, width: number, height: number, shadowStyle: string },
	visibility: VisibilityType,
	frame: { buff: ICanvasFrame, show: ICanvasFrame },
}
export interface ISandTable {
}
export class SandTable implements ISandTable {
	scene: IScene;
	observer: IObserver = {
		c: { x: 250, y: 300 },
		viewRange: (type: string) => { return 350; }
	};

	constructor(scene: IScene) // 
	{
		this.scene = scene;
	}

	async drawSceneWithUserView(proxyCfg?: ImageProxyConfig) {
		// 加载地图
		let oriMap = new Image();
		await WebUtil.loadImageByProxy(oriMap, this.scene.map.imageUrl, proxyCfg);
		this.scene.map.width  = oriMap.width ;
		this.scene.map.height = oriMap.height;
		await SandTableUtils.drawSceneWithUserView(this.scene, oriMap, this.observer);
	}


}

interface IColorRGB { readonly r: number, readonly g: number, readonly b: number }
class ColorRGB implements IColorRGB {
	readonly r: number;
	readonly g: number;
	readonly b: number;

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	static fromStrHex(str: string): ColorRGB {
		let r = 0, g = 0, b = 0;
		if (!str) {
			// do nothing
		} else if (str.length > 6) {
			r = parseInt(`0x${str.substring(1, 3)}`);
			g = parseInt(`0x${str.substring(3, 5)}`);
			b = parseInt(`0x${str.substring(5, 7)}`);
		}
		return new ColorRGB(r, g, b);
	}

	static fromName(name: string): ColorRGB {
		let r = 0, g = 0, b = 0;
		for (let i = 0; i< namedRGBColor.length; i++) {
			let color = namedRGBColor[i];
			if (name == color.name) {
				r = color.color.r;
				g = color.color.g;
				b = color.color.b;
			}
		}
		return new ColorRGB(r, g, b);
	}

	toStrRGB(): string { return `rgb(${this.r},${this.g},${this.b})`; }

	toStrHex(): string {
		let r = this.r.toString(16);
		let g = this.g.toString(16);
		let b = this.b.toString(16);
		r = r.length > 1 ? r : "0" + r;
		g = g.length > 1 ? g : "0" + g;
		b = b.length > 1 ? b : "0" + b;
		return `#${r}${g}${b}`;
	}

	toNameColor(): {color: ColorRGB, name: string} {
		let minIdx = 0;
		let minDiff = 255 + 255 + 255;

		let idx = 0;
		while (idx < namedRGBColor.length) {
			let curr = namedRGBColor[idx].color;
			let diff = Math.abs(curr.r - this.r) + Math.abs(curr.g - this.g) + Math.abs(curr.b - this.b);
			if (diff < minDiff) {
				minIdx = idx;
				minDiff = diff;
			}
			idx++;
		}
		return namedRGBColor[minIdx];
	}

	toName(): {color: ColorRGB, name: string} {
		let idx = 0;
		while ((idx + 1) < namedRGBColor.length) {
			let curr = namedRGBColor[idx].color;
			let next = namedRGBColor[idx + 1].color;
			console.log(`(${this.toStrHex()} : ${curr.toStrHex()} : ${next.toStrHex()})  r: (${curr.r} : ${next.r} : ${this.r})`);
			if (curr.r > next.r) {
				break;
			} else if (this.r < next.r) {
				break;
			} else {
				idx++
			}
		}
		while ((idx + 1) < namedRGBColor.length) {
			let curr = namedRGBColor[idx].color;
			let next = namedRGBColor[idx + 1].color;
			console.log(`(${this.toStrHex()} : ${curr.toStrHex()} : ${next.toStrHex()})  g: (${curr.g} : ${next.g} : ${this.g})`);
			if (curr.g > next.g) {
				break;
			} else if (this.g < next.g) {
				break;
			} else {
				idx++
			}
		}
		while ((idx + 1) < namedRGBColor.length) {
			let curr = namedRGBColor[idx].color;
			let next = namedRGBColor[idx + 1].color;
			console.log(`(${this.toStrHex()} : ${curr.toStrHex()} : ${next.toStrHex()})  b: (${curr.b} : ${next.b} : ${this.b})`);
			if (curr.b > next.b) {
				break;
			} else if (this.b < next.b) {
				break;
			} else {
				idx++
			}
		}
		return namedRGBColor[idx];
	}

	oppColor(ilighten: number){
		// 互补色的查询
		// https://htmlcolorcodes.com/zh/yanse-xuanze-qi/
		// https://zh.planetcalc.com/7661/
		let color = this.toStrHex();
		let asHex = '0123456789ABCDEF';
		let sResult = '#';
		let iTemp = 0;
		for (let i=1; i<7;i++) {
			iTemp = parseInt(`0x${color.substring(i, 1)}`) + ilighten;
			if (iTemp > 15) {
				iTemp = 15;
			} else if (iTemp < 0) {
				iTemp= 0;
			}
			sResult = sResult + asHex.charAt(iTemp);
		}
		let result = ColorRGB.fromStrHex(sResult);
		return result;
	}

}

let RGBColorMap = {
Black                : {color: ColorRGB.fromStrHex('#000000'), rev: ColorRGB.fromStrHex('#FFFFFF')},
Navy                 : {color: ColorRGB.fromStrHex('#000080'), rev: ColorRGB.fromStrHex('#FFFF7F')},
DarkBlue             : {color: ColorRGB.fromStrHex('#00008B'), rev: ColorRGB.fromStrHex('#FFFF74')},
MediumBlue           : {color: ColorRGB.fromStrHex('#0000CD'), rev: ColorRGB.fromStrHex('#FFFF32')},
Blue                 : {color: ColorRGB.fromStrHex('#0000FF'), rev: ColorRGB.fromStrHex('#FFFF00')},
DarkGreen            : {color: ColorRGB.fromStrHex('#006400'), rev: ColorRGB.fromStrHex('#FF9BFF')},
Green                : {color: ColorRGB.fromStrHex('#008000'), rev: ColorRGB.fromStrHex('#FF7FFF')},
Teal                 : {color: ColorRGB.fromStrHex('#008080'), rev: ColorRGB.fromStrHex('#FF7F7F')},
DarkCyan             : {color: ColorRGB.fromStrHex('#008B8B'), rev: ColorRGB.fromStrHex('#FF7474')},
DeepSkyBlue          : {color: ColorRGB.fromStrHex('#00BFFF'), rev: ColorRGB.fromStrHex('#FF4000')},
DarkTurquoise        : {color: ColorRGB.fromStrHex('#00CED1'), rev: ColorRGB.fromStrHex('#FF312E')},
MediumSpringGreen    : {color: ColorRGB.fromStrHex('#00FA9A'), rev: ColorRGB.fromStrHex('#FF0565')},
Lime                 : {color: ColorRGB.fromStrHex('#00FF00'), rev: ColorRGB.fromStrHex('#FF00FF')},
SpringGreen          : {color: ColorRGB.fromStrHex('#00FF7F'), rev: ColorRGB.fromStrHex('#FF0080')},
Aqua                 : {color: ColorRGB.fromStrHex('#00FFFF'), rev: ColorRGB.fromStrHex('#FF0000')},
Cyan                 : {color: ColorRGB.fromStrHex('#00FFFF'), rev: ColorRGB.fromStrHex('#FF0000')},
MidnightBlue         : {color: ColorRGB.fromStrHex('#191970'), rev: ColorRGB.fromStrHex('#E6E68F')},
DodgerBlue           : {color: ColorRGB.fromStrHex('#1E90FF'), rev: ColorRGB.fromStrHex('#E16F00')},
LightSeaGreen        : {color: ColorRGB.fromStrHex('#20B2AA'), rev: ColorRGB.fromStrHex('#DF4D55')},
ForestGreen          : {color: ColorRGB.fromStrHex('#228B22'), rev: ColorRGB.fromStrHex('#DD74DD')},
SeaGreen             : {color: ColorRGB.fromStrHex('#2E8B57'), rev: ColorRGB.fromStrHex('#D174A8')},
DarkSlateGray        : {color: ColorRGB.fromStrHex('#2F4F4F'), rev: ColorRGB.fromStrHex('#D0B0B0')},
LimeGreen            : {color: ColorRGB.fromStrHex('#32CD32'), rev: ColorRGB.fromStrHex('#CD32CD')},
MediumSeaGreen       : {color: ColorRGB.fromStrHex('#3CB371'), rev: ColorRGB.fromStrHex('#C34C8E')},
Turquoise            : {color: ColorRGB.fromStrHex('#40E0D0'), rev: ColorRGB.fromStrHex('#BF1F2F')},
RoyalBlue            : {color: ColorRGB.fromStrHex('#4169E1'), rev: ColorRGB.fromStrHex('#BE961E')},
SteelBlue            : {color: ColorRGB.fromStrHex('#4682B4'), rev: ColorRGB.fromStrHex('#B97D4B')},
DarkSlateBlue        : {color: ColorRGB.fromStrHex('#483D8B'), rev: ColorRGB.fromStrHex('#B7C274')},
MediumTurquoise      : {color: ColorRGB.fromStrHex('#48D1CC'), rev: ColorRGB.fromStrHex('#B72E33')},
Indigo               : {color: ColorRGB.fromStrHex('#4B0082'), rev: ColorRGB.fromStrHex('#B4FF7D')},
DarkOliveGreen       : {color: ColorRGB.fromStrHex('#556B2F'), rev: ColorRGB.fromStrHex('#AA94D0')},
CadetBlue            : {color: ColorRGB.fromStrHex('#5F9EA0'), rev: ColorRGB.fromStrHex('#A0615F')},
CornflowerBlue       : {color: ColorRGB.fromStrHex('#6495ED'), rev: ColorRGB.fromStrHex('#9B6A12')},
MediumAquaMarine     : {color: ColorRGB.fromStrHex('#66CDAA'), rev: ColorRGB.fromStrHex('#993255')},
DimGray              : {color: ColorRGB.fromStrHex('#696969'), rev: ColorRGB.fromStrHex('#969696')},
SlateBlue            : {color: ColorRGB.fromStrHex('#6A5ACD'), rev: ColorRGB.fromStrHex('#95A532')},
OliveDrab            : {color: ColorRGB.fromStrHex('#6B8E23'), rev: ColorRGB.fromStrHex('#47238E')},
SlateGray            : {color: ColorRGB.fromStrHex('#708090'), rev: ColorRGB.fromStrHex('#908070')},
LightSlateGray       : {color: ColorRGB.fromStrHex('#778899'), rev: ColorRGB.fromStrHex('#998877')},
MediumSlateBlue      : {color: ColorRGB.fromStrHex('#7B68EE'), rev: ColorRGB.fromStrHex('#DAEE68')},
LawnGreen            : {color: ColorRGB.fromStrHex('#7CFC00'), rev: ColorRGB.fromStrHex('#8303FF')},
Chartreuse           : {color: ColorRGB.fromStrHex('#7FFF00'), rev: ColorRGB.fromStrHex('#8000FF')},
Aquamarine           : {color: ColorRGB.fromStrHex('#7FFFD4'), rev: ColorRGB.fromStrHex('#80002B')},
Maroon               : {color: ColorRGB.fromStrHex('#800000'), rev: ColorRGB.fromStrHex('#7FFFFF')},
Purple               : {color: ColorRGB.fromStrHex('#800080'), rev: ColorRGB.fromStrHex('#7FFF7F')},
Olive                : {color: ColorRGB.fromStrHex('#808000'), rev: ColorRGB.fromStrHex('#7F7FFF')},
Gray                 : {color: ColorRGB.fromStrHex('#808080'), rev: ColorRGB.fromStrHex('#B7DB70')},
SkyBlue              : {color: ColorRGB.fromStrHex('#87CEEB'), rev: ColorRGB.fromStrHex('#783114')},
LightSkyBlue         : {color: ColorRGB.fromStrHex('#87CEFA'), rev: ColorRGB.fromStrHex('#783105')},
BlueViolet           : {color: ColorRGB.fromStrHex('#8A2BE2'), rev: ColorRGB.fromStrHex('#75D41D')},
DarkRed              : {color: ColorRGB.fromStrHex('#8B0000'), rev: ColorRGB.fromStrHex('#74FFFF')},
DarkMagenta          : {color: ColorRGB.fromStrHex('#8B008B'), rev: ColorRGB.fromStrHex('#74FF74')},
SaddleBrown          : {color: ColorRGB.fromStrHex('#8B4513'), rev: ColorRGB.fromStrHex('#74BAEC')},
DarkSeaGreen         : {color: ColorRGB.fromStrHex('#8FBC8F'), rev: ColorRGB.fromStrHex('#704370')},
LightGreen           : {color: ColorRGB.fromStrHex('#90EE90'), rev: ColorRGB.fromStrHex('#6F116F')},
MediumPurple         : {color: ColorRGB.fromStrHex('#9370DB'), rev: ColorRGB.fromStrHex('#B7DB70')},
DarkViolet           : {color: ColorRGB.fromStrHex('#9400D3'), rev: ColorRGB.fromStrHex('#6BFF2C')},
PaleGreen            : {color: ColorRGB.fromStrHex('#98FB98'), rev: ColorRGB.fromStrHex('#670467')},
DarkOrchid           : {color: ColorRGB.fromStrHex('#9932CC'), rev: ColorRGB.fromStrHex('#66CD33')},
YellowGreen          : {color: ColorRGB.fromStrHex('#9ACD32'), rev: ColorRGB.fromStrHex('#6532CD')},
Sienna               : {color: ColorRGB.fromStrHex('#A0522D'), rev: ColorRGB.fromStrHex('#5FADD2')},
Brown                : {color: ColorRGB.fromStrHex('#A52A2A'), rev: ColorRGB.fromStrHex('#5AD5D5')},
DarkGray             : {color: ColorRGB.fromStrHex('#A9A9A9'), rev: ColorRGB.fromStrHex('#565656')},
LightBlue            : {color: ColorRGB.fromStrHex('#ADD8E6'), rev: ColorRGB.fromStrHex('#522719')},
GreenYellow          : {color: ColorRGB.fromStrHex('#ADFF2F'), rev: ColorRGB.fromStrHex('#5200D0')},
PaleTurquoise        : {color: ColorRGB.fromStrHex('#AFEEEE'), rev: ColorRGB.fromStrHex('#501111')},
LightSteelBlue       : {color: ColorRGB.fromStrHex('#B0C4DE'), rev: ColorRGB.fromStrHex('#4F3B21')},
PowderBlue           : {color: ColorRGB.fromStrHex('#B0E0E6'), rev: ColorRGB.fromStrHex('#4F1F19')},
FireBrick            : {color: ColorRGB.fromStrHex('#B22222'), rev: ColorRGB.fromStrHex('#4DDDDD')},
DarkGoldenRod        : {color: ColorRGB.fromStrHex('#B8860B'), rev: ColorRGB.fromStrHex('#4779F4')},
MediumOrchid         : {color: ColorRGB.fromStrHex('#BA55D3'), rev: ColorRGB.fromStrHex('#45AA2C')},
RosyBrown            : {color: ColorRGB.fromStrHex('#BC8F8F'), rev: ColorRGB.fromStrHex('#437070')},
DarkKhaki            : {color: ColorRGB.fromStrHex('#BDB76B'), rev: ColorRGB.fromStrHex('#424894')},
Silver               : {color: ColorRGB.fromStrHex('#C0C0C0'), rev: ColorRGB.fromStrHex('#3F3F3F')},
MediumVioletRed      : {color: ColorRGB.fromStrHex('#C71585'), rev: ColorRGB.fromStrHex('#38EA7A')},
IndianRed            : {color: ColorRGB.fromStrHex('#CD5C5C'), rev: ColorRGB.fromStrHex('#32A3A3')},
Peru                 : {color: ColorRGB.fromStrHex('#CD853F'), rev: ColorRGB.fromStrHex('#327AC0')},
Chocolate            : {color: ColorRGB.fromStrHex('#D2691E'), rev: ColorRGB.fromStrHex('#2D96E1')},
Tan                  : {color: ColorRGB.fromStrHex('#D2B48C'), rev: ColorRGB.fromStrHex('#2D4B73')},
LightGray            : {color: ColorRGB.fromStrHex('#D3D3D3'), rev: ColorRGB.fromStrHex('#2C2C2C')},
Thistle              : {color: ColorRGB.fromStrHex('#D8BFD8'), rev: ColorRGB.fromStrHex('#274027')},
Orchid               : {color: ColorRGB.fromStrHex('#DA70D6'), rev: ColorRGB.fromStrHex('#258F29')},
GoldenRod            : {color: ColorRGB.fromStrHex('#DAA520'), rev: ColorRGB.fromStrHex('#255ADF')},
PaleVioletRed        : {color: ColorRGB.fromStrHex('#DB7093'), rev: ColorRGB.fromStrHex('#248F6C')},
Crimson              : {color: ColorRGB.fromStrHex('#DC143C'), rev: ColorRGB.fromStrHex('#23EBC3')},
Gainsboro            : {color: ColorRGB.fromStrHex('#DCDCDC'), rev: ColorRGB.fromStrHex('#232323')},
Plum                 : {color: ColorRGB.fromStrHex('#DDA0DD'), rev: ColorRGB.fromStrHex('#225F22')},
BurlyWood            : {color: ColorRGB.fromStrHex('#DEB887'), rev: ColorRGB.fromStrHex('#214778')},
LightCyan            : {color: ColorRGB.fromStrHex('#E0FFFF'), rev: ColorRGB.fromStrHex('#1F0000')},
Lavender             : {color: ColorRGB.fromStrHex('#E6E6FA'), rev: ColorRGB.fromStrHex('#191905')},
DarkSalmon           : {color: ColorRGB.fromStrHex('#E9967A'), rev: ColorRGB.fromStrHex('#166985')},
Violet               : {color: ColorRGB.fromStrHex('#EE82EE'), rev: ColorRGB.fromStrHex('#117D11')},
PaleGoldenRod        : {color: ColorRGB.fromStrHex('#EEE8AA'), rev: ColorRGB.fromStrHex('#111755')},
LightCoral           : {color: ColorRGB.fromStrHex('#F08080'), rev: ColorRGB.fromStrHex('#0F7F7F')},
Khaki                : {color: ColorRGB.fromStrHex('#F0E68C'), rev: ColorRGB.fromStrHex('#0F1973')},
AliceBlue            : {color: ColorRGB.fromStrHex('#F0F8FF'), rev: ColorRGB.fromStrHex('#0F0700')},
HoneyDew             : {color: ColorRGB.fromStrHex('#F0FFF0'), rev: ColorRGB.fromStrHex('#0F000F')},
Azure                : {color: ColorRGB.fromStrHex('#F0FFFF'), rev: ColorRGB.fromStrHex('#0F0000')},
SandyBrown           : {color: ColorRGB.fromStrHex('#F4A460'), rev: ColorRGB.fromStrHex('#0B5B9F')},
Wheat                : {color: ColorRGB.fromStrHex('#F5DEB3'), rev: ColorRGB.fromStrHex('#0A214C')},
Beige                : {color: ColorRGB.fromStrHex('#F5F5DC'), rev: ColorRGB.fromStrHex('#0A0A23')},
WhiteSmoke           : {color: ColorRGB.fromStrHex('#F5F5F5'), rev: ColorRGB.fromStrHex('#0A0A0A')},
MintCream            : {color: ColorRGB.fromStrHex('#F5FFFA'), rev: ColorRGB.fromStrHex('#0A0005')},
GhostWhite           : {color: ColorRGB.fromStrHex('#F8F8FF'), rev: ColorRGB.fromStrHex('#070700')},
Salmon               : {color: ColorRGB.fromStrHex('#FA8072'), rev: ColorRGB.fromStrHex('#057F8D')},
AntiqueWhite         : {color: ColorRGB.fromStrHex('#FAEBD7'), rev: ColorRGB.fromStrHex('#051428')},
Linen                : {color: ColorRGB.fromStrHex('#FAF0E6'), rev: ColorRGB.fromStrHex('#050F19')},
LightGoldenRodYellow : {color: ColorRGB.fromStrHex('#FAFAD2'), rev: ColorRGB.fromStrHex('#05052D')},
OldLace              : {color: ColorRGB.fromStrHex('#FDF5E6'), rev: ColorRGB.fromStrHex('#020A19')},
Red                  : {color: ColorRGB.fromStrHex('#FF0000'), rev: ColorRGB.fromStrHex('#00FFFF')},
Fuchsia              : {color: ColorRGB.fromStrHex('#FF00FF'), rev: ColorRGB.fromStrHex('#00FF00')},
Magenta              : {color: ColorRGB.fromStrHex('#FF00FF'), rev: ColorRGB.fromStrHex('#00FF00')},
DeepPink             : {color: ColorRGB.fromStrHex('#FF1493'), rev: ColorRGB.fromStrHex('#00EB6C')},
OrangeRed            : {color: ColorRGB.fromStrHex('#FF4500'), rev: ColorRGB.fromStrHex('#00BAFF')},
Tomato               : {color: ColorRGB.fromStrHex('#FF6347'), rev: ColorRGB.fromStrHex('#009CB8')},
HotPink              : {color: ColorRGB.fromStrHex('#FF69B4'), rev: ColorRGB.fromStrHex('#00964B')},
Coral                : {color: ColorRGB.fromStrHex('#FF7F50'), rev: ColorRGB.fromStrHex('#0080AF')},
DarkOrange           : {color: ColorRGB.fromStrHex('#FF8C00'), rev: ColorRGB.fromStrHex('#0073FF')},
LightSalmon          : {color: ColorRGB.fromStrHex('#FFA07A'), rev: ColorRGB.fromStrHex('#005F85')},
Orange               : {color: ColorRGB.fromStrHex('#FFA500'), rev: ColorRGB.fromStrHex('#005AFF')},
LightPink            : {color: ColorRGB.fromStrHex('#FFB6C1'), rev: ColorRGB.fromStrHex('#00493E')},
Pink                 : {color: ColorRGB.fromStrHex('#FFC0CB'), rev: ColorRGB.fromStrHex('#003F34')},
Gold                 : {color: ColorRGB.fromStrHex('#FFD700'), rev: ColorRGB.fromStrHex('#0028FF')},
PeachPuff            : {color: ColorRGB.fromStrHex('#FFDAB9'), rev: ColorRGB.fromStrHex('#002546')},
NavajoWhite          : {color: ColorRGB.fromStrHex('#FFDEAD'), rev: ColorRGB.fromStrHex('#002152')},
Moccasin             : {color: ColorRGB.fromStrHex('#FFE4B5'), rev: ColorRGB.fromStrHex('#001B4A')},
Bisque               : {color: ColorRGB.fromStrHex('#FFE4C4'), rev: ColorRGB.fromStrHex('#001B3B')},
MistyRose            : {color: ColorRGB.fromStrHex('#FFE4E1'), rev: ColorRGB.fromStrHex('#001B1E')},
BlanchedAlmond       : {color: ColorRGB.fromStrHex('#FFEBCD'), rev: ColorRGB.fromStrHex('#001432')},
PapayaWhip           : {color: ColorRGB.fromStrHex('#FFEFD5'), rev: ColorRGB.fromStrHex('#00102A')},
LavenderBlush        : {color: ColorRGB.fromStrHex('#FFF0F5'), rev: ColorRGB.fromStrHex('#000F0A')},
SeaShell             : {color: ColorRGB.fromStrHex('#FFF5EE'), rev: ColorRGB.fromStrHex('#000A11')},
Cornsilk             : {color: ColorRGB.fromStrHex('#FFF8DC'), rev: ColorRGB.fromStrHex('#000723')},
LemonChiffon         : {color: ColorRGB.fromStrHex('#FFFACD'), rev: ColorRGB.fromStrHex('#000532')},
FloralWhite          : {color: ColorRGB.fromStrHex('#FFFAF0'), rev: ColorRGB.fromStrHex('#00050F')},
Snow                 : {color: ColorRGB.fromStrHex('#FFFAFA'), rev: ColorRGB.fromStrHex('#000505')},
Yellow               : {color: ColorRGB.fromStrHex('#FFFF00'), rev: ColorRGB.fromStrHex('#0000FF')},
LightYellow          : {color: ColorRGB.fromStrHex('#FFFFE0'), rev: ColorRGB.fromStrHex('#00001F')},
Ivory                : {color: ColorRGB.fromStrHex('#FFFFF0'), rev: ColorRGB.fromStrHex('#00000F')},
White                : {color: ColorRGB.fromStrHex('#FFFFFF'), rev: ColorRGB.fromStrHex('#000000')},
};


// 6b8e23
let namedRGBColor:Array<{color: ColorRGB, rev: ColorRGB, name: string}> = [
{color: ColorRGB.fromStrHex('#000000'), rev: ColorRGB.fromStrHex('#FFFFFF'), name: 'Black'               },
{color: ColorRGB.fromStrHex('#000080'), rev: ColorRGB.fromStrHex('#FFFF7F'), name: 'Navy'                },
{color: ColorRGB.fromStrHex('#00008B'), rev: ColorRGB.fromStrHex('#FFFF74'), name: 'DarkBlue'            },
{color: ColorRGB.fromStrHex('#0000CD'), rev: ColorRGB.fromStrHex('#FFFF32'), name: 'MediumBlue'          },
{color: ColorRGB.fromStrHex('#0000FF'), rev: ColorRGB.fromStrHex('#FFFF00'), name: 'Blue'                },
{color: ColorRGB.fromStrHex('#006400'), rev: ColorRGB.fromStrHex('#FF9BFF'), name: 'DarkGreen'           },
{color: ColorRGB.fromStrHex('#008000'), rev: ColorRGB.fromStrHex('#FF7FFF'), name: 'Green'               },
{color: ColorRGB.fromStrHex('#008080'), rev: ColorRGB.fromStrHex('#FF7F7F'), name: 'Teal'                },
{color: ColorRGB.fromStrHex('#008B8B'), rev: ColorRGB.fromStrHex('#FF7474'), name: 'DarkCyan'            },
{color: ColorRGB.fromStrHex('#00BFFF'), rev: ColorRGB.fromStrHex('#FF4000'), name: 'DeepSkyBlue'         },
{color: ColorRGB.fromStrHex('#00CED1'), rev: ColorRGB.fromStrHex('#FF312E'), name: 'DarkTurquoise'       },
{color: ColorRGB.fromStrHex('#00FA9A'), rev: ColorRGB.fromStrHex('#FF0565'), name: 'MediumSpringGreen'   },
{color: ColorRGB.fromStrHex('#00FF00'), rev: ColorRGB.fromStrHex('#FF00FF'), name: 'Lime'                },
{color: ColorRGB.fromStrHex('#00FF7F'), rev: ColorRGB.fromStrHex('#FF0080'), name: 'SpringGreen'         },
{color: ColorRGB.fromStrHex('#00FFFF'), rev: ColorRGB.fromStrHex('#FF0000'), name: 'Aqua'                },
{color: ColorRGB.fromStrHex('#00FFFF'), rev: ColorRGB.fromStrHex('#FF0000'), name: 'Cyan'                },
{color: ColorRGB.fromStrHex('#191970'), rev: ColorRGB.fromStrHex('#E6E68F'), name: 'MidnightBlue'        },
{color: ColorRGB.fromStrHex('#1E90FF'), rev: ColorRGB.fromStrHex('#E16F00'), name: 'DodgerBlue'          },
{color: ColorRGB.fromStrHex('#20B2AA'), rev: ColorRGB.fromStrHex('#DF4D55'), name: 'LightSeaGreen'       },
{color: ColorRGB.fromStrHex('#228B22'), rev: ColorRGB.fromStrHex('#DD74DD'), name: 'ForestGreen'         },
{color: ColorRGB.fromStrHex('#2E8B57'), rev: ColorRGB.fromStrHex('#D174A8'), name: 'SeaGreen'            },
{color: ColorRGB.fromStrHex('#2F4F4F'), rev: ColorRGB.fromStrHex('#D0B0B0'), name: 'DarkSlateGray'       },
{color: ColorRGB.fromStrHex('#32CD32'), rev: ColorRGB.fromStrHex('#CD32CD'), name: 'LimeGreen'           },
{color: ColorRGB.fromStrHex('#3CB371'), rev: ColorRGB.fromStrHex('#C34C8E'), name: 'MediumSeaGreen'      },
{color: ColorRGB.fromStrHex('#40E0D0'), rev: ColorRGB.fromStrHex('#BF1F2F'), name: 'Turquoise'           },
{color: ColorRGB.fromStrHex('#4169E1'), rev: ColorRGB.fromStrHex('#BE961E'), name: 'RoyalBlue'           },
{color: ColorRGB.fromStrHex('#4682B4'), rev: ColorRGB.fromStrHex('#B97D4B'), name: 'SteelBlue'           },
{color: ColorRGB.fromStrHex('#483D8B'), rev: ColorRGB.fromStrHex('#B7C274'), name: 'DarkSlateBlue'       },
{color: ColorRGB.fromStrHex('#48D1CC'), rev: ColorRGB.fromStrHex('#B72E33'), name: 'MediumTurquoise'     },
{color: ColorRGB.fromStrHex('#4B0082'), rev: ColorRGB.fromStrHex('#B4FF7D'), name: 'Indigo'              },
{color: ColorRGB.fromStrHex('#556B2F'), rev: ColorRGB.fromStrHex('#AA94D0'), name: 'DarkOliveGreen'      },
{color: ColorRGB.fromStrHex('#5F9EA0'), rev: ColorRGB.fromStrHex('#A0615F'), name: 'CadetBlue'           },
{color: ColorRGB.fromStrHex('#6495ED'), rev: ColorRGB.fromStrHex('#9B6A12'), name: 'CornflowerBlue'      },
{color: ColorRGB.fromStrHex('#66CDAA'), rev: ColorRGB.fromStrHex('#993255'), name: 'MediumAquaMarine'    },
{color: ColorRGB.fromStrHex('#696969'), rev: ColorRGB.fromStrHex('#969696'), name: 'DimGray'             },
{color: ColorRGB.fromStrHex('#6A5ACD'), rev: ColorRGB.fromStrHex('#95A532'), name: 'SlateBlue'           },
{color: ColorRGB.fromStrHex('#6B8E23'), rev: ColorRGB.fromStrHex('#47238E'), name: 'OliveDrab'           },
{color: ColorRGB.fromStrHex('#708090'), rev: ColorRGB.fromStrHex('#908070'), name: 'SlateGray'           },
{color: ColorRGB.fromStrHex('#778899'), rev: ColorRGB.fromStrHex('#998877'), name: 'LightSlateGray'      },
{color: ColorRGB.fromStrHex('#7B68EE'), rev: ColorRGB.fromStrHex('#DAEE68'), name: 'MediumSlateBlue'     },
{color: ColorRGB.fromStrHex('#7CFC00'), rev: ColorRGB.fromStrHex('#8303FF'), name: 'LawnGreen'           },
{color: ColorRGB.fromStrHex('#7FFF00'), rev: ColorRGB.fromStrHex('#8000FF'), name: 'Chartreuse'          },
{color: ColorRGB.fromStrHex('#7FFFD4'), rev: ColorRGB.fromStrHex('#80002B'), name: 'Aquamarine'          },
{color: ColorRGB.fromStrHex('#800000'), rev: ColorRGB.fromStrHex('#7FFFFF'), name: 'Maroon'              },
{color: ColorRGB.fromStrHex('#800080'), rev: ColorRGB.fromStrHex('#7FFF7F'), name: 'Purple'              },
{color: ColorRGB.fromStrHex('#808000'), rev: ColorRGB.fromStrHex('#7F7FFF'), name: 'Olive'               },
{color: ColorRGB.fromStrHex('#808080'), rev: ColorRGB.fromStrHex('#B7DB70'), name: 'Gray'                },
{color: ColorRGB.fromStrHex('#87CEEB'), rev: ColorRGB.fromStrHex('#783114'), name: 'SkyBlue'             },
{color: ColorRGB.fromStrHex('#87CEFA'), rev: ColorRGB.fromStrHex('#783105'), name: 'LightSkyBlue'        },
{color: ColorRGB.fromStrHex('#8A2BE2'), rev: ColorRGB.fromStrHex('#75D41D'), name: 'BlueViolet'          },
{color: ColorRGB.fromStrHex('#8B0000'), rev: ColorRGB.fromStrHex('#74FFFF'), name: 'DarkRed'             },
{color: ColorRGB.fromStrHex('#8B008B'), rev: ColorRGB.fromStrHex('#74FF74'), name: 'DarkMagenta'         },
{color: ColorRGB.fromStrHex('#8B4513'), rev: ColorRGB.fromStrHex('#74BAEC'), name: 'SaddleBrown'         },
{color: ColorRGB.fromStrHex('#8FBC8F'), rev: ColorRGB.fromStrHex('#704370'), name: 'DarkSeaGreen'        },
{color: ColorRGB.fromStrHex('#90EE90'), rev: ColorRGB.fromStrHex('#6F116F'), name: 'LightGreen'          },
{color: ColorRGB.fromStrHex('#9370DB'), rev: ColorRGB.fromStrHex('#B7DB70'), name: 'MediumPurple'        },
{color: ColorRGB.fromStrHex('#9400D3'), rev: ColorRGB.fromStrHex('#6BFF2C'), name: 'DarkViolet'          },
{color: ColorRGB.fromStrHex('#98FB98'), rev: ColorRGB.fromStrHex('#670467'), name: 'PaleGreen'           },
{color: ColorRGB.fromStrHex('#9932CC'), rev: ColorRGB.fromStrHex('#66CD33'), name: 'DarkOrchid'          },
{color: ColorRGB.fromStrHex('#9ACD32'), rev: ColorRGB.fromStrHex('#6532CD'), name: 'YellowGreen'         },
{color: ColorRGB.fromStrHex('#A0522D'), rev: ColorRGB.fromStrHex('#5FADD2'), name: 'Sienna'              },
{color: ColorRGB.fromStrHex('#A52A2A'), rev: ColorRGB.fromStrHex('#5AD5D5'), name: 'Brown'               },
{color: ColorRGB.fromStrHex('#A9A9A9'), rev: ColorRGB.fromStrHex('#565656'), name: 'DarkGray'            },
{color: ColorRGB.fromStrHex('#ADD8E6'), rev: ColorRGB.fromStrHex('#522719'), name: 'LightBlue'           },
{color: ColorRGB.fromStrHex('#ADFF2F'), rev: ColorRGB.fromStrHex('#5200D0'), name: 'GreenYellow'         },
{color: ColorRGB.fromStrHex('#AFEEEE'), rev: ColorRGB.fromStrHex('#501111'), name: 'PaleTurquoise'       },
{color: ColorRGB.fromStrHex('#B0C4DE'), rev: ColorRGB.fromStrHex('#4F3B21'), name: 'LightSteelBlue'      },
{color: ColorRGB.fromStrHex('#B0E0E6'), rev: ColorRGB.fromStrHex('#4F1F19'), name: 'PowderBlue'          },
{color: ColorRGB.fromStrHex('#B22222'), rev: ColorRGB.fromStrHex('#4DDDDD'), name: 'FireBrick'           },
{color: ColorRGB.fromStrHex('#B8860B'), rev: ColorRGB.fromStrHex('#4779F4'), name: 'DarkGoldenRod'       },
{color: ColorRGB.fromStrHex('#BA55D3'), rev: ColorRGB.fromStrHex('#45AA2C'), name: 'MediumOrchid'        },
{color: ColorRGB.fromStrHex('#BC8F8F'), rev: ColorRGB.fromStrHex('#437070'), name: 'RosyBrown'           },
{color: ColorRGB.fromStrHex('#BDB76B'), rev: ColorRGB.fromStrHex('#424894'), name: 'DarkKhaki'           },
{color: ColorRGB.fromStrHex('#C0C0C0'), rev: ColorRGB.fromStrHex('#3F3F3F'), name: 'Silver'              },
{color: ColorRGB.fromStrHex('#C71585'), rev: ColorRGB.fromStrHex('#38EA7A'), name: 'MediumVioletRed'     },
{color: ColorRGB.fromStrHex('#CD5C5C'), rev: ColorRGB.fromStrHex('#32A3A3'), name: 'IndianRed'           },
{color: ColorRGB.fromStrHex('#CD853F'), rev: ColorRGB.fromStrHex('#327AC0'), name: 'Peru'                },
{color: ColorRGB.fromStrHex('#D2691E'), rev: ColorRGB.fromStrHex('#2D96E1'), name: 'Chocolate'           },
{color: ColorRGB.fromStrHex('#D2B48C'), rev: ColorRGB.fromStrHex('#2D4B73'), name: 'Tan'                 },
{color: ColorRGB.fromStrHex('#D3D3D3'), rev: ColorRGB.fromStrHex('#2C2C2C'), name: 'LightGray'           },
{color: ColorRGB.fromStrHex('#D8BFD8'), rev: ColorRGB.fromStrHex('#274027'), name: 'Thistle'             },
{color: ColorRGB.fromStrHex('#DA70D6'), rev: ColorRGB.fromStrHex('#258F29'), name: 'Orchid'              },
{color: ColorRGB.fromStrHex('#DAA520'), rev: ColorRGB.fromStrHex('#255ADF'), name: 'GoldenRod'           },
{color: ColorRGB.fromStrHex('#DB7093'), rev: ColorRGB.fromStrHex('#248F6C'), name: 'PaleVioletRed'       },
{color: ColorRGB.fromStrHex('#DC143C'), rev: ColorRGB.fromStrHex('#23EBC3'), name: 'Crimson'             },
{color: ColorRGB.fromStrHex('#DCDCDC'), rev: ColorRGB.fromStrHex('#232323'), name: 'Gainsboro'           },
{color: ColorRGB.fromStrHex('#DDA0DD'), rev: ColorRGB.fromStrHex('#225F22'), name: 'Plum'                },
{color: ColorRGB.fromStrHex('#DEB887'), rev: ColorRGB.fromStrHex('#214778'), name: 'BurlyWood'           },
{color: ColorRGB.fromStrHex('#E0FFFF'), rev: ColorRGB.fromStrHex('#1F0000'), name: 'LightCyan'           },
{color: ColorRGB.fromStrHex('#E6E6FA'), rev: ColorRGB.fromStrHex('#191905'), name: 'Lavender'            },
{color: ColorRGB.fromStrHex('#E9967A'), rev: ColorRGB.fromStrHex('#166985'), name: 'DarkSalmon'          },
{color: ColorRGB.fromStrHex('#EE82EE'), rev: ColorRGB.fromStrHex('#117D11'), name: 'Violet'              },
{color: ColorRGB.fromStrHex('#EEE8AA'), rev: ColorRGB.fromStrHex('#111755'), name: 'PaleGoldenRod'       },
{color: ColorRGB.fromStrHex('#F08080'), rev: ColorRGB.fromStrHex('#0F7F7F'), name: 'LightCoral'          },
{color: ColorRGB.fromStrHex('#F0E68C'), rev: ColorRGB.fromStrHex('#0F1973'), name: 'Khaki'               },
{color: ColorRGB.fromStrHex('#F0F8FF'), rev: ColorRGB.fromStrHex('#0F0700'), name: 'AliceBlue'           },
{color: ColorRGB.fromStrHex('#F0FFF0'), rev: ColorRGB.fromStrHex('#0F000F'), name: 'HoneyDew'            },
{color: ColorRGB.fromStrHex('#F0FFFF'), rev: ColorRGB.fromStrHex('#0F0000'), name: 'Azure'               },
{color: ColorRGB.fromStrHex('#F4A460'), rev: ColorRGB.fromStrHex('#0B5B9F'), name: 'SandyBrown'          },
{color: ColorRGB.fromStrHex('#F5DEB3'), rev: ColorRGB.fromStrHex('#0A214C'), name: 'Wheat'               },
{color: ColorRGB.fromStrHex('#F5F5DC'), rev: ColorRGB.fromStrHex('#0A0A23'), name: 'Beige'               },
{color: ColorRGB.fromStrHex('#F5F5F5'), rev: ColorRGB.fromStrHex('#0A0A0A'), name: 'WhiteSmoke'          },
{color: ColorRGB.fromStrHex('#F5FFFA'), rev: ColorRGB.fromStrHex('#0A0005'), name: 'MintCream'           },
{color: ColorRGB.fromStrHex('#F8F8FF'), rev: ColorRGB.fromStrHex('#070700'), name: 'GhostWhite'          },
{color: ColorRGB.fromStrHex('#FA8072'), rev: ColorRGB.fromStrHex('#057F8D'), name: 'Salmon'              },
{color: ColorRGB.fromStrHex('#FAEBD7'), rev: ColorRGB.fromStrHex('#051428'), name: 'AntiqueWhite'        },
{color: ColorRGB.fromStrHex('#FAF0E6'), rev: ColorRGB.fromStrHex('#050F19'), name: 'Linen'               },
{color: ColorRGB.fromStrHex('#FAFAD2'), rev: ColorRGB.fromStrHex('#05052D'), name: 'LightGoldenRodYellow'},
{color: ColorRGB.fromStrHex('#FDF5E6'), rev: ColorRGB.fromStrHex('#020A19'), name: 'OldLace'             },
{color: ColorRGB.fromStrHex('#FF0000'), rev: ColorRGB.fromStrHex('#00FFFF'), name: 'Red'                 },
{color: ColorRGB.fromStrHex('#FF00FF'), rev: ColorRGB.fromStrHex('#00FF00'), name: 'Fuchsia'             },
{color: ColorRGB.fromStrHex('#FF00FF'), rev: ColorRGB.fromStrHex('#00FF00'), name: 'Magenta'             },
{color: ColorRGB.fromStrHex('#FF1493'), rev: ColorRGB.fromStrHex('#00EB6C'), name: 'DeepPink'            },
{color: ColorRGB.fromStrHex('#FF4500'), rev: ColorRGB.fromStrHex('#00BAFF'), name: 'OrangeRed'           },
{color: ColorRGB.fromStrHex('#FF6347'), rev: ColorRGB.fromStrHex('#009CB8'), name: 'Tomato'              },
{color: ColorRGB.fromStrHex('#FF69B4'), rev: ColorRGB.fromStrHex('#00964B'), name: 'HotPink'             },
{color: ColorRGB.fromStrHex('#FF7F50'), rev: ColorRGB.fromStrHex('#0080AF'), name: 'Coral'               },
{color: ColorRGB.fromStrHex('#FF8C00'), rev: ColorRGB.fromStrHex('#0073FF'), name: 'DarkOrange'          },
{color: ColorRGB.fromStrHex('#FFA07A'), rev: ColorRGB.fromStrHex('#005F85'), name: 'LightSalmon'         },
{color: ColorRGB.fromStrHex('#FFA500'), rev: ColorRGB.fromStrHex('#005AFF'), name: 'Orange'              },
{color: ColorRGB.fromStrHex('#FFB6C1'), rev: ColorRGB.fromStrHex('#00493E'), name: 'LightPink'           },
{color: ColorRGB.fromStrHex('#FFC0CB'), rev: ColorRGB.fromStrHex('#003F34'), name: 'Pink'                },
{color: ColorRGB.fromStrHex('#FFD700'), rev: ColorRGB.fromStrHex('#0028FF'), name: 'Gold'                },
{color: ColorRGB.fromStrHex('#FFDAB9'), rev: ColorRGB.fromStrHex('#002546'), name: 'PeachPuff'           },
{color: ColorRGB.fromStrHex('#FFDEAD'), rev: ColorRGB.fromStrHex('#002152'), name: 'NavajoWhite'         },
{color: ColorRGB.fromStrHex('#FFE4B5'), rev: ColorRGB.fromStrHex('#001B4A'), name: 'Moccasin'            },
{color: ColorRGB.fromStrHex('#FFE4C4'), rev: ColorRGB.fromStrHex('#001B3B'), name: 'Bisque'              },
{color: ColorRGB.fromStrHex('#FFE4E1'), rev: ColorRGB.fromStrHex('#001B1E'), name: 'MistyRose'           },
{color: ColorRGB.fromStrHex('#FFEBCD'), rev: ColorRGB.fromStrHex('#001432'), name: 'BlanchedAlmond'      },
{color: ColorRGB.fromStrHex('#FFEFD5'), rev: ColorRGB.fromStrHex('#00102A'), name: 'PapayaWhip'          },
{color: ColorRGB.fromStrHex('#FFF0F5'), rev: ColorRGB.fromStrHex('#000F0A'), name: 'LavenderBlush'       },
{color: ColorRGB.fromStrHex('#FFF5EE'), rev: ColorRGB.fromStrHex('#000A11'), name: 'SeaShell'            },
{color: ColorRGB.fromStrHex('#FFF8DC'), rev: ColorRGB.fromStrHex('#000723'), name: 'Cornsilk'            },
{color: ColorRGB.fromStrHex('#FFFACD'), rev: ColorRGB.fromStrHex('#000532'), name: 'LemonChiffon'        },
{color: ColorRGB.fromStrHex('#FFFAF0'), rev: ColorRGB.fromStrHex('#00050F'), name: 'FloralWhite'         },
{color: ColorRGB.fromStrHex('#FFFAFA'), rev: ColorRGB.fromStrHex('#000505'), name: 'Snow'                },
{color: ColorRGB.fromStrHex('#FFFF00'), rev: ColorRGB.fromStrHex('#0000FF'), name: 'Yellow'              },
{color: ColorRGB.fromStrHex('#FFFFE0'), rev: ColorRGB.fromStrHex('#00001F'), name: 'LightYellow'         },
{color: ColorRGB.fromStrHex('#FFFFF0'), rev: ColorRGB.fromStrHex('#00000F'), name: 'Ivory'               },
{color: ColorRGB.fromStrHex('#FFFFFF'), rev: ColorRGB.fromStrHex('#000000'), name: 'White'               }];

for (let i = 0; i < namedRGBColor.length; i++) {
	let c1 = namedRGBColor[i].color;
	let c2 = namedRGBColor[i].rev;
	//
	//console.log(`%c${c1.toStrHex()}%c${c2.toStrHex()}%c${namedRGBColor[i].name}`, //
	//`color:${c2.toStrHex()}; background:${c1.toStrHex()}; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`, //
	//`color:${c1.toStrHex()}; background:${c2.toStrHex()}; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`, //
	//`color: Black          ; background: White          ; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`);
	//
	 let c3 = c2.toNameColor().color;
	 console.log(`%c${c1.toStrHex()}%c${c2.toStrHex()}%c${c3.toStrHex()}%c${namedRGBColor[i].name}`, //
	 `color:${c2.toStrHex()}; background:${c1.toStrHex()}; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`, //
	 `color:${c1.toStrHex()}; background:${c2.toStrHex()}; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`, //
	 `color:${c1.toStrHex()}; background:${c3.toStrHex()}; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`, //
	 `color: Black          ; background: White          ; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`);
}

//{

//	let rec = RGBColorMap.LemonChiffon;
//	let c1 = rec.color;
//	let c2 = rec.rev;
//	let c3 = c2.toName().color;
//	console.log(`%c${c2.toStrHex()}%c${c3.toStrHex()}`, //
//	`color:${c1.toStrHex()}; background:${c2.toStrHex()}; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`, //
//	`color:${c1.toStrHex()}; background:${c3.toStrHex()}; padding: 5px 7px; border-radius: 3px; font-weight: bold; font-size: 2.5em;`);

//}



export namespace SandTableUtils {


	/**
	 * 加载图片资源
	 * @param imageRecs 
	 * @param imgProxyUrl 
	 */
	export let loadImageResources = async (imageRecs: Array<ImageResource>, imgProxyUrl?: string): Promise<void> => {
		if (null != imageRecs && imageRecs.length > 0) {
			for (let i = 0; i < imageRecs.length; i++) {
				let imgElem: HTMLImageElement = new Image();
				let cc = imageRecs[i];
				await WebUtil.loadImageByProxy(imgElem, cc.url, {proxyUrl: imgProxyUrl});
				cc.imgElem = imgElem;
			}
		}
	} 

	//export let drawToken = (cvsCtx: CanvasRenderingContext2D, token :ICircleToken): void => {
	//		cvsCtx.save();
	//		cvsCtx.lineWidth = 0;
	//		// draw a circle
	//		cvsCtx.beginPath();
	//		cvsCtx.arc(token.c.x, token.c.y, token.radius, 0, Geo2DUtils.PI_DOUBLE, true);
	//		cvsCtx.fillStyle = token.color;
	//		cvsCtx.fill();
	//		// clip Image
	//		cvsCtx.beginPath();
	//		cvsCtx.arc(token.c.x, token.c.y, token.radius - 3, 0, Geo2DUtils.PI_DOUBLE, true);
	//		cvsCtx.clip();
	//		if (null != token.imgClip && null != token.imgClip.imageElem) {
	//			let dx = token.c.x - token.radius;
	//			let dy = token.c.y - token.radius;
	//			let dwidth = token.radius * 2;
	//			let dheight = dwidth;
	//			cvsCtx.drawImage(token.imgClip.imageElem, token.imgClip.sx, token.imgClip.sy,
	//				token.imgClip.width, token.imgClip.height, dx, dy, dwidth, dheight);
	//		}
	//		cvsCtx.restore();
	//}

	export let drawDarkScene = async (frame: ICanvasFrame, // 
		oriMap: HTMLImageElement, shadowStyle: string): Promise<HTMLImageElement> => // 
	{
		let width  = oriMap.width ;
		let height = oriMap.height;
		frame.ctx.clearRect(0, 0, width, height);
		frame.ctx.drawImage(oriMap, 0, 0, width, height, 0, 0, width, height);
		// 加上一层战争迷雾
		frame.ctx.fillStyle = shadowStyle
		frame.ctx.fillRect(0, 0, width, height);
		let darkMapData = frame.cvs.toDataURL('image/png', 1);
		let darkMapImage = new Image();
		darkMapImage.crossOrigin = 'Anonymous';
		await WebUtil.loadImageByProxy(darkMapImage, darkMapData);
		return darkMapImage;
	}



	export let drawBrightScene = async (frame: ICanvasFrame, // 
		oriMap: HTMLImageElement , drawItems: (frame: ICanvasFrame) => Promise<void> //
	): Promise<HTMLImageElement> => // 
	{
		let width  = oriMap.width ;
		let height = oriMap.height;
		frame.ctx.clearRect(0, 0, width, height);
		frame.ctx.drawImage(oriMap, 0, 0, width, height, 0, 0, width, height);

		// TODO: add other things
		await drawItems(frame);

		let brightMapData = frame.cvs.toDataURL('image/png', 1);
		let brightMapImage = new Image();
		brightMapImage.crossOrigin = 'Anonymous';
		await WebUtil.loadImageByProxy(brightMapImage, brightMapData);
		return brightMapImage;
	}

	export let drawScopeOfVisionOnDarkMap = async (frame: ICanvasFrame, // 
		darkMapImage: HTMLImageElement, brightMapImage: HTMLImageElement, //
		observer: IObserver, visiable: VisibilityType //
	): Promise<HTMLImageElement> => {
		let width  = darkMapImage.width ;
		let height = darkMapImage.height;
		frame.ctx.drawImage(darkMapImage, 0, 0, width, height, 0, 0, width, height);
		frame.ctx.save();
		frame.ctx.beginPath();
		frame.ctx.arc(observer.c.x, observer.c.y, observer.viewRange(visiable), 0, Math.PI * 2);
		frame.ctx.clip();
		frame.ctx.drawImage(brightMapImage, 0, 0, width, height, 0, 0, width, height);
		frame.ctx.restore();	
		let viewMapData = frame.cvs.toDataURL('image/png', 1);
		let viewMapImage = new Image();
		await WebUtil.loadImageByProxy(viewMapImage, viewMapData);
		return viewMapImage;
	}

	/**
	 * 加载地图
	 * 
	 * @param scene 场景
	 * @param oriMap 图片
	 */
	export let drawSceneWithUserView = async (scene: IScene, oriMap: HTMLImageElement, observer: IObserver): Promise<void> => {
		//
		scene.frame.buff.cvs.width  = scene.map.width ;
		scene.frame.buff.cvs.height = scene.map.height;
		scene.frame.buff.cvs.style.width  = `${scene.map.width }px`;
		scene.frame.buff.cvs.style.height = `${scene.map.height}px`;
		scene.frame.show.cvs.width  = scene.map.width ;
		scene.frame.show.cvs.height = scene.map.height;
		scene.frame.show.cvs.style.width  = `${scene.map.width }px`;
		scene.frame.show.cvs.style.height = `${scene.map.height}px`;
		// 
		let darkMapImage = await drawDarkScene(scene.frame.buff, oriMap, scene.map.shadowStyle); 
		let brightMapImage = await drawBrightScene(scene.frame.buff, oriMap, async (frame) => { //
			await TimeUtil.sleep(1000); 
		});
		let viewMapImage = await drawScopeOfVisionOnDarkMap(scene.frame.buff, darkMapImage, brightMapImage, observer, scene.visibility);
		// 显示到展示的画布上
		scene.frame.show.ctx.clearRect(0, 0, scene.map.width, scene.map.height);
		scene.frame.show.ctx.drawImage(viewMapImage, 0, 0, scene.map.width, scene.map.height, 0, 0, scene.map.width, scene.map.height);
	}




}