import IPainterAPI from './IPainterAPI';
import CanvasItemContext from './context/CanvasItemContext';
import Rectangle from './shapes/Rectangle';
import Vector2D from './utility/Vector2D';
import JsonData from './utility/JsonData';
import { ScalingNode } from './transform/ScalingNode';

export default interface ICanvasItem {
	/**
	 * @description Renders the canvas item to the screen given the state data
	 *
	 * @param painter The painter api used for drawing in the virtual space
	 * @param metadata Useful context about the instance being rendered (e.g. whether or not it is selected)
	 */
	render: (painter: IPainterAPI, metadata: CanvasItemContext) => void;

	/**
	 * @description Gets the bounding rectangle for this canvas item, used for determining
	 * if a user has selected this canvas item and for rendering the selection box
	 */
	getBoundingRect: () => Rectangle;

	/**
	 * @description Returns a pure JSON object that captures the
	 * current state of this canvas item and can be serialized to
	 * store in a database. If omitted, the canvas item will be converted
	 * to a universal format. It may still be deserialized and rendered but
	 * will not map back to this canvas item. It is highly recommended
	 * to implement this method.
	 *
	 * When reconstructing canvas items from a saved state, the return value
	 * from this method will be passed into the constructor
	 */
	toJson?: () => JsonData;

	/**
	 * @description Optionally allows consumers to have more fine tuned control over
	 * whether or not the user has selected this item
	 *
	 * @param point The user's mouse coordinates in the virtual space
	 */
	pointInsideItem?: (point: Vector2D) => boolean;

	/**
	 * @description Applies a scaling transformation to the canvas item.
	 * scales should be invertible so that `applyScale({ -x, -y }, node)`
	 * undos `applyScale({ x, y }, node)`
	 */
	applyScale?: (scale: Vector2D, node: ScalingNode) => void;

	/**
	 * @description Applies a move transformation to the canvas item.
	 * Moves should be invertible so that `applyMove({ -x, -y })` undoes
	 * `applyMove({ x, y })`
	 */
	applyMove?: (move: Vector2D) => void;

	/**
	 * @description Applies a rotation (in degrees) to the canvas item.
	 * Rotations should be invertible so that `applyRotation(-r)` undoes
	 * `applyRotation(r)`
	 */
	applyRotation?: (rotation: number) => void;

	/**
	 * @description The name of the canvas item so that the canvas can be
	 * reconstructed from a saved pure JSON states. This property must be
	 * a constant value and not change between instances.
	 */
	canvasItemName: string;
}
