import Line from '../types/shapes/Line';
import Rectangle from '../types/shapes/Rectangle';
import Vector2D from '../types/utility/Vector2D';
import Circle from '../types/shapes/Circle';
import Polygon from '../types/shapes/Polygon';
import {
	solveQuadraticEquation, avg, degreesToRads, radsToDegrees,
} from './math-utility';
import { IRotatable } from '../types/shapes/IRotatable';

/**
 * @description Shorthand way to create Vector2D objects
 * @param x
 * @param y
 * @untested An uncomplicated convinience method for creating vector objects in a readable way
 */
export function vector(x: number, y: number): Vector2D {
	return { x, y };
}

/**
 * @description Returns true if the shape has rotation and it's rotation is not divisible by 360
 * @param shape A rotatable shape
 * @param untested An uncomplicated convinience method
 */
export function hasRotation(shape: IRotatable): boolean {
	return shape.rotation && shape.rotation % 360 !== 0;
}

/**
 * @description Returns the distance between two points in a cartesean plane
 * @param point1
 * @param point2
 * @tested
 */
export function distanceBetweenTwoPoints(point1: Vector2D, point2: Vector2D): number {
	return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

/**
 * @description Calculates the angle between two lines
 * segments which share a common point
 * @param sharedPoint The point that both lines share
 * @param p1 Point 1
 * @param p2 Point 2
 * @tested
 */
export function angleOfThreePoints(sharedPoint: Vector2D, p1: Vector2D, p2: Vector2D): number {
	const dirCToA = Math.atan2(p1.y - sharedPoint.y, p1.x - sharedPoint.x);
	const dirCToB = Math.atan2(p2.y - sharedPoint.y, p2.x - sharedPoint.x);
	let angleACB = dirCToA - dirCToB;

	if (angleACB > Math.PI) {
		angleACB -= Math.PI * 2;
	} else if (angleACB < -Math.PI) {
		angleACB += Math.PI * 2;
	}

	const result = radsToDegrees(angleACB) * -1;

	if (result < 0) {
		return result + 360;
	}

	return result;
}

/**
 * @description Returns the center point of a rectangle
 */
export function centerOfRect(rect: Rectangle): Vector2D {
	return {
		x: rect.topLeftCorner.x + rect.width / 2,
		y: rect.topLeftCorner.y + rect.height / 2,
	};
}

/**
 * @description Returns the center point on a line
 */
export function centerOfLine(line: Line): Vector2D {
	const { x: x1, y: y1 } = line.point1;
	const { x: x2, y: y2 } = line.point2;

	return vector(avg([ x1, x2 ]), avg([ y1, y2 ]));
}

/**
 * @description Returns the centroid of a polygon
 */
export function centerOfPolygon(polygon: Polygon): Vector2D {
	const xValues = polygon.points.map(({ x }) => x);
	const yValues = polygon.points.map(({ y }) => y);

	const cX = avg(xValues);
	const cY = avg(yValues);

	return vector(cX, cY);
}

/**
 * @description Rotates one point around another
 *
 * @param point The point to rotate
 * @param center The center to rotate around
 * @param rotation The rotation in degrees
 * @tested
 */
export function rotateAroundPoint(point: Vector2D, center: Vector2D, rotation: number): Vector2D {
	if (rotation === 0) {
		return point;
	}

	const absRotation = degreesToRads(rotation);
	const s = Math.sin(absRotation);
	const c = Math.cos(absRotation);

	const p = vector(point.x, point.y);

	p.x -= center.x;
	p.y -= center.y;

	const newX = p.x * c - p.y * s;
	const newY = p.x * s + p.y * c;

	p.x = newX + center.x;
	p.y = newY + center.y;

	return p;
}

/**
 * @description Shorthand way of checking equality of two vectors
 * @param v1 The right hand vector
 * @param v2 The left hand vector
 */
export function vectorEquals(v1: Vector2D, v2: Vector2D): boolean {
	return v1?.x === v2?.x && v1?.y === v2?.y;
}

/**
 * @description Rotates a polygon around a point. Returns the transformed polygon
 * @param polygon The polygon to rotate
 * @param rotation The rotation in degrees
 * @param point The point to rotate around
 */
export function rotatePolygonAroundPoint(polygon: Polygon, rotation: number, point: Vector2D): Polygon {
	const points = polygon.points.map((p) => rotateAroundPoint(p, point, rotation));
	return {
		...polygon,
		points,
	};
}

/**
 * @description Rotates a polygon around its center. Returns the transformed polygon
 * @param polygon The polygon to rotate
 * @param rotation The rotation in degrees
 */
export function rotatePolygon(polygon: Polygon, rotation: number): Polygon {
	const center = centerOfPolygon(polygon);
	const rotatedPolygon = rotatePolygonAroundPoint(polygon, rotation, center);
	return {
		...rotatedPolygon,
		rotation: (polygon.rotation ?? 0) - rotation,
	};
}

/**
 * @description Converts a rectangle to an array of points without
 * respect to it's rotation
 * @param rect The rectangle
 */
function unrotatedRectToPoints(rect: Rectangle): Vector2D[] {
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
		topLeft,
		topRight,
		bottomRight,
		bottomLeft,
	];
}

