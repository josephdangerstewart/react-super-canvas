import Polygon from '../../src/types/shapes/Polygon';
import Line from '../../src/types/shapes/Line';
import {
	polygonToLines,
	vector,
} from '../../src/utility/shapes-util';
import { line } from '../test-utils/shapes';

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
});
