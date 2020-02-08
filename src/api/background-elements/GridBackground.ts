import IBackgroundElement from '../../types/IBackgroundElement';
import Vector2D from '../../types/utility/Vector2D';
import IPainterAPI from '../../types/IPainterAPI';
import BackgroundElementContext from '../../types/context/BackgroundElementContext';
import Line from '../../types/shapes/Line';
import { vector } from '../../utility/shapes-util';

export default class GridBackground implements IBackgroundElement {
	private pixelsPerUnit: number;

	constructor(pixelsPerUnit: number) {
		this.pixelsPerUnit = pixelsPerUnit || 10;
	}

	mapMouseCoordinates = (mousePos: Vector2D): Vector2D => ({
		x: this.snapOnAxis(mousePos.x),
		y: this.snapOnAxis(mousePos.y),
	});

	renderBackground = (painter: IPainterAPI, canvasContext: CanvasRenderingContext2D, context: BackgroundElementContext): void => {
		const { scale } = context;
		const snappedTopLeftCorner = this.mapMouseCoordinates(context.virtualTopLeftCorner);

		const scaledHeight = canvasContext.canvas.height / scale;
		const scaledWidth = canvasContext.canvas.width / scale;

		const leftX = snappedTopLeftCorner.x;
		const topY = snappedTopLeftCorner.y;

		const rightX = scaledWidth + snappedTopLeftCorner.x;
		const bottomY = scaledHeight + snappedTopLeftCorner.y;

		for (let x = leftX; x <= rightX; x += this.pixelsPerUnit) {
			const line: Line = {
				point1: vector(x, topY - this.pixelsPerUnit),
				point2: vector(x, bottomY + this.pixelsPerUnit),
				strokeColor: '#E8E8E8',
			};

			if (x === 0) {
				line.strokeColor = '#4A4A4A';
			}

			painter.drawLine(line);
		}

		for (let y = topY; y <= bottomY; y += this.pixelsPerUnit) {
			const line: Line = {
				point1: vector(leftX - this.pixelsPerUnit, y),
				point2: vector(rightX + this.pixelsPerUnit, y),
				strokeColor: '#E8E8E8',
			};

			if (y === 0) {
				line.strokeColor = '#4A4A4A';
			}

			painter.drawLine(line);
		}
	};

	/* PRIVATE METHODS */

	private snapOnAxis = (point: number): number => {
		let snappedPoint;
		const normalizedPixelsPerUnit = point >= 0 ? this.pixelsPerUnit : (this.pixelsPerUnit * -1);
		const pointIsToLeft = point >= 0
			? point % normalizedPixelsPerUnit < normalizedPixelsPerUnit / 2
			: point % normalizedPixelsPerUnit > normalizedPixelsPerUnit / 2;

		if (point % normalizedPixelsPerUnit === 0) {
			snappedPoint = point;
		} else if (pointIsToLeft) {
			// Case where point is to the left of the halfway point on the x axis
			// if so, move the point horizontally to the left to snap it to the grid
			snappedPoint = point - (point % normalizedPixelsPerUnit);
		} else {
			// Case where point is to the right of the halfway point on the x axis
			// if so, move the point horizontally to the right
			snappedPoint = point + (normalizedPixelsPerUnit - (point % normalizedPixelsPerUnit));
		}

		return snappedPoint;
	};
}
