import ICanvasItem from '../../types/ICanvasItem';
import { CanvasItemKind } from './CanvasItemKind';
import IPainterAPI from '../../types/IPainterAPI';
import Rectangle from '../../types/shapes/Rectangle';
import JsonData from '../../types/utility/JsonData';
import { Renderable, RenderOpType } from '../../types/Renderable';
import {
	boundingRectOfRects, boundingRectOfCircle, boundingRectOfPolygon, boundingRectOfLine,
} from '../../utility/shapes-util';
import { IImageCache } from '../../types/IImageCache';
import { boundingRectOfImage } from '../../utility/image-utility';

export interface RenderableCanvasItemConstructor {
	renderable: Renderable;
	imageCache?: IImageCache;
}

export class RenderableCanvasItem implements ICanvasItem {
	canvasItemName = CanvasItemKind.RenderableCanvasItem;
	private renderable: Renderable;
	private imageCache: IImageCache;

	constructor({ imageCache, renderable }) {
		this.renderable = renderable;
		this.imageCache = imageCache;
	}

	render = (painter: IPainterAPI): void => {
		painter.drawRenderable(this.renderable);
	};

	getBoundingRect = (): Rectangle => boundingRectOfRects(this.renderable.ops.map((op) => {
		switch (op.type) {
			case RenderOpType.Circle:
				if (!op.circle) {
					return null;
				}
				return boundingRectOfCircle(op.circle);
			case RenderOpType.Image:
				if (!op.image) {
					return null;
				}
				return boundingRectOfImage(
					op.image.imageUrl,
					op.image.scale,
					op.image.topLeftCorner,
					this.imageCache,
				);
			case RenderOpType.Line:
				if (!op.line) {
					return null;
				}
				return boundingRectOfLine(op.line);
			case RenderOpType.Polygon:
				if (!op.polygon) {
					return null;
				}
				return boundingRectOfPolygon(op.polygon);
			case RenderOpType.Rectangle:
				return op.rect;
			default:
				return null;
		}
	}).filter(Boolean));

	toJson = (): JsonData => ({
		renderable: this.renderable,
	});
}
