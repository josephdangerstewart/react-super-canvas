import Circle from './shapes/Circle';
import Rectangle from './shapes/Rectangle';
import Line from './shapes/Line';
import Polygon from './shapes/Polygon';

export interface Renderable {
	ops: RenderOp[];
}

export interface RenderOp {
	type: RenderOpType;

	circle?: Circle;
	rect?: Rectangle;
	line?: Line;
	polygon?: Polygon;
	image?: {
		boundingRect: Rectangle;
		imageUrl: string;
	};
}

export enum RenderOpType {
	Circle,
	Line,
	Polygon,
	Rectangle,
	Image,
}
