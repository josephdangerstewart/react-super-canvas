import IBrush from '../../types/IBrush';
import Vector2D from '../../types/utility/Vector2D';
import IPainterAPI from '../../types/IPainterAPI';
import { BrushContext } from '../../types/context/BrushContext';
import { cursorPreview, polygonToLines } from '../../utility/shapes-util';
import { AddCanvasItemCallback } from '../../types/callbacks/AddCanvasItemCallback';
import PolygonCanvasItem from '../canvas-items/PolygonCanvasItem';

export default class PolygonBrush implements IBrush {
	private points: Vector2D[];

	constructor() {
		this.points = [];
	}

	renderPreview = (painter: IPainterAPI, context: BrushContext): void => {
		const cursor = context.snappedMousePosition;
		const cursorShape = cursorPreview(cursor);

		// The user is not actively drawing
		if (this.points.length === 0) {
			painter.drawCircle(cursorShape);
		} else {
			const lines = polygonToLines({ points: [ ...this.points, cursor ] }, false);
			lines.forEach((line) => painter.drawLine(line));
			painter.drawCircle(cursorShape);
		}
	};

	mouseDown = (addCanvasItem: AddCanvasItemCallback, context: BrushContext): void => {
		const cursor = context.snappedMousePosition;

		if (this.points.length === 0) {
			this.points.push(cursor);
			return;
		}

		const { x, y } = cursor;
		const { x: originX, y: originY } = this.points[0];

		// The user has completed the polygon
		if (x === originX && y === originY) {
			if (this.points.length === 1) {
				this.points = [];
				return;
			}

			addCanvasItem(new PolygonCanvasItem(this.points));
			this.points = [];
			return;
		}

		this.points.push(cursor);
	};
}
