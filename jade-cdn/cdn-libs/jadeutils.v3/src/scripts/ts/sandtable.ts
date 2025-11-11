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

	toName(): {color: ColorRGB, name: string} {
		let idx = 0;
		while ((idx + 1) < namedRGBColor.length) {
			if (this.r > namedRGBColor[idx + 1].color.r) { break; } else { idx++ }
		}
		while ((idx + 1) < namedRGBColor.length) {
			if (this.g > namedRGBColor[idx + 1].color.g) { break; } else { idx++ }
		}
		while ((idx + 1) < namedRGBColor.length) {
			if (this.b > namedRGBColor[idx + 1].color.b) { break; } else { idx++ }
		}
		return namedRGBColor[idx];
	}

}

let RGBColorMap = {
Black                : ColorRGB.fromStrHex('#000000'),
Navy                 : ColorRGB.fromStrHex('#000080'),
DarkBlue             : ColorRGB.fromStrHex('#00008B'),
MediumBlue           : ColorRGB.fromStrHex('#0000CD'),
Blue                 : ColorRGB.fromStrHex('#0000FF'),
DarkGreen            : ColorRGB.fromStrHex('#006400'),
Green                : ColorRGB.fromStrHex('#008000'),
Teal                 : ColorRGB.fromStrHex('#008080'),
DarkCyan             : ColorRGB.fromStrHex('#008B8B'),
DeepSkyBlue          : ColorRGB.fromStrHex('#00BFFF'),
DarkTurquoise        : ColorRGB.fromStrHex('#00CED1'),
MediumSpringGreen    : ColorRGB.fromStrHex('#00FA9A'),
Lime                 : ColorRGB.fromStrHex('#00FF00'),
SpringGreen          : ColorRGB.fromStrHex('#00FF7F'),
Aqua                 : ColorRGB.fromStrHex('#00FFFF'),
Cyan                 : ColorRGB.fromStrHex('#00FFFF'),
MidnightBlue         : ColorRGB.fromStrHex('#191970'),
DodgerBlue           : ColorRGB.fromStrHex('#1E90FF'),
LightSeaGreen        : ColorRGB.fromStrHex('#20B2AA'),
ForestGreen          : ColorRGB.fromStrHex('#228B22'),
SeaGreen             : ColorRGB.fromStrHex('#2E8B57'),
DarkSlateGray        : ColorRGB.fromStrHex('#2F4F4F'),
LimeGreen            : ColorRGB.fromStrHex('#32CD32'),
MediumSeaGreen       : ColorRGB.fromStrHex('#3CB371'),
Turquoise            : ColorRGB.fromStrHex('#40E0D0'),
RoyalBlue            : ColorRGB.fromStrHex('#4169E1'),
SteelBlue            : ColorRGB.fromStrHex('#4682B4'),
DarkSlateBlue        : ColorRGB.fromStrHex('#483D8B'),
MediumTurquoise      : ColorRGB.fromStrHex('#48D1CC'),
Indigo               : ColorRGB.fromStrHex('#4B0082'),
DarkOliveGreen       : ColorRGB.fromStrHex('#556B2F'),
CadetBlue            : ColorRGB.fromStrHex('#5F9EA0'),
CornflowerBlue       : ColorRGB.fromStrHex('#6495ED'),
MediumAquaMarine     : ColorRGB.fromStrHex('#66CDAA'),
DimGray              : ColorRGB.fromStrHex('#696969'),
SlateBlue            : ColorRGB.fromStrHex('#6A5ACD'),
OliveDrab            : ColorRGB.fromStrHex('#6B8E23'),
SlateGray            : ColorRGB.fromStrHex('#708090'),
LightSlateGray       : ColorRGB.fromStrHex('#778899'),
MediumSlateBlue      : ColorRGB.fromStrHex('#7B68EE'),
LawnGreen            : ColorRGB.fromStrHex('#7CFC00'),
Chartreuse           : ColorRGB.fromStrHex('#7FFF00'),
Aquamarine           : ColorRGB.fromStrHex('#7FFFD4'),
Maroon               : ColorRGB.fromStrHex('#800000'),
Purple               : ColorRGB.fromStrHex('#800080'),
Olive                : ColorRGB.fromStrHex('#808000'),
Gray                 : ColorRGB.fromStrHex('#808080'),
SkyBlue              : ColorRGB.fromStrHex('#87CEEB'),
LightSkyBlue         : ColorRGB.fromStrHex('#87CEFA'),
BlueViolet           : ColorRGB.fromStrHex('#8A2BE2'),
DarkRed              : ColorRGB.fromStrHex('#8B0000'),
DarkMagenta          : ColorRGB.fromStrHex('#8B008B'),
SaddleBrown          : ColorRGB.fromStrHex('#8B4513'),
DarkSeaGreen         : ColorRGB.fromStrHex('#8FBC8F'),
LightGreen           : ColorRGB.fromStrHex('#90EE90'),
MediumPurple         : ColorRGB.fromStrHex('#9370DB'),
DarkViolet           : ColorRGB.fromStrHex('#9400D3'),
PaleGreen            : ColorRGB.fromStrHex('#98FB98'),
DarkOrchid           : ColorRGB.fromStrHex('#9932CC'),
YellowGreen          : ColorRGB.fromStrHex('#9ACD32'),
Sienna               : ColorRGB.fromStrHex('#A0522D'),
Brown                : ColorRGB.fromStrHex('#A52A2A'),
DarkGray             : ColorRGB.fromStrHex('#A9A9A9'),
LightBlue            : ColorRGB.fromStrHex('#ADD8E6'),
GreenYellow          : ColorRGB.fromStrHex('#ADFF2F'),
PaleTurquoise        : ColorRGB.fromStrHex('#AFEEEE'),
LightSteelBlue       : ColorRGB.fromStrHex('#B0C4DE'),
PowderBlue           : ColorRGB.fromStrHex('#B0E0E6'),
FireBrick            : ColorRGB.fromStrHex('#B22222'),
DarkGoldenRod        : ColorRGB.fromStrHex('#B8860B'),
MediumOrchid         : ColorRGB.fromStrHex('#BA55D3'),
RosyBrown            : ColorRGB.fromStrHex('#BC8F8F'),
DarkKhaki            : ColorRGB.fromStrHex('#BDB76B'),
Silver               : ColorRGB.fromStrHex('#C0C0C0'),
MediumVioletRed      : ColorRGB.fromStrHex('#C71585'),
IndianRed            : ColorRGB.fromStrHex('#CD5C5C'),
Peru                 : ColorRGB.fromStrHex('#CD853F'),
Chocolate            : ColorRGB.fromStrHex('#D2691E'),
Tan                  : ColorRGB.fromStrHex('#D2B48C'),
LightGray            : ColorRGB.fromStrHex('#D3D3D3'),
Thistle              : ColorRGB.fromStrHex('#D8BFD8'),
Orchid               : ColorRGB.fromStrHex('#DA70D6'),
GoldenRod            : ColorRGB.fromStrHex('#DAA520'),
PaleVioletRed        : ColorRGB.fromStrHex('#DB7093'),
Crimson              : ColorRGB.fromStrHex('#DC143C'),
Gainsboro            : ColorRGB.fromStrHex('#DCDCDC'),
Plum                 : ColorRGB.fromStrHex('#DDA0DD'),
BurlyWood            : ColorRGB.fromStrHex('#DEB887'),
LightCyan            : ColorRGB.fromStrHex('#E0FFFF'),
Lavender             : ColorRGB.fromStrHex('#E6E6FA'),
DarkSalmon           : ColorRGB.fromStrHex('#E9967A'),
Violet               : ColorRGB.fromStrHex('#EE82EE'),
PaleGoldenRod        : ColorRGB.fromStrHex('#EEE8AA'),
LightCoral           : ColorRGB.fromStrHex('#F08080'),
Khaki                : ColorRGB.fromStrHex('#F0E68C'),
AliceBlue            : ColorRGB.fromStrHex('#F0F8FF'),
HoneyDew             : ColorRGB.fromStrHex('#F0FFF0'),
Azure                : ColorRGB.fromStrHex('#F0FFFF'),
SandyBrown           : ColorRGB.fromStrHex('#F4A460'),
Wheat                : ColorRGB.fromStrHex('#F5DEB3'),
Beige                : ColorRGB.fromStrHex('#F5F5DC'),
WhiteSmoke           : ColorRGB.fromStrHex('#F5F5F5'),
MintCream            : ColorRGB.fromStrHex('#F5FFFA'),
GhostWhite           : ColorRGB.fromStrHex('#F8F8FF'),
Salmon               : ColorRGB.fromStrHex('#FA8072'),
AntiqueWhite         : ColorRGB.fromStrHex('#FAEBD7'),
Linen                : ColorRGB.fromStrHex('#FAF0E6'),
LightGoldenRodYellow : ColorRGB.fromStrHex('#FAFAD2'),
OldLace              : ColorRGB.fromStrHex('#FDF5E6'),
Red                  : ColorRGB.fromStrHex('#FF0000'),
Fuchsia              : ColorRGB.fromStrHex('#FF00FF'),
Magenta              : ColorRGB.fromStrHex('#FF00FF'),
DeepPink             : ColorRGB.fromStrHex('#FF1493'),
OrangeRed            : ColorRGB.fromStrHex('#FF4500'),
Tomato               : ColorRGB.fromStrHex('#FF6347'),
HotPink              : ColorRGB.fromStrHex('#FF69B4'),
Coral                : ColorRGB.fromStrHex('#FF7F50'),
DarkOrange           : ColorRGB.fromStrHex('#FF8C00'),
LightSalmon          : ColorRGB.fromStrHex('#FFA07A'),
Orange               : ColorRGB.fromStrHex('#FFA500'),
LightPink            : ColorRGB.fromStrHex('#FFB6C1'),
Pink                 : ColorRGB.fromStrHex('#FFC0CB'),
Gold                 : ColorRGB.fromStrHex('#FFD700'),
PeachPuff            : ColorRGB.fromStrHex('#FFDAB9'),
NavajoWhite          : ColorRGB.fromStrHex('#FFDEAD'),
Moccasin             : ColorRGB.fromStrHex('#FFE4B5'),
Bisque               : ColorRGB.fromStrHex('#FFE4C4'),
MistyRose            : ColorRGB.fromStrHex('#FFE4E1'),
BlanchedAlmond       : ColorRGB.fromStrHex('#FFEBCD'),
PapayaWhip           : ColorRGB.fromStrHex('#FFEFD5'),
LavenderBlush        : ColorRGB.fromStrHex('#FFF0F5'),
SeaShell             : ColorRGB.fromStrHex('#FFF5EE'),
Cornsilk             : ColorRGB.fromStrHex('#FFF8DC'),
LemonChiffon         : ColorRGB.fromStrHex('#FFFACD'),
FloralWhite          : ColorRGB.fromStrHex('#FFFAF0'),
Snow                 : ColorRGB.fromStrHex('#FFFAFA'),
Yellow               : ColorRGB.fromStrHex('#FFFF00'),
LightYellow          : ColorRGB.fromStrHex('#FFFFE0'),
Ivory                : ColorRGB.fromStrHex('#FFFFF0'),
White                : ColorRGB.fromStrHex('#FFFFFF'),
};

