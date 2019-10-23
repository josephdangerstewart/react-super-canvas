import Vector2D from '../utility/Vector2D';

export default interface Rectangle {
	/**
	 * @description The top left corner in the virtual space
	 */
	topLeftCorner: Vector2D;

	/**
	 * @description The width of the rectangle in pixels
	 */
	width: number;

	/**
	 * @description The height of the rectangle in pixels
	 */
	height: number;

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

export const RectangleDefaults: object = {
	strokeColor: 'black',
	strokeWeight: 1.0,
	fillColor: null,
	fillImageUrl: null,
};
