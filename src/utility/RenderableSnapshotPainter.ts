import IPainterAPI from '../types/IPainterAPI';
import { RenderOp, RenderOpType } from '../types/Renderable';
import Line from '../types/shapes/Line';
import Vector2D from '../types/utility/Vector2D';
import Rectangle from '../types/shapes/Rectangle';
import Circle from '../types/shapes/Circle';
import Polygon from '../types/shapes/Polygon';

export class RenderableSnapshotPainter implements IPainterAPI {
	private renderOps: RenderOp[];

	constructor() {
		this.renderOps = [];
	}

	drawLine = (line: Line): void => {
		this.renderOps.push({
			type: RenderOpType.Line,
			line,
		});
	};

	drawImage = (topLeftCorner: Vector2D, imageUrl: string, scale?: Vector2D, opacity?: number): void => {
		this.renderOps.push({
			type: RenderOpType.Image,
			image: {
				topLeftCorner,
				scale,
				opacity,
				imageUrl,
			},
		});
	};

	drawRect = (rect: Rectangle): void => {
		this.renderOps.push({
			type: RenderOpType.Rectangle,
			rect,
		});
	};

	drawCircle = (circle: Circle): void => {
		this.renderOps.push({
			type: RenderOpType.Circle,
			circle,
		});
	};

	drawPolygon = (polygon: Polygon): void => {
		this.renderOps.push({
			type: RenderOpType.Polygon,
			polygon,
		});
	};

	setCursor = (): void => null;

	/** PUBLIC METHODS */

	getRenderOps = (): RenderOp[] => this.renderOps;
}
