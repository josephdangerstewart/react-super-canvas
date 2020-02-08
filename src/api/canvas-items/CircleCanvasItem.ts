import ICanvasItem from '../../types/ICanvasItem';
import Circle from '../../types/shapes/Circle';
import IPainterAPI from '../../types/IPainterAPI';
import Vector2D from '../../types/utility/Vector2D';
import { boundingRectOfCircle } from '../../utility/shapes-util';
import Rectangle from '../../types/shapes/Rectangle';
import { TransformOperation } from '../../types/transform/TransformOperation';
import { TransformKind } from '../../types/transform/TransformKind';
import { scaleCircle, moveCircle } from '../../utility/transform-utility';
import { ScalingNode } from '../../types/transform/ScalingNode';
import JsonData from '../../types/utility/JsonData';
import { CanvasItemKind } from './CanvasItemKind';
import StyleContext from '../../types/context/StyleContext';

export interface CircleCanvasItemConstructor {
	center: Vector2D;
	radius: number;
	styleContext: StyleContext;
}

export default class CircleCanvasItem implements ICanvasItem {
	public canvasItemName = CanvasItemKind.CircleCanvasItem;

	private circle: Circle;

	constructor({ center, radius, styleContext }: CircleCanvasItemConstructor) {
		this.circle = {
			center,
			radius,
			fillColor: styleContext.fillColor,
			strokeColor: styleContext.strokeColor,
		};
	}

	toJson = (): JsonData => ({
		center: this.circle.center,
		radius: this.circle.radius,
		styleContext: { ...this.circle },
	});

	render = (painter: IPainterAPI): void => {
		painter.drawCircle(this.circle);
	};

	getBoundingRect = (): Rectangle => boundingRectOfCircle(this.circle);

	applyTransform = (operation: TransformOperation): void => {
		if (operation.action === TransformKind.Scale) {
			this.circle = scaleCircle(this.circle, operation.scale.value, operation.scale.node);
		} if (operation.action === TransformKind.Move) {
			this.circle = moveCircle(this.circle, operation.move);
		}
	};

	applyScale = (scale: Vector2D, node: ScalingNode): void => {
		this.circle = scaleCircle(this.circle, scale, node);
	};

	applyMove = (move: Vector2D): void => {
		this.circle = moveCircle(this.circle, move);
	};
}
