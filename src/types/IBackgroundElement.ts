import Vector2D from './utility/Vector2D';

export default interface IBackgroundElement {
	mapMouseCoordinates: (mousePos: Vector2D) => Vector2D;
}
