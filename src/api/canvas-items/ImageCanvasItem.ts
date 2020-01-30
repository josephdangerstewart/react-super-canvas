import ICanvasItem from '../../types/ICanvasItem';
import Rectangle from '../../types/shapes/Rectangle';
import { vector } from '../../utility/shapes-util';
import Vector2D from '../../types/utility/Vector2D';
import IPainterAPI from '../../types/IPainterAPI';

export default class ImageCanvasItem implements ICanvasItem {
	private src: string;
	private topLeftCorner: Vector2D;
	private size: Vector2D;
	private scale: number;

	constructor(src: string, topLeftCorner: Vector2D) {
		this.src = src;
		this.topLeftCorner = topLeftCorner;
	}

	render = (painter: IPainterAPI): void => {
		painter.drawImage(this.topLeftCorner, this.src);
	};

	getBoundingRect = (): Rectangle => {
		console.error('NOT IMPLEMENTED');
		return {
			topLeftCorner: vector(0, 0),
			width: 1,
			height: 1,
		};
	};
}