/**
 * @description Rotates a rectangle around a point and returns a polygon representing
 * the rotated rectangle. The returned shape is different than the shape passed in.
 * @param rect The rectangle to rotate
 * @param rotation The rotation in degrees
 * @param point The point to rotate around
 */
export function rotateRectAroundPoint(rect: Rectangle, rotation: number, point: Vector2D): Polygon {
	const polygon: Polygon = {
		...rect,
		points: unrotatedRectToPoints(rect),
	};

	return rotatePolygonAroundPoint(polygon, rotation, point);
}

/**
 * @description Rotates a rectangle around its center. Returns a polygon representing the transformed
 * square
 * @param rect The rectangle to rotate around it's center
 * @param rotation The rotation (in degrees) to apply to the rectangle
 */
export function rotateRect(rect: Rectangle, rotation: number): Polygon {
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

	const points = [
		topLeft,
		topRight,
		bottomRight,
		bottomLeft,
	];

	const polygon: Polygon = {
		...rect,
		points,
	};

	return rotatePolygon(polygon, rotation);
}

/**
 * @description Rotates a line around a point
 * @param line The line to rotate
 * @param rotation The rotation in degrees
 * @param point The point to rotate around
 */
export function rotateLineAroundPoint(line: Line, rotation: number, point: Vector2D): Line {
	const { point1, point2 } = line;

	const newPoint1 = rotateAroundPoint(point1, point, rotation);
	const newPoint2 = rotateAroundPoint(point2, point, rotation);

	return {
		...line,
		point1: newPoint1,
		point2: newPoint2,
		rotation: (line.rotation ?? 0) - rotation,
	};
}

/**
 * @description Rotates a line around it's center
 * @param line The line to rotate
 * @param rotation The rotation to apply (in degrees) to the line
 */
export function rotateLine(line: Line, rotation: number): Line {
	const { point1, point2 } = line;
	const center = centerOfLine(line);

	const newPoint1 = rotateAroundPoint(point1, center, rotation);
	const newPoint2 = rotateAroundPoint(point2, center, rotation);

	return {
		...line,
		point1: newPoint1,
		point2: newPoint2,
		rotation: (line.rotation ?? 0) - rotation,
	};
}

/**
 * @description Returns the same shape with it's points rotated around its center by it's rotation
 * and it's rotation = 0, useful for doing geometric calculations (such as hit testing) without having
 * to factor in that polygon's rotation value. The returned shape represents the *same polygon* as the
 * one passed in.
 * @param polygon The polygon to normalize
 */
export function normalizeRotationForPolygon(polygon: Polygon): Polygon {
	if (!hasRotation(polygon)) {
		return polygon;
	}

	return {
		...rotatePolygon(polygon, polygon.rotation),
		rotation: 0,
	};
}

