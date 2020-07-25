/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
import Vector2D from '../../src/types/utility/Vector2D';

export {};

declare global {
	namespace jest {
		interface Matchers<R, T> {
			toRoughEqualVector(point: Vector2D): CustomMatcherResult;
			toRoughEqualNumber(number: number): CustomMatcherResult;
		}
	}
}
