/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Vector2D from '../../src/types/utility/Vector2D';
import { vectorToString } from './shapes';

interface CustomMatcherResult {
	message: () => string;
	pass: boolean;
}

function round(n: number, toNearestDecimal: number): number {
	return Math.floor(n * (toNearestDecimal * 10)) / (toNearestDecimal * 10);
}

function numberRoughEquals(received: number, expected: number, decimalPlaces = 3): CustomMatcherResult {
	const pass = round(received, decimalPlaces) === round(expected, decimalPlaces);

	return {
		message: () => `Expected ${received}${pass ? ' not' : ''} to equal ${expected} up to ${decimalPlaces} decimal places`,
		pass,
	};
}

function toRoughEqualVector(received: Vector2D, expected: Vector2D, decimalPlaces = 3): CustomMatcherResult {
	const xResult = numberRoughEquals(received.x, expected.x, decimalPlaces);
	const yResult = numberRoughEquals(received.y, expected.y, decimalPlaces);
	const pass = xResult.pass && yResult.pass;

	return {
		message: () => `Expected ${vectorToString(received)} to${pass ? ' not' : ''} equal ${vectorToString(expected)} up to ${decimalPlaces} decimal places`,
		pass: xResult.pass && yResult.pass,
	};
}

export const extensions = {
	toRoughEqualVector,
};
