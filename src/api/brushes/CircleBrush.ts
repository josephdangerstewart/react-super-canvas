import IBrush from '../../types/IBrush';
import IPainterAPI from '../../types/IPainterAPI';
import { BrushContext } from '../../types/context/BrushContext';
import Circle from '../../types/shapes/Circle';

export default class CircleBrush implements IBrush {
	private radius: number;

	constructor(radius: number) {
		this.radius = radius || 10;
	}

	renderPreview = (painter: IPainterAPI, canvasContext: CanvasRenderingContext2D, context: BrushContext): void => {
		const cursor = context.snappedMousePosition;

		const circlePreview: Circle = {
			center: cursor,
			radius: this.radius,
			fillColor: 'black',
			strokeColor: 'black',
		};

		painter.drawCircle(circlePreview);
	};
}
