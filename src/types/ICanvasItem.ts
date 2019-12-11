import IPainterAPI from './IPainterAPI';
import CanvasItemContext from './context/CanvasItemContext';
import Rectangle from './shapes/Rectangle';
import Vector2D from './utility/Vector2D';

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
	 * @description Optionally allows canvas item creators to have more fine tuned control over
	 * whether or not the user has selected this item
	 *
	 * @param point The user's mouse coordinates in the virtual space
	 */
	pointInsideItem?: (point: Vector2D) => boolean;
}
