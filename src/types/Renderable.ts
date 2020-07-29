import Circle from './shapes/Circle';
import Rectangle from './shapes/Rectangle';
import Line from './shapes/Line';
import Polygon from './shapes/Polygon';
import JsonData from './utility/JsonData';
import Vector2D from './utility/Vector2D';

export interface Renderable extends JsonData {
	/**
	 * @description The stack of render operations that make up this renderable item.
	 * A renderable item is a singular and serializable format to describe any given
	 * rendered object on the canvas.
	 */
	ops: RenderOp[];

	/**
	 * @description The output from `toJson` used to try and map this renderable back
	 * to a canvas item
	 */
	canvasItemJson: JsonData;

	/**
	 * @description Metadata is data that is stored about a canvas item but managed by
	 * the system.
	 */
	metadata?: RenderableMetadata;
}

export interface RenderableMetadata extends JsonData {
	/**
	 * @description Whether or not this renderable is locked on the canvas
	 */
	isLocked?: boolean;
}

export interface RenderOp extends JsonData {
	/**
	 * @description The type of object that will be rendered to the canvas
	 */
	type: RenderOpType;

	/**
	 * @description Circle data if type is `RenderOpType.Circle`
	 */
	circle?: Circle;

	/**
	 * @description Rectangle data if type is `RenderOpType.Rectangle`
	 */
	rect?: Rectangle;

	/**
	 * @description Line data if type is `RenderOpType.Line`
	 */
	line?: Line;

	/**
	 * @description Polygon data if type is `RenderOpType.Polygon`
	 */
	polygon?: Polygon;

	/**
	 * @description Image data if type is `RenderOpType.Image`
	 */
	image?: ImageData;
}

export interface ImageData extends JsonData {
	scale: Vector2D;
	opacity: number;
	topLeftCorner: Vector2D;
	imageUrl: string;
}

export enum RenderOpType {
	Circle = 'circle',
	Line = 'line',
	Polygon = 'polygon',
	Rectangle = 'rectangle',
	Image = 'image',
}
