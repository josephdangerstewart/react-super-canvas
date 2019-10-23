/**
 * @author Joseph Stewart
 * @version 1.0.0
 */

import Vector2D from '../utility/Vector2D';

export default interface Circle {
	/**
	 * @description The center of the circle in the virtual canvas space
	 */
	center: Vector2D;

	/**
	 * @description The radius of the circle
	 */
	radius: number;

	/**
	 * @description The stroke of the color
	 * @default "black"
	 */
	strokeColor?: string;

	/**
	 * @description The color of the fill (will have no fill if undefined)
	 * @default null
	 */
	fillColor?: string;

	/**
	 * @description The thickness of the stroke
	 * @default 1.0
	 */
	strokeWeight?: number;

	/**
	 * @description The background image of the circle (will have no background image if undefined and is
	 * overridden by fillColor)
	 * @default null
	 */
	fillImageUrl?: string;
}

export const CircleDefaults: object = {
	strokeColor: 'black',
	fillColor: null,
	strokeWeight: 1.0,
	fillImageUrl: null,
};
