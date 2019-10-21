import IPainterAPI from '../types/IPainterAPI';
import Vector2D from '../types/utility/Vector2D';
import Line, { LineDefaults } from '../types/shapes/Line';
import Rectangle, { RectangleDefaults } from '../types/shapes/Rectangle';
import Circle from '../types/shapes/Circle';
import fillDefaults from '../utility/fill-defaults';
import {
	getCanvasRect,
	lineCollidesWithRect,
	vector,
	rectCollidesWithRect,
} from '../utility/shapes-util';

export default class PainterAPI implements IPainterAPI {
	private panOffset: Vector2D;
	private scale: number;
	private context2d: CanvasRenderingContext2D;
	private imageCache: Record<string, HTMLImageElement>;

	constructor(context2d: CanvasRenderingContext2D, panOffset: Vector2D, scale: number) {
		this.context2d = context2d;
		this.panOffset = panOffset;
		this.scale = scale;
		this.imageCache = {};
	}

	/* INTERFACE METHODS */

	setPan = (pan: Vector2D): void => {
		this.panOffset = pan;
	};

	setScale = (scale: number): void => {
		this.scale = scale;
	};

	clearCanvas = (): void => {
		this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height);
	};

	setContext2D = (context: CanvasRenderingContext2D): void => {
		this.context2d = context;
	};

	drawLine = (arg: Line): void => {
		const line = fillDefaults(arg, LineDefaults);

		const point1 = this.toAbsolutePoint(line.point1);
		const point2 = this.toAbsolutePoint(line.point2);

		// Only draw if it is visible
		if (this.lineIntersectsCanvas({ point1, point2 })) {
			this.context2d.beginPath();
			this.context2d.moveTo(point1.x, point1.y);
			this.context2d.lineTo(point2.x, point2.y);
			this.context2d.strokeStyle = line.strokeColor;
			this.context2d.lineWidth = line.strokeWeight;
			this.context2d.stroke();
		}
	};

	drawImage = (topLeftCorner: Vector2D, imageUrl: string): void => {
		const image = this.imageCache[imageUrl] || new Image();

		if (!image.complete) {
			image.onload = (): void => {
				this.doDrawImage(topLeftCorner, image);
			};
		} else {
			this.doDrawImage(topLeftCorner, image);
		}

		if (!this.imageCache[imageUrl]) {
			image.src = imageUrl;
			this.imageCache[imageUrl] = image;
		}
	};

	drawRect = (rectParam: Rectangle): void => {
		const rect = fillDefaults(rectParam, RectangleDefaults);
		console.log(rect);
	};

	drawCircle = (circle: Circle): void => {
		console.log(circle);
	};

	/* UTILITY METHODS */

	private toAbsolutePoint = (point: Vector2D): Vector2D => {
		const absolutePoint: Vector2D = {
			x: point.x * this.scale,
			y: point.y * this.scale,
		};

		const absolutePan: Vector2D = {
			x: this.panOffset.x * this.scale,
			y: this.panOffset.y * this.scale,
		};

		absolutePoint.x -= absolutePan.x;
		absolutePoint.y -= absolutePan.y;

		return absolutePoint;
	};

	private lineIntersectsCanvas = (line: Line): boolean => {
		const canvasRect = getCanvasRect(this.context2d);
		return lineCollidesWithRect(line, canvasRect);
	};

	private doDrawImage = (topLeftCorner: Vector2D, image: HTMLImageElement): void => {
		const { x, y } = this.toAbsolutePoint(topLeftCorner);
		const { width, height } = image;
		const absWidth = width * this.scale;
		const absHeight = height * this.scale;

		const imageRect: Rectangle = {
			topLeftCorner: vector(x, y),
			width: absWidth,
			height: absHeight,
		};

		const canvasRect = getCanvasRect(this.context2d);

		if (rectCollidesWithRect(imageRect, canvasRect)) {
			this.context2d.drawImage(image, x, y, absWidth, absHeight);
		}
	};
}