/**
 * @description Returns the same shape with it's points rotated around its center by it's rotation
 * and it's rotation = 0, useful for doing geometric calculations (such as hit testing) without having
 * to factor in that polygon's rotation value. The returned shape represents the *same rectangle* as the
 * one passed in.
 * @param rect The rectangle to normalize
 */
export function normalizeRotationForRect(rect: Rectangle): Polygon {
	if (!hasRotation(rect)) {
		return {
			...rect,
			points: unrotatedRectToPoints(rect),
		};
	}

	return {
		...rotateRect(rect, rect.rotation),
		rotation: 0,
	};
}

/**
 * @description Returns the same shape with it's points rotated around its center by it's rotation
 * and it's rotation = 0, useful for doing geometric calculations (such as hit testing) without having
 * to factor in that polygon's rotation value. The returned shape represents the *same line* as the
 * one passed in.
 * @param line The line to normalize
 */
export function normalizeRotationForLine(line: Line): Line {
	if (!hasRotation(line)) {
		return line;
	}

	return {
		...rotateLine(line, line.rotation),
		rotation: 0,
	};
}

/**
 * @description Returns the bounding rectangle of a circle
 * @param circle
 */
export function boundingRectOfCircle(circle: Circle): Rectangle {
	const { center: { x, y }, radius } = circle;
	return {
		topLeftCorner: vector(x - radius, y - radius),
		width: radius * 2,
		height: radius * 2,
	};
}

/**
 * @description Converts a polygon into a series of lines
 * @param polygon
 * @tested
 */
export function polygonToLines(polygon: Polygon, enforceCompleteness = true): Line[] {
	const normalizedPolygon = normalizeRotationForPolygon(polygon);

	if (normalizedPolygon.points.length < 2) {
		return [];
	}

	let point1: Vector2D;
	let point2: Vector2D;
	const lines: Line[] = [];

	for (let i = 0; i < normalizedPolygon.points.length; i++) {
		point1 = normalizedPolygon.points[i];
		if (i === normalizedPolygon.points.length - 1) {
			[ point2 ] = normalizedPolygon.points;
		} else {
			point2 = normalizedPolygon.points[i + 1];
		}

		if (i < normalizedPolygon.points.length - 1 || enforceCompleteness) {
			lines.push({ point1, point2 });
		}
	}

	return lines;
}

/**
 * @description Converts a rectangle to a series of points (topLeft, topRight, bottomLeft, bottomRight)
 * @param rect The rectangle to convert
 * @tested
 */
export function rectToPoints(rect: Rectangle): Vector2D[] {
	return normalizeRotationForRect(rect).points;
}

/**
 * @description Converts a line into an array of it's two points
 * @param line
 * @untested This is simple enough to not need a test
 */
export function lineToPoints(line: Line): Vector2D[] {
	const { point1, point2 } = normalizeRotationForLine(line);
	return [ point1, point2 ];
}

/**
 * @description Converts a rectangle to a series of lines (top, right, bottom, left)
 * @param rect The rectangle to convert
 * @tested
 */
export function rectToLines(rect: Rectangle): Line[] {
	const [ topLeft, topRight, bottomRight, bottomLeft ] = rectToPoints(rect);

	return [
		{ point1: topLeft, point2: topRight },
		{ point1: topRight, point2: bottomRight },
		{ point1: bottomRight, point2: bottomLeft },
		{ point1: bottomLeft, point2: topLeft },
	];
}

/**
 * @description Returns the bounding rectangle of a line
 */
export function boundingRectOfLine(line: Line): Rectangle {
	const normalizedLine = normalizeRotationForLine(line);

	const { point1, point2 } = normalizedLine;
	const topLeftX = Math.min(point1.x, point2.x);
	const topLeftY = Math.max(point1.y, point2.y);
	const bottomRightX = Math.max(point1.x, point2.x);
	const bottomRightY = Math.min(point1.y, point2.y);
	return {
		topLeftCorner: vector(topLeftX, topLeftY),
		height: topLeftY - bottomRightY,
		width: bottomRightX - topLeftX,
	};
}

