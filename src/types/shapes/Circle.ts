/**
 * @author Joseph Stewart
 * @version 1.0.0
 */

import Vector2D from '../utility/Vector2D';
import StyledShape, { StyledShapeDefaults } from './StyledShape';
import JsonData from '../utility/JsonData';

export default interface Circle extends StyledShape, JsonData {
	/**
	 * @description The center of the circle in the virtual canvas space
	 */
	center: Vector2D;

	/**
	 * @description The radius of the circle
	 */
	radius: number;
}

export const CircleDefaults: object = StyledShapeDefaults;
