import ICanvasItem from '../../types/ICanvasItem';
import Circle from '../../types/shapes/Circle';
import IPainterAPI from '../../types/IPainterAPI';
import Vector2D from '../../types/utility/Vector2D';
import Line from '../../types/shapes/Line';
import { vector } from '../../utility/shapes-util';

export default class CircleCanvasItem implements ICanvasItem {
	private circle: Circle;
	private line: Line;

	constructor(center: Vector2D, radius: number) {
		this.circle = {
			center,
			radius,
			fillColor: 'green',
			strokeColor: 'black',
		};

		this.line = {
			point1: vector(center.x - radius, center.y),
			point2: vector(center.x + radius, center.y),
			strokeColor: 'red',
		};
	}

	render = (painter: IPainterAPI): void => {
		painter.drawCircle(this.circle);
		painter.drawLine(this.line);
	};
}
