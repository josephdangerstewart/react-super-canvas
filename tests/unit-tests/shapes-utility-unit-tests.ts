import Polygon from '../../src/types/shapes/Polygon';
import Line from '../../src/types/shapes/Line';
import {
	polygonToLines,
	vector,
	rectToPoints,
	rectToLines,
	lineCollidesWithLine,
	pointInsideRect,
	lineCollidesWithRect,
	pointInsidePolygon,
	pointOnLine,
	rectCollidesWithRect,
	pointInsideCircle,
} from '../../src/utility/shapes-util';
import {
	line,
	lineToString,
	vectorToString,
	rectToString,
} from '../test-utils/shapes';
import Rectangle from '../../src/types/shapes/Rectangle';
import Vector2D from '../../src/types/utility/Vector2D';
import Circle from '../../src/types/shapes/Circle';

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
				vector(4, 1),
				vector(2, 5),
				vector(-3, 4),
				vector(-4, 3),
				vector(-3, 2),
			],
		});

		it('can convert a polygon to lines without completeness', () => {
			const expectedLines: Line[] = [
				line(0, 0, 4, 1),
				line(4, 1, 2, 5),
				line(2, 5, -3, 4),
				line(-3, 4, -4, 3),
				line(-4, 3, -3, 2),
			];

			const lines = polygonToLines(polygon, false);

			expect(lines).toEqual(expectedLines);
		});

		it('can convert a polygon to lines with completeness', () => {
			const expectedLines: Line[] = [
				line(0, 0, 4, 1),
				line(4, 1, 2, 5),
				line(2, 5, -3, 4),
				line(-3, 4, -4, 3),
				line(-4, 3, -3, 2),
				line(-3, 2, 0, 0),
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

	describe('lineCollidesWithLine', () => {
		const cases = [
			[ line(0, 0, 0, 5), line(1, 0, 1, 5), false ],
			[ line(0, 0, 0, 5), line(-1, -0.001, 4, -0.001), false ],
			[ line(0, 0, 0, 5), line(-3, 3, 6, 12), false ],
			[ line(0, 0, 0, 5), line(0, 0, 5, 0), true ],
			[ line(0, 0, 0, 5), line(-1, 0, 2, 5), true ],
			[ line(0, 0, 0, 5), line(-1, 0, 4, 0), true ],
			[ line(-5, 2, 4, 2), line(4, 1, 2, 5), true ],
			[ line(-5, 2, 4, 2), line(-3, 2, -4, 3), true ],
		];

		cases.forEach(([ line1, line2, expectedOutput ]) => {
			it(`${expectedOutput ? 'does' : 'does not'} collide for ${lineToString(line1 as Line)} and ${lineToString(line2 as Line)}`, () => {
				const result = lineCollidesWithLine(line1 as Line, line2 as Line);
				expect(result).toEqual(expectedOutput);
			});
		});
	});

	describe('pointInsideRect', () => {
		const cases = [
			[ vector(0, 0), true ],
			[ vector(1, 1), true ],
			[ vector(-1, -1), false ],
			[ vector(6, 5), false ],
			[ vector(5, 5), true ],
			[ vector(3.5, 3.5), true ],
			[ vector(2, -1), false ],
			[ vector(2, 6), false ],
			[ vector(-1, 2), false ],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`returns ${expectedOutput} for ${vectorToString(input as Vector2D)}`, () => {
				const result = pointInsideRect(input as Vector2D, rect);

				expect(result).toEqual(expectedOutput);
			});
		});
	});

	describe('lineCollidesWithRect', () => {
		const cases = [
			[ line(-1, 2, 3, -1), true ],
			[ line(2, 2, 3, 2), true ],
			[ line(0, 0, 5, 0), true ],
			[ line(0, 0, 5, 5), true ],
			[ line(5, 0, 5, 5), true ],
			[ line(2, 7, 9, 3), false ],
			[ line(9, 3, 2, 7), false ],
			[ line(0, -1, 5, -1), false ],
			[ line(0, 6, 5, 6), false ],
			[ line(-5, 1, -4, 2), false ],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`returns ${expectedOutput} for ${lineToString(input as Line)}`, () => {
				const result = lineCollidesWithRect(input as Line, rect);
				expect(result).toEqual(expectedOutput);
			});
		});
	});

	describe('pointOnLine', () => {
		const lineToTest = line(0, 0, 4, 2);

		const cases = [
			[ vector(0, 0), true ],
			[ vector(4, 2), true ],
			[ vector(2, 1), true ],
			[ vector(6, 3), false ],
			[ vector(1, 1), false ],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`evaluates that ${vectorToString(input as Vector2D)} is${expectedOutput ? '' : ' not'} on ${lineToString(lineToTest)}`, () => {
				const result = pointOnLine(input as Vector2D, lineToTest);

				expect(result).toEqual(expectedOutput);
			});
		});
	});

	describe('pointInsidePolygon', () => {
		const poly: Polygon = {
			points: [
				vector(0, 0),
				vector(4, 1),
				vector(2, 5),
				vector(-3, 4),
				vector(-4, 3),
				vector(-3, 2),
			],
		};

		const cases = [
			[ vector(0, 0), true ],
			[ vector(1, 0), false ],
			[ vector(0, 2), true ],
			[ vector(4, 2), false ],
			[ vector(4, 1), true ],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`returns ${expectedOutput} for ${vectorToString(input as Vector2D)}`, () => {
				const result = pointInsidePolygon(input as Vector2D, poly);
				expect(result).toEqual(expectedOutput);
			});
		});
	});

	describe('rectCollidesWithRect', () => {
		const cases = [
			[
				{ topLeftCorner: vector(3, 1), width: 3, height: 2 },
				true,
			],
			[
				{ topLeftCorner: vector(3, 1), width: 1, height: 2 },
				true,
			],
			[
				{ topLeftCorner: vector(0, 0), width: 4, height: 4 },
				true,
			],
			[
				{ topLeftCorner: vector(-1, -1), width: 7, height: 7 },
				true,
			],
			[
				{ topLeftCorner: vector(-1, 0), width: 4, height: 4 },
				true,
			],
			[
				{ topLeftCorner: vector(-1, 0), width: 10, height: 10 },
				true,
			],
			[
				{ topLeftCorner: vector(-1, 0), width: 1, height: 5 },
				true,
			],
			[
				{ topLeftCorner: vector(-2, 0), width: 1, height: 5 },
				false,
			],
			[
				{ topLeftCorner: vector(2, -2), width: 2, height: 1 },
				false,
			],
			[
				{ topLeftCorner: vector(6, 3), width: 1, height: 1 },
				false,
			],
			[
				{ topLeftCorner: vector(2, 6), width: 1, height: 1 },
				false,
			],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`returns ${expectedOutput} for ${rectToString(input as Rectangle)}`, () => {
				const result = rectCollidesWithRect(rect, input as Rectangle);

				expect(result).toEqual(expectedOutput);
			});
		});
	});

	describe('pointInsideCircle', () => {
		const circle: Circle = {
			center: vector(0, 0),
			radius: 3,
		};

		const cases = [
			[ vector(0, 0), true ],
			[ vector(1, 1), true ],
			[ vector(2, 2), true ],
			[ vector(0, 3), true ],
			[ vector(1, 3), false ],
			[ vector(-1, 1), true ],
			[ vector(-2, 2), true ],
			[ vector(-1, 3), false ],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`returns ${expectedOutput} for ${vectorToString(input as Vector2D)}`, () => {
				const result = pointInsideCircle(input as Vector2D, circle);
				expect(result).toEqual(expectedOutput);
			});
		});
	});
});