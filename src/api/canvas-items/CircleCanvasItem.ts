import ICanvasItem from '../../types/ICanvasItem';
import Circle from '../../types/shapes/Circle';
import IPainterAPI from '../../types/IPainterAPI';
import Vector2D from '../../types/utility/Vector2D';

export default class CircleCanvasItem implements ICanvasItem {
	private circle: Circle;

	constructor(center: Vector2D, radius: number) {
		this.circle = {
			center,
			radius,
			fillColor: 'green',
			strokeColor: 'black',
			strokeWeight: 2,
		};
	}

	render = (painter: IPainterAPI): void => {
		painter.drawCircle(this.circle);
	};
}
