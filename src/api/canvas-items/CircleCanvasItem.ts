import ICanvasItem from '../../types/ICanvasItem';
import Circle from '../../types/shapes/Circle';
import IPainterAPI from '../../types/IPainterAPI';
import Vector2D from '../../types/utility/Vector2D';
import Line from '../../types/shapes/Line';
import { vector } from '../../utility/shapes-util';
import StyleContext from '../../types/context/StyleContext';
import Rectangle from '../../types/shapes/Rectangle';

export default class CircleCanvasItem implements ICanvasItem {
	private circle: Circle;
	private line: Line;

	constructor(center: Vector2D, radius: number, styleContext: StyleContext) {
		this.circle = {
			center,
			radius,
			fillColor: styleContext.fillColor,
			strokeColor: styleContext.strokeColor,
		};

		this.line = {
			point1: vector(center.x - radius, center.y),
			point2: vector(center.x + radius, center.y),
			strokeColor: 'red',
		};
	}

	render = (painter: IPainterAPI): void => {
		painter.drawCircle(this.circle);
	};

	getBoundingRect = (): Rectangle => {
		const { radius } = this.circle;
		const { x, y } = this.circle.center;

		return {
			topLeftCorner: vector(x - radius, y - radius),
			width: radius * 2,
			height: radius * 2,
		};
	};
}
