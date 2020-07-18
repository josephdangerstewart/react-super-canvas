import IPainterAPI from '../types/IPainterAPI';
import Vector2D from '../types/utility/Vector2D';
import Line, { LineDefaults } from '../types/shapes/Line';
import Rectangle, { RectangleDefaults } from '../types/shapes/Rectangle';
import Circle, { CircleDefaults } from '../types/shapes/Circle';
import fillDefaults from '../utility/fill-defaults';
import {
	getCanvasRect,
	lineCollidesWithRect,
	vector,
	rectCollidesWithRect,
	circleCollidesWithRect,
	polygonCollidesWithRect,
	boundingRectOfCircle,
	boundingRectOfPolygon,
} from '../utility/shapes-util';
import Polygon, { PolygonDefaults } from '../types/shapes/Polygon';
import StyledShape from '../types/shapes/StyledShape';
import { IImageCache } from '../types/IImageCache';
import { Renderable, RenderOpType } from '../types/Renderable';

export default class PainterAPI implements IPainterAPI {
	private panOffset: Vector2D;
	private scale: number;
	private context2d: CanvasRenderingContext2D;
	private imageCache: IImageCache;
	private cursor: string;

	constructor(context2d: CanvasRenderingContext2D, panOffset: Vector2D, scale: number, imageCache: IImageCache) {
		this.context2d = context2d;
		this.panOffset = panOffset;
		this.scale = scale;
		this.cursor = null;
		this.imageCache = imageCache;
	}

	/* INTERFACE METHODS */

	drawLine = (arg: Line): void => {
		const line = fillDefaults(arg, LineDefaults);

		const canvasRect = this.getViewport();

		// Only draw if it is visible
		if (lineCollidesWithRect(line, canvasRect)) {
			const point1 = this.toAbsolutePoint(line.point1);
			const point2 = this.toAbsolutePoint(line.point2);

			this.context2d.beginPath();
			this.context2d.moveTo(point1.x, point1.y);
			this.context2d.lineTo(point2.x, point2.y);
			this.context2d.strokeStyle = line.strokeColor;
			this.context2d.lineWidth = line.strokeWeight;
			this.context2d.closePath();
			this.context2d.stroke();
		}
	};

	drawImage = (topLeftCorner: Vector2D, imageUrl: string, scale?: Vector2D, opacity?: number): void => {
		this.imageCache.withCachedImage(imageUrl, (image) => {
			this.doDrawImage(topLeftCorner, image, scale, opacity);
		});
	};

	drawPolygon = (polygonParam: Polygon): void => {
		const polygon = fillDefaults(polygonParam, PolygonDefaults);

		if (polygon.points.length < 2) {
			return;
		}

		const canvasRect = this.getViewport();
		if (polygonCollidesWithRect(polygon, canvasRect)) {
			const [ firstPoint, ...restOfPoints ] = polygon.points.map(this.toAbsolutePoint);
			const { x: firstX, y: firstY } = firstPoint;

			this.context2d.beginPath();
			this.context2d.moveTo(firstX, firstY);

			restOfPoints.forEach((point) => {
				const { x, y } = point;
				this.context2d.lineTo(x, y);
			});
			this.context2d.lineTo(firstX, firstY);

			this.context2d.closePath();
			this.drawWithStyles(polygon, boundingRectOfPolygon(polygon));
		}
	};

	drawRect = (rectParam: Rectangle): void => {
		this.context2d.save();
		const rect = fillDefaults(rectParam, RectangleDefaults);

		const { x, y } = this.toAbsolutePoint(rect.topLeftCorner);
		const { width, height } = rect;
		const canvasRect = this.getViewport();

		if (rectCollidesWithRect(rect, canvasRect)) {
			this.context2d.beginPath();

			this.context2d.rect(x, y, width * this.scale, height * this.scale);
			this.context2d.closePath();

			this.drawWithStyles(rect, rect);
		}

		this.context2d.restore();
	};

