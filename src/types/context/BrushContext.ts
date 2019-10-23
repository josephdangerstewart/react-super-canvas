import Context from './Context';
import Vector2D from '../utility/Vector2D';

export interface BrushContext extends Context {
	/**
	 * @description The mouse position that has been mapped to the background element
	 */
	snappedMousePosition: Vector2D;
}
