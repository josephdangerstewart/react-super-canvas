import IBrush, { DefaultBrushKind } from '../../types/IBrush';
import IPainterAPI from '../../types/IPainterAPI';
import { BrushContext } from '../../types/context/BrushContext';
import { AddCanvasItemCallback } from '../../types/callbacks/AddCanvasItemCallback';
import Vector2D from '../../types/utility/Vector2D';
import { vector } from '../../utility/shapes-util';
import ImageCanvasItem from '../canvas-items/ImageCanvasItem';
import { CanvasItemKind } from '../canvas-items/CanvasItemKind';

export default class ImageBrush implements IBrush {
	public brushName = DefaultBrushKind.ImageBrush;
	public supportedCanvasItems = {
		[CanvasItemKind.ImageCanvasItem]: ImageCanvasItem,
	};

	private topLeftCorner: Vector2D;
	private src: string;

	constructor(src: string) {
		this.src = src;
		this.topLeftCorner = vector(0, 0);
	}

	renderPreview = (painter: IPainterAPI, context: BrushContext): void => {
		this.topLeftCorner = context.snappedMousePosition;
		painter.drawImage(this.topLeftCorner, this.src, null, 0.5);
	};

	mouseDown = (addCanvasItem: AddCanvasItemCallback, context: BrushContext): void => {
		addCanvasItem(new ImageCanvasItem(this.src, this.topLeftCorner, context.imageCache));
	};
}
