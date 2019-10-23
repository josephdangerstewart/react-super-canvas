import Vector2D from './Vector2D';

export default interface BackgroundElementContext {
	/**
	 * @description The current virtual mouse position of the user
	 */
	mousePosition: Vector2D;

	/**
	 * @description The current absolute position of the user on the canvas. Use sparingly
	 */
	absoluteMousePosition: Vector2D;

	/**
	 * @description Whether or not the canvas is being panned
	 */
	isPanning: boolean;

	/**
	 * @description The virtual position of the top left corner of the canvas
	 */
	virtualTopLeftCorner: Vector2D;
}