	drawCircle = (circleParam: Circle): void => {
		const circle = fillDefaults(circleParam, CircleDefaults);

		const { x, y } = this.toAbsolutePoint(circle.center);
		const { radius } = circle;
		const canvasRect = this.getViewport();

		if (circleCollidesWithRect(circle, canvasRect)) {
			this.context2d.beginPath();
			this.context2d.arc(x, y, Math.abs(radius) * this.scale, 0, Math.PI * 2);
			this.context2d.closePath();
			this.drawWithStyles(circle, boundingRectOfCircle(circle));
		}
	};

	drawRenderable = (renderable: Renderable): void => {
		renderable.ops.forEach((op) => {
			switch (op.type) {
				case RenderOpType.Circle:
					this.drawCircle(op.circle);
					break;
				case RenderOpType.Image:
					this.drawImage(op.image.topLeftCorner, op.image.imageUrl, op.image.scale, op.image.opacity);
					break;
				case RenderOpType.Line:
					this.drawLine(op.line);
					break;
				case RenderOpType.Polygon:
					this.drawPolygon(op.polygon);
					break;
				case RenderOpType.Rectangle:
					this.drawRect(op.rect);
					break;
				default:
					break;
			}
		});
	};

	/* PUBLIC METHODS */

	beginCursorState = (): void => {
		this.cursor = null;
	};

	endCursorState = (): void => {
		if (this.cursor) {
			this.context2d.canvas.style.cursor = this.cursor;
		} else {
			this.context2d.canvas.style.cursor = 'default';
		}

		this.cursor = null;
	};

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
		context.translate(0.5, 0.5);
	};

	setCursor = (cursor: string): void => {
		this.cursor = cursor;
	};

	/* UTILITY METHODS */

	private getViewport = (): Rectangle => {
		const canvasRect = getCanvasRect(this.context2d);

		return {
			topLeftCorner: this.toVirtualPoint(canvasRect.topLeftCorner),
			width: canvasRect.width / this.scale,
			height: canvasRect.height / this.scale,
		};
	};

	private drawWithStyles = (styles: StyledShape, boundingRect: Rectangle): void => {
		this.context2d.strokeStyle = styles.strokeColor;
		this.context2d.lineWidth = styles.strokeWeight;

		if (styles.fillColor) {
			this.context2d.fillStyle = styles.fillColor;
			this.context2d.fill();
		} else if (styles.fillImageUrl) {
			this.imageCache.withCachedImage(styles.fillImageUrl, (_, repeating) => {
				if (!repeating) {
					return;
				}

				const { x, y } = this.toAbsolutePoint(boundingRect.topLeftCorner);
				repeating.setTransform(new DOMMatrix().translate(x, y).scale(this.scale, this.scale));
				this.context2d.fillStyle = repeating;
				this.context2d.fill();
				this.context2d.stroke();
			}, () => {
				this.context2d.fill();
				this.context2d.stroke();
			});

			return;
		}

		this.context2d.stroke();
	};

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

	private toVirtualPoint = (point: Vector2D): Vector2D => {
		const virtualPoint: Vector2D = {
			x: point.x / this.scale,
			y: point.y / this.scale,
		};

		const virtualPan: Vector2D = {
			x: this.panOffset.x,
			y: this.panOffset.y,
		};

		virtualPoint.x += virtualPan.x;
		virtualPoint.y += virtualPan.y;

		return virtualPoint;
	};

	private doDrawImage = (topLeftCorner: Vector2D, image: HTMLImageElement, scale?: Vector2D, opacity?: number): void => {
		const safeScale = scale || vector(1, 1);

		const { x, y } = this.toAbsolutePoint(topLeftCorner);
		const { width, height } = image;
		const absWidth = width * this.scale * safeScale.x;
		const absHeight = height * this.scale * safeScale.y;

		const imageRect: Rectangle = {
			topLeftCorner,
			width: width * safeScale.x,
			height: height * safeScale.y,
		};

		const canvasRect = this.getViewport();

		if (rectCollidesWithRect(imageRect, canvasRect)) {
			const oldOpacity = this.context2d.globalAlpha;
			this.context2d.globalAlpha = opacity || oldOpacity;
			this.context2d.drawImage(image, x, y, absWidth, absHeight);
			this.context2d.globalAlpha = oldOpacity;
		}
	};
}
