import Line from '../../src/types/shapes/Line';
import { vector } from '../../src/utility/shapes-util';

export function line(x1: number, y1: number, x2: number, y2: number): Line {
	return {
		point1: vector(x1, y1),
		point2: vector(x2, y2),
	};
}
