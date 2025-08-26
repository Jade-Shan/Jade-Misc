import { TimeUtil } from "./basic.js";
import { CanvasCircle2D, CanvasShape2D, ICanvas2D } from "./canvas.js";
import { Geo2DUtils, GeoShape2D, IPoint2D, Point2D } from "./geo2d.js";
import { ImageProxyConfig, WebUtil } from "./web.js";

export type VisibilityType = "default" | "glimmer" | "dark";

/* ======================
 * 序列化的记录
 * ======================= */
export interface ImageResource {
	type: "Image" | "Other",
	id: string,
	url: string,
}

/**
 * 从图片中截取一部分
 */
export interface ImageClip {
	imgKey: string, // 对应的图片ID
	sx: number,     // 左上角X
	sy: number,     // 左上角Y
	width: number,  // 宽度
	height: number, // 高度
	imageElem?: HTMLImageElement;
}

export interface ITokenRec {
	type: "Circle" | "Rectangle" | "Line",
	id: string,
	x: number,
	y: number,
	visiable: boolean,
	blockView: boolean,
	color: string,
}

export interface ICircleTokenRec extends ITokenRec {
	type: "Circle",
	radius: number,
	img: ImageClip,
}

export interface IRectangleTokenRec extends ITokenRec {
	type: "Rectangle",
	width: number,
	height: number,
	img: ImageClip,
}

export interface ILineTokenRec extends ITokenRec {
	type: "Line",
	x2: number,
	y2: number,
}

export interface ScenceData {
	username: string,
	loginToken: string,
	imgResources: Array<ImageResource>,
	mapDatas: {
		teams: Array<ICircleTokenRec>,
		creaters: Array<ICircleTokenRec>,
		furnishings: Array<IRectangleTokenRec>,
		doors: Array<IRectangleTokenRec>,
		walls: Array<ILineTokenRec>,
	}
}








export interface IObserver {
	pos: IPoint2D,
	viewRange: (type: VisibilityType) => number
}
export interface IToken2D extends CanvasShape2D {
	id: string,
	color: string,
	visiable: boolean,
	blockView: boolean

	toRecord(): ITokenRec;
}

export class CircleToken extends CanvasCircle2D implements IToken2D {
	id: string = "";
	color: string;
	visiable: boolean = true;
	blockView: boolean = true;
	imgClip: ImageClip;

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

	static fromRecord(rec: ICircleTokenRec): CircleToken {
		return new CircleToken(rec.id, rec.x, rec.y, rec.radius, 0, rec.color, rec.color, // 
			rec.visiable, rec.blockView, rec.color, rec.img);
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


export interface IRectangleTokenRec extends ITokenRec {
	type: "Rectangle",
	width: number,
	height: number,
}


export interface ILineTokenRec extends ITokenRec {
	type: "Line",
	x2: number,
	y2: number,
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
		pos: { x: 250, y: 300 },
		viewRange: (type: string) => { return 150; }
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

export namespace SandTableUtils {

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
		frame.ctx.arc(observer.pos.x, observer.pos.y, observer.viewRange(visiable), 0, Math.PI * 2);
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