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
	imageCache: IImageCache;
}

export class RenderableCanvasItem implements ICanvasItem {
	canvasItemName = CanvasItemKind.RenderableCanvasItem;
	private renderable: Renderable;
	private imageCache: IImageCache;
	private isDirty: boolean;

	constructor({ imageCache, renderable }: RenderableCanvasItemConstructor) {
		this.renderable = renderable;
		this.imageCache = imageCache;
		this.isDirty = false;
	}

	// This is a special canvas item and this method is used by SuperCanvasManager
	getRenderable = (): Renderable => this.renderable;

	render = (painter: IPainterAPI): void => {
		this.renderable.ops.forEach((op) => {
			switch (op.type) {
				case RenderOpType.Circle:
					painter.drawCircle(op.circle);
					break;
				case RenderOpType.Image:
					painter.drawImage(op.image.topLeftCorner, op.image.imageUrl, op.image.scale, op.image.opacity);
					break;
				case RenderOpType.Line:
					painter.drawLine(op.line);
					break;
				case RenderOpType.Polygon:
					painter.drawPolygon(op.polygon);
					break;
				case RenderOpType.Rectangle:
					painter.drawRect(op.rect);
					break;
				default:
					break;
			}
		});
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

	toJson = (): JsonData => {
		// Don't allow this renderable to be mapped back to it's original canvas item
		// if it's been edited or else the changes made by the user will be lost
		if (!this.isDirty && this.renderable.canvasItemJson) {
			return this.renderable.canvasItemJson;
		}

		return {
			renderable: {
				...this.renderable,
				canvasItemJson: null,
			},
		};
	};
}
