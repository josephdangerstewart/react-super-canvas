/**
 * @author Joseph Stewart
 * @version 1.0.0
 */

import Vector2D from '../utility/Vector2D';
import JsonData from '../utility/JsonData';

export default interface Line extends JsonData {
	/**
	 * @description The first point in the virtual space
	 */
	point1: Vector2D;

	/**
	 * @description The second point in the vector space
	 */
	point2: Vector2D;

	/**
	 * @description The color of the line
	 * @default 'black'
	 */
	strokeColor?: string;

	/**
	 * @description The thickness of the line
	 * @default 1.0
	 */
	strokeWeight?: number;

	/**
	 * @description The rotation of the line in degrees
	 */
	rotation?: number;
}

export const LineDefaults: object = {
	strokeColor: 'black',
	strokeWeight: 1.0,
};
