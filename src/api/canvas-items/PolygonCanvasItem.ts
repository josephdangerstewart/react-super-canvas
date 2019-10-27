import ICanvasItem from '../../types/ICanvasItem';
import IPainterAPI from '../../types/IPainterAPI';
import Polygon from '../../types/shapes/Polygon';
import Vector2D from '../../types/utility/Vector2D';

export default class PolygonCanvasItem implements ICanvasItem {
	private polygon: Polygon;

	constructor(points: Vector2D[]) {
		this.polygon = {
			points,
			fillColor: 'red',
		};
	}

	render = (painter: IPainterAPI): void => {
		painter.drawPolygon(this.polygon);
	};
}
