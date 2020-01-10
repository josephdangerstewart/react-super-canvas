export enum ColorContrast {
	Bright = 'bright',
	Dark = 'dark',
}

export interface RGB {
	r: number;
	g: number;
	b: number;
}

export interface RGBA extends RGB {
	a: number;
}

export function isValidHex(color: string): boolean {
	if (!color) {
		return false;
	}

	return /^(#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]|#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9])$/.test(color);
}

export function isValidHexa(color: string): boolean {
	if (!color) {
		return false;
	}

	return isValidHex(color) || /^#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]$/.test(color);
}

export function hexToRgb(hex: string): RGB {
	if (!hex) {
		return null;
	}

	const normalizedHex = hex.replace(
		/^#([a-f\d])([a-f\d])([a-f\d])$/ig,
		(m, r, g, b) => (`#${r + r + g + g + b + b}`),
	);

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalizedHex);
	return result && {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	};
}

export function hexaToRgba(hex: string): RGBA {
	if (!hex) {
		return null;
	}

	if (isValidHex(hex)) {
		const hexObj = hexToRgb(hex);
		if (!hexObj) {
			return null;
		}
		return {
			...hexObj,
			a: 1,
		};
	}

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result && {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
		a: parseInt(result[4], 16) / 255,
	};
}

export function stringToRgb(color: string): RGB {
	if (!color) {
		return null;
	}

	const normalizedColor = color.replace(/\s/g, '');

	if (isValidHex(color)) {
		return hexToRgb(color);
	}

	if (isValidHexa(color)) {
		const { r, g, b } = hexaToRgba(color);
		return { r, g, b };
	}

	const pieces = normalizedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

	if (!pieces) {
		return null;
	}

	pieces.shift();

	const [ r, g, b ] = pieces.map((num): number => Number(num));

	if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
		return null;
	}

	return { r, g, b };
}

export function stringToRgba(color: string): RGBA {
	if (!color) {
		return null;
	}

	const normalizedColor = color.replace(/\s/g, '');

	if (isValidHexa(normalizedColor)) {
		return hexaToRgba(color);
	}

	const pieces = normalizedColor.match(/^rgba\((\d+),(\d+),(\d+),((\d+|\.)+)\)$/);

	if (!pieces) {
		return null;
	}

	pieces.shift();

	const [ r, g, b, a ] = pieces.map((num): number => Number(num));

	if (r > 255 || g > 255 || b > 255 || a > 1 || r < 0 || g < 0 || b < 0 || a < 0) {
		return null;
	}

	return {
		r,
		g,
		b,
		a,
	};
}

export function rgbToString({ r, g, b }: RGB): string {
	return `rgb(${r},${g},${b})`;
}

export function rgbaToString({
	r,
	g,
	b,
	a,
}: RGBA): string {
	return `rgba(${r},${g},${b},${a})`;
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
		colorPieces.shift();

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

export function withOpacity(color: string, alpha: number): string {
	if (!color || alpha < 0 || alpha > 1) {
		return null;
	}

	const rgb = stringToRgb(color);

	if (!rgb) {
		return null;
	}

	return rgbaToString({ ...rgb, a: alpha });
}
