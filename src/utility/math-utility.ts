/**
 * @description Solves a quadratic system in the form Ax^2 + Bx + C
 */
export function solveQuadraticEquation(a: number, b: number, c: number): [number, number] {
	const r1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
	const r2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);

	return [ r1, r2 ];
}
