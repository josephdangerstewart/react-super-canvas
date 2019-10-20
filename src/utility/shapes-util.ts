import Line from '../types/shapes/Line';
import Rectangle from '../types/shapes/Rectangle';
import Vector2D from '../types/utility/Vector2D';

export function rectToLines(rect: Rectangle): Line[] {
	const { x, y } = rect.topLeftCorner;
	const { width, height } = rect;

	const topLeft: Vector2D = {
		x,
		y,
	};

	const topRight: Vector2D = {
		x: x + width,
		y,
	};

	const bottomLeft: Vector2D = {
		x,
		y: y + height,
	};

	const bottomRight: Vector2D = {
		x: x + width,
		y: y + height,
	};

	return [
		{ point1: topLeft, point2: topRight },
		{ point1: topRight, point2: bottomRight },
		{ point1: bottomRight, point2: bottomLeft },
		{ point1: bottomLeft, point2: topLeft },
	];
}

export function lineCollidesWithLine(line1: Line, line2: Line): boolean {
	const { x: x1, y: y1 } = line1.point1;
	const { x: x2, y: y2 } = line1.point2;
	const { x: x3, y: y3 } = line2.point1;
	const { x: x4, y: y4 } = line2.point2;

	const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
	const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

	return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

export function pointInsideRect(point: Vector2D, rect: Rectangle): boolean {
	const { x, y } = point;
	const { x: topLeftX, y: topLeftY } = rect.topLeftCorner;
	const { height, width } = rect;

	return x >= topLeftX && x <= topLeftX + width && y >= topLeftY && y <= topLeftY + height;
}

export function lineCollidesWithRect(line: Line, rect: Rectangle): boolean {
	return rectToLines(rect).some((rectLine) => lineCollidesWithLine(rectLine, line)) || (
		pointInsideRect(line.point1, rect) && pointInsideRect(line.point2, rect)
	);
}

export function vector(x: number, y: number): Vector2D {
	return { x, y };
}

export function getCanvasRect(context2d: CanvasRenderingContext2D): Rectangle {
	return {
		topLeftCorner: vector(0, 0),
		width: context2d.canvas.width,
		height: context2d.canvas.height,
	};
}
