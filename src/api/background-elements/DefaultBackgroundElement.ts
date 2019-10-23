import IBackgroundElement from '../../types/IBackgroundElement';
import Vector2D from '../../types/utility/Vector2D';
import IPainterAPI from '../../types/IPainterAPI';
import BackgroundElementContext from '../../types/utility/BackgroundElementContext';
import Circle from '../../types/shapes/Circle';

/**
 * @description A generic background that does not enforce grid positioning
 */
export default class DefaultBackgroundElement implements IBackgroundElement {
	mapMouseCoordinates = (mousePos: Vector2D): Vector2D => mousePos;

	renderBackground = (painter: IPainterAPI, canvasContext: CanvasRenderingContext2D, context: BackgroundElementContext): void => {
		const circle: Circle = {
			center: context.virtualTopLeftCorner,
			radius: 50,
			fillColor: 'blue',
		};

		painter.drawCircle(circle);
	};
}
