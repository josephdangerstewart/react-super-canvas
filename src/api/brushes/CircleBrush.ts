import IBrush, { DefaultBrushKind } from '../../types/IBrush';
import IPainterAPI from '../../types/IPainterAPI';
import { BrushContext } from '../../types/context/BrushContext';
import Circle from '../../types/shapes/Circle';
import { AddCanvasItemCallback } from '../../types/callbacks/AddCanvasItemCallback';
import Vector2D from '../../types/utility/Vector2D';
import { distanceBetweenTwoPoints } from '../../utility/shapes-util';
import CircleCanvasItem from '../canvas-items/CircleCanvasItem';
import { withOpacity } from '../../utility/color-utility';

export default class CircleBrush implements IBrush {
	public brushName = DefaultBrushKind.CircleBrush;

	private cursorRadius: number;
	private centerAt: Vector2D;
	private previewRadius: number;

	constructor(cursorRadius: number) {
		this.cursorRadius = cursorRadius || 2;
		this.centerAt = null;
		this.previewRadius = cursorRadius;
	}

	renderPreview = (painter: IPainterAPI, context: BrushContext): void => {
		const cursor = context.snappedMousePosition;
		const { styleContext } = context;
		let circlePreview: Circle;

		if (!this.centerAt) {
			circlePreview = {
				center: cursor,
				radius: this.cursorRadius,
				fillColor: 'rgba(0, 0, 0, 0.58)',
				strokeColor: 'rgba(0, 0, 0, 0.58)',
			};
		} else {
			const distanceFromCenter = distanceBetweenTwoPoints(cursor, this.centerAt);
			if (distanceFromCenter < this.cursorRadius) {
				this.previewRadius = this.cursorRadius;
			} else {
				this.previewRadius = Math.floor(distanceFromCenter);
			}

			circlePreview = {
				center: this.centerAt,
				radius: this.previewRadius,
				fillColor: withOpacity(styleContext.fillColor, 0.5),
				strokeColor: withOpacity(styleContext.strokeColor, 0.5),
			};
		}

		painter.drawCircle(circlePreview);
	};

	mouseDown = (addCanvasItem: AddCanvasItemCallback, context: BrushContext): void => {
		if (!this.centerAt) {
			this.centerAt = context.snappedMousePosition;
		} else {
			addCanvasItem(new CircleCanvasItem(this.centerAt, this.previewRadius, context.styleContext));
			this.centerAt = null;
			this.previewRadius = this.cursorRadius;
		}
	};
}