/**
 * @description Returns the bounding rectangle of a polygon
 */
export function boundingRectOfPolygon(polygon: Polygon): Rectangle {
	const normalizedPolygon = normalizeRotationForPolygon(polygon);

	const { points } = normalizedPolygon;
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
}

/**
 * @description Returns the total bounding rect of an array of rectangles
 * @param rects The rects to get the bounding rect of
 * @tested
 */
export function boundingRectOfRects(rects: Rectangle[]): Rectangle {
	const normalizedRects = rects.map((rect) => boundingRectOfPolygon(normalizeRotationForRect(rect)));

	const leftXs = normalizedRects.map(({ topLeftCorner }) => topLeftCorner.x);
	const rightXs = normalizedRects.map(({ topLeftCorner, width }) => topLeftCorner.x + width);

	const topYs = normalizedRects.map(({ topLeftCorner }) => topLeftCorner.y);
	const bottomYs = normalizedRects.map(({ topLeftCorner, height }) => topLeftCorner.y + height);

	const maxX = Math.max(...rightXs, ...leftXs);
	const minX = Math.min(...rightXs, ...leftXs);

	const maxY = Math.max(...topYs, ...bottomYs);
	const minY = Math.min(...topYs, ...bottomYs);

	const width = maxX - minX;
	const height = maxY - minY;
	const topLeftCorner = vector(minX, minY);

	return {
		width,
		height,
		topLeftCorner,
	};
}

/**
 * @description Returns true if there is an intersection between two lines
 * @param line1 The first line
 * @param line2 The second line
 * @tested
 */
