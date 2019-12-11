import ICanvasItem from '../../types/ICanvasItem';
import IPainterAPI from '../../types/IPainterAPI';
import Polygon from '../../types/shapes/Polygon';
import Vector2D from '../../types/utility/Vector2D';
import StyleContext from '../../types/context/StyleContext';
import Rectangle from '../../types/shapes/Rectangle';
import { vector, pointInsidePolygon } from '../../utility/shapes-util';

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

	getBoundingRect = (): Rectangle => {
		const { points } = this.polygon;
		const xValues = points.map((point) => point.x);
		const yValues = points.map((point) => point.y);

		const minX = Math.min(...xValues);
		const minY = Math.min(...yValues);

		const maxX = Math.max(...xValues);
		const maxY = Math.max(...yValues);

		return {
			topLeftCorner: vector(minX, minY),
			width: maxX - minX,
			height: maxY - minY,
		};
	};

	pointInsideItem = (point: Vector2D): boolean => pointInsidePolygon(point, this.polygon);
}
