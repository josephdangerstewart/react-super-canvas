import Vector2D from '../types/utility/Vector2D';
import { ScalingNode } from '../types/transform/ScalingNode';
import Rectangle from '../types/shapes/Rectangle';
import { vector } from './shapes-util';
import Circle from '../types/shapes/Circle';

/**
 * @description Scales a rectangle by a scale vector
 *
 * @param rect The rectangle that will be scaled
 * @param scale The scale vector in the form of (scaleX, scaleY)
 * @param node Which node to scale on
 */
export function scaleRectangle(rect: Rectangle, scale: Vector2D, node: ScalingNode): Rectangle {
	const { x, y } = rect.topLeftCorner;
	const { width, height } = rect;
	const { x: scaleX, y: scaleY } = scale;

	const newWidth = width * scaleX;
	const newHeight = height * scaleY;

	const diff = vector(newWidth - width, newHeight - height);

	let newTopLeft = vector(0, 0);
	switch (node) {
		case ScalingNode.TopLeft:
			newTopLeft = vector(x - diff.x, y - diff.y);
			break;
		case ScalingNode.TopRight:
			newTopLeft = vector(x, y - diff.y);
			break;
		case ScalingNode.BottomLeft:
			newTopLeft = vector(x - diff.x, y);
			break;
		case ScalingNode.BottomRight:
			newTopLeft = vector(x, y);
			break;
		default:
			break;
	}

	return {
		...rect,
		topLeftCorner: newTopLeft,
		width: newWidth,
		height: newHeight,
	};
}

/**
 * @description Scales a circle on a given scale vector
 *
 * @param circle The circle to scale
 * @param scale The scale vector in the form (scaleX, scaleY) note that circles are locked into a 1:1
 * aspect ratio and Math.min(scaleX, scaleY) will be used to calculate the scaled radius
 * @param node The node that the user is scaling on
 */
export function scaleCircle(circle: Circle, scale: Vector2D, node: ScalingNode): Circle {
	const { radius } = circle;
	const { x, y } = circle.center;

	const boundingRect: Rectangle = {
		topLeftCorner: vector(x - radius, y - radius),
		width: radius * 2,
		height: radius * 2,
	};

	const scaledBoundingRect = scaleRectangle(boundingRect, scale, node);
	const { width, height } = scaledBoundingRect;
	const newRadius = Math.abs(Math.floor(Math.min(width, height) / 2));
	const newCenter = vector(scaledBoundingRect.topLeftCorner.x + newRadius, scaledBoundingRect.topLeftCorner.y + newRadius);

	if (width < 0) {
		newCenter.x -= newRadius * 2;
	}

	if (height < 0) {
		newCenter.y -= newRadius * 2;
	}

	return {
		...circle,
		center: newCenter,
		radius: newRadius,
	};
}
