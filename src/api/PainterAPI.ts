import IPainterAPI from '../types/IPainterAPI';
import Vector2D from '../types/utility/Vector2D';
import Line, { LineDefaults } from '../types/shapes/Line';
import Rectangle from '../types/shapes/Rectangle';
import Circle from '../types/shapes/Circle';
import fillDefaults from '../utility/fill-defaults';
import { getCanvasRect, lineCollidesWithRect } from '../utility/shapes-util';

export default class PainterAPI implements IPainterAPI {
	panOffset: Vector2D;
	scale: number;
	context2d: CanvasRenderingContext2D;

	/* INTERFACE METHODS */

	setPan = (pan: Vector2D): void => {
		this.panOffset = pan;
	};

	setScale = (scale: number): void => {
		this.scale = scale;
	};

	clearCanvas = (canvasSize: Vector2D): void => {
		this.context2d.clearRect(0, 0, canvasSize.x, canvasSize.y);
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
		console.log(topLeftCorner, imageUrl);
	};

	drawRect = (rect: Rectangle): void => {
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
}
