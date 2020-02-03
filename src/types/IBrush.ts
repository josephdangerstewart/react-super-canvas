import IPainterAPI from './IPainterAPI';
import { BrushContext } from './context/BrushContext';
import { AddCanvasItemCallback } from './callbacks/AddCanvasItemCallback';
import Type from './utility/Type';
import ICanvasItem from './ICanvasItem';

export enum DefaultBrushKind {
	CircleBrush = 'circle',
	PolygonBrush = 'polygon',
	Selection = 'selection',
	ImageBrush = 'image',
}

export default interface IBrush {
	/**
	 * @description Renders a preview of the element being drawn to the screen
	 */
	renderPreview: (painter: IPainterAPI, context: BrushContext) => void;

	/**
	 * @description The event hook for when a the user clicks with this brush
	 */
	mouseDown: (addCanvasItem: AddCanvasItemCallback, context: BrushContext) => void;

	/**
	 * @description The unique id for the brush type
	 */
	brushName: string | DefaultBrushKind;

	/**
	 * @description An array of supported brushes that can be rendered
	 * by this brush. This is needed in order to map initial static JSON
	 * data to canvas items. The SuperCanvas needs an awareness of which
	 * canvas items exist.
	 */
	supportedCanvasItems: Record<string, Type<ICanvasItem>>;
}
