import Vector2D from './utility/Vector2D';
import Line from './shapes/Line';
import Rectangle from './shapes/Rectangle';
import Circle from './shapes/Circle';

export default interface IPainterAPI {
	/**
	 * @description Sets the pan (used by [SuperCanvasApi](/supercanvasapi))
	 */
	setPan: (pan: Vector2D) => void;

	/**
	 * @description Sets the scale (used by [SuperCanvasApi](/supercanvasapi))
	 */
	setScale: (scale: number) => void;

	/**
	 * @description Clears all drawn elements on the canvas (used by [SuperCanvasApi](/supercanvasapi))
	 */
	clearCanvas: () => void;

	/**
	 * @description Sets the canvas render (used by [SuperCanvasApi](/supercanvasapi))
	 */
	setContext2D: (context: CanvasRenderingContext2D) => void;

	/**
	 * @description Removes any image in the cache that haven't been used in *timeout* milliseconds
	 */
	cleanImageCache: (timeout: number) => void;

	/**
	 * @description Draws a line in the virtual space
	 */
	drawLine: (line: Line) => void;

	/**
	 * @description Draws an image in the virtual space
	 * @remarks Images are cached
	 */
	drawImage: (topLeftCorner: Vector2D, imageUrl: string) => void;

	/**
	 * @description Draws a rectangle in the virtual space
	 */
	drawRect: (rect: Rectangle) => void;

	/**
	 * @description Draws a circle in the virtual space
	 */
	drawCircle: (circle: Circle) => void;
}
