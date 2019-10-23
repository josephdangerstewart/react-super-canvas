import Vector2D from '../utility/Vector2D';
import Context from './Context';

export default interface BackgroundElementContext extends Context {
	/**
	 * @description The virtual position of the top left corner of the canvas
	 */
	virtualTopLeftCorner: Vector2D;
}
