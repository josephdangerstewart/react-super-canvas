import Vector2D from '../types/utility/Vector2D';
import { ScalingNode } from '../types/transform/ScalingNode';
import Rectangle from '../types/shapes/Rectangle';
import { vector, boundingRectOfCircle, boundingRectOfPolygon } from './shapes-util';
import Circle from '../types/shapes/Circle';
import Polygon from '../types/shapes/Polygon';

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
		case ScalingNode.TopMiddle:
			newTopLeft = vector(x, y - diff.y);
			break;
		case ScalingNode.BottomLeft:
		case ScalingNode.MiddleLeft:
			newTopLeft = vector(x - diff.x, y);
			break;
		case ScalingNode.MiddleRight:
		case ScalingNode.BottomRight:
		case ScalingNode.BottomMiddle:
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
	const boundingRect = boundingRectOfCircle(circle);

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

/**
 * @description Scales a polygon by a given scale vector
 *
 * @param polygon The polygon to be scaled
 * @param scale The scale vector in the form (scaleX, scaleY). Note that polygons are not locked
 * into any aspect ratio
 * @param node The scaling node that was dragged by the user to
 */
export function scalePolygon(polygon: Polygon, scale: Vector2D, node: ScalingNode): Polygon {
	const boundingRect = boundingRectOfPolygon(polygon);
	const { x: left, y: top } = boundingRect.topLeftCorner;

	const scaledBoundingRect = scaleRectangle(boundingRect, scale, node);
	const { x: scaledLeft, y: scaledTop } = scaledBoundingRect.topLeftCorner;

	const points = polygon.points.map((point) => ({
		x: ((point.x - left) * scale.x) + scaledLeft,
		y: ((point.y - top) * scale.y) + scaledTop,
	}));

	return {
		...polygon,
		points,
	};
}

/**
 * @description Moves a circle by a certain amount of units
 *
 * @param circle The circle to move
 * @param diff The x and y difference to move the circle by
 */
export function moveCircle(circle: Circle, diff: Vector2D): Circle {
	const { x, y } = circle.center;
	return {
		...circle,
		center: vector(x + diff.x, y + diff.y),
	};
}

/**
 * @description Moves a polygon by a certain amount of units
 *
 * @param polygon The polygon to move
 * @param diff The x and y difference to move the polygon by
 */
export function movePolygon(polygon: Polygon, diff: Vector2D): Polygon {
	return {
		...polygon,
		points: polygon.points.map(({ x, y }) => ({
			x: x + diff.x,
			y: y + diff.y,
		})),
	};
}
