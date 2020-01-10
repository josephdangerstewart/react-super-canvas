import { hexToRgb, hexaToRgba } from '../../src/utility/color-utility';

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
});
