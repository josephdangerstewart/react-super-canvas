import IBrush, { DefaultBrushKind } from '../../types/IBrush';
import IPainterAPI from '../../types/IPainterAPI';
import { BrushContext } from '../../types/context/BrushContext';
import { AddCanvasItemCallback } from '../../types/callbacks/AddCanvasItemCallback';
import Vector2D from '../../types/utility/Vector2D';
import { distanceBetweenTwoPoints, cursorPreview } from '../../utility/shapes-util';
import CircleCanvasItem from '../canvas-items/CircleCanvasItem';
import { withOpacity } from '../../utility/color-utility';
import { CanvasItemKind } from '../canvas-items/CanvasItemKind';

export default class CircleBrush implements IBrush {
	public brushName = DefaultBrushKind.CircleBrush;
	public supportedCanvasItems = {
		[CanvasItemKind.CircleCanvasItem]: CircleCanvasItem,
	};

	private cursorRadius: number;
	private centerAt: Vector2D;
	private previewRadius: number;

	constructor() {
		const cursor = cursorPreview({ x: 0, y: 0 });
		this.cursorRadius = cursor.radius;
		this.centerAt = null;
		this.previewRadius = cursor.radius;
	}

	renderPreview = (painter: IPainterAPI, context: BrushContext): void => {
		const cursor = context.snappedMousePosition;
		const { styleContext } = context;
		let circlePreview = cursorPreview(cursor);

		if (this.centerAt) {
			const distanceFromCenter = distanceBetweenTwoPoints(cursor, this.centerAt);
			if (distanceFromCenter < this.cursorRadius) {
				this.previewRadius = this.cursorRadius;
			} else {
				this.previewRadius = Math.floor(distanceFromCenter);
			}

			const fillColor = withOpacity(styleContext.fillColor, 0.5);
			const strokeColor = withOpacity(styleContext.strokeColor, 0.5);

			circlePreview = {
				center: this.centerAt,
				radius: this.previewRadius,
				fillColor,
				strokeColor,
			};
		}

		painter.drawCircle(circlePreview);
	};

	mouseDown = (addCanvasItem: AddCanvasItemCallback, context: BrushContext): void => {
		if (!this.centerAt) {
			this.centerAt = context.snappedMousePosition;
		} else {
			addCanvasItem(new CircleCanvasItem(({
				center: this.centerAt,
				radius: this.previewRadius,
				styleContext: context.styleContext,
			})));

			this.centerAt = null;
			this.previewRadius = this.cursorRadius;
		}
	};
}
