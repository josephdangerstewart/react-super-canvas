import Line from '../types/shapes/Line';

/**
 * @description Solves a quadratic system in the form Ax^2 + Bx + C
 */
export function solveQuadraticEquation(a: number, b: number, c: number): [number, number] {
	const r1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
	const r2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);

	return [ r1, r2 ];
}

/**
 * @description Returns the slope of a line
 */
export function slopeOf(line: Line): number {
	const { x: x1, y: y1 } = line.point1;
	const { x: x2, y: y2 } = line.point2;

	if (x1 === x2) {
		return undefined;
	}

	return (y1 - y2) / (x1 - x2);
}

/**
 * @description Returns the sum of a set of numbers
 */
export function sum(n: number[]): number {
	return n.reduce((a, b) => a + b, 0);
}

/**
 * @description Returns the average of a set of numbers
 */
export function avg(n: number[]): number {
	if (n.length === 0) {
		return undefined;
	}

	return sum(n) / n.length;
}