export function lineCollidesWithLine(line1: Line, line2: Line): boolean {
	const normalizedLine1 = normalizeRotationForLine(line1);
	const normalizedLine2 = normalizeRotationForLine(line2);

	const { x: x1, y: y1 } = normalizedLine1.point1;
	const { x: x2, y: y2 } = normalizedLine1.point2;
	const { x: x3, y: y3 } = normalizedLine2.point1;
	const { x: x4, y: y4 } = normalizedLine2.point2;

	const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
	const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

	return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

/**
 * @description Determines if a point is on a given line
 * @param point The point to check
 * @param line The line to check
 * @tested
 */
export function pointOnLine(point: Vector2D, line: Line): boolean {
	const normalizedLine = normalizeRotationForLine(line);

	const { point1, point2 } = normalizedLine;

	const maxX = Math.max(point1.x, point2.x);
	const minX = Math.min(point1.x, point2.x);
	const maxY = Math.max(point1.y, point2.y);
	const minY = Math.min(point1.y, point2.y);

	// Handle the special case when the slope
	// is undefined
	if (point1.x === point2.x) {
		return point1.x === point.x && point.y <= maxY && point.y >= minY;
	}

	if (point.x > maxX || point.x < minX || point.y > maxY || point.y < minY) {
		return false;
	}

	const m = (point2.y - point1.y) / (point2.x - point1.x);
	const b = -(m * point1.x) + point1.y;

	return point.y === (m * point.x) + b;
}

/**
 * @description Tests whether a point is inside of a polygon
 * @param point
 * @param polygon
 * @tested
 */
export function pointInsidePolygon(point: Vector2D, polygon: Polygon): boolean {
	const normalizedPolygon = normalizeRotationForPolygon(polygon);

	const ray: Line = {
		point1: vector(Math.min(...polygon.points.map(({ x }) => x)) - 1, point.y),
		point2: point,
	};

	if (normalizedPolygon.points.some((v) => vectorEquals(v, point))) {
		return true;
	}

	const polyLines = polygonToLines(normalizedPolygon);
	let intersections = 0;

	if (polyLines.some((line) => pointOnLine(point, line))) {
		return true;
	}

	for (let i = 0; i < polyLines.length; i++) {
		// A ray passing through a single vertex will "collide" with the two lines that connect
		// to that vertex. To fix this, only count a collision if the second point in the side
		// is above the point we are testing
		//
		// https://en.wikipedia.org/wiki/Point_in_polygon (altered for canvas coordinate system)
		if (lineCollidesWithLine(polyLines[i], ray)) {
			const pointIsVertex = pointOnLine(polyLines[i].point1, ray) || pointOnLine(polyLines[i].point2, ray);

			if ((pointIsVertex && polyLines[i].point2.y < point.y) || !pointIsVertex) {
				intersections++;
			}
		}
	}

	return intersections % 2 === 1;
}

/**
 * @description Returns true if a given point lies within a given rectangle
 * @param point The point
 * @param rect The rectangle
 * @tested
 */
export function pointInsideRect(point: Vector2D, rect: Rectangle): boolean {
	if (hasRotation(rect)) {
		const polygon = normalizeRotationForRect(rect);
		return pointInsidePolygon(point, polygon);
	}

	const { x, y } = point;
	const { x: topLeftX, y: topLeftY } = rect.topLeftCorner;
	const { height, width } = rect;

	return x >= topLeftX && x <= topLeftX + width && y >= topLeftY && y <= topLeftY + height;
}

/**
 * @description Returns true if a line intersects a rectangle or if the line is completely inside the rectangle
 * @param line The line
 * @param rect The rectangle
 * @tested
 */
export function lineCollidesWithRect(line: Line, rect: Rectangle): boolean {
	const normalizedLine = normalizeRotationForLine(line);

	const { point1, point2 } = normalizedLine;
	return rectToLines(rect).some((rectLine) => lineCollidesWithLine(rectLine, normalizedLine)) || (
		pointInsideRect(point1, rect) && pointInsideRect(point2, rect)
	);
}

/**
 * @description Returns a rectangle representing the size of the given canvas element
 * @param context2d
 * @untested Simple enough to not need a test
 */
export function getCanvasRect(context2d: CanvasRenderingContext2D): Rectangle {
	return {
		topLeftCorner: vector(0, 0),
		width: context2d.canvas.width,
		height: context2d.canvas.height,
	};
}

/**
 * @description Returns true if there is an intersection between two rectangles or if one of the rectangles
 * is inside the other
 * @param rect1 The first rectangle
 * @param rect2 The second rectangle
 * @tested
 */
export function rectCollidesWithRect(rect1: Rectangle, rect2: Rectangle): boolean {
	const linesRect1 = rectToLines(rect1);
	const linesRect2 = rectToLines(rect2);

	const pointsRect1 = rectToPoints(rect1);
	const pointsRect2 = rectToPoints(rect2);

	const hasIntersections = linesRect1.some((line1) => linesRect2.some((line2) => lineCollidesWithLine(line1, line2)));
	const rect1InsideRect2 = pointsRect1.some((point) => pointInsideRect(point, rect2));
	const rect2InsideRect1 = pointsRect2.some((point) => pointInsideRect(point, rect1));

	return hasIntersections || rect1InsideRect2 || rect2InsideRect1;
}

/**
 * @description Returns true if a point is inside a circle
 * @param point
 * @param circle
 * @tested
 */
export function pointInsideCircle(point: Vector2D, circle: Circle): boolean {
	const { x: x1, y: y1 } = point;
	const { x: x2, y: y2 } = circle.center;
	const { radius: r } = circle;

	const d = (x1 - x2) ** 2 + (y1 - y2) ** 2;
	return d <= r ** 2;
}

/**
 * @description Returns true if a lines intersects a circle or if the line is completely inside the circle
 * @param circle
 * @param line
 * @source https://photos.app.goo.gl/g6Y2KXWpj4odXu9x6
 * @tested
 */
export function circleCollidesWithLine(circle: Circle, line: Line): boolean {
	if (lineToPoints(line).some((point) => pointInsideCircle(point, circle))) {
		return true;
	}

	const normalizedLine = normalizeRotationForLine(line);

	const { point1, point2 } = normalizedLine;
	const { center: { x: c1, y: c2 }, radius: r } = circle;

	// If the difference between our lines x values is 0 then
	// our slope is undefined and our line is in the form x = c
	if (point2.x === point1.x) {
		// Put the line in form x = n
		const n = point1.x;

		const A = 1;
		const B = -2 * c2;
		const C = n ** 2 - 2 * n * c1 + c1 ** 2 + c2 ** 2 - r ** 2;

		const [ y1, y2 ] = solveQuadraticEquation(A, B, C);

		if (Number.isNaN(y1) && Number.isNaN(y2)) {
			return false;
		}

		return pointOnLine({ x: n, y: y1 }, normalizedLine) || pointOnLine({ x: n, y: y2 }, normalizedLine);
	}

	// Put the line in form y = mx + b
	const m = (point2.y - point1.y) / (point2.x - point1.x);
	const b = -(m * point1.x) + point1.y;

	// The form of the circle is (x - c1)^2 + (y - c2)^2 = r^2
	// When you substitute y = mx + b in for y and factor it out
	// to the form Ax^2 + Bx + C, these are the relative values
	// for A, B, and C
	const A = (1 + m ** 2);
	const B = 2 * (m * b - c2 * m - c1);
	const C = c2 ** 2 + b ** 2 - 2 * c2 * b + c1 ** 2 - r ** 2;

	// Solve for two points using the quadratic formula
	const [ x1, x2 ] = solveQuadraticEquation(A, B, C);

	if (Number.isNaN(x1) && Number.isNaN(x2)) {
		return false;
	}

	// Then substitute x1 and x2 back into the original line function y = mx + b
	// to get the two points of collision
	const y1 = m * x1 + b;
	const y2 = m * x2 + b;

	return pointOnLine({ x: x1, y: y1 }, normalizedLine) || pointOnLine({ x: x2, y: y2 }, normalizedLine);
}

/**
 * @description Returns true if a circle intersects a rectangle or if one is completely inside the other
 * @param circle
 * @param rect
 * @tested
 */
export function circleCollidesWithRect(circle: Circle, rect: Rectangle): boolean {
	const circleInsideRectangle = pointInsideRect(circle.center, rect);
	if (circleInsideRectangle) {
		return true;
	}

	const rectangleInsideCircle = rectToPoints(rect).some((point) => pointInsideCircle(point, circle));
	if (rectangleInsideCircle) {
		return true;
	}

	return rectToLines(rect).some((line) => circleCollidesWithLine(circle, line));
}

/**
 * @description Returns true if a polygon intersects a rectangle or if one is inside the other
 * @param polygon
 * @param rect
 */
export function polygonCollidesWithRect(polygon: Polygon, rect: Rectangle): boolean {
	const normalizedPolygon = normalizeRotationForPolygon(polygon);

	// Polygon is inside rectangle
	if (normalizedPolygon.points.some((point) => pointInsideRect(point, rect))) {
		return true;
	}

	// Rectangle inside polygon
	if (rectToPoints(rect).some((point) => pointInsidePolygon(point, normalizedPolygon))) {
		return true;
	}

	// Polygon intersects with rectangle
	if (polygonToLines(normalizedPolygon).some((line) => lineCollidesWithRect(line, rect))) {
		return true;
	}

	return false;
}

/**
 * @description A convinience method to get the shape for the mouse cursor
 * @param pos The position of the cursor
 * @untested A convinience method for accessing a shared cursor preview
 */
export const cursorPreview = (pos: Vector2D): Circle => ({
	center: pos,
	radius: 2,
	fillColor: 'rgba(0, 0, 0, 0.75)',
});

/**
 * @description Returns the length of a line
 * @param line The line to calculate the length of
 * @note Is essentially an alias for distanceBetweenTwoPoints
 */
export const lengthOfLine = (line: Line): number => distanceBetweenTwoPoints(line.point1, line.point2);

/**
 * @description Returns the difference between two points so essentially point1 - point2
 */
export function getDiffBetweenPoints(point1: Vector2D, point2: Vector2D): Vector2D {
	return vector(point1.x - point2.x, point1.y - point2.y);
}
