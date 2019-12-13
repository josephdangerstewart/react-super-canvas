import Vector2D from '../utility/Vector2D';

export default interface TransformContext {
	/**
	 * @description The x,y scale of an object in virtual units
	 */
	scale?: Vector2D;

	/**
	 * @description The rotation of an object in degrees
	 */
	rotation?: number;

	/**
	 * @description The translation of an object in virtual units
	 */
	translation?: Vector2D;
}

export function merge(transform1: TransformContext, transform2: TransformContext): TransformContext {
	return {
		scale: {
			x: transform1.scale.x || 0 + transform2.scale.x || 0,
			y: transform1.scale.y || 0 + transform2.scale.y || 0,
		},
		rotation: transform1.rotation || 0 + transform2.rotation || 0,
		translation: {
			x: transform1.translation.x || 0 + transform2.translation.x || 0,
			y: transform1.translation.y || 0 + transform2.translation.y || 0,
		},
	};
}
