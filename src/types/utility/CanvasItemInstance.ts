import ICanvasItem from '../ICanvasItem';
import { RenderableMetadata } from '../Renderable';

export interface CanvasItemInstance {
	/**
	 * @description The canvas item this is wrapped around
	 */
	canvasItem: ICanvasItem;

	/**
	 * @description The metadata attached to this canvas item that
	 * gets serialized with the canvas item but is not owned by
	 * the canvas item
	 */
	metadata: RenderableMetadata;

	/**
	 * @description The unique identifier for this instance so that the super
	 * canvas can cache it
	 */
	id: number;
}
