import IPainterAPI from './IPainterAPI';

export default interface IBrush {
	/**
	 * @description Renders a preview of the element being drawn to the screen
	 */
	renderPreview: (painter: IPainterAPI, canvasContext: CanvasRenderingContext2D) => void;
}
