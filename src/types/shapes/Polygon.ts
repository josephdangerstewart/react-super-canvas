import Vector2D from '../utility/Vector2D';

export default interface Polygon {
	/**
	 * @description The points that make up the polygon
	 */
	points: Vector2D[];

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
	 * @description The background image of the circle (will have no background image if undefined and is
	 * overridden by fillColor)
	 * @default null
	 */
	fillImageUrl?: string;

	/**
	 * @description The thickness of the stroke
	 * @default 1.0
	 */
	strokeWeight?: number;
}

export const PolygonDefaults: object = {
	strokeColor: 'black',
	fillColor: null,
	fillImageUrl: null,
	strokeWeight: 1,
};
