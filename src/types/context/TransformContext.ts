import Vector2D from '../utility/Vector2D';

export default interface TransformContext {
	/**
	 * @description The x,y scale of an object in virtual units
	 */
	scale: Vector2D;

	/**
	 * @description The rotation of an object in degrees
	 */
	rotation: number;

	/**
	 * @description The translation of an object in virtual units
	 */
	translation: Vector2D;
}