let namedRGBColor:Array<{color: ColorRGB, name: string}> = []; 
namedRGBColor.push({color: ColorRGB.fromStrHex('#000000'), name: 'Black'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#000080'), name: 'Navy'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00008B'), name: 'DarkBlue'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#0000CD'), name: 'MediumBlue'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#0000FF'), name: 'Blue'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#006400'), name: 'DarkGreen'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#008000'), name: 'Green'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#008080'), name: 'Teal'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#008B8B'), name: 'DarkCyan'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00BFFF'), name: 'DeepSkyBlue'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00CED1'), name: 'DarkTurquoise'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00FA9A'), name: 'MediumSpringGreen'   });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00FF00'), name: 'Lime'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00FF7F'), name: 'SpringGreen'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00FFFF'), name: 'Aqua'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#00FFFF'), name: 'Cyan'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#191970'), name: 'MidnightBlue'        });
namedRGBColor.push({color: ColorRGB.fromStrHex('#1E90FF'), name: 'DodgerBlue'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#20B2AA'), name: 'LightSeaGreen'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#228B22'), name: 'ForestGreen'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#2E8B57'), name: 'SeaGreen'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#2F4F4F'), name: 'DarkSlateGray'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#32CD32'), name: 'LimeGreen'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#3CB371'), name: 'MediumSeaGreen'      });
namedRGBColor.push({color: ColorRGB.fromStrHex('#40E0D0'), name: 'Turquoise'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#4169E1'), name: 'RoyalBlue'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#4682B4'), name: 'SteelBlue'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#483D8B'), name: 'DarkSlateBlue'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#48D1CC'), name: 'MediumTurquoise'     });
namedRGBColor.push({color: ColorRGB.fromStrHex('#4B0082'), name: 'Indigo'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#556B2F'), name: 'DarkOliveGreen'      });
namedRGBColor.push({color: ColorRGB.fromStrHex('#5F9EA0'), name: 'CadetBlue'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#6495ED'), name: 'CornflowerBlue'      });
namedRGBColor.push({color: ColorRGB.fromStrHex('#66CDAA'), name: 'MediumAquaMarine'    });
namedRGBColor.push({color: ColorRGB.fromStrHex('#696969'), name: 'DimGray'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#6A5ACD'), name: 'SlateBlue'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#6B8E23'), name: 'OliveDrab'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#708090'), name: 'SlateGray'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#778899'), name: 'LightSlateGray'      });
namedRGBColor.push({color: ColorRGB.fromStrHex('#7B68EE'), name: 'MediumSlateBlue'     });
namedRGBColor.push({color: ColorRGB.fromStrHex('#7CFC00'), name: 'LawnGreen'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#7FFF00'), name: 'Chartreuse'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#7FFFD4'), name: 'Aquamarine'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#800000'), name: 'Maroon'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#800080'), name: 'Purple'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#808000'), name: 'Olive'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#808080'), name: 'Gray'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#87CEEB'), name: 'SkyBlue'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#87CEFA'), name: 'LightSkyBlue'        });
namedRGBColor.push({color: ColorRGB.fromStrHex('#8A2BE2'), name: 'BlueViolet'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#8B0000'), name: 'DarkRed'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#8B008B'), name: 'DarkMagenta'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#8B4513'), name: 'SaddleBrown'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#8FBC8F'), name: 'DarkSeaGreen'        });
namedRGBColor.push({color: ColorRGB.fromStrHex('#90EE90'), name: 'LightGreen'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#9370DB'), name: 'MediumPurple'        });
namedRGBColor.push({color: ColorRGB.fromStrHex('#9400D3'), name: 'DarkViolet'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#98FB98'), name: 'PaleGreen'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#9932CC'), name: 'DarkOrchid'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#9ACD32'), name: 'YellowGreen'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#A0522D'), name: 'Sienna'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#A52A2A'), name: 'Brown'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#A9A9A9'), name: 'DarkGray'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#ADD8E6'), name: 'LightBlue'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#ADFF2F'), name: 'GreenYellow'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#AFEEEE'), name: 'PaleTurquoise'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#B0C4DE'), name: 'LightSteelBlue'      });
namedRGBColor.push({color: ColorRGB.fromStrHex('#B0E0E6'), name: 'PowderBlue'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#B22222'), name: 'FireBrick'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#B8860B'), name: 'DarkGoldenRod'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#BA55D3'), name: 'MediumOrchid'        });
namedRGBColor.push({color: ColorRGB.fromStrHex('#BC8F8F'), name: 'RosyBrown'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#BDB76B'), name: 'DarkKhaki'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#C0C0C0'), name: 'Silver'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#C71585'), name: 'MediumVioletRed'     });
namedRGBColor.push({color: ColorRGB.fromStrHex('#CD5C5C'), name: 'IndianRed'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#CD853F'), name: 'Peru'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#D2691E'), name: 'Chocolate'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#D2B48C'), name: 'Tan'                 });
namedRGBColor.push({color: ColorRGB.fromStrHex('#D3D3D3'), name: 'LightGray'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#D8BFD8'), name: 'Thistle'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#DA70D6'), name: 'Orchid'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#DAA520'), name: 'GoldenRod'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#DB7093'), name: 'PaleVioletRed'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#DC143C'), name: 'Crimson'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#DCDCDC'), name: 'Gainsboro'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#DDA0DD'), name: 'Plum'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#DEB887'), name: 'BurlyWood'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#E0FFFF'), name: 'LightCyan'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#E6E6FA'), name: 'Lavender'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#E9967A'), name: 'DarkSalmon'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#EE82EE'), name: 'Violet'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#EEE8AA'), name: 'PaleGoldenRod'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F08080'), name: 'LightCoral'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F0E68C'), name: 'Khaki'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F0F8FF'), name: 'AliceBlue'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F0FFF0'), name: 'HoneyDew'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F0FFFF'), name: 'Azure'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F4A460'), name: 'SandyBrown'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F5DEB3'), name: 'Wheat'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F5F5DC'), name: 'Beige'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F5F5F5'), name: 'WhiteSmoke'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F5FFFA'), name: 'MintCream'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#F8F8FF'), name: 'GhostWhite'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FA8072'), name: 'Salmon'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FAEBD7'), name: 'AntiqueWhite'        });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FAF0E6'), name: 'Linen'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FAFAD2'), name: 'LightGoldenRodYellow'});
namedRGBColor.push({color: ColorRGB.fromStrHex('#FDF5E6'), name: 'OldLace'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF0000'), name: 'Red'                 });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF00FF'), name: 'Fuchsia'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF00FF'), name: 'Magenta'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF1493'), name: 'DeepPink'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF4500'), name: 'OrangeRed'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF6347'), name: 'Tomato'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF69B4'), name: 'HotPink'             });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF7F50'), name: 'Coral'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FF8C00'), name: 'DarkOrange'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFA07A'), name: 'LightSalmon'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFA500'), name: 'Orange'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFB6C1'), name: 'LightPink'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFC0CB'), name: 'Pink'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFD700'), name: 'Gold'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFDAB9'), name: 'PeachPuff'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFDEAD'), name: 'NavajoWhite'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFE4B5'), name: 'Moccasin'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFE4C4'), name: 'Bisque'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFE4E1'), name: 'MistyRose'           });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFEBCD'), name: 'BlanchedAlmond'      });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFEFD5'), name: 'PapayaWhip'          });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFF0F5'), name: 'LavenderBlush'       });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFF5EE'), name: 'SeaShell'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFF8DC'), name: 'Cornsilk'            });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFFACD'), name: 'LemonChiffon'        });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFFAF0'), name: 'FloralWhite'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFFAFA'), name: 'Snow'                });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFFF00'), name: 'Yellow'              });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFFFE0'), name: 'LightYellow'         });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFFFF0'), name: 'Ivory'               });
namedRGBColor.push({color: ColorRGB.fromStrHex('#FFFFFF'), name: 'White'               });

export namespace SandTableUtils {

	export let colorToRgbNum = (str: string): {r:number, g: number, b: number}  => {
		let result = {r: 0, g:0, b:0};
		if (str.length > 6) {

		}

		return result;
	}

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