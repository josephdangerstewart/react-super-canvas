import Vector2D from './utility/Vector2D';
import IPainterAPI from './IPainterAPI';
import BackgroundElementContext from './utility/BackgroundElementContext';

export default interface IBackgroundElement {
	/**
	 * @description Maps virtual mouse coordinates to whatever mouse position constraints
	 * the background has (i.e. mapping mouse coordinates on a grid)
	 *
	 * @param mousePos The virtual position of the mouse on the canvas
	 * @returns The mapped position according to any constraints in the virtual space
	 */
	mapMouseCoordinates: (mousePos: Vector2D) => Vector2D;

	/**
	 * @description Renders the background. It is the first thing rendered onto the canvas
	 *
	 * @param painter The IPainterAPI instance for painting in the virtual space
	 * @param context2d OPTIONAL - The context for the HTML canvas useful for drawing without respect
	 * to virtual spacing
	 */
	renderBackground: (painter: IPainterAPI, context2d: CanvasRenderingContext2D, context: BackgroundElementContext) => void;
}
