import {
	hexToRgb,
	hexaToRgba,
	isValidHex,
	isValidHexa,
} from '../../src/utility/color-utility';

describe('color-utility', () => {
	it('can convert hex to rgb', () => {
		const cases = [
			[ hexToRgb('#FFFFFF'), { r: 255, g: 255, b: 255 } ],
			[ hexToRgb('#123456'), { r: 18, g: 52, b: 86 } ],
			[ hexToRgb('#FFF'), { r: 255, g: 255, b: 255 } ],
			[ hexToRgb('#BA3C4C'), { r: 186, g: 60, b: 76 } ],
			[ hexToRgb(''), null ],
			[ hexToRgb('#FF'), null ],
			[ hexToRgb('#AAAA'), null ],
			[ hexToRgb('#123L45'), null ],
		];

		cases.forEach(([ actual, expected ]) => expect(actual).toEqual(expected));
	});

	it('can convert hexa to rgba', () => {
		const cases = [
			[
				hexaToRgba('#FFFFFF'),
				{
					r: 255,
					g: 255,
					b: 255,
					a: 1,
				},
			],
			[
				hexaToRgba('#FFFFFF33'),
				{
					r: 255,
					g: 255,
					b: 255,
					a: 0.2,
				},
			],
			[
				hexaToRgba('#BA3C4CFF'),
				{
					r: 186,
					g: 60,
					b: 76,
					a: 1,
				},
			],
			[
				hexaToRgba('#FFF'),
				{
					r: 255,
					g: 255,
					b: 255,
					a: 1,
				},
			],
			[
				hexaToRgba(''),
				null,
			],
			[
				hexaToRgba('#FFFF'),
				null,
			],
			[
				hexaToRgba('#FF'),
				null,
			],
			[
				hexaToRgba('FFF'),
				null,
			],
			[
				hexaToRgba('#123456LL'),
				null,
			],
		];

		cases.forEach(([ actual, expected ]) => expect(actual).toEqual(expected));
	});

	it('can determine valid hex', () => {
		const validCases = [
			isValidHex('#FFF'),
			isValidHex('#123ABC'),
			isValidHex('#123'),
			isValidHex('#A2C'),
			isValidHex('#1A2B3C'),
		];

		const invalidCases = [
			isValidHex('FFF'),
			isValidHex('FFFFFF'),
			isValidHex('#FF'),
			isValidHex('#FFFF'),
			isValidHex('#12345G'),
			isValidHex('#FFFFFFF'),
		];

		validCases.forEach((actual) => expect(actual).toEqual(true));
		invalidCases.forEach((actual) => expect(actual).toEqual(false));
	});

	it('can determine valid hexa', () => {
		const validCases = [
			isValidHexa('#FFF'),
			isValidHexa('#123ABC'),
			isValidHexa('#123'),
			isValidHexa('#A2C'),
			isValidHexa('#1A2B3C'),
			isValidHexa('#FFFFFFFF'),
			isValidHexa('#ABCD128B'),
			isValidHexa('#12345678'),
		];

		const invalidCases = [
			isValidHexa('FFF'),
			isValidHexa('FFFFFF'),
			isValidHexa('#FF'),
			isValidHexa('#FFFF'),
			isValidHexa('#12345G'),
			isValidHexa('#1234567'),
			isValidHexa('#123456789'),
		];

		validCases.forEach((actual) => expect(actual).toEqual(true));
		invalidCases.forEach((actual) => expect(actual).toEqual(false));
	});
});
