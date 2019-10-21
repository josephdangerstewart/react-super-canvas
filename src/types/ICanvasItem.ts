import IPainterAPI from './IPainterAPI';
import CanvasItemMetadata from './utility/CanvasItemMetadata';

export default interface ICanvasItem {
	/**
	 * @description Renders the canvas item to the screen given the state data
	 *
	 * @param painter The painter api used for drawing in the virtual space
	 * @param metadata Useful context about the instance being rendered (e.g. whether or not it is selected)
	 */
	render: (painter: IPainterAPI, metadata: CanvasItemMetadata) => void;
}
