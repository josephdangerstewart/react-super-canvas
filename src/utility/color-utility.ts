export enum ColorContrast {
	Bright = 'bright',
	Dark = 'dark',
}

export function isValidHex(color: string): boolean {
	return /^(#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]|#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9])$/.test(color);
}

// Copied from https://awik.io/determine-color-bright-dark-using-javascript/
export function getContrast(color: string): ColorContrast {
	let r: number;
	let g: number;
	let b: number;
	// Check the format of the color, HEX or RGB?
	if (color.match(/^rgb/)) {
		// If HEX --> store the red, green, blue values in separate variables
		const colorPieces = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

		[ r, g, b ] = colorPieces.map((val): number => Number(val));
	} else {
		// If RGB --> Convert it to HEX: http://gist.github.com/983661
		const colorValue = +(`0x${color.slice(1).replace(
			color.length < 5 && /./g, '$&$&',
		)}`);

		// eslint-disable-next-line
		r = colorValue >> 16;
		// eslint-disable-next-line
		g = colorValue >> 8 & 255;
		// eslint-disable-next-line
		b = colorValue & 255;
	}

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(
		0.299 * (r * r)
		+ 0.587 * (g * g)
		+ 0.114 * (b * b),
	);

	// Using the HSP value, determine whether the color is light or dark
	if (hsp > 127.5) {
		return ColorContrast.Bright;
	}

	return ColorContrast.Dark;
}
