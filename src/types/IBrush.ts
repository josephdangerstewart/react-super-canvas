import IPainterAPI from './IPainterAPI';
import { BrushContext } from './context/BrushContext';

export default interface IBrush {
	/**
	 * @description Renders a preview of the element being drawn to the screen
	 */
	renderPreview: (painter: IPainterAPI, canvasContext: CanvasRenderingContext2D, context: BrushContext) => void;
}
