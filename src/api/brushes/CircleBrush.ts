import IBrush from '../../types/IBrush';
import IPainterAPI from '../../types/IPainterAPI';
import { BrushContext } from '../../types/context/BrushContext';
import Circle from '../../types/shapes/Circle';

export default class CircleBrush implements IBrush {
	private cursorRadius: number;

	constructor(cursorRadius: number) {
		this.cursorRadius = cursorRadius || 2;
	}

	renderPreview = (painter: IPainterAPI, canvasContext: CanvasRenderingContext2D, context: BrushContext): void => {
		const cursor = context.snappedMousePosition;

		const circlePreview: Circle = {
			center: cursor,
			radius: this.cursorRadius,
			fillColor: 'rgba(0, 0, 0, 0.58)',
			strokeColor: 'black',
		};

		painter.drawCircle(circlePreview);
	};
}
