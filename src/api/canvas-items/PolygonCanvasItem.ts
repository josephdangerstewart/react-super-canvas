import ICanvasItem from '../../types/ICanvasItem';
import IPainterAPI from '../../types/IPainterAPI';
import Polygon from '../../types/shapes/Polygon';
import Vector2D from '../../types/utility/Vector2D';
import StyleContext from '../../types/context/StyleContext';
import Rectangle from '../../types/shapes/Rectangle';
import { pointInsidePolygon, boundingRectOfPolygon } from '../../utility/shapes-util';
import { scalePolygon, movePolygon } from '../../utility/transform-utility';
import { ScalingNode } from '../../types/transform/ScalingNode';

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

	getBoundingRect = (): Rectangle => boundingRectOfPolygon(this.polygon);

	pointInsideItem = (point: Vector2D): boolean => pointInsidePolygon(point, this.polygon);

	applyScale = (scale: Vector2D, node: ScalingNode): void => {
		this.polygon = scalePolygon(this.polygon, scale, node);
	};

	applyMove = (move: Vector2D): void => {
		this.polygon = movePolygon(this.polygon, move);
	};
}
