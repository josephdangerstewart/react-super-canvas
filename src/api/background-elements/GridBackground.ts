import IBackgroundElement from '../../types/IBackgroundElement';
import Vector2D from '../../types/utility/Vector2D';
import IPainterAPI from '../../types/IPainterAPI';
import BackgroundElementContext from '../../types/context/BackgroundElementContext';
import Circle from '../../types/shapes/Circle';

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
		const snappedTopLeftCorner = this.mapMouseCoordinates(context.virtualTopLeftCorner);

		const circle: Circle = {
			center: snappedTopLeftCorner,
			radius: 1,
		};

		for (let { x } = snappedTopLeftCorner; x < canvasContext.canvas.width + snappedTopLeftCorner.x; x += this.pixelsPerUnit) {
			for (let { y } = snappedTopLeftCorner; y < canvasContext.canvas.height + snappedTopLeftCorner.y; y += this.pixelsPerUnit) {
				circle.center = { x, y };

				if (x === 0 || y === 0) {
					circle.fillColor = '#4A4A4A';
					circle.strokeColor = '#4A4A4A';
				} else {
					circle.fillColor = '#E8E8E8';
					circle.strokeColor = '#E8E8E8';
				}

				painter.drawCircle(circle);
			}
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
