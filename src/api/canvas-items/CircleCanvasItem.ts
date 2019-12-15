import ICanvasItem from '../../types/ICanvasItem';
import Circle from '../../types/shapes/Circle';
import IPainterAPI from '../../types/IPainterAPI';
import Vector2D from '../../types/utility/Vector2D';
import { vector } from '../../utility/shapes-util';
import StyleContext from '../../types/context/StyleContext';
import Rectangle from '../../types/shapes/Rectangle';
import { TransformOperation } from '../../types/transform/TransformOperation';
import { TransformKind } from '../../types/transform/TransformKind';
import { scaleCircle, moveCircle } from '../../utility/transform-utility';

export default class CircleCanvasItem implements ICanvasItem {
	private circle: Circle;

	constructor(center: Vector2D, radius: number, styleContext: StyleContext) {
		this.circle = {
			center,
			radius,
			fillColor: styleContext.fillColor,
			strokeColor: styleContext.strokeColor,
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

	applyTransform = (operation: TransformOperation): void => {
		if (operation.action === TransformKind.Scale) {
			this.circle = scaleCircle(this.circle, operation.scale.value, operation.scale.node);
		} if (operation.action === TransformKind.Move) {
			this.circle = moveCircle(this.circle, operation.move);
		}
	};
}
