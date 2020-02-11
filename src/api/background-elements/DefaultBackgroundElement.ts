import IBackgroundElement from '../../types/IBackgroundElement';
import Vector2D from '../../types/utility/Vector2D';

/**
 * @description A generic background that does not enforce grid positioning
 */
export default class DefaultBackgroundElement implements IBackgroundElement {
	mapMouseCoordinates = (mousePos: Vector2D): Vector2D => mousePos;
	renderBackground = (): void => { /* This renders no background */ };
}
