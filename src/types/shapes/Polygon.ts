import Vector2D from '../utility/Vector2D';
import StyledShape, { StyledShapeDefaults } from './StyledShape';
import JsonData from '../utility/JsonData';
import { IRotatable } from './IRotatable';

export default interface Polygon extends StyledShape, JsonData, IRotatable {
	/**
	 * @description The points that make up the polygon
	 */
	points: Vector2D[];
}

export const PolygonDefaults: object = StyledShapeDefaults;
