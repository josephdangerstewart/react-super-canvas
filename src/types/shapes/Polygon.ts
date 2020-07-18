import Vector2D from '../utility/Vector2D';
import StyledShape, { StyledShapeDefaults } from './StyledShape';
import JsonData from '../utility/JsonData';

export default interface Polygon extends StyledShape, JsonData {
	/**
	 * @description The points that make up the polygon
	 */
	points: Vector2D[];

	/**
	 * @description The rotation of the polygon in degrees
	 */
	rotation?: number;
}

export const PolygonDefaults: object = StyledShapeDefaults;
