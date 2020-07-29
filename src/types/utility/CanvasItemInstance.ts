import ICanvasItem from '../ICanvasItem';
import { RenderableMetadata } from '../Renderable';

export interface CanvasItemInstance {
	canvasItem: ICanvasItem;
	metadata: RenderableMetadata;
}
