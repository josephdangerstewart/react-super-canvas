import Vector2D from '../utility/Vector2D';
import StyleContext from './StyleContext';

/**
 * @description Shared data between all of the context interfaces
 */
export default interface Context {
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
	 * @description The current style settings of the user
	 */
	styleContext: StyleContext;
}
