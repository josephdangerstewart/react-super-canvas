import Polygon from '../../src/types/shapes/Polygon';
import Line from '../../src/types/shapes/Line';
import {
	polygonToLines,
	vector,
	rectToPoints,
	rectToLines,
} from '../../src/utility/shapes-util';
import { line } from '../test-utils/shapes';
import Rectangle from '../../src/types/shapes/Rectangle';
import Vector2D from '../../src/types/utility/Vector2D';

// Prepare a 5x5 rectangle with top left corner of (0,0)
const rect: Rectangle = Object.freeze({
	topLeftCorner: vector(0, 0),
	width: 5,
	height: 5,
});

describe('shapes-util', () => {
	describe('polygonToLines', () => {
		const polygon: Polygon = Object.freeze({
			points: [
				vector(0, 0),
				vector(5, 5),
				vector(0, 5),
				vector(5, 5),
			],
		});

		it('can convert a polygon to lines without completeness', () => {
			const expectedLines: Line[] = [
				line(0, 0, 5, 5),
				line(5, 5, 0, 5),
				line(0, 5, 5, 5),
			];

			const lines = polygonToLines(polygon, false);

			expect(lines).toEqual(expectedLines);
		});

		it('can convert a polygon to lines with completeness', () => {
			const expectedLines: Line[] = [
				line(0, 0, 5, 5),
				line(5, 5, 0, 5),
				line(0, 5, 5, 5),
				line(5, 5, 0, 0),
			];

			const lines = polygonToLines(polygon, true);

			expect(lines).toEqual(expectedLines);
		});
	});

	describe('rectToPoints', () => {
		const expectedPoints: Vector2D[] = [
			vector(0, 0),
			vector(5, 0),
			vector(0, 5),
			vector(5, 5),
		];

		it('can convert a rectangle to an array of points', () => {
			const result = rectToPoints(rect);

			expect(result).toEqual(expectedPoints);
		});
	});

	describe('rectToLines', () => {
		const expectedLines: Line[] = [
			line(0, 0, 5, 0),
			line(5, 0, 5, 5),
			line(5, 5, 0, 5),
			line(0, 5, 0, 0),
		];

		it('can convert a rectangle to an array of lines', () => {
			const result = rectToLines(rect);

			expect(result).toEqual(expectedLines);
		});
	});
});
