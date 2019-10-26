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
import CachedImage from '../types/utility/CachedImage';
import Polygon, { PolygonDefaults } from '../types/shapes/Polygon';
import StyledShape from '../types/shapes/StyledShape';
import { WithCachedImageCallback, OnImageUnprocessedCallback } from '../types/callbacks/WithCachedImageCallback';

export default class PainterAPI implements IPainterAPI {
	private panOffset: Vector2D;
	private scale: number;
	private context2d: CanvasRenderingContext2D;
	private imageCache: Record<string, CachedImage>;

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
		context.translate(0.5, 0.5);
	};

	drawLine = (arg: Line): void => {
		const line = fillDefaults(arg, LineDefaults);

		const point1 = this.toAbsolutePoint(line.point1);
		const point2 = this.toAbsolutePoint(line.point2);

		// Only draw if it is visible
		if (this.lineIntersectsCanvas({ point1, point2 })) {
			this.context2d.save();
			this.context2d.beginPath();
			this.context2d.moveTo(point1.x, point1.y);
			this.context2d.lineTo(point2.x, point2.y);
			this.context2d.strokeStyle = line.strokeColor;
			this.context2d.lineWidth = line.strokeWeight;
			this.context2d.stroke();
			this.context2d.restore();
		}
	};

	drawImage = (topLeftCorner: Vector2D, imageUrl: string): void => {
		this.withCachedImage(imageUrl, (image) => {
			this.context2d.save();
			this.doDrawImage(topLeftCorner, image);
			this.context2d.restore();
		});
	};

	cleanImageCache = (timeout: number): void => {
		const now = new Date();
		Object.keys(this.imageCache).forEach((key) => {
			if (+now - +this.imageCache[key].lastAccessed > timeout) {
				this.imageCache[key] = null;
			}
		});
	};

	drawPolygon = (polygonParam: Polygon): void => {
		this.context2d.save();
		const polygon = fillDefaults(polygonParam, PolygonDefaults);

		if (polygon.points.length < 2) {
			return;
		}

		const canvasRect = getCanvasRect(this.context2d);
		if (polygonCollidesWithRect(polygon, canvasRect)) {
			const [ firstPoint, ...restOfPoints ] = polygon.points.map(this.toAbsolutePoint);
			const { x: firstX, y: firstY } = firstPoint;

			this.context2d.moveTo(firstX, firstY);

			restOfPoints.forEach((point) => {
				const { x, y } = point;
				this.context2d.lineTo(x, y);
			});

			this.drawWithStyles(polygon, boundingRectOfPolygon(polygon));
		}
		this.context2d.restore();
	};

	drawRect = (rectParam: Rectangle): void => {
		this.context2d.save();
		const rect = fillDefaults(rectParam, RectangleDefaults);

		const { x, y } = this.toAbsolutePoint(rect.topLeftCorner);
		const { width, height } = rect;
		const canvasRect = getCanvasRect(this.context2d);

		if (rectCollidesWithRect(rect, canvasRect)) {
			this.context2d.rect(x, y, width * this.scale, height * this.scale);
			this.drawWithStyles(rect, rect);
		}
		this.context2d.restore();
	};

	drawCircle = (circleParam: Circle): void => {
		const circle = fillDefaults(circleParam, CircleDefaults);

		const { x, y } = this.toAbsolutePoint(circle.center);
		const { radius } = circle;
		const canvasRect = getCanvasRect(this.context2d);

		if (circleCollidesWithRect(circle, canvasRect)) {
			this.context2d.save();
			this.context2d.beginPath();
			this.context2d.arc(x, y, radius * this.scale, 0, Math.PI * 2);
			this.drawWithStyles(circle, boundingRectOfCircle(circle));
			this.context2d.restore();
		}
	};

	/* UTILITY METHODS */

	private drawWithStyles = (styles: StyledShape, boundingRect: Rectangle): void => {
		this.context2d.strokeStyle = styles.strokeColor;
		this.context2d.lineWidth = styles.strokeWeight;

		if (styles.fillColor) {
			this.context2d.fillStyle = styles.fillColor;
			this.context2d.fill();
		} else if (styles.fillImageUrl) {
			this.withCachedImage(styles.fillImageUrl, (image, repeating) => {
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

	private withCachedImage = (imageUrl: string, callback: WithCachedImageCallback, onImageUnprocessed?: OnImageUnprocessedCallback): boolean => {
		const cachedImage = this.imageCache[imageUrl];
		const image = cachedImage ? cachedImage.image : new Image();

		if (!image.complete) {
			// Do not handle context sensitive code asynchronously
			// we don't want consumers drawing the canvas whenever their image happens to load
			// So don't call the callback in onload
			image.onload = (): void => {
				cachedImage.repeating = this.context2d.createPattern(image, 'repeat');
			};

			if (onImageUnprocessed) {
				onImageUnprocessed();
			}
		} else {
			callback(image, cachedImage && cachedImage.repeating);
		}

		// Still cache the image though no matter what
		if (!cachedImage) {
			image.src = imageUrl;
			this.imageCache[imageUrl] = {
				image,
				lastAccessed: new Date(),
				repeating: null,
			};
		} else {
			this.imageCache[imageUrl].lastAccessed = new Date();
		}

		return image.complete;
	};
}
