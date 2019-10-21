import Vector2D from './Vector2D';

export default interface CanvasItemContext {
	/**
	 * @description Whether or not the current item is selected
	 */
	isSelected: boolean;

	/**
	 * @description The current virtual mouse position of the user
	 */
	mousePosition: Vector2D;

	/**
	 * @description The current absolute position of the user on the canvas. Use sparingly
	 */
	absoluteMousePosition: Vector2D;
}
