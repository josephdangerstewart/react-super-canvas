import IPainterAPI from './IPainterAPI';
import { BrushContext } from './context/BrushContext';
import { AddCanvasItemCallback } from './callbacks/AddCanvasItemCallback';

export default interface IBrush {
	/**
	 * @description Renders a preview of the element being drawn to the screen
	 */
	renderPreview: (painter: IPainterAPI, context: BrushContext) => void;

	/**
	 * @description The event hook for when a the user clicks with this brush
	 */
	mouseDown: (addCanvasItem: AddCanvasItemCallback, context: BrushContext) => void;
}
