import {
	hexToRgb,
	hexaToRgba,
	isValidHex,
	isValidHexa,
	stringToRgb,
	stringToRgba,
} from '../../src/utility/color-utility';

describe('color-utility', () => {
	describe('hexToRgb', () => {
		const cases = [
			[ '#FFFFFF', { r: 255, g: 255, b: 255 } ],
			[ '#ffffff', { r: 255, g: 255, b: 255 } ],
			[ '#123456', { r: 18, g: 52, b: 86 } ],
			[ '#FFF', { r: 255, g: 255, b: 255 } ],
			[ '#fff', { r: 255, g: 255, b: 255 } ],
			[ '#BA3C4C', { r: 186, g: 60, b: 76 } ],
			[ '', null ],
			[ '#FF', null ],
			[ '#AAAA', null ],
			[ '#123L45', null ],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`correctly parses ${input}`, () => expect(hexToRgb(input as string)).toEqual(expectedOutput));
		});
	});

	describe('hexaToRgba', () => {
		const cases = [
			[
				'#FFFFFF',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 1,
				},
			],
			[
				'#FFFFFF33',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 0.2,
				},
			],
			[
				'#BA3C4CFF',
				{
					r: 186,
					g: 60,
					b: 76,
					a: 1,
				},
			],
			[
				'#FFF',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 1,
				},
			],
			[
				'',
				null,
			],
			[
				'#FFFF',
				null,
			],
			[
				'#FF',
				null,
			],
			[
				'FFF',
				null,
			],
			[
				'#123456LL',
				null,
			],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`correctly parses ${input}`, () => expect(hexaToRgba(input as string)).toEqual(expectedOutput));
		});
	});

	describe('isValidHex', () => {
		const validCases = [
			'#FFF',
			'#123ABC',
			'#123',
			'#A2C',
			'#1A2B3C',
			'#aaa',
			'#ffffff',
		];

		const invalidCases = [
			'FFF',
			'FFFFFF',
			'#FF',
			'#FFFF',
			'#12345G',
			'#FFFFFFF',
			'#ff',
		];

		validCases.forEach((input) => {
			it(`returns true for ${input}`, () => expect(isValidHex(input)).toEqual(true));
		});

		invalidCases.forEach((input) => {
			it(`returns false for ${input}`, () => expect(isValidHex(input)).toEqual(false));
		});
	});

	describe('isValidHexa', () => {
		const validCases = [
			'#FFF',
			'#123ABC',
			'#123',
			'#A2C',
			'#1A2B3C',
			'#FFFFFFFF',
			'#ABCD128B',
			'#12345678',
			'#fff',
			'#ffffff',
		];

		const invalidCases = [
			'FFF',
			'FFFFFF',
			'#FF',
			'#FFFF',
			'#12345G',
			'#1234567',
			'#123456789',
		];

		validCases.forEach((input) => {
			it(`returns true for ${input}`, () => expect(isValidHexa(input)).toEqual(true));
		});

		invalidCases.forEach((input) => {
			it(`returns false for ${input}`, () => expect(isValidHexa(input)).toEqual(false));
		});
	});

	describe('stringToRGB', () => {
		const cases = [
			[ 'rgb(255,255,255)', { r: 255, g: 255, b: 255 } ],
			[ 'rgb( 150, 150, 150)', { r: 150, g: 150, b: 150 } ],
			[ 'rgb( 100 , 100, 100 )', { r: 100, g: 100, b: 100 } ],
			[ 'rgb(0, 0, 0)', { r: 0, g: 0, b: 0 } ],
			[ '#FFFFFF', { r: 255, g: 255, b: 255 } ],
			[ '#123456', { r: 18, g: 52, b: 86 } ],
			[ '#FFF', { r: 255, g: 255, b: 255 } ],
			[ '#BA3C4C', { r: 186, g: 60, b: 76 } ],
			[ '#fff', { r: 255, g: 255, b: 255 } ],
			[ '#ffffff', { r: 255, g: 255, b: 255 } ],
			[ '', null ],
			[ 'invalid', null ],
			[ 'rgb( 0, 0, 0', null ],
			[ 'rgb(260, 260, 260)', null ],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`can parse ${input}`, () => expect(stringToRgb(input as string)).toEqual(expectedOutput));
		});
	});

	describe('stringToRGBA', () => {
		const cases = [
			[
				'#FFFFFF',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 1,
				},
			],
			[
				'#FFFFFF33',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 0.2,
				},
			],
			[
				'#BA3C4CFF',
				{
					r: 186,
					g: 60,
					b: 76,
					a: 1,
				},
			],
			[
				'#FFF',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 1,
				},
			],
			[
				'',
				null,
			],
			[
				'#FFFF',
				null,
			],
			[
				'#FF',
				null,
			],
			[
				'FFF',
				null,
			],
			[
				'#123456LL',
				null,
			],
			[
				'rgba(255,255,255, 0.5 )',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 0.5,
				},
			],
			[
				'rgba( 255 , 255 , 255, 0.5 )',
				{
					r: 255,
					g: 255,
					b: 255,
					a: 0.5,
				},
			],
			[
				'rgba(260, 260, 260, 0.5)',
				null,
			],
		];

		cases.forEach(([ input, expectedOutput ]) => {
			it(`properly parses ${input}`, () => expect(stringToRgba(input as string)).toEqual(expectedOutput));
		});
	});
});
