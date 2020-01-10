import Polygon from '../../src/types/shapes/Polygon';
import Line from '../../src/types/shapes/Line';
import {
	polygonToLines,
	vector,
} from '../../src/utility/shapes-util';

describe('shapes-util', () => {
	describe('polygonToLines', () => {
		const polygon: Polygon = Object.freeze({
			points: [
				{ x: 0, y: 0 },
				{ x: 5, y: 5 },
				{ x: 0, y: 5 },
				{ x: 5, y: 5 },
			],
		});

		it('can convert a polygon to lines without completeness', () => {
			const expectedLines: Line[] = [
				{
					point1: vector(0, 0),
					point2: vector(5, 5),
				},
				{
					point1: vector(5, 5),
					point2: vector(0, 5),
				},
				{
					point1: vector(0, 5),
					point2: vector(5, 5),
				},
			];

			const lines = polygonToLines(polygon, false);

			expect(lines).toEqual(expectedLines);
		});

		it('can convert a polygon to lines with completeness', () => {
			const expectedLines: Line[] = [
				{
					point1: vector(0, 0),
					point2: vector(5, 5),
				},
				{
					point1: vector(5, 5),
					point2: vector(0, 5),
				},
				{
					point1: vector(0, 5),
					point2: vector(5, 5),
				},
				{
					point1: vector(5, 5),
					point2: vector(0, 0),
				},
			];

			const lines = polygonToLines(polygon, false);

			expect(lines).toEqual(expectedLines);
		});
	});
});
