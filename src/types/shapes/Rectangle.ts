import Vector2D from '../utility/Vector2D';
import StyledShape, { StyledShapeDefaults } from './StyledShape';
import JsonData from '../utility/JsonData';

export default interface Rectangle extends StyledShape, JsonData {
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
}

export const RectangleDefaults: object = StyledShapeDefaults;
