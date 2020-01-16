import Line from '../../src/types/shapes/Line';
import { vector } from '../../src/utility/shapes-util';
import Vector2D from '../../src/types/utility/Vector2D';
import Rectangle from '../../src/types/shapes/Rectangle';
import Circle from '../../src/types/shapes/Circle';

export function line(x1: number, y1: number, x2: number, y2: number): Line {
	return {
		point1: vector(x1, y1),
		point2: vector(x2, y2),
	};
}

export function vectorToString({ x, y }: Vector2D): string {
	return `(${x},${y})`;
}

export function lineToString({ point1, point2 }: Line): string {
	return `${vectorToString(point1)}-${vectorToString(point2)}`;
}

export function rectToString(rect: Rectangle): string {
	return `[topLeft: ${vectorToString(rect.topLeftCorner)}, w: ${rect.width}, h: ${rect.height}]`;
}

export function circleToString(circle: Circle): string {
	return `[center: ${vectorToString(circle.center)}, r: ${circle.radius}]`;
}
