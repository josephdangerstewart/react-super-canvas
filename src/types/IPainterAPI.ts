import Vector2D from './utility/Vector2D';
import Line from './shapes/Line';
import Rectangle from './shapes/Rectangle';
import Circle from './shapes/Circle';
import Polygon from './shapes/Polygon';

export default interface IPainterAPI {
	/**
	 * @description Draws a line in the virtual space
	 */
	drawLine: (line: Line) => void;

	/**
	 * @description Draws an image in the virtual space
	 * @remarks Images are cached, rotation is in degrees
	 */
	drawImage: (topLeftCorner: Vector2D, imageUrl: string, scale?: Vector2D, opacity?: number, rotation?: number) => void;

	/**
	 * @description Draws a rectangle in the virtual space
	 */
	drawRect: (rect: Rectangle) => void;

	/**
	 * @description Draws a circle in the virtual space
	 */
	drawCircle: (circle: Circle) => void;

	/**
	 * @description Draws a polygon in the virtual space
	 */
	drawPolygon: (polygon: Polygon) => void;

	/**
	 * @description Sets the user's cursor, the most recent cursor in the stack takes precedent
	 * So the top most item on the render stack has priority.
	 */
	setCursor: (cursor: string) => void;
}
