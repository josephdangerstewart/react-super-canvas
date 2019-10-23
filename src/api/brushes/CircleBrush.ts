import IBrush from '../../types/IBrush';
import IPainterAPI from '../../types/IPainterAPI';
import { BrushContext } from '../../types/context/BrushContext';
import Circle from '../../types/shapes/Circle';

export default class CircleBrush implements IBrush {
	renderPreview = (painter: IPainterAPI, canvasContext: CanvasRenderingContext2D, context: BrushContext): void => {
		const cursor = context.snappedMousePosition;

		const circlePreview: Circle = {
			center: cursor,
			radius: 10,
			fillColor: 'rgba(0, 0, 0, 0.58)',
			strokeColor: 'rgba(0, 0, 0, 0.58)',
		};

		painter.drawCircle(circlePreview);
	};
}
