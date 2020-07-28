import ICanvasItem from '../../types/ICanvasItem';
import IPainterAPI from '../../types/IPainterAPI';
import Polygon from '../../types/shapes/Polygon';
import Vector2D from '../../types/utility/Vector2D';
import Rectangle from '../../types/shapes/Rectangle';
import { pointInsidePolygon, boundingRectOfPolygon } from '../../utility/shapes-util';
import { scalePolygon, movePolygon } from '../../utility/transform-utility';
import { ScalingNode } from '../../types/transform/ScalingNode';
import JsonData from '../../types/utility/JsonData';
import { CanvasItemKind } from './CanvasItemKind';
import StyleContext from '../../types/context/StyleContext';

export interface PolygonCanvasItemConstructor {
	points: Vector2D[];
	styleContext: StyleContext;
	rotation?: number;
}

export default class PolygonCanvasItem implements ICanvasItem {
	public canvasItemName = CanvasItemKind.PolygonCanvasItem;

	private polygon: Polygon;

	constructor({ points, styleContext, rotation }: PolygonCanvasItemConstructor) {
		this.polygon = {
			points,
			fillColor: styleContext.fillColor,
			strokeColor: styleContext.strokeColor,
			rotation: rotation ?? 0,
		};
	}

	toJson = (): JsonData => ({
		points: this.polygon.points,
		styleContext: { ...this.polygon },
		rotation: this.polygon.rotation,
	});

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

	applyRotation = (rotation: number): void => {
		this.polygon.rotation += rotation;
	};
}
