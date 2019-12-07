/** @external */
export default interface StyledShape {
	/**
	 * @description The color of the stroke. A valid CSS color
	 * @default 'black'
	 */
	strokeColor?: string;

	/**
	 * @description The thickness of the stroke
	 * @default 1.0
	 */
	strokeWeight?: number;

	/**
	 * @description The color of the fill (unfilled if null)
	 * @default null
	 */
	fillColor?: string;

	/**
	 * @description The background image of the rectangle (wont have a background image if undefined, is overridden
	 * by `fillColor`)
	 * @default null
	 */
	fillImageUrl?: string;
}

export const StyledShapeDefaults: object = {
	strokeColor: 'black',
	strokeWeight: 1.0,
	fillColor: null,
	fillImageUrl: null,
};
