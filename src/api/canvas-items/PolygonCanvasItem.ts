import ICanvasItem from '../../types/ICanvasItem';
import IPainterAPI from '../../types/IPainterAPI';
import Polygon from '../../types/shapes/Polygon';
import Vector2D from '../../types/utility/Vector2D';
import StyleContext from '../../types/context/StyleContext';

export default class PolygonCanvasItem implements ICanvasItem {
	private polygon: Polygon;

	constructor(points: Vector2D[], styleContext: StyleContext) {
		this.polygon = {
			points,
			fillColor: styleContext.fillColor,
			strokeColor: styleContext.strokeColor,
		};
	}

	render = (painter: IPainterAPI): void => {
		painter.drawPolygon(this.polygon);
	};
}
